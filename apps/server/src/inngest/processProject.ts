import { analyzeBrand, generateScript } from "@klyp/api/services/ai";
import { generateBanner } from "@klyp/api/services/banner";
import { extractWithScreenshot } from "@klyp/api/services/extract";
import { uploadToR2 } from "@klyp/api/services/storage";
import { db } from "@klyp/db";
import {
	banner as bannerTable,
	project as projectTable,
} from "@klyp/db/schema";
import { eq } from "drizzle-orm";
import { renderVideo } from "../services/video";
import { inngest } from "./client";

type ProjectUpdate = Partial<typeof projectTable.$inferInsert>;

async function updateProject(id: string, data: ProjectUpdate) {
	await db.update(projectTable).set(data).where(eq(projectTable.id, id));
}

export const processProject = inngest.createFunction(
	{
		id: "process-project",
		retries: 0,
		timeouts: { finish: "5m" },
		triggers: [{ event: "project/created" }],
		onFailure: async ({ event }) => {
			const originalEvent = event.data.event as {
				data: { projectId: string };
			};
			const projectId = originalEvent.data.projectId;
			const error = event.data.error as { message?: string };
			await db
				.update(projectTable)
				.set({
					status: "failed",
					errorMessage: error?.message ?? "Processing failed",
				})
				.where(eq(projectTable.id, projectId));
		},
	},
	async ({ event, step }) => {
		const { projectId, url } = event.data as {
			projectId: string;
			url: string;
		};

		try {
			// Step 1: Extract website content + screenshot
			const extracted = await step.run("extract", async () => {
				await updateProject(projectId, { status: "extracting", progress: 10 });
				const result = await extractWithScreenshot(url);
				await updateProject(projectId, {
					screenshotUrl: result.screenshotUrl ?? undefined,
					progress: 25,
				});
				return result;
			});

			// Step 2: AI brand analysis + script generation
			const { brand, script } = await step.run("analyze", async () => {
				await updateProject(projectId, { status: "analyzing", progress: 30 });
				const b = await analyzeBrand(extracted.markdown, url);
				const s = await generateScript(b);
				await updateProject(projectId, {
					brandJson: JSON.stringify(b),
					scriptJson: JSON.stringify(s),
					progress: 50,
				});
				return { brand: b, script: s };
			});

			// Step 3: Render and upload video
			const videoUrl = await step.run("render-video", async () => {
				await updateProject(projectId, {
					status: "rendering_video",
					progress: 55,
				});
				const buffer = await renderVideo(brand, script);
				const key = `projects/${projectId}/video.mp4`;
				const uploadedUrl = await uploadToR2(key, buffer, "video/mp4");
				await updateProject(projectId, { videoUrl: uploadedUrl, progress: 80 });
				return uploadedUrl;
			});

			// Step 4: Render and upload banner
			await step.run("render-banner", async () => {
				await updateProject(projectId, {
					status: "rendering_banner",
					progress: 82,
				});
				const png = await generateBanner({
					brand,
					screenshotUrl: extracted.screenshotUrl,
				});
				const key = `projects/${projectId}/banner-twitter.png`;
				const bannerUrl = await uploadToR2(key, png, "image/png");

				await db.insert(bannerTable).values({
					projectId,
					format: "twitter_post",
					imageUrl: bannerUrl,
				});

				await updateProject(projectId, { status: "done", progress: 100 });
				return bannerUrl;
			});

			return { projectId, videoUrl };
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "Unknown error";
			await updateProject(projectId, {
				status: "failed",
				errorMessage: msg,
			});
			throw err; // re-throw so Inngest marks the run as failed
		}
	},
);

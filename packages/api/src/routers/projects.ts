import { db } from "@klyp/db";
import { asset, banner, project } from "@klyp/db/schema";
import { ORPCError } from "@orpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod/v4";

import { protectedProcedure } from "../index";
import { inngest } from "../services/inngest";
import { getSignedDownloadUrl } from "../services/storage";

const FREE_PROJECT_LIMIT = 1;

export const projectsRouter = {
	create: protectedProcedure
		.input(z.object({ url: z.url() }))
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;

			const existing = await db
				.select({ id: project.id })
				.from(project)
				.where(eq(project.userId, userId));

			if (existing.length >= FREE_PROJECT_LIMIT) {
				throw new ORPCError("FORBIDDEN", {
					message: "Free plan is limited to 1 project.",
				});
			}

			const [created] = await db
				.insert(project)
				.values({ userId, url: input.url, status: "pending", progress: 0 })
				.returning();

			if (!created) throw new ORPCError("INTERNAL_SERVER_ERROR");

			await inngest.send({
				name: "project/created",
				data: { projectId: created.id, url: input.url },
			});

			return { id: created.id };
		}),

	get: protectedProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const [p] = await db
				.select()
				.from(project)
				.where(and(eq(project.id, input.id), eq(project.userId, userId)));

			if (!p) throw new ORPCError("NOT_FOUND");

			const banners = await db
				.select()
				.from(banner)
				.where(eq(banner.projectId, p.id));
			const assets = await db
				.select()
				.from(asset)
				.where(eq(asset.projectId, p.id));

			return {
				...p,
				brand: p.brandJson ? JSON.parse(p.brandJson) : null,
				script: p.scriptJson ? JSON.parse(p.scriptJson) : null,
				banners,
				assets,
			};
		}),

	list: protectedProcedure.handler(async ({ context }) => {
		const userId = context.session.user.id;
		return db
			.select()
			.from(project)
			.where(eq(project.userId, userId))
			.orderBy(desc(project.createdAt));
	}),

	rename: protectedProcedure
		.input(z.object({ id: z.string(), name: z.string().min(1) }))
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const [p] = await db
				.update(project)
				.set({ name: input.name })
				.where(and(eq(project.id, input.id), eq(project.userId, userId)))
				.returning();

			if (!p) throw new ORPCError("NOT_FOUND");
			return { success: true };
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const [p] = await db
				.delete(project)
				.where(and(eq(project.id, input.id), eq(project.userId, userId)))
				.returning();

			if (!p) throw new ORPCError("NOT_FOUND");
			return { success: true };
		}),

	getDownloadUrl: protectedProcedure
		.input(
			z.object({
				projectId: z.string(),
				kind: z.enum(["video", "banner"]),
			}),
		)
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const [p] = await db
				.select()
				.from(project)
				.where(
					and(eq(project.id, input.projectId), eq(project.userId, userId)),
				);

			if (!p) throw new ORPCError("NOT_FOUND");

			let key: string;
			if (input.kind === "video") {
				if (!p.videoUrl)
					throw new ORPCError("NOT_FOUND", { message: "Video not ready" });
				key = `projects/${p.id}/video.mp4`;
			} else {
				key = `projects/${p.id}/banner-twitter.png`;
			}

			return { url: await getSignedDownloadUrl(key) };
		}),
};

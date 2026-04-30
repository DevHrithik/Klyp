"use client";

import { useQuery } from "@tanstack/react-query";
import {
	ArrowLeftIcon,
	DownloadIcon,
	ImageIcon,
	SparklesIcon,
	VideoIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { orpc } from "@/utils/orpc";

const STATUS_LABELS: Record<string, string> = {
	pending: "Queued…",
	extracting: "Scraping website…",
	analyzing: "Analyzing with AI…",
	rendering_video: "Rendering video…",
	rendering_banner: "Creating banner…",
	done: "Done!",
	failed: "Failed",
};

const STATUS_COLORS: Record<string, string> = {
	pending: "bg-yellow-500/20 text-yellow-300",
	extracting: "bg-blue-500/20 text-blue-300",
	analyzing: "bg-purple-500/20 text-purple-300",
	rendering_video: "bg-indigo-500/20 text-indigo-300",
	rendering_banner: "bg-indigo-500/20 text-indigo-300",
	done: "bg-green-500/20 text-green-300",
	failed: "bg-red-500/20 text-red-300",
};

export function ProjectDetail({ projectId }: { projectId: string }) {
	const { data, isLoading } = useQuery({
		...orpc.projects.get.queryOptions({ input: { id: projectId } }),
		refetchInterval: (query) => {
			const status = query.state.data?.status;
			return status === "done" || status === "failed" ? false : 2000;
		},
	});

	if (isLoading)
		return (
			<div className="flex min-h-[60vh] items-center justify-center">
				<p className="font-inter text-white/50">Loading…</p>
			</div>
		);
	if (!data)
		return (
			<div className="p-8 font-inter text-red-400">Project not found.</div>
		);

	const isDone = data.status === "done";
	const isFailed = data.status === "failed";
	const isProcessing = !isDone && !isFailed;

	return (
		<div className="mx-auto max-w-6xl px-6 py-12">
			<Link
				href="/dashboard"
				className="mb-8 inline-flex items-center gap-2 font-inter text-sm text-white/50 transition-colors hover:text-white"
			>
				<ArrowLeftIcon className="h-4 w-4" />
				Back to dashboard
			</Link>

			<div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1
						className={`break-all font-instrument-serif text-4xl text-white ${data.name ? "mb-1" : "mb-2"}`}
					>
						{data.name ||
							data.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
					</h1>
					{data.name && (
						<p className="font-inter text-sm text-white/50">{data.url}</p>
					)}
				</div>
				<span
					className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 font-medium text-sm ${STATUS_COLORS[data.status] ?? "bg-white/10 text-white/50"}`}
				>
					{STATUS_LABELS[data.status] ?? data.status}
				</span>
			</div>

			{/* Processing state */}
			{isProcessing && (
				<div className="mt-8 overflow-hidden rounded-3xl border border-[#7b39fc]/20 bg-[rgba(85,80,110,0.1)] p-8 backdrop-blur-md">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-xl bg-[#7b39fc]/20">
								<SparklesIcon className="h-5 w-5 text-[#c4a1ff]" />
							</div>
							<p className="font-instrument-serif text-2xl text-white">
								{STATUS_LABELS[data.status] ?? "Processing..."}
							</p>
						</div>
						<p className="font-inter font-medium text-[#c4a1ff] tabular-nums">
							{data.progress}%
						</p>
					</div>
					<div className="h-3 w-full overflow-hidden rounded-full bg-white/5 shadow-inner">
						<div
							className="h-full rounded-full bg-linear-to-r from-[#7b39fc] to-[#c4a1ff] transition-all duration-700 ease-out"
							style={{ width: `${data.progress}%` }}
						/>
					</div>
					<p className="mt-6 font-inter text-sm text-white/40">
						This usually takes 60–90 seconds. You can close this tab and come
						back — we'll keep processing in the background.
					</p>
				</div>
			)}

			{/* Error state */}
			{isFailed && (
				<div className="mt-8 rounded-3xl border border-red-500/30 bg-red-900/10 p-8 backdrop-blur-md">
					<div className="mb-4 flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
							<div className="h-2 w-2 rounded-full bg-red-400" />
						</div>
						<p className="font-instrument-serif text-2xl text-white">
							Generation failed
						</p>
					</div>
					<p className="mb-6 font-inter text-red-300/70">
						{data.errorMessage ??
							"An unknown error occurred during generation."}
					</p>
					<Link
						href="/dashboard"
						className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 font-cabin font-medium text-sm text-white transition-colors hover:bg-white/20"
					>
						Try a different URL
					</Link>
				</div>
			)}

			{/* Done state */}
			{isDone && (
				<div className="space-y-8">
					{/* Brand Context */}
					{data.brand && (
						<div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:flex-row md:items-center">
							<div className="flex items-start gap-4">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7b39fc]/20">
									<SparklesIcon className="h-6 w-6 text-[#c4a1ff]" />
								</div>
								<div>
									<p className="font-inter text-white/40 text-xs uppercase tracking-wider">
										Brand Identity
									</p>
									<p className="mt-1 font-instrument-serif text-3xl text-white">
										{data.brand.productName}
									</p>
									<p className="mt-2 font-inter text-white/60">
										{data.brand.tagline}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Assets Grid */}
					<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
						{/* Video Column (1/3 width on desktop) */}
						{data.videoUrl && (
							<div className="col-span-1 flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
								<div className="mb-6 flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7b39fc]/20">
										<VideoIcon className="h-5 w-5 text-[#c4a1ff]" />
									</div>
									<h2 className="font-instrument-serif text-2xl text-white">
										Product Video
									</h2>
								</div>

								<div className="relative w-full overflow-hidden rounded-2xl bg-black/50 ring-1 ring-white/10">
									{/* biome-ignore lint/a11y/useMediaCaption: rendered asset has no caption track in pipeline */}
									<video
										src={data.videoUrl}
										controls
										className="w-full"
										style={{ aspectRatio: "9/16" }}
									/>
								</div>

								<a
									href={data.videoUrl}
									download
									className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7b39fc] px-5 py-3 font-cabin font-medium text-white transition-colors hover:bg-[#682edf]"
								>
									<DownloadIcon className="h-5 w-5" />
									Download Video
								</a>
							</div>
						)}

						{/* Banners Column (2/3 width on desktop) */}
						{data.banners && data.banners.length > 0 && (
							<div className="col-span-1 flex flex-col gap-8 lg:col-span-2">
								{data.banners.map((b) => (
									<div
										key={b.id}
										className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
									>
										<div className="mb-6 flex items-center justify-between">
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7b39fc]/20">
													<ImageIcon className="h-5 w-5 text-[#c4a1ff]" />
												</div>
												<h2 className="font-instrument-serif text-2xl text-white">
													{b.format === "twitter_post"
														? "Twitter / OG Banner"
														: "Banner"}
												</h2>
											</div>
											<a
												href={b.imageUrl}
												download
												className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2 font-cabin font-medium text-sm text-white transition-colors hover:bg-white/20"
											>
												<DownloadIcon className="h-4 w-4" />
												Download
											</a>
										</div>

										<div className="relative w-full overflow-hidden rounded-2xl bg-black/50 ring-1 ring-white/10">
											<Image
												src={b.imageUrl}
												alt="Generated banner"
												width={1200}
												height={630}
												className="h-auto w-full object-cover"
												unoptimized
											/>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

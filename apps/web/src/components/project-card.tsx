"use client";

import type { AppRouterClient } from "@klyp/api/routers/index";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@klyp/ui/components/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

const STATUS_COLORS: Record<string, string> = {
	pending: "bg-yellow-500/20 text-yellow-300",
	extracting: "bg-blue-500/20 text-blue-300",
	analyzing: "bg-purple-500/20 text-purple-300",
	rendering_video: "bg-indigo-500/20 text-indigo-300",
	rendering_banner: "bg-indigo-500/20 text-indigo-300",
	done: "bg-green-500/20 text-green-300",
	failed: "bg-red-500/20 text-red-300",
};

const STATUS_LABELS: Record<string, string> = {
	pending: "Queued",
	extracting: "Extracting",
	analyzing: "Analyzing",
	rendering_video: "Rendering video",
	rendering_banner: "Rendering banner",
	done: "Done",
	failed: "Failed",
};

type Project = Awaited<ReturnType<AppRouterClient["projects"]["list"]>>[number];

export function ProjectCard({ project }: { project: Project }) {
	const queryClient = useQueryClient();
	const [isRenaming, setIsRenaming] = useState(false);
	const [name, setName] = useState(project.name || project.url);

	const renameMutation = useMutation({
		...orpc.projects.rename.mutationOptions(),
		onSuccess: () => {
			queryClient.invalidateQueries(orpc.projects.list.queryOptions());
			setIsRenaming(false);
			toast.success("Project renamed");
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	const deleteMutation = useMutation({
		...orpc.projects.delete.mutationOptions(),
		onSuccess: () => {
			queryClient.invalidateQueries(orpc.projects.list.queryOptions());
			toast.success("Project deleted");
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	function handleRenameSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		renameMutation.mutate({ id: project.id, name: name.trim() });
	}

	return (
		<div className="group relative flex h-[280px] w-full flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 transition-all hover:border-[#7b39fc]/50 hover:shadow-[0_0_40px_rgba(123,57,252,0.1)]">
			{/* Decorative background gradient */}
			<div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

			{/* Full card clickable link (overlay) - only active when not renaming */}
			{!isRenaming && (
				<Link
					href={`/projects/${project.id}` as Route}
					className="absolute inset-0 z-0"
					aria-label={`View project ${project.name || project.url}`}
				/>
			)}

			{/* Top Section */}
			<div className="relative z-10">
				<div className="flex items-start justify-between">
					<span
						className={`inline-flex rounded-md px-2.5 py-1 font-medium text-xs ${STATUS_COLORS[project.status] ?? "bg-white/10 text-white/50"}`}
					>
						{STATUS_LABELS[project.status] ?? project.status}
					</span>

					{/* Actions Dropdown */}
					<div className="relative z-20">
						<DropdownMenu>
							<DropdownMenuTrigger className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white">
								<MoreVerticalIcon className="h-4 w-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-40 rounded-xl border-white/10 bg-[#1a1528] p-1.5 text-white shadow-xl"
							>
								<DropdownMenuItem
									onClick={(e) => {
										e.stopPropagation();
										setIsRenaming(true);
									}}
									className="cursor-pointer rounded-lg px-3 py-2 focus:bg-white/10 focus:text-white"
								>
									<PencilIcon className="mr-2 h-4 w-4" />
									Rename
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={(e) => {
										e.stopPropagation();
										if (
											confirm("Are you sure you want to delete this project?")
										) {
											deleteMutation.mutate({ id: project.id });
										}
									}}
									className="cursor-pointer rounded-lg px-3 py-2 text-red-400 focus:bg-red-500/10 focus:text-red-400"
								>
									<TrashIcon className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* Title / Rename Input */}
				<div className="mt-6">
					{isRenaming ? (
						<form
							onSubmit={handleRenameSubmit}
							className="flex items-center gap-2"
						>
							<input
								// biome-ignore lint/a11y/noAutofocus: autofocus is fine here
								autoFocus
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full rounded-xl border border-[#7b39fc]/50 bg-black/40 px-3 py-2 font-instrument-serif text-2xl text-white outline-none focus:border-[#7b39fc] focus:ring-1 focus:ring-[#7b39fc]"
								onBlur={() => setIsRenaming(false)}
								onKeyDown={(e) => {
									if (e.key === "Escape") setIsRenaming(false);
								}}
							/>
						</form>
					) : (
						<h3 className="line-clamp-2 break-all font-instrument-serif text-3xl text-white transition-colors group-hover:text-[#e4d9ff]">
							{project.name ||
								project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
						</h3>
					)}
					{!isRenaming && project.name && (
						<p className="mt-2 line-clamp-1 break-all font-inter text-sm text-white/40">
							{project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
						</p>
					)}
				</div>
			</div>

			{/* Bottom Section */}
			<div className="relative z-10 flex items-end justify-between border-white/5 border-t pt-4">
				<p className="font-inter text-white/30 text-xs">
					{new Date(project.createdAt).toLocaleDateString(undefined, {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</p>
			</div>
		</div>
	);
}

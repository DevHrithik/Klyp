"use client";

import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { orpc } from "@/utils/orpc";

import { ProjectCard } from "./project-card";

export function ProjectList() {
	const {
		data: projects,
		isLoading,
		isError,
		error,
	} = useQuery(orpc.projects.list.queryOptions());

	if (isLoading)
		return (
			<p className="font-inter text-sm text-white/40">Loading projects…</p>
		);

	if (isError)
		return (
			<p className="font-inter text-red-400 text-sm">
				{error instanceof Error ? error.message : "Failed to load projects"}
			</p>
		);

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{projects?.map((p) => (
				<ProjectCard key={p.id} project={p} />
			))}

			{/* New project card */}
			<Link
				href="/dashboard"
				className="group relative flex h-[280px] w-full flex-col items-center justify-center rounded-[24px] border border-white/20 border-dashed bg-white/5 transition-all hover:border-[#7b39fc]/50 hover:bg-[#7b39fc]/5 hover:shadow-[0_0_40px_rgba(123,57,252,0.1)]"
			>
				<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/50 shadow-inner transition-all group-hover:border-[#7b39fc]/50 group-hover:bg-[#7b39fc]/20 group-hover:text-[#e4d9ff] group-hover:shadow-[0_0_20px_rgba(123,57,252,0.3)]">
					<PlusIcon className="h-8 w-8" />
				</div>
				<h3 className="font-instrument-serif text-2xl text-white/70 transition-colors group-hover:text-[#e4d9ff]">
					New Project
				</h3>
				<p className="mt-2 font-inter text-[15px] text-white/40 transition-colors group-hover:text-white/70">
					Generate video, banners, and copy
				</p>
			</Link>
		</div>
	);
}

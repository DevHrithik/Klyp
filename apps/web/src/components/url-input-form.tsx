"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LinkIcon } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { orpc } from "@/utils/orpc";

export function UrlInputForm() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [url, setUrl] = useState("");

	const { mutate, isPending, error } = useMutation({
		...orpc.projects.create.mutationOptions(),
		onSuccess: async ({ id }) => {
			// Invalidate the projects list so it refetches when the user navigates back
			await queryClient.invalidateQueries(orpc.projects.list.queryOptions());
			router.push(`/projects/${id}` as Route);
		},
	});

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		mutate({ url });
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-2xl rounded-2xl border border-[rgba(164,132,215,0.3)] bg-[rgba(85,80,110,0.2)] p-2 backdrop-blur-md transition-all focus-within:border-[#7b39fc] focus-within:bg-[rgba(85,80,110,0.3)] focus-within:shadow-[0_0_30px_rgba(123,57,252,0.2)] hover:border-[#7b39fc]/50"
		>
			<div className="flex items-center gap-2">
				<div className="flex h-12 w-12 items-center justify-center">
					<LinkIcon className="h-5 w-5 text-[#c4a1ff]" />
				</div>
				<input
					type="url"
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					placeholder="https://your-product.com"
					required
					className="h-12 flex-1 bg-transparent font-inter text-[16px] text-white placeholder-white/40 focus:outline-none"
				/>
				<button
					type="submit"
					disabled={isPending}
					className="flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-[#7b39fc] px-6 font-cabin font-medium text-[16px] text-white shadow-sm transition-colors hover:bg-[#682edf] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isPending ? "Generating…" : "Generate Kit"}
				</button>
			</div>
			{error && (
				<p className="mt-2 px-2 text-red-400 text-sm">
					{error instanceof Error ? error.message : "Something went wrong"}
				</p>
			)}
		</form>
	);
}

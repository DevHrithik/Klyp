import { LinkIcon, PlusIcon } from "lucide-react";
import { requireSession } from "@/lib/auth-server";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
	const session = await requireSession();

	return (
		<div className="mx-auto max-w-7xl px-6 py-12">
			{/* Hidden API fetcher */}
			<div className="hidden">
				<Dashboard session={session} />
			</div>

			{/* Welcome & Input Section */}
			<div className="mt-8 mb-16 flex flex-col items-center justify-center text-center">
				<h1 className="mb-4 font-instrument-serif text-5xl text-white md:text-6xl">
					Welcome back,{" "}
					<span className="text-[#c4a1ff] italic tracking-wide">
						{session.user.name?.split(" ")[0] || "Founder"}
					</span>
				</h1>
				<p className="mb-10 font-inter text-lg text-white/60">
					Paste a product URL below to generate your next marketing kit.
				</p>

				{/* URL Input Form */}
				<div className="w-full max-w-2xl rounded-2xl border border-[rgba(164,132,215,0.3)] bg-[rgba(85,80,110,0.2)] p-2 backdrop-blur-md transition-all focus-within:border-[#7b39fc] focus-within:bg-[rgba(85,80,110,0.3)] focus-within:shadow-[0_0_30px_rgba(123,57,252,0.2)] hover:border-[#7b39fc]/50">
					<form className="flex items-center gap-2">
						<div className="flex h-12 w-12 items-center justify-center">
							<LinkIcon className="h-5 w-5 text-[#c4a1ff]" />
						</div>
						<input
							type="url"
							placeholder="https://your-product.com"
							className="h-12 flex-1 bg-transparent font-inter text-[16px] text-white placeholder-white/40 focus:outline-none"
							required
						/>
						<button
							type="submit"
							className="flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-[#7b39fc] px-6 font-cabin font-medium text-[16px] text-white shadow-sm transition-colors hover:bg-[#682edf] active:scale-[0.98]"
						>
							Generate Kit
						</button>
					</form>
				</div>
			</div>

			{/* Recent Projects Section */}
			<div className="mb-8 flex items-center justify-between">
				<h2 className="font-instrument-serif text-3xl text-white">
					Recent Projects
				</h2>
			</div>

			{/* Empty State / Grid */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{/* Example Empty State Card */}
				<button
					type="button"
					className="group relative flex h-[280px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border border-white/20 border-dashed bg-white/5 transition-all hover:border-[#7b39fc]/50 hover:bg-[#7b39fc]/5 hover:shadow-[0_0_40px_rgba(123,57,252,0.1)]"
				>
					<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/50 shadow-inner transition-all group-hover:border-[#7b39fc]/50 group-hover:bg-[#7b39fc]/20 group-hover:text-[#e4d9ff] group-hover:shadow-[0_0_20px_rgba(123,57,252,0.3)]">
						<PlusIcon className="h-8 w-8" />
					</div>
					<h3 className="font-instrument-serif text-2xl text-white/70 transition-colors group-hover:text-[#e4d9ff]">
						Create New Project
					</h3>
					<p className="mt-2 font-inter text-[15px] text-white/40 transition-colors group-hover:text-white/70">
						Generate video, banners, and copy
					</p>
				</button>
			</div>
		</div>
	);
}

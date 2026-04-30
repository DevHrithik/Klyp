import { ProjectList } from "@/components/project-list";
import { UrlInputForm } from "@/components/url-input-form";
import { requireSession } from "@/lib/auth-server";

export default async function DashboardPage() {
	const session = await requireSession();

	return (
		<div className="mx-auto max-w-7xl px-6 py-12">
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

				<UrlInputForm />
			</div>

			{/* Recent Projects */}
			<div className="mb-8 flex items-center justify-between">
				<h2 className="font-instrument-serif text-3xl text-white">
					Recent Projects
				</h2>
			</div>

			<ProjectList />
		</div>
	);
}

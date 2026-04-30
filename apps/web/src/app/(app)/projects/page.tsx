import { ProjectList } from "@/components/project-list";
import { requireSession } from "@/lib/auth-server";

export default async function ProjectsPage() {
	await requireSession();

	return (
		<div className="mx-auto max-w-7xl px-6 py-12">
			<h1 className="mb-8 font-instrument-serif text-4xl text-white md:text-5xl">
				Projects
			</h1>
			<ProjectList />
		</div>
	);
}

import { requireSession } from "@/lib/auth-server";

import { ProjectDetail } from "./project-detail";

export default async function ProjectPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await requireSession();
	const { id } = await params;
	return <ProjectDetail projectId={id} />;
}

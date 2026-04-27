import { redirect } from "next/navigation";
import AuthPanel from "@/components/auth-panel";
import { getSession } from "@/lib/auth-server";

export default async function LoginPage() {
	const session = await getSession();

	if (session?.user) {
		redirect("/dashboard");
	}

	return (
		<div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#03000a]">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(123,57,252,0.15)_0%,transparent_100%)]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(123,57,252,0.1)_0%,transparent_100%)]" />
			<AuthPanel />
		</div>
	);
}

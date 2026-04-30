import { requireSession } from "@/lib/auth-server";

import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
	const session = await requireSession();

	return (
		<div className="mx-auto max-w-7xl px-6 py-12">
			<div className="mb-8">
				<h1 className="font-instrument-serif text-4xl text-white md:text-5xl">
					Settings
				</h1>
				<p className="mt-2 font-inter text-sm text-white/50">
					Manage your profile and account security.
				</p>
			</div>

			<SettingsForm
				initialName={session.user.name ?? ""}
				initialEmail={session.user.email}
			/>
		</div>
	);
}

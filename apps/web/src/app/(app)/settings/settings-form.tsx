"use client";

import { useMutation } from "@tanstack/react-query";
import { CheckIcon, KeyRoundIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

interface SettingsFormProps {
	initialName: string;
	initialEmail: string;
}

function SectionCard({
	icon: Icon,
	title,
	description,
	children,
}: {
	icon: typeof UserIcon;
	title: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<div className="rounded-[24px] border border-white/10 bg-white/5 p-6 transition-all hover:border-[#7b39fc]/30">
			<div className="mb-6 flex items-center gap-4">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#7b39fc]/20">
					<Icon className="h-4 w-4 text-[#c4a1ff]" />
				</div>
				<div>
					<h2 className="font-instrument-serif text-2xl text-white">{title}</h2>
					<p className="mt-0.5 font-inter text-white/40 text-xs">
						{description}
					</p>
				</div>
			</div>
			{children}
		</div>
	);
}

function Field({
	label,
	id,
	children,
}: {
	label: string;
	id: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1.5">
			<label htmlFor={id} className="font-inter text-sm text-white/60">
				{label}
			</label>
			{children}
		</div>
	);
}

const inputClass =
	"w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-inter text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#7b39fc]/60 focus:bg-[#7b39fc]/5 disabled:cursor-not-allowed disabled:opacity-40";

const btnClass =
	"flex items-center gap-2 rounded-xl bg-[#7b39fc] px-5 py-2.5 font-cabin font-medium text-sm text-white transition-colors hover:bg-[#682edf] disabled:cursor-not-allowed disabled:opacity-50";

export function SettingsForm({ initialName, initialEmail }: SettingsFormProps) {
	const [name, setName] = useState(initialName);

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const updateProfile = useMutation({
		mutationFn: async (data: { name: string }) => {
			const result = await authClient.updateUser(data);
			if (result.error)
				throw new Error(result.error.message ?? "Update failed");
			return result.data;
		},
		onSuccess: () => {
			toast.success("Profile updated");
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	const changePassword = useMutation({
		mutationFn: async (data: {
			currentPassword: string;
			newPassword: string;
		}) => {
			const result = await authClient.changePassword({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				revokeOtherSessions: false,
			});
			if (result.error)
				throw new Error(result.error.message ?? "Password change failed");
			return result.data;
		},
		onSuccess: () => {
			toast.success("Password changed");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	function handleProfileSubmit(e: React.FormEvent) {
		e.preventDefault();
		updateProfile.mutate({ name: name.trim() });
	}

	function handlePasswordSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			toast.error("New passwords don't match");
			return;
		}
		if (newPassword.length < 8) {
			toast.error("Password must be at least 8 characters");
			return;
		}
		changePassword.mutate({ currentPassword, newPassword });
	}

	return (
		<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
			<div className="space-y-6">
				{/* Profile */}
				<SectionCard
					icon={UserIcon}
					title="Profile"
					description="Update your display name"
				>
					<form onSubmit={handleProfileSubmit} className="space-y-4">
						<Field label="Name" id="profile-name">
							<input
								id="profile-name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Your name"
								required
								className={inputClass}
							/>
						</Field>
						<Field label="Email" id="profile-email">
							<input
								id="profile-email"
								type="email"
								value={initialEmail}
								disabled
								className={inputClass}
							/>
							<p className="font-inter text-white/30 text-xs">
								Email cannot be changed.
							</p>
						</Field>
						<div className="flex justify-end pt-2">
							<button
								type="submit"
								disabled={
									updateProfile.isPending || name.trim() === initialName
								}
								className={btnClass}
							>
								{updateProfile.isSuccess && !updateProfile.isPending ? (
									<CheckIcon className="h-4 w-4" />
								) : null}
								{updateProfile.isPending ? "Saving…" : "Save changes"}
							</button>
						</div>
					</form>
				</SectionCard>

				{/* Plan */}
				<SectionCard
					icon={UserIcon}
					title="Plan"
					description="Your current subscription"
				>
					<div className="flex items-center justify-between rounded-xl border border-[#7b39fc]/30 bg-[#7b39fc]/10 px-4 py-3">
						<div>
							<p className="font-inter font-medium text-sm text-white">
								Free plan
							</p>
							<p className="font-inter text-white/40 text-xs">
								1 project included
							</p>
						</div>
						<span className="rounded-md bg-[#7b39fc]/30 px-2.5 py-1 font-inter text-[#c4a1ff] text-xs">
							Active
						</span>
					</div>
				</SectionCard>
			</div>

			<div className="space-y-6">
				{/* Security */}
				<SectionCard
					icon={KeyRoundIcon}
					title="Security"
					description="Change your password"
				>
					<form onSubmit={handlePasswordSubmit} className="space-y-4">
						<Field label="Current password" id="current-password">
							<input
								id="current-password"
								type="password"
								value={currentPassword}
								onChange={(e) => setCurrentPassword(e.target.value)}
								placeholder="••••••••"
								required
								autoComplete="current-password"
								className={inputClass}
							/>
						</Field>
						<Field label="New password" id="new-password">
							<input
								id="new-password"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								placeholder="••••••••"
								required
								autoComplete="new-password"
								className={inputClass}
							/>
						</Field>
						<Field label="Confirm new password" id="confirm-password">
							<input
								id="confirm-password"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								placeholder="••••••••"
								required
								autoComplete="new-password"
								className={inputClass}
							/>
						</Field>
						<div className="flex justify-end pt-2">
							<button
								type="submit"
								disabled={changePassword.isPending}
								className={btnClass}
							>
								{changePassword.isPending ? "Updating…" : "Update password"}
							</button>
						</div>
					</form>
				</SectionCard>
			</div>
		</div>
	);
}

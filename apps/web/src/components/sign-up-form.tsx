import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignUpForm({
	onSwitchToSignIn,
}: {
	onSwitchToSignIn: () => void;
}) {
	const router = useRouter();
	const { isPending } = authClient.useSession();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			name: "",
		},
		onSubmit: async ({ value }) => {
			await authClient.signUp.email(
				{
					email: value.email,
					password: value.password,
					name: value.name,
				},
				{
					onSuccess: () => {
						router.replace("/dashboard");
						router.refresh();
						toast.success("Sign up successful");
					},
					onError: (error) => {
						toast.error(error.error.message || error.error.statusText);
					},
				},
			);
		},
		validators: {
			onSubmit: z.object({
				name: z.string().min(2, "Name must be at least 2 characters"),
				email: z.email("Invalid email address"),
				password: z.string().min(8, "Password must be at least 8 characters"),
			}),
		},
	});

	if (isPending) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<div className="flex w-full flex-col space-y-6 rounded-[20px] border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] p-8 backdrop-blur-xl">
			<div className="flex flex-col space-y-2 text-center">
				<h1 className="font-instrument-serif text-4xl text-white tracking-tight">
					Create an account
				</h1>
				<p className="font-inter text-sm text-white/70">
					Enter your details below to create your account
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<div>
					<form.Field name="name">
						{(field) => (
							<div className="space-y-2">
								<label
									htmlFor={field.name}
									className="font-inter font-medium text-sm text-white/90"
								>
									Name
								</label>
								<input
									id={field.name}
									name={field.name}
									placeholder="John Doe"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="w-full rounded-[10px] border border-[rgba(164,132,215,0.3)] bg-[rgba(85,80,110,0.2)] px-4 py-3 font-inter text-[16px] text-white placeholder-white/50 backdrop-blur-md transition-all focus:border-[#7b39fc] focus:outline-none focus:ring-1 focus:ring-[#7b39fc]"
								/>
								{field.state.meta.errors.map((error) => (
									<p
										key={error?.message}
										className="mt-1 font-inter text-red-400 text-xs"
									>
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<div>
					<form.Field name="email">
						{(field) => (
							<div className="space-y-2">
								<label
									htmlFor={field.name}
									className="font-inter font-medium text-sm text-white/90"
								>
									Email
								</label>
								<input
									id={field.name}
									name={field.name}
									type="email"
									placeholder="name@example.com"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="w-full rounded-[10px] border border-[rgba(164,132,215,0.3)] bg-[rgba(85,80,110,0.2)] px-4 py-3 font-inter text-[16px] text-white placeholder-white/50 backdrop-blur-md transition-all focus:border-[#7b39fc] focus:outline-none focus:ring-1 focus:ring-[#7b39fc]"
								/>
								{field.state.meta.errors.map((error) => (
									<p
										key={error?.message}
										className="mt-1 font-inter text-red-400 text-xs"
									>
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<div>
					<form.Field name="password">
						{(field) => (
							<div className="space-y-2">
								<label
									htmlFor={field.name}
									className="font-inter font-medium text-sm text-white/90"
								>
									Password
								</label>
								<input
									id={field.name}
									name={field.name}
									type="password"
									placeholder="••••••••"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="w-full rounded-[10px] border border-[rgba(164,132,215,0.3)] bg-[rgba(85,80,110,0.2)] px-4 py-3 font-inter text-[16px] text-white placeholder-white/50 backdrop-blur-md transition-all focus:border-[#7b39fc] focus:outline-none focus:ring-1 focus:ring-[#7b39fc]"
								/>
								{field.state.meta.errors.map((error) => (
									<p
										key={error?.message}
										className="mt-1 font-inter text-red-400 text-xs"
									>
										{error?.message}
									</p>
								))}
							</div>
						)}
					</form.Field>
				</div>

				<form.Subscribe
					selector={(state) => ({
						canSubmit: state.canSubmit,
						isSubmitting: state.isSubmitting,
					})}
				>
					{({ canSubmit, isSubmitting }) => (
						<button
							type="submit"
							className="mt-6 w-full cursor-pointer rounded-[10px] bg-[#7b39fc] px-6 py-3 font-cabin font-medium text-[16px] text-white shadow-sm transition-colors hover:bg-[#682edf] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
							disabled={!canSubmit || isSubmitting}
						>
							{isSubmitting ? "Creating account..." : "Sign Up"}
						</button>
					)}
				</form.Subscribe>
			</form>

			<div className="text-center font-inter text-sm">
				<span className="text-white/60">Already have an account? </span>
				<button
					type="button"
					onClick={onSwitchToSignIn}
					className="cursor-pointer font-medium text-[#c4a1ff] underline-offset-4 transition-colors hover:underline"
				>
					Sign In
				</button>
			</div>
		</div>
	);
}

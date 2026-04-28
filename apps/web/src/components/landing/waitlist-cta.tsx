"use client";

import { motion } from "framer-motion";

export default function WaitlistCTA() {
	return (
		<section
			id="waitlist"
			className="relative w-full overflow-hidden border-white/5 border-t bg-[#03000a] px-6 py-24 md:py-32 lg:px-8"
		>
			{/* Ambient Glowing Orbs */}
			<div className="pointer-events-none absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7b39fc]/10 blur-[150px]" />
			<div className="pointer-events-none absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-[#7b39fc] to-transparent shadow-[0_0_30px_rgba(123,57,252,0.8)]" />

			<div className="relative z-10 mx-auto max-w-4xl text-center">
				<div className="flex flex-col items-center">
					{/* Section Label */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-6 flex h-[38px] items-center gap-2 rounded-[10px] border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] px-4 py-1 backdrop-blur-md"
					>
						<span className="rounded-md bg-[#7b39fc] px-2 py-0.5 font-cabin font-medium text-[14px] text-white">
							Early Access
						</span>
						<span className="font-cabin font-medium text-[14px] text-white">
							Join the waitlist
						</span>
					</motion.div>

					{/* Headline */}
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="font-instrument-serif text-5xl text-white leading-[1.1] md:text-7xl"
					>
						Be the first to launch with{" "}
						<span className="text-[#7b39fc] italic tracking-wide">Klyp</span>
					</motion.h2>

					{/* Subtext */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="mt-6 max-w-2xl font-inter font-normal text-lg text-white/70"
					>
						Join hundreds of founders on the waitlist. Early members get
						lifetime discounted pricing and priority access.
					</motion.p>
				</div>

				{/* Input Form */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3 }}
					className="mx-auto mt-12 max-w-lg"
				>
					<form
						onSubmit={(e) => e.preventDefault()}
						className="flex flex-col gap-4 sm:flex-row"
					>
						<input
							type="email"
							placeholder="Enter your email address"
							required
							className="h-14 grow rounded-xl border border-white/10 bg-white/5 px-6 font-inter text-white placeholder:text-white/40 focus:border-[#7b39fc]/50 focus:outline-hidden focus:ring-2 focus:ring-[#7b39fc]/20"
						/>
						<button
							type="submit"
							className="flex h-14 shrink-0 items-center justify-center rounded-xl bg-[#7b39fc] px-8 font-cabin font-medium text-lg text-white shadow-[0_0_20px_rgba(123,57,252,0.4)] transition-all hover:bg-[#8a4bfe] hover:shadow-[0_0_30px_rgba(123,57,252,0.6)] sm:w-auto"
						>
							Join the Waitlist
						</button>
					</form>

					{/* Social Proof */}
					<div className="mt-6 flex items-center justify-center gap-2 text-white/50">
						<span className="font-inter text-sm">
							No spam. Unsubscribe anytime.
						</span>
					</div>
				</motion.div>
			</div>
		</section>
	);
}

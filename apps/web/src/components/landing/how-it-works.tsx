"use client";

import { motion } from "framer-motion";

const steps = [
	{
		id: 1,
		icon: "🔗",
		title: "Paste your URL",
		description:
			"Drop in your product or landing page URL. Klyp scrapes and understands everything about your product.",
	},
	{
		id: 2,
		icon: "⚡",
		title: "AI generates everything",
		description:
			"Klyp's AI engine creates a launch video, social banners, and platform-ready marketing copy — all in under 60 seconds.",
	},
	{
		id: 3,
		icon: "🚀",
		title: "Download & launch",
		description:
			"Preview your assets, download in HD, and hit publish. Your launch is ready.",
	},
];

export default function HowItWorks() {
	return (
		<section
			id="how-it-works"
			className="relative w-full overflow-hidden border-white/5 border-y bg-[#03000a] px-6 py-24 md:py-32 lg:px-8"
		>
			{/* Purple Ambient Gradients */}
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(123,57,252,0.12)_0%,transparent_100%)]" />
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(123,57,252,0.08)_0%,transparent_100%)]" />

			<div className="relative z-10 mx-auto max-w-7xl">
				<div className="flex flex-col items-center text-center">
					{/* Section Label */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-6 flex h-[38px] items-center gap-2 rounded-[10px] border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] py-1 pr-4 pl-1 backdrop-blur-md"
					>
						<span className="rounded-md bg-[#7b39fc] px-2 py-0.5 font-cabin font-medium text-[14px] text-white">
							Guide
						</span>
						<span className="font-cabin font-medium text-[14px] text-white">
							How It Works
						</span>
					</motion.div>

					{/* Headline */}
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="font-instrument-serif text-4xl text-white leading-[1.1] md:text-6xl"
					>
						From URL to full launch kit in{" "}
						<span className="text-[#7b39fc] italic tracking-wide">3 steps</span>
					</motion.h2>

					{/* Subtext */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="mt-6 max-w-2xl font-inter font-normal text-lg text-white/70"
					>
						No design skills. No copywriting. No video editing. Just paste your
						product URL.
					</motion.p>
				</div>

				{/* Steps Grid */}
				<div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
					{steps.map((step, index) => (
						<motion.div
							key={step.id}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 * index + 0.3 }}
							className="group relative flex flex-col overflow-hidden rounded-[32px] border border-white/5 bg-white/2 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#7b39fc]/40 hover:bg-white/4 hover:shadow-[0_20px_40px_rgba(123,57,252,0.1)]"
						>
							{/* Top hover gradient line */}
							<div className="absolute inset-x-0 -top-px h-px w-full bg-linear-to-r from-transparent via-[#7b39fc]/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

							{/* Bottom purple glow inside card */}
							<div className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-[#7b39fc]/20 blur-3xl transition-all duration-500 group-hover:bg-[#7b39fc]/40" />

							{/* Icon */}
							<div className="relative z-10 mb-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-inner transition-all duration-300 group-hover:border-[#7b39fc]/50 group-hover:bg-[#7b39fc]/20 group-hover:shadow-[0_0_20px_rgba(123,57,252,0.3)]">
								<span className="text-3xl">{step.icon}</span>
							</div>

							{/* Huge Background Step Number */}
							<div className="absolute top-6 right-6 font-black font-instrument-serif text-6xl text-white/10 transition-all duration-300 group-hover:text-[#7b39fc]/20">
								0{step.id}
							</div>

							{/* Content */}
							<div className="relative z-10">
								<h3 className="mb-4 font-instrument-serif text-3xl text-white transition-colors group-hover:text-[#e4d9ff]">
									{step.title}
								</h3>
								<p className="font-inter text-[16px] text-white/60 leading-relaxed transition-colors group-hover:text-white/80">
									{step.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

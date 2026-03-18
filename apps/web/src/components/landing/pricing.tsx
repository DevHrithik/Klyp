"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const plans = [
	{
		name: "Free",
		price: { monthly: "$0", annually: "$0" },
		description: "For starters and explorers exploring the product.",
		features: ["3 active projects", "Community support", "Public previews"],
		buttonText: "Start for Free",
		isPopular: false,
	},
	{
		name: "Starter",
		price: { monthly: "$25", annually: "$20" },
		description: "For builders who want unlimited freedom.",
		features: [
			"Unlimited projects",
			"Real-time dashboard",
			"Private repositories",
			"Custom domains",
			"Priority support",
			"User roles & permissions",
			"Credit rollovers",
		],
		buttonText: "Start for Free",
		isPopular: true,
	},
	{
		name: "Team",
		price: { monthly: "$99", annually: "$79" },
		description: "For growing teams who build together.",
		features: [
			"All Pro features",
			"Multi-user collaboration",
			"Role-based access control",
			"SSO & audit logs",
			"Opt out of data training",
			"Dedicated support",
		],
		buttonText: "Contact Sales",
		isPopular: false,
	},
];

export default function Pricing() {
	const [isAnnual, setIsAnnual] = useState(false);

	return (
		<section
			id="pricing"
			className="relative w-full overflow-hidden bg-[#03000a] px-6 py-24 md:py-32 lg:px-8"
		>
			{/* Animated border keyframes + card border styles */}
			<style>{`
				@keyframes spin-border {
					0%   { --border-angle: 0deg; }
					100% { --border-angle: 360deg; }
				}

				@property --border-angle {
					syntax: "<angle>";
					initial-value: 0deg;
					inherits: false;
				}

				.pricing-card-border {
					animation: spin-border 4s linear infinite;
					background: conic-gradient(
						from var(--border-angle),
						transparent 30%,
						rgba(123, 57, 252, 0.15) 45%,
						rgba(123, 57, 252, 0.4) 50%,
						rgba(123, 57, 252, 0.15) 55%,
						transparent 70%
					);
				}

				.pricing-card-border--pro {
					animation: spin-border 3s linear infinite;
					background: conic-gradient(
						from var(--border-angle),
						transparent 20%,
						rgba(138, 75, 254, 0.3) 35%,
						rgba(123, 57, 252, 0.9) 50%,
						rgba(138, 75, 254, 0.3) 65%,
						transparent 80%
					);
				}
			`}</style>

			{/* Premium Background Ambient Glows & Tech Grid */}
			<div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
				{/* 1. Massive Glowing Horizon line at the top Center */}
				<div className="absolute -top-[10%] left-1/2 h-[500px] w-full max-w-[1200px] -translate-x-1/2 rounded-[100%] bg-[#7b39fc]/15 blur-[120px]" />

				{/* 2. Slower floating huge orbs for dynamic ambience */}
				<motion.div
					animate={{
						transform: [
							"translate(-20px, -20px)",
							"translate(40px, 20px)",
							"translate(-20px, -20px)",
						],
					}}
					transition={{
						duration: 15,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
					className="absolute top-40 -left-64 h-[600px] w-[600px] rounded-full bg-[#7b39fc]/10 blur-[150px]"
				/>
				<motion.div
					animate={{
						transform: [
							"translate(20px, 20px)",
							"translate(-40px, -20px)",
							"translate(20px, 20px)",
						],
					}}
					transition={{
						duration: 18,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
						delay: 2,
					}}
					className="absolute top-60 -right-64 h-[700px] w-[700px] rounded-full bg-[#6429d2]/10 blur-[150px]"
				/>

				{/* 3. Tech Grid Overlay masked to only show near the top horizon */}
				<div
					className="absolute inset-x-0 top-0 h-[800px] opacity-[0.12]"
					style={{
						backgroundImage:
							"linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
						backgroundSize: "48px 48px",
						maskImage:
							"radial-gradient(ellipse 80% 60% at 50% 0%, black 10%, transparent 100%)",
						WebkitMaskImage:
							"radial-gradient(ellipse 80% 60% at 50% 0%, black 10%, transparent 100%)",
					}}
				/>
			</div>

			<div className="relative z-10 mx-auto max-w-6xl">
				{/* Header Section */}
				<div className="flex flex-col items-center text-center">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="flex max-w-3xl flex-col items-center justify-center gap-x-3 text-5xl text-white leading-[1.1] tracking-tight md:inline-block md:text-6xl"
					>
						<span className="font-instrument-serif font-normal text-white italic drop-shadow-[0_0_20px_rgba(123,57,252,0.3)]">
							The future
						</span>
						<span className="font-inter font-medium text-white/95">
							{" "}
							of building,
						</span>
						<br className="hidden md:block" />
						<span className="mt-2 font-inter font-medium text-white/95 md:mt-0">
							priced simply
						</span>
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="mt-6 max-w-xl font-inter font-normal text-sm text-white/40 md:text-[15px]"
					>
						Start free, scale as you grow. No hidden fees, no lock-in you own
						the code
					</motion.p>
				</div>

				{/* Toggle Switch */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.2 }}
					className="mt-10 flex justify-center"
				>
					<div className="relative flex items-center rounded-full border border-white/5 bg-[#0a0714] p-1.5 shadow-[0_0_30px_rgba(123,57,252,0.08)] backdrop-blur-md">
						<button
							type="button"
							onClick={() => setIsAnnual(false)}
							className={`relative z-10 w-24 rounded-full py-2 font-medium text-sm transition-colors ${
								!isAnnual ? "text-white" : "text-white/40 hover:text-white/60"
							}`}
						>
							Monthly
						</button>
						<button
							type="button"
							onClick={() => setIsAnnual(true)}
							className={`relative z-10 w-24 rounded-full py-2 font-medium text-sm transition-colors ${
								isAnnual ? "text-white" : "text-white/40 hover:text-white/60"
							}`}
						>
							Yearly
						</button>

						{/* Active Tab Background */}
						<motion.div
							className="absolute top-1.5 bottom-1.5 w-24 rounded-full bg-white/10 shadow-inner"
							animate={{ x: isAnnual ? "100%" : "0%" }}
							transition={{ type: "spring", stiffness: 400, damping: 30 }}
						/>

						{/* Overlapping -20% Pill */}
						<div className="pointer-events-none absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-white px-2 py-0.5 shadow-[0_4px_10px_rgba(255,255,255,0.2)]">
							<span className="font-bold font-inter text-[10px] text-black">
								-20%
							</span>
						</div>
					</div>
				</motion.div>

				{/* Pricing Cards Grid */}
				<div className="mx-auto mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
					{plans.map((plan, index) => {
						const isPro = plan.isPopular;

						return (
							<motion.div
								key={plan.name}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.1 * index + 0.3 }}
								className={`group relative rounded-[24px] p-[1.5px] shadow-2xl transition-transform hover:-translate-y-1 ${
									isPro ? "pricing-card-border--pro" : "pricing-card-border"
								}`}
							>
								{/* Inner Card Background */}
								<div className="relative flex h-full flex-col overflow-hidden rounded-[22.5px] bg-[#0a0710] p-8">
									{/* Bottom Glow */}
									{isPro ? (
										<div className="absolute inset-x-0 bottom-0 h-3/4 w-full bg-linear-to-t from-[#8a4bfe]/70 via-[#7b39fc]/30 to-transparent opacity-70 blur-2xl" />
									) : (
										<div className="absolute inset-x-0 -bottom-20 left-1/2 h-[150px] w-3/4 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
									)}

									<div className="relative z-10 flex h-full flex-col">
										{/* Card Header */}
										<div className="mb-6 flex items-center justify-between">
											<h3 className="font-inter font-medium text-white text-xl">
												{plan.name}
											</h3>
											{isPro && (
												<div className="rounded-full border border-white/5 bg-white/10 px-3 py-1 font-medium text-[#cbb5ff] text-[11px]">
													Most Popular
												</div>
											)}
										</div>

										{/* Price Section */}
										<div className="mb-4 flex items-baseline gap-2">
											<span className="font-inter font-semibold text-5xl text-white tracking-tight">
												{isAnnual ? plan.price.annually : plan.price.monthly}
											</span>
											<span className="font-inter font-normal text-sm text-white/40">
												per month
											</span>
										</div>

										{/* Description */}
										<p className="mb-8 min-h-[40px] font-inter text-[13px] text-white/40 leading-relaxed">
											{plan.description}
										</p>

										{/* CTA Button */}
										<button
											type="button"
											className={`mb-10 flex w-full items-center justify-center rounded-xl py-3.5 font-inter font-medium text-[14px] transition-all focus:outline-hidden ${
												isPro
													? "bg-linear-to-r from-[#8a4bfe] to-[#7b39fc] text-white shadow-[0_0_20px_rgba(123,57,252,0.4)] hover:opacity-90"
													: "border border-white/5 bg-white/5 text-white/90 hover:bg-white/10"
											}`}
										>
											{plan.buttonText}
										</button>

										{/* Features List */}
										<ul className="flex grow flex-col gap-4">
											{plan.features.map((feature, i) => (
												<li key={i} className="flex items-start gap-3">
													<svg
														className="mt-0.5 h-4 w-4 shrink-0 text-white/40"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														strokeWidth={2}
														aria-hidden
													>
														<title>Check</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M5 13l4 4L19 7"
														/>
													</svg>
													<span className="font-inter font-normal text-[13px] text-white/60">
														{feature}
													</span>
												</li>
											))}
										</ul>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

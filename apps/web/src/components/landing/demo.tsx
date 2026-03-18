"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TARGET_URL = "https://your-startup.com";
const LOADING_STEPS = [
	"Extracting brand assets...",
	"Analyzing product messaging...",
	"Rendering short-form video...",
	"Generating social banners...",
	"Writing conversion copy...",
	"Finalizing launch kit...",
];

export default function Demo() {
	const [phase, setPhase] = useState<"idle" | "typing" | "processing" | "done">(
		"idle",
	);
	const [typedText, setTypedText] = useState("");
	const [loadingStep, setLoadingStep] = useState(0);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (phase === "idle") {
			setTypedText("");
			setLoadingStep(0);
			// Wait 1.5s before starting to type
			timeout = setTimeout(() => setPhase("typing"), 1500);
		} else if (phase === "typing") {
			let i = 0;
			const typeInterval = setInterval(() => {
				setTypedText(TARGET_URL.slice(0, i + 1));
				i++;
				if (i >= TARGET_URL.length) {
					clearInterval(typeInterval);
					// Wait 0.8s after typing before hitting 'Generate'
					timeout = setTimeout(() => setPhase("processing"), 800);
				}
			}, 60); // fast typing
			return () => clearInterval(typeInterval);
		} else if (phase === "processing") {
			let step = 0;
			setLoadingStep(0);
			const stepInterval = setInterval(() => {
				step++;
				if (step >= LOADING_STEPS.length) {
					clearInterval(stepInterval);
					// Short pause before showing dashboard
					timeout = setTimeout(() => setPhase("done"), 400);
				} else {
					setLoadingStep(step);
				}
			}, 700);
			return () => clearInterval(stepInterval);
		} else if (phase === "done") {
			// Hold the final result for 6 seconds, then loop
			timeout = setTimeout(() => setPhase("idle"), 6000);
		}

		return () => clearTimeout(timeout);
	}, [phase]);

	return (
		<section
			id="demo"
			className="relative w-full overflow-hidden border-white/5 border-b bg-[#03000a] px-6 py-24 md:py-32 lg:px-8"
		>
			{/* Ambient Glowing Orbs */}
			<div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7b39fc]/5 blur-[120px]" />

			<div className="relative z-10 mx-auto max-w-7xl">
				<div className="flex flex-col items-center text-center">
					{/* Section Label */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-6 flex h-[38px] items-center gap-2 rounded-[10px] border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] px-4 py-1 backdrop-blur-md"
					>
						<span className="rounded-md bg-[#7b39fc] px-2 py-0.5 font-cabin font-medium text-[14px] text-white">
							Demo
						</span>
						<span className="font-cabin font-medium text-[14px] text-white">
							See It In Action
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
						Watch Klyp build a launch kit{" "}
						<span className="text-[#7b39fc] italic tracking-wide">live</span>
					</motion.h2>

					{/* Subtext */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="mt-6 max-w-2xl font-inter font-normal text-lg text-white/70"
					>
						Paste in any product URL and watch in real-time as Klyp builds your
						video, banners, and copy.
					</motion.p>
				</div>

				{/* Mockup UI Window */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.3 }}
					className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-[24px] border border-white/10 bg-[#0c0814]/80 shadow-2xl shadow-[#7b39fc]/10 backdrop-blur-xl"
				>
					{/* macOS Top bar */}
					<div className="flex items-center justify-between border-white/5 border-b bg-white/5 px-4 py-3">
						<div className="flex gap-2">
							<div className="h-3 w-3 rounded-full bg-white/20" />
							<div className="h-3 w-3 rounded-full bg-white/20" />
							<div className="h-3 w-3 rounded-full bg-white/20" />
						</div>
						<div className="flex h-6 w-full max-w-[200px] items-center justify-center rounded-md bg-black/40 font-mono text-white/40 text-xs md:max-w-md">
							klyp.ai/dashboard
						</div>
						<div className="w-11" /> {/* Spacer for flex balance */}
					</div>

					{/* Window Body */}
					<div className="relative flex min-h-[450px] w-full flex-col items-center justify-center p-6 md:p-12">
						<AnimatePresence mode="wait">
							{/* PHASE: IDLE / TYPING / PROCESSING */}
							{(phase === "idle" ||
								phase === "typing" ||
								phase === "processing") && (
								<motion.div
									key="input-phase"
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
									transition={{ duration: 0.4 }}
									className="flex w-full max-w-2xl flex-col items-center gap-8"
								>
									{/* The Input Field */}
									<div
										className={`flex w-full flex-col gap-4 rounded-2xl border bg-black/40 p-2 backdrop-blur-md transition-all duration-500 md:flex-row md:items-center ${
											phase === "processing"
												? "border-[#7b39fc]/50 shadow-[0_0_30px_rgba(123,57,252,0.2)]"
												: "border-white/10"
										}`}
									>
										<div className="flex h-14 w-full items-center rounded-xl bg-white/5 px-4 font-mono text-sm text-white/90 md:text-base">
											<span className="mr-2 text-white/40">url</span>
											{typedText}
											{(phase === "typing" || phase === "idle") && (
												<span className="ml-1 block h-5 w-2 animate-pulse bg-[#7b39fc] text-[#7b39fc]" />
											)}
										</div>
										<button
											type="button"
											className={`flex h-14 w-full shrink-0 items-center justify-center rounded-xl bg-[#7b39fc] px-8 font-cabin font-medium text-lg text-white transition-all duration-300 md:w-auto ${
												phase === "processing"
													? "cursor-not-allowed bg-[#7b39fc]/50 text-white/50"
													: "hover:bg-[#8a4bfe]"
											}`}
										>
											{phase === "processing" ? "Generating..." : "Generate"}
										</button>
									</div>

									{/* The Progress Loader */}
									<div className="mt-4 h-20 w-full">
										<AnimatePresence>
											{phase === "processing" && (
												<motion.div
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													className="flex w-full flex-col items-center gap-4"
												>
													<div className="h-1.5 w-full max-w-md overflow-hidden rounded-full bg-white/10">
														<motion.div
															className="h-full bg-[#7b39fc] shadow-[0_0_10px_rgba(123,57,252,0.8)]"
															initial={{ width: "0%" }}
															animate={{
																width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%`,
															}}
															transition={{ duration: 0.5, ease: "easeInOut" }}
														/>
													</div>
													<motion.p
														key={loadingStep}
														initial={{ opacity: 0, y: 5 }}
														animate={{ opacity: 1, y: 0 }}
														exit={{ opacity: 0, y: -5 }}
														className="font-inter font-medium text-[#cbb5ff] text-sm"
													>
														{LOADING_STEPS[loadingStep]}
													</motion.p>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</motion.div>
							)}

							{/* PHASE: DONE (Results Dashboard) */}
							{phase === "done" && (
								<motion.div
									key="result-phase"
									initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
									animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.6, staggerChildren: 0.1 }}
									className="grid w-full grid-cols-1 gap-6 md:grid-cols-3"
								>
									{/* Sidebar / Video Output */}
									<motion.div
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										className="col-span-1 flex flex-col gap-4"
									>
										<div className="flex items-center gap-2">
											<span className="text-xl">🎬</span>
											<span className="font-cabin font-medium text-sm text-white/60">
												Launch Video (9:16)
											</span>
										</div>
										<div className="relative aspect-9/16 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-inner">
											{/* Skeleton Video UI */}
											<div className="absolute inset-x-4 top-4 bottom-12 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm" />
											<div className="absolute bottom-4 left-4 h-3 w-3/4 rounded-full bg-white/20" />
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7b39fc]/80 backdrop-blur-md transition-transform hover:scale-110">
													<span className="ml-1 text-white text-xl">▶</span>
												</div>
											</div>
										</div>
									</motion.div>

									{/* Main Content / Extracted Assets */}
									<motion.div
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										className="col-span-1 flex flex-col gap-8 md:col-span-2"
									>
										{/* Written Copy */}
										<div className="flex flex-col gap-4">
											<div className="flex items-center gap-2">
												<span className="text-xl">✍️</span>
												<span className="font-cabin font-medium text-sm text-white/60">
													Twitter / X Thread
												</span>
											</div>
											<div className="flex w-full flex-col gap-3 rounded-2xl border border-white/5 bg-white/5 p-5">
												<div className="mb-2 flex items-center gap-3">
													<div className="h-10 w-10 shrink-0 rounded-full bg-white/10" />
													<div className="flex w-full flex-col gap-1.5">
														<div className="h-2 w-32 rounded-full bg-white/20" />
														<div className="h-2 w-16 rounded-full bg-white/10" />
													</div>
												</div>
												<div className="h-2 w-full rounded-full bg-white/20" />
												<div className="h-2 w-11/12 rounded-full bg-white/20" />
												<div className="h-2 w-4/5 rounded-full bg-white/20" />
												<div className="mt-2 h-24 w-full rounded-xl bg-white/10" />
											</div>
										</div>

										{/* Banners */}
										<div className="flex flex-col gap-4">
											<div className="flex items-center gap-2">
												<span className="text-xl">🖼️</span>
												<span className="font-cabin font-medium text-sm text-white/60">
													Social Assets
												</span>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div className="flex aspect-12/6 w-full flex-col justify-end rounded-xl border border-[#7b39fc]/30 bg-linear-to-br from-[#7b39fc]/20 to-transparent p-4">
													<div className="h-2 w-1/2 rounded-full bg-white/30" />
												</div>
												<div className="flex aspect-12/6 w-full flex-col justify-end rounded-xl border border-white/5 bg-white/5 p-4">
													<div className="h-2 w-1/3 rounded-full bg-white/20" />
												</div>
											</div>
										</div>
									</motion.div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</motion.div>

				{/* CTA Button below demo */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.4 }}
					className="mt-12 flex justify-center"
				>
					<button
						type="button"
						className="flex h-[46px] items-center justify-center rounded-xl bg-white px-8 font-cabin font-semibold text-[#171717] text-base transition-all hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
					>
						Try it for free <span className="ml-2">→</span>
					</button>
				</motion.div>
			</div>
		</section>
	);
}

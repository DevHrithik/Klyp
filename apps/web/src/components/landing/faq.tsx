"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const faqs = [
	{
		question: "What types of products work with Klyp?",
		answer:
			"Any product with a public URL — SaaS tools, apps, browser extensions, newsletters, and more.",
	},
	{
		question: "How long does generation take?",
		answer: "Under 60 seconds for a full marketing kit.",
	},
	{
		question: "Can I customize the outputs?",
		answer:
			"Currently you can regenerate with tweaked prompts. Full editing UI is coming soon.",
	},
	{
		question: "Do I need design or video experience?",
		answer: "Zero. Klyp is built for founders, not designers.",
	},
	{
		question: "What formats are supported for export?",
		answer:
			"MP4 for videos, PNG/JPG for banners, and plain text/Markdown for copy.",
	},
	{
		question: "Is my product data stored?",
		answer:
			"We only cache scraped data temporarily for generation. Nothing is stored long-term.",
	},
	{
		question: "When does Klyp launch publicly?",
		answer: "We're in beta. Join the waitlist to get early access.",
	},
];

export default function FAQ() {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section
			id="faq"
			className="relative w-full overflow-hidden border-white/5 border-t bg-[#03000a] px-6 py-24 md:py-32 lg:px-8"
		>
			{/* Ambient Glow */}
			<div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7b39fc]/5 blur-[120px]" />

			<div className="relative z-10 mx-auto max-w-4xl">
				<div className="flex flex-col items-center text-center">
					{/* Section Label */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-6 flex h-[38px] items-center gap-2 rounded-[10px] border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] px-4 py-1 backdrop-blur-md"
					>
						<span className="rounded-md bg-[#7b39fc] px-2 py-0.5 font-cabin font-medium text-[14px] text-white">
							FAQ
						</span>
						<span className="font-cabin font-medium text-[14px] text-white">
							Got questions?
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
						Got questions?{" "}
						<span className="text-[#7b39fc] italic tracking-wide">
							We've got answers.
						</span>
					</motion.h2>
				</div>

				{/* FAQ Accordion */}
				<div className="mx-auto mt-16 flex max-w-3xl flex-col gap-4">
					{faqs.map((faq, index) => {
						const isOpen = openIndex === index;

						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: 0.1 * index + 0.2 }}
								className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
									isOpen
										? "border-[#7b39fc]/40 bg-white/10 shadow-[0_0_30px_rgba(123,57,252,0.1)]"
										: "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
								}`}
							>
								<button
									type="button"
									onClick={() => setOpenIndex(isOpen ? null : index)}
									className="flex w-full items-center justify-between p-6 text-left focus:outline-hidden"
								>
									<span className="font-cabin font-medium text-lg text-white">
										{faq.question}
									</span>
									<div
										className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
											isOpen
												? "bg-[#7b39fc] text-white"
												: "bg-white/10 text-white/60"
										}`}
									>
										<svg
											className={`h-5 w-5 transition-transform duration-300 ${
												isOpen ? "rotate-45" : ""
											}`}
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
											aria-hidden
										>
											<title>Toggle</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M12 4v16m8-8H4"
											/>
										</svg>
									</div>
								</button>

								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3, ease: "easeInOut" }}
										>
											<div className="px-6 pt-0 pb-6 font-inter text-[15px] text-white/70 leading-relaxed">
												{faq.answer}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}

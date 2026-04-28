"use client";

import { motion } from "framer-motion";

const testimonials = [
	{
		id: 1,
		content:
			"I launched my SaaS in a weekend. Klyp handled all the marketing content while I focused on the product.",
		author: "devfounder",
		name: "Alex Rivera",
		role: "Indie Hacker",
		avatar:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=devfounder&backgroundColor=7b39fc",
	},
	{
		id: 2,
		content:
			"I used to spend 3 hours making a launch tweet thread. Klyp nails it in 30 seconds.",
		author: "sarahmakes",
		name: "Sarah Chen",
		role: "Product Designer",
		avatar:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=sarahmakes&backgroundColor=2b2344",
	},
	{
		id: 3,
		content:
			"Generated a Product Hunt banner and launch video in under a minute. Insane tool.",
		author: "marketo_builder",
		name: "Mark Johnson",
		role: "SaaS Founder",
		avatar:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=marketo_builder&backgroundColor=8a4bfe",
	},
	{
		id: 4,
		content:
			"The video generation is pure magic. It perfectly captured our brand tone and saved us thousands on agency fees.",
		author: "jessicadev",
		name: "Jessica Wu",
		role: "Frontend Developer",
		avatar:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=jessicadev&backgroundColor=7b39fc",
	},
	{
		id: 5,
		content:
			"We use Klyp for every feature release now. It saves our marketing team days of work.",
		author: "growth_tom",
		name: "Tom Baker",
		role: "Head of Growth",
		avatar:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=growth_tom&backgroundColor=2b2344",
	},
	{
		id: 6,
		content:
			"Unbelievable quality. The AI actually understands what makes a product launch successful.",
		author: "emilybuilds",
		name: "Emily Davis",
		role: "Startup Founder",
		avatar:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=emilybuilds&backgroundColor=8a4bfe",
	},
	{
		id: 7,
		content:
			"I was skeptical about AI marketing copy, but the tweets Klyp generated got us 500+ signups on day one.",
		author: "david_ships",
		name: "David Kim",
		role: "Solo Founder",
		avatar:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=david_ships&backgroundColor=7b39fc",
	},
	{
		id: 8,
		content:
			"The brand extraction feature is flawless. Every asset looks like it was custom-made by our design team.",
		author: "ui_lisa",
		name: "Lisa Torres",
		role: "Creative Director",
		avatar:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=ui_lisa&backgroundColor=2b2344",
	},
	{
		id: 9,
		content:
			"I've tried other AI tools, but Klyp is the only one that outputs production-ready assets without needing edits.",
		author: "creator_dan",
		name: "Dan Wilson",
		role: "Content Creator",
		avatar:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=creator_dan&backgroundColor=8a4bfe",
	},
	{
		id: 10,
		content:
			"From URL to full marketing kit in seconds. This is the ultimate cheat code for indie hackers.",
		author: "ship_it_fast",
		name: "Rachel Green",
		role: "Serial Maker",
		avatar:
			"https://api.dicebear.com/7.x/avataaars/svg?seed=ship_it_fast&backgroundColor=7b39fc",
	},
];

const row1 = testimonials.slice(0, 5);
const row2 = testimonials.slice(5, 10);

function TestimonialCard({ testimonial }: { testimonial: any }) {
	return (
		<div className="group relative flex w-[320px] shrink-0 flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-[#7b39fc]/40 hover:bg-white/10 md:w-[400px] md:p-8">
			{/* Subtle Top Glow on Hover */}
			<div className="absolute inset-x-0 top-0 h-px w-full bg-linear-to-r from-transparent via-[#7b39fc]/0 to-transparent transition-all duration-500 group-hover:via-[#7b39fc]/50" />

			{/* Content */}
			<p className="mb-8 grow font-inter text-[15px] text-white/80 leading-relaxed">
				"{testimonial.content}"
			</p>

			{/* Author Info */}
			<div className="flex items-center gap-4">
				<img
					src={testimonial.avatar}
					alt={testimonial.author}
					className="h-12 w-12 rounded-full border border-white/10 bg-black/20"
				/>
				<div className="flex flex-col">
					<span className="font-cabin font-medium text-base text-white">
						{testimonial.name}
					</span>
					<span className="font-inter text-sm text-white/50">
						@{testimonial.author} · {testimonial.role}
					</span>
				</div>
			</div>
		</div>
	);
}

export default function Testimonials() {
	return (
		<section
			id="testimonials"
			className="relative w-full overflow-hidden border-white/5 border-t bg-[#03000a] py-24 md:py-32"
		>
			<style>
				{`
					@keyframes marquee-left {
						from { transform: translateX(0); }
						to { transform: translateX(-50%); }
					}
					@keyframes marquee-right {
						from { transform: translateX(-50%); }
						to { transform: translateX(0); }
					}
					.animate-marquee-left {
						animation: marquee-left 40s linear infinite;
					}
					.animate-marquee-right {
						animation: marquee-right 40s linear infinite;
					}
					.marquee-container:hover .animate-marquee-left,
					.marquee-container:hover .animate-marquee-right {
						animation-play-state: paused;
					}
				`}
			</style>

			{/* Ambient Glowing Orbs */}
			<div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/2 rounded-full bg-[#7b39fc]/10 blur-[120px]" />
			<div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/3 translate-y-1/2 rounded-full bg-[#7b39fc]/10 blur-[120px]" />

			<div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
				<div className="flex flex-col items-center text-center">
					{/* Section Label */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="mb-6 flex h-[38px] items-center gap-2 rounded-[10px] border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] px-4 py-1 backdrop-blur-md"
					>
						<span className="rounded-md bg-[#7b39fc] px-2 py-0.5 font-cabin font-medium text-[14px] text-white">
							Testimonials
						</span>
						<span className="font-cabin font-medium text-[14px] text-white">
							What Founders Say
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
						Loved by the builders{" "}
						<span className="text-[#7b39fc] italic tracking-wide">
							shipping fast
						</span>
					</motion.h2>
				</div>
			</div>

			{/* Marquee Section */}
			<div className="relative mt-20 flex flex-col gap-6 overflow-hidden">
				{/* Left/Right Fade Masks */}
				<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-[#03000a] to-transparent md:w-40" />
				<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-[#03000a] to-transparent md:w-40" />

				{/* Row 1 (Moves Left) */}
				<div className="marquee-container flex w-max">
					<div className="flex w-max animate-marquee-left">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="flex w-max gap-6 pr-6">
								{row1.map((testimonial) => (
									<TestimonialCard
										key={testimonial.id}
										testimonial={testimonial}
									/>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Row 2 (Moves Right) */}
				<div className="marquee-container flex w-max">
					<div className="flex w-max animate-marquee-right">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="flex w-max gap-6 pr-6">
								{row2.map((testimonial) => (
									<TestimonialCard
										key={testimonial.id}
										testimonial={testimonial}
									/>
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

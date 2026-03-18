"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useCallback, useEffect, useRef } from "react";

const GLOW_COLOR = "123, 57, 252";
const SPOTLIGHT_RADIUS = 400;

const features = [
	{
		id: 1,
		title: "AI Product Videos",
		description:
			"Short-form 10–60 sec videos in 9:16 and 1:1 formats. Script, scenes, transitions, and optional voiceover — all auto-generated.",
		icon: "🎬",
		className: "md:col-span-2 md:row-span-2 h-[400px] md:h-auto",
		visual: (
			<div className="absolute inset-x-8 top-40 bottom-0 flex flex-col items-center justify-start overflow-hidden rounded-t-2xl border-white/10 border-x border-t bg-linear-to-b from-white/5 to-transparent pt-8 shadow-2xl transition-transform duration-500 group-hover:translate-y-2">
				<div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7b39fc] shadow-[0_0_30px_rgba(123,57,252,0.6)]">
					<span className="ml-1 text-2xl text-white">▶</span>
				</div>
				<div className="mt-8 h-2 w-32 rounded-full bg-white/10" />
				<div className="mt-4 h-2 w-48 rounded-full bg-white/5" />
			</div>
		),
	},
	{
		id: 2,
		title: "Brand Extraction",
		description:
			"Klyp reads your URL and extracts your brand colors, logo, and product tone to keep all assets on-brand.",
		icon: "🎨",
		className: "md:col-span-1 h-[250px]",
	},
	{
		id: 3,
		title: "Marketing Kit Export",
		description:
			"Receive everything in a structured kit: video, banners, copy — ready to download or share.",
		icon: "📦",
		className: "md:col-span-1 h-[250px]",
	},
	{
		id: 4,
		title: "Social Banners",
		description:
			"Brand-aware banners for platforms like Twitter/X, LinkedIn, and Product Hunt, rendered pixel-perfect.",
		icon: "🖼️",
		className: "md:col-span-1 h-[250px]",
	},
	{
		id: 5,
		title: "Marketing Copy",
		description:
			"Launch tweets, LinkedIn posts, ad copy, and tagline suggestions crafted to convert.",
		icon: "✍️",
		className: "md:col-span-1 h-[250px]",
	},
	{
		id: 6,
		title: "Project Dashboard",
		description:
			"Track all your generated assets, check job status, and manage downloads from one clean dashboard.",
		icon: "📊",
		className: "md:col-span-1 h-[250px]",
	},
];

/* ──────────────────────────────────────────────────
   Section-level spotlight — tracks mouse across the
   entire grid and sets CSS vars on each .card element
   ────────────────────────────────────────────────── */
function useGlobalSpotlight(sectionRef: React.RefObject<HTMLElement | null>) {
	const spotlightRef = useRef<HTMLDivElement | null>(null);

	const calculateSpotlight = useCallback(
		(radius: number) => ({
			proximity: radius * 0.5,
			fadeDistance: radius * 0.75,
		}),
		[],
	);

	useEffect(() => {
		const section = sectionRef.current;
		if (!section) return;

		// Create the floating spotlight orb
		const spotlight = document.createElement("div");
		spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${GLOW_COLOR}, 0.15) 0%,
        rgba(${GLOW_COLOR}, 0.08) 15%,
        rgba(${GLOW_COLOR}, 0.04) 25%,
        rgba(${GLOW_COLOR}, 0.02) 40%,
        rgba(${GLOW_COLOR}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
		document.body.appendChild(spotlight);
		spotlightRef.current = spotlight;

		const handleMouseMove = (e: MouseEvent) => {
			if (!spotlightRef.current) return;

			const sectionRect = section.getBoundingClientRect();
			const mouseInsideSection =
				e.clientX >= sectionRect.left &&
				e.clientX <= sectionRect.right &&
				e.clientY >= sectionRect.top &&
				e.clientY <= sectionRect.bottom;

			const cards = section.querySelectorAll<HTMLElement>(".bento-card");

			if (!mouseInsideSection) {
				gsap.to(spotlightRef.current, {
					opacity: 0,
					duration: 0.3,
					ease: "power2.out",
				});
				cards.forEach((card) => {
					card.style.setProperty("--glow-intensity", "0");
				});
				return;
			}

			const { proximity, fadeDistance } = calculateSpotlight(SPOTLIGHT_RADIUS);
			let minDistance = Number.POSITIVE_INFINITY;

			cards.forEach((card) => {
				const cardRect = card.getBoundingClientRect();
				const centerX = cardRect.left + cardRect.width / 2;
				const centerY = cardRect.top + cardRect.height / 2;
				const distance =
					Math.hypot(e.clientX - centerX, e.clientY - centerY) -
					Math.max(cardRect.width, cardRect.height) / 2;
				const effectiveDistance = Math.max(0, distance);

				minDistance = Math.min(minDistance, effectiveDistance);

				let glowIntensity = 0;
				if (effectiveDistance <= proximity) {
					glowIntensity = 1;
				} else if (effectiveDistance <= fadeDistance) {
					glowIntensity =
						(fadeDistance - effectiveDistance) / (fadeDistance - proximity);
				}

				// Set percentage-based coordinates on each card
				const relativeX = ((e.clientX - cardRect.left) / cardRect.width) * 100;
				const relativeY = ((e.clientY - cardRect.top) / cardRect.height) * 100;

				card.style.setProperty("--glow-x", `${relativeX}%`);
				card.style.setProperty("--glow-y", `${relativeY}%`);
				card.style.setProperty("--glow-intensity", glowIntensity.toString());
				card.style.setProperty("--glow-radius", `${SPOTLIGHT_RADIUS}px`);
			});

			// Move the floating orb
			gsap.to(spotlightRef.current, {
				left: e.clientX,
				top: e.clientY,
				duration: 0.1,
				ease: "power2.out",
			});

			const targetOpacity =
				minDistance <= proximity
					? 0.8
					: minDistance <= fadeDistance
						? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
						: 0;

			gsap.to(spotlightRef.current, {
				opacity: targetOpacity,
				duration: targetOpacity > 0 ? 0.2 : 0.5,
				ease: "power2.out",
			});
		};

		const handleMouseLeave = () => {
			section.querySelectorAll<HTMLElement>(".bento-card").forEach((card) => {
				card.style.setProperty("--glow-intensity", "0");
			});
			if (spotlightRef.current) {
				gsap.to(spotlightRef.current, {
					opacity: 0,
					duration: 0.3,
					ease: "power2.out",
				});
			}
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseleave", handleMouseLeave);
			spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
		};
	}, [sectionRef, calculateSpotlight]);
}

export default function Features() {
	const sectionRef = useRef<HTMLElement>(null);
	useGlobalSpotlight(sectionRef);

	return (
		<section
			ref={sectionRef}
			id="features"
			className="relative w-full overflow-hidden border-white/5 border-b bg-[#03000a] px-6 py-24 md:py-32 lg:px-8"
		>
			{/* Border-glow CSS — mask trick from bento.md */}
			<style>
				{`
          .bento-card {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
          }

          .bento-card::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 6px;
            background: radial-gradient(
              var(--glow-radius) circle at var(--glow-x) var(--glow-y),
              rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.8)) 0%,
              rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.4)) 30%,
              transparent 60%
            );
            border-radius: inherit;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
            z-index: 10;
          }

          .bento-card:hover::after {
            opacity: 1;
          }

          .bento-card:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.4), 0 0 30px rgba(${GLOW_COLOR}, 0.2);
          }
        `}
			</style>

			{/* Ambient Glowing Orbs */}
			<div className="pointer-events-none absolute top-40 -left-40 h-96 w-96 rounded-full bg-[#7b39fc]/10 blur-[100px]" />
			<div className="pointer-events-none absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-[#7b39fc]/10 blur-[100px]" />

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
							Features
						</span>
						<span className="font-cabin font-medium text-[14px] text-white">
							What You Get
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
						Your complete AI-powered{" "}
						<span className="text-[#7b39fc] italic tracking-wide">
							launch kit
						</span>
					</motion.h2>

					{/* Subtext */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="mt-6 max-w-2xl font-inter font-normal text-lg text-white/70"
					>
						Everything a founder needs to go from product to audience — in one
						place.
					</motion.p>
				</div>

				{/* Bento Grid */}
				<div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={feature.id}
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 * index + 0.3 }}
							className={`bento-card group relative flex flex-col overflow-hidden rounded-[32px] border border-white/5 bg-white/2 p-8 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:border-[#7b39fc]/40 hover:bg-white/4 ${feature.className}`}
						>
							{/* Background Glow */}
							<div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#7b39fc]/10 blur-3xl transition-all duration-500 group-hover:bg-[#7b39fc]/30" />

							{/* Icon & Title */}
							<div className="relative z-10 flex items-center gap-4">
								<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl shadow-inner transition-all duration-300 group-hover:border-[#7b39fc]/50 group-hover:bg-[#7b39fc]/20">
									{feature.icon}
								</div>
								<h3 className="font-instrument-serif text-2xl text-white transition-colors group-hover:text-[#e4d9ff]">
									{feature.title}
								</h3>
							</div>

							{/* Description */}
							<p className="relative z-10 mt-4 font-inter text-[15px] text-white/60 leading-relaxed transition-colors group-hover:text-white/80">
								{feature.description}
							</p>

							{/* Optional Custom Visual */}
							{feature.visual && feature.visual}
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

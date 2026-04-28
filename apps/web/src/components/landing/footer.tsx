"use client";

import Link from "next/link";

const footerLinks = [
	{
		title: "Product",
		links: [
			{ name: "Features", href: "#features" },
			{ name: "Pricing", href: "#pricing" },
			{ name: "Changelog", href: "#" },
			{ name: "Roadmap", href: "#" },
		],
	},
	{
		title: "Company",
		links: [
			{ name: "About", href: "#" },
			{ name: "Blog", href: "#" },
			{ name: "Press", href: "#" },
			{ name: "Careers", href: "#" },
		],
	},
	{
		title: "Legal",
		links: [
			{ name: "Privacy Policy", href: "#" },
			{ name: "Terms of Service", href: "#" },
		],
	},
	{
		title: "Social",
		links: [
			{ name: "Twitter / X", href: "#" },
			{ name: "LinkedIn", href: "#" },
			{ name: "GitHub", href: "#" },
		],
	},
];

export default function Footer() {
	return (
		<footer className="relative w-full overflow-hidden border-white/5 border-t bg-[#03000a] px-6 pt-12 md:pt-24 lg:px-8">
			{/* Ambient Glowing Orbs */}
			<div className="pointer-events-none absolute bottom-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full bg-[#7b39fc]/10 blur-[150px]" />

			<div className="relative z-10 mx-auto max-w-7xl">
				<div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6">
					{/* Brand Column */}
					<div className="col-span-2 lg:col-span-2">
						<Link href="/" className="flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-[#8a4bfe] to-[#7b39fc] shadow-[0_0_15px_rgba(123,57,252,0.5)]">
								<svg
									className="h-5 w-5 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
									aria-hidden
								>
									<title>Klyp Logo</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<span className="font-instrument-serif text-2xl text-white tracking-wide">
								Klyp
							</span>
						</Link>
						<p className="mt-6 max-w-xs font-inter text-[15px] text-white/50 leading-relaxed">
							The AI Launch Team for every founder. Build your marketing kit in
							seconds, not days.
						</p>
					</div>

					{/* Links Columns */}
					{footerLinks.map((column) => (
						<div key={column.title} className="col-span-1">
							<h3 className="mb-6 font-cabin font-semibold text-base text-white tracking-wide">
								{column.title}
							</h3>
							<ul className="flex flex-col gap-4">
								{column.links.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="group flex items-center font-inter text-[14px] text-white/50 transition-colors hover:text-white"
										>
											<span className="relative">
												{link.name}
												<span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#7b39fc] transition-all duration-300 group-hover:w-full" />
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>

			{/* Giant Background Text */}
			<div className="pointer-events-none relative mt-16 flex w-full select-none items-center justify-center pb-6 md:pb-10">
				<h1 className="font-black font-inter text-[#1a1429] text-[28vw] leading-none tracking-tighter md:text-[24vw]">
					Klyp
				</h1>
			</div>
		</footer>
	);
}

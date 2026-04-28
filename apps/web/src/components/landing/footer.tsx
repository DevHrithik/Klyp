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
		<footer className="relative w-full bg-[#03000a] px-4 pt-20 sm:px-6 lg:px-8">
			{/* Purple glow at the top of the footer */}
			<div className="pointer-events-none absolute top-0 left-1/2 h-[300px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7b39fc]/20 blur-[120px]" />

			<div className="relative z-10 mx-auto max-w-7xl">
				{/* The rounded container matching the image */}
				<div className="relative overflow-hidden rounded-t-[2.5rem] border-white/10 border-x border-t px-8 py-16 md:px-16 md:py-20">
					<div className="relative z-10 flex flex-col justify-between gap-16 lg:flex-row lg:gap-8">
						{/* Left Side: Logo & Copyright */}
						<div className="flex flex-col justify-between">
							<Link href="/" className="mb-16 flex items-center gap-2 md:mb-32">
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="white"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>Klyp Logo</title>
									<path d="M20 3L4 12L20 21V3Z" />
								</svg>
								<span className="font-instrument-serif text-3xl text-white tracking-wide">
									Klyp
								</span>
							</Link>
							<p className="font-inter text-[14px] text-white/40">
								© 2026 Klyp. All rights reserved.
							</p>
						</div>

						{/* Right Side: Links */}
						<div className="grid grid-cols-2 gap-12 sm:grid-cols-4 lg:gap-16">
							{footerLinks.map((column) => (
								<div key={column.title} className="flex flex-col">
									<h3 className="mb-6 font-inter font-medium text-[14px] text-white">
										{column.title}
									</h3>
									<ul className="flex flex-col gap-4">
										{column.links.map((link) => (
											<li key={link.name}>
												<Link
													href={link.href}
													className="font-inter text-[14px] text-white/40 transition-colors hover:text-white"
												>
													{link.name}
												</Link>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

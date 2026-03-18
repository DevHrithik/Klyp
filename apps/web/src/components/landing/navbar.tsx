import { Menu } from "lucide-react";
import Link from "next/link";

export default function LandingNavbar() {
	return (
		<nav className="absolute inset-x-0 top-0 z-20 w-full bg-transparent px-6 py-4 md:px-[120px]">
			<div className="flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="z-30 flex items-center gap-2 text-white">
					<svg
						width="14"
						height="16"
						viewBox="0 0 14 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Klyp logo"
					>
						<path
							d="M1.04356 6.35771L13.6437 0.666504V14.6665L1.04356 8.9753C0.844111 8.88523 0.675037 8.74239 0.556276 8.56361C0.437515 8.38482 0.373981 8.1775 0.373403 7.96582C0.372825 7.75414 0.435222 7.54641 0.553018 7.36683C0.670813 7.18724 0.839127 7.04332 1.03789 6.95251L1.04356 6.35771Z"
							fill="white"
						/>
					</svg>
					<span className="font-instrument-serif font-semibold text-2xl tracking-wide">
						Klyp
					</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden items-center gap-8 md:flex">
					<Link
						href="/"
						className="font-manrope font-medium text-sm text-white transition-opacity hover:opacity-80"
					>
						Home
					</Link>
					<Link
						href="#features"
						className="font-manrope font-medium text-sm text-white transition-opacity hover:opacity-80"
					>
						Features
					</Link>
					<Link
						href="#pricing"
						className="font-manrope font-medium text-sm text-white transition-opacity hover:opacity-80"
					>
						Pricing
					</Link>
					<Link
						href="#faq"
						className="font-manrope font-medium text-sm text-white transition-opacity hover:opacity-80"
					>
						FAQ
					</Link>
				</div>

				{/* Desktop Actions */}
				<div className="hidden items-center gap-4 md:flex">
					<Link
						href="/login"
						className="rounded-lg border border-[#d4d4d4] bg-white px-4 py-2 font-manrope font-semibold text-[#171717] text-sm transition-opacity hover:opacity-90"
					>
						Sign In
					</Link>
					<Link
						href="#waitlist"
						className="rounded-lg bg-[#7b39fc] px-4 py-2 font-manrope font-semibold text-[#fafafa] text-sm shadow-sm transition-opacity hover:opacity-90"
					>
						Join Waitlist
					</Link>
				</div>

				{/* Mobile Menu Icon */}
				<div className="flex md:hidden">
					<button type="button" className="text-white hover:opacity-80">
						<Menu className="h-6 w-6" />
					</button>
				</div>
			</div>
		</nav>
	);
}

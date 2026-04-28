"use client";

import Demo from "@/components/landing/demo";
import FAQ from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import HeroSection from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import LandingNavbar from "@/components/landing/navbar";
import Pricing from "@/components/landing/pricing";
import StatsBar from "@/components/landing/stats-bar";
import Testimonials from "@/components/landing/testimonials";
import WaitlistCTA from "@/components/landing/waitlist-cta";

export default function Home() {
	return (
		<main className="bg-[#2b2344]">
			<div className="relative min-h-screen overflow-hidden bg-[#2b2344]">
				{/* Background Video */}
				<video
					className="absolute inset-0 h-full w-full object-cover"
					src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260210_031346_d87182fb-b0af-4273-84d1-c6fd17d6bf0f.mp4"
					autoPlay
					loop
					muted
					playsInline
				/>

				{/* Navbar */}
				<LandingNavbar />

				{/* Hero Content */}
				<HeroSection />
			</div>

			{/* Stats Bar */}
			<StatsBar />

			{/* How It Works */}
			<HowItWorks />

			{/* Features */}
			<Features />

			{/* Demo */}
			<Demo />

			{/* Pricing */}
			<Pricing />

			{/* Testimonials */}
			<Testimonials />

			{/* FAQ */}
			<FAQ />

			{/* Waitlist CTA */}
			<WaitlistCTA />

			{/* Footer */}
			<Footer />
		</main>
	);
}

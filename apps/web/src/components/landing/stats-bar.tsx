export default function StatsBar() {
	return (
		<section id="stats" className="relative z-20 bg-black py-16">
			{/* Top Glowing Divider */}
			<div className="absolute top-0 right-0 left-0 h-px w-full bg-linear-to-r from-transparent via-[rgba(123,57,252,0.5)] to-transparent" />
			<div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-[#7b39fc] to-transparent shadow-[0_0_20px_rgba(123,57,252,0.5)]" />

			{/* Bottom Glowing Divider */}
			<div className="absolute right-0 bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-[rgba(123,57,252,0.5)] to-transparent" />
			<div className="absolute bottom-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-linear-to-r from-transparent via-[#7b39fc] to-transparent shadow-[0_0_20px_rgba(123,57,252,0.5)]" />

			<div className="relative mx-auto max-w-7xl px-6">
				{/* Top Copy */}
				<p className="mb-10 text-center font-inter font-medium text-sm text-white/50 md:text-base">
					Trusted by indie hackers, dev founders, and SaaS teams shipping fast.
				</p>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 gap-8 divide-x-0 divide-[rgba(164,132,215,0.2)] md:grid-cols-4 md:gap-4 md:divide-x">
					<div className="flex flex-col items-center justify-center space-y-2 text-center">
						<h3 className="font-instrument-serif text-4xl text-white md:text-5xl">
							2,400+
						</h3>
						<p className="font-inter font-medium text-[#7b39fc] text-sm">
							Products Launched
						</p>
					</div>

					<div className="flex flex-col items-center justify-center space-y-2 text-center">
						<h3 className="font-instrument-serif text-4xl text-white md:text-5xl">
							18,000+
						</h3>
						<p className="font-inter font-medium text-[#7b39fc] text-sm">
							Videos Generated
						</p>
					</div>

					<div className="flex flex-col items-center justify-center space-y-2 text-center">
						<h3 className="font-instrument-serif text-4xl text-white md:text-5xl">
							&lt; 60 sec
						</h3>
						<p className="font-inter font-medium text-[#7b39fc] text-sm">
							Avg. Generation Time
						</p>
					</div>

					<div className="flex flex-col items-center justify-center space-y-2 text-center">
						<h3 className="flex items-center gap-2 font-instrument-serif text-4xl text-white md:text-5xl">
							<span className="text-3xl text-yellow-400">⭐</span> 4.9/5
						</h3>
						<p className="font-inter font-medium text-[#7b39fc] text-sm">
							Founders Trust
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

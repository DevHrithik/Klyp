export default function HeroSection() {
	return (
		<div className="relative z-10 mx-auto mt-32 flex max-w-5xl flex-col items-center px-4 text-center">
			{/* Tagline Pill */}
			<div className="mb-8 flex h-[38px] items-center gap-2 rounded-[10px] border border-[rgba(164,132,215,0.5)] bg-[rgba(85,80,110,0.4)] py-1 pr-4 pl-1 backdrop-blur-md">
				<span className="rounded-md bg-[#7b39fc] px-2 py-0.5 font-cabin font-medium text-[14px] text-white">
					Beta
				</span>
				<span className="font-cabin font-medium text-[14px] text-white">
					Meet Klyp: The AI Launch Team
				</span>
			</div>

			{/* Headline */}
			<h1 className="mb-6 font-instrument-serif text-5xl text-white leading-[1.1] md:text-[96px]">
				Everything you need to launch your product{" "}
				<span className="italic tracking-wide">instantly</span>
			</h1>

			{/* Subtext */}
			<p className="mb-10 max-w-[662px] font-inter font-normal text-[18px] text-white/70">
				Klyp converts any website URL into a launch-ready marketing kit. Get
				product videos, social banners, and marketing copy generated in seconds.
			</p>

			{/* Waitlist Input */}
			<form
				className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:gap-2"
				onSubmit={(e) => e.preventDefault()}
			>
				<input
					type="email"
					placeholder="Enter your email"
					required
					className="w-full rounded-[10px] border border-[rgba(164,132,215,0.3)] bg-[rgba(85,80,110,0.2)] px-4 py-3 font-inter text-[16px] text-white placeholder-white/50 backdrop-blur-md focus:border-[#7b39fc] focus:outline-none focus:ring-1 focus:ring-[#7b39fc]"
				/>
				<button
					type="submit"
					className="whitespace-nowrap rounded-[10px] bg-[#7b39fc] px-6 py-3 font-cabin font-medium text-[16px] text-white shadow-sm transition-colors hover:bg-[#682edf]"
				>
					Join Waitlist
				</button>
			</form>
		</div>
	);
}

import Sidebar from "@/components/sidebar";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="relative flex min-h-svh w-full bg-[#03000a] text-white">
			{/* Ambient Gradients matching Landing Page */}
			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(123,57,252,0.15)_0%,transparent_100%)]" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(123,57,252,0.1)_0%,transparent_100%)]" />
			</div>

			{/* Sidebar */}
			<Sidebar />

			{/* Main Content Area */}
			<div className="relative z-10 flex min-w-0 flex-1 flex-col">
				<main className="flex-1 overflow-auto">{children}</main>
			</div>
		</div>
	);
}

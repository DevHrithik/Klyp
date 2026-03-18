import type { Metadata } from "next";
import {
	Cabin,
	Geist,
	Geist_Mono,
	Instrument_Serif,
	Inter,
	Manrope,
} from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const manrope = Manrope({
	variable: "--font-manrope",
	subsets: ["latin"],
});

const cabin = Cabin({
	variable: "--font-cabin",
	subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
	variable: "--font-instrument-serif",
	weight: ["400"],
	subsets: ["latin"],
});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "klyp",
	description: "klyp",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${cabin.variable} ${instrumentSerif.variable} ${inter.variable} antialiased`}
			>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

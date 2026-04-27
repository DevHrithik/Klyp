"use client";

import { cn } from "@klyp/ui/lib/utils";
import {
	ChevronLeft,
	ChevronRight,
	FolderKanban,
	LayoutDashboard,
	LogOut,
	Settings,
	User,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const { data: session } = authClient.useSession();

	const navItems: {
		name: string;
		href: Route;
		icon: typeof LayoutDashboard;
	}[] = [
		{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
		{ name: "Projects", href: "/projects", icon: FolderKanban },
	];

	return (
		<aside
			className={cn(
				"relative z-20 flex flex-col border-[rgba(164,132,215,0.2)] border-r bg-[#03000a]/60 backdrop-blur-xl transition-all duration-300",
				isCollapsed ? "w-20" : "w-64",
			)}
		>
			{/* Logo & Collapse Toggle */}
			<div
				className={cn(
					"flex h-16 items-center px-6",
					isCollapsed ? "justify-center" : "justify-between",
				)}
			>
				<Link
					href="/"
					className="flex shrink-0 items-center gap-3 overflow-hidden text-white"
				>
					<svg
						width="14"
						height="16"
						viewBox="0 0 14 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-label="Klyp logo"
						className="shrink-0"
					>
						<path
							d="M1.04356 6.35771L13.6437 0.666504V14.6665L1.04356 8.9753C0.844111 8.88523 0.675037 8.74239 0.556276 8.56361C0.437515 8.38482 0.373981 8.1775 0.373403 7.96582C0.372825 7.75414 0.435222 7.54641 0.553018 7.36683C0.670813 7.18724 0.839127 7.04332 1.03789 6.95251L1.04356 6.35771Z"
							fill="white"
						/>
					</svg>
					{!isCollapsed && (
						<span className="shrink-0 font-instrument-serif font-semibold text-2xl tracking-wide">
							Klyp
						</span>
					)}
				</Link>
				{!isCollapsed && (
					<button
						type="button"
						onClick={() => setIsCollapsed(true)}
						className="cursor-pointer text-white/40 transition-colors hover:text-white"
					>
						<ChevronLeft className="h-5 w-5" />
					</button>
				)}
			</div>

			{/* If collapsed, show the expand button below logo */}
			{isCollapsed && (
				<div className="flex justify-center pb-4">
					<button
						type="button"
						onClick={() => setIsCollapsed(false)}
						className="flex cursor-pointer items-center justify-center rounded-xl p-2 text-white/40 transition-colors hover:bg-[rgba(85,80,110,0.3)] hover:text-white"
					>
						<ChevronRight className="h-5 w-5" />
					</button>
				</div>
			)}

			{/* Navigation */}
			<nav className="flex-1 space-y-2 px-4 py-6">
				{navItems.map((item) => {
					const isActive = pathname === item.href;
					return (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								"group flex cursor-pointer items-center rounded-xl font-inter font-medium text-sm transition-all hover:bg-[rgba(85,80,110,0.3)] hover:text-white",
								isCollapsed ? "justify-center p-3" : "px-3 py-3",
								isActive
									? "border border-[rgba(164,132,215,0.3)] bg-[rgba(85,80,110,0.4)] text-white shadow-[0_0_15px_rgba(123,57,252,0.1)]"
									: "border border-transparent text-white/60",
							)}
							title={isCollapsed ? item.name : undefined}
						>
							<item.icon
								className={cn(
									"h-5 w-5 shrink-0",
									isActive ? "text-[#c4a1ff]" : "group-hover:text-white",
								)}
							/>
							{!isCollapsed && (
								<span className="ml-3 truncate">{item.name}</span>
							)}
						</Link>
					);
				})}
			</nav>

			{/* User Profile & Actions Bottom Section */}
			<div className="space-y-2 border-[rgba(164,132,215,0.2)] border-t px-4 py-4">
				{/* Settings */}
				<Link
					href={"/settings" as Route}
					className={cn(
						"group flex cursor-pointer items-center rounded-xl font-inter font-medium text-sm transition-all hover:bg-[rgba(85,80,110,0.3)] hover:text-white",
						isCollapsed ? "justify-center p-3" : "px-3 py-3",
						pathname === "/settings"
							? "border border-[rgba(164,132,215,0.3)] bg-[rgba(85,80,110,0.4)] text-white shadow-[0_0_15px_rgba(123,57,252,0.1)]"
							: "border border-transparent text-white/60",
					)}
					title={isCollapsed ? "Settings" : undefined}
				>
					<Settings
						className={cn(
							"h-5 w-5 shrink-0",
							pathname === "/settings"
								? "text-[#c4a1ff]"
								: "group-hover:text-white",
						)}
					/>
					{!isCollapsed && <span className="ml-3 truncate">Settings</span>}
				</Link>

				{/* Logout */}
				<button
					type="button"
					onClick={() => {
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									router.push("/");
								},
							},
						});
					}}
					className={cn(
						"group flex w-full cursor-pointer items-center rounded-xl border border-transparent font-inter font-medium text-sm text-white/60 transition-all hover:bg-[rgba(85,80,110,0.3)] hover:text-white",
						isCollapsed ? "justify-center p-3" : "px-3 py-3",
					)}
					title={isCollapsed ? "Log Out" : undefined}
				>
					<LogOut className="h-5 w-5 shrink-0 group-hover:text-white" />
					{!isCollapsed && <span className="ml-3 truncate">Log Out</span>}
				</button>

				{/* User Profile */}
				{session && (
					<div
						className={cn(
							"mt-4 flex items-center rounded-xl border border-[rgba(164,132,215,0.15)] bg-[rgba(85,80,110,0.2)]",
							isCollapsed ? "justify-center p-2" : "gap-3 p-3",
						)}
					>
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7b39fc] text-white">
							<User className="h-4 w-4" />
						</div>
						{!isCollapsed && (
							<div className="flex min-w-0 flex-col">
								<span className="truncate font-inter font-medium text-sm text-white">
									{session.user.name}
								</span>
								<span className="truncate font-inter text-white/50 text-xs">
									{session.user.email}
								</span>
							</div>
						)}
					</div>
				)}
			</div>
		</aside>
	);
}

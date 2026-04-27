"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export default function AuthPanel() {
	const [showSignIn, setShowSignIn] = useState(true);

	return (
		<div className="relative z-10 w-full max-w-md px-4">
			<AnimatePresence mode="wait">
				{showSignIn ? (
					<motion.div
						key="signin"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
					</motion.div>
				) : (
					<motion.div
						key="signup"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						<SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

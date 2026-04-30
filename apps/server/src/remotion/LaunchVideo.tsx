import type { Brand, Script } from "@klyp/api/services/ai";
import type { ReactElement } from "react";
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

interface Props extends Record<string, unknown> {
	brand: Brand;
	script: Script;
	screenshotUrl?: string;
}

function Scene({ text, color }: { text: string; color: string }) {
	const frame = useCurrentFrame();
	const opacity = interpolate(frame, [0, 8], [0, 1], {
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				background: "#03000a",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 48,
			}}
		>
			<p
				style={{
					fontFamily: "Inter, sans-serif",
					fontSize: 56,
					fontWeight: 800,
					color: "#ffffff",
					textAlign: "center",
					lineHeight: 1.2,
					opacity,
					borderBottom: `4px solid ${color}`,
					paddingBottom: 8,
				}}
			>
				{text}
			</p>
		</AbsoluteFill>
	);
}

export function LaunchVideo({ brand, script }: Props): ReactElement {
	const { fps } = useVideoConfig();
	let offset = 0;

	const hookDuration = 3 * fps;

	return (
		<AbsoluteFill style={{ background: "#03000a" }}>
			{/* Hook */}
			<Sequence from={0} durationInFrames={hookDuration}>
				<Scene text={script.hook} color={brand.primaryColor} />
			</Sequence>

			{/* Scenes */}
			{script.scenes.map((scene, i) => {
				const start = hookDuration + offset;
				const dur = scene.durationSeconds * fps;
				offset += dur;
				return (
					<Sequence key={i} from={start} durationInFrames={dur}>
						<Scene text={scene.text} color={brand.primaryColor} />
					</Sequence>
				);
			})}

			{/* CTA */}
			<Sequence from={hookDuration + offset} durationInFrames={3 * fps}>
				<AbsoluteFill
					style={{
						background: brand.primaryColor,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<p
						style={{
							fontFamily: "Inter",
							fontSize: 64,
							fontWeight: 900,
							color: "#fff",
						}}
					>
						{script.cta}
					</p>
				</AbsoluteFill>
			</Sequence>
		</AbsoluteFill>
	);
}

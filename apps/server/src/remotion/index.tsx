import { Composition, registerRoot } from "remotion";
import { LaunchVideo } from "./LaunchVideo";

function RemotionRoot() {
	return (
		<Composition
			id="LaunchVideo"
			component={LaunchVideo}
			durationInFrames={150}
			fps={30}
			width={1080}
			height={1920}
			defaultProps={{
				brand: {
					productName: "Demo",
					tagline: "Tagline",
					features: [],
					targetAudience: "all",
					tone: "bold",
					primaryColor: "#7b39fc",
					secondaryColor: "#c4a1ff",
				},
				script: {
					hook: "The future is here",
					scenes: [{ text: "Fast", narration: "", durationSeconds: 3 }],
					cta: "Try now",
				},
			}}
		/>
	);
}

registerRoot(RemotionRoot);

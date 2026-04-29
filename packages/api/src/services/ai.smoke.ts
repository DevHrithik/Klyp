import { analyzeBrand, generateScript } from "./ai";

const sampleMarkdown = `
# Linear — The new standard for modern software development
Linear is a purpose-built tool for planning and building products. Streamline issues, sprints, and product roadmaps.
Features: Issue tracking, project milestones, cycle management, git integrations, keyboard-first design.
Trusted by thousands of high-performance engineering teams.
`;

console.log("Analyzing brand...");
const brand = await analyzeBrand(sampleMarkdown, "https://linear.app");
console.log("Brand:", JSON.stringify(brand, null, 2));

console.log("\nGenerating script...");
const script = await generateScript(brand);
console.log("Script:", JSON.stringify(script, null, 2));
console.log(`\nScenes count: ${script.scenes.length} (expected 3-5)`);

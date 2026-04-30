import { env } from "@klyp/env/server";
import { Inngest } from "inngest";

export const inngest = new Inngest({
	id: "klyp",
	eventKey: env.INNGEST_EVENT_KEY,
	isDev: env.NODE_ENV !== "production",
});

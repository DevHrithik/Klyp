import { createContext } from "@klyp/api/context";
import { appRouter } from "@klyp/api/routers/index";
import { auth } from "@klyp/auth";
import { pingDatabase } from "@klyp/db";
import { env } from "@klyp/env/server";
import { OpenAPIHandler } from "@orpc/openapi/node";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/node";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";

const PORT = Number.parseInt(process.env.PORT ?? "", 10) || 3001;
const SERVER_START_MS = Date.now();

const app = express();
app.set("trust proxy", 1);

app.use(
	cors({
		origin: env.CORS_ORIGIN,
		methods: ["GET", "POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});
const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

app.use(async (req, res, next) => {
	const rpcResult = await rpcHandler.handle(req, res, {
		prefix: "/rpc",
		context: await createContext({ req }),
	});
	if (rpcResult.matched) return;

	const apiResult = await apiHandler.handle(req, res, {
		prefix: "/api-reference",
		context: await createContext({ req }),
	});
	if (apiResult.matched) return;

	next();
});

app.use(express.json());

/** Liveness + readiness probe: DB connectivity. Railway / load balancers should target this path. */
app.get("/health", async (_req, res) => {
	const database = (await pingDatabase()) ? "ok" : ("error" as const);

	if (database === "error") {
		console.error("[health] database ping failed");
	}

	const body = {
		status: database === "ok" ? "ok" : "degraded",
		database,
		env: env.NODE_ENV,
		uptimeMs: Math.round(Date.now() - SERVER_START_MS),
		timestamp: new Date().toISOString(),
	};

	res.status(database === "ok" ? 200 : 503).json(body);
});

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

app.listen(PORT, "0.0.0.0", () => {
	console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

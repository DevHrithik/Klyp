import { env } from "@klyp/env/server";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const neonSql = neon(env.DATABASE_URL);
export const db = drizzle(neonSql, { schema });

/** Returns true when the database responds to a trivial query (for health checks). */
export async function pingDatabase(): Promise<boolean> {
	try {
		await db.execute(sql`select 1`);
		return true;
	} catch {
		return false;
	}
}

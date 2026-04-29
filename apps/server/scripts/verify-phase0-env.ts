/**
 * Verify build-plan 0.2 (R2 list bucket) and 0.3 (Inngest keys present).
 * Loads apps/server/.env via dotenv/config from cwd when run from apps/server.
 */
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { env } from "@klyp/env/server";

const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	},
});

const out = await r2.send(
	new ListObjectsV2Command({ Bucket: env.R2_BUCKET, MaxKeys: 1 }),
);
console.log(
	"0.2 R2: ListObjects OK (keyCount preview:",
	out.KeyCount ?? 0,
	")",
);
console.log("0.3 Inngest: EVENT_KEY / SIGNING_KEY accepted by env schema");

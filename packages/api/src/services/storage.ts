import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@klyp/env/server";

export const r2 = new S3Client({
	region: "auto",
	endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY,
	},
});

export async function uploadToR2(
	key: string,
	body: Buffer | Uint8Array | string,
	contentType: string,
): Promise<string> {
	await r2.send(
		new PutObjectCommand({
			Bucket: env.R2_BUCKET,
			Key: key,
			Body: body,
			ContentType: contentType,
		}),
	);
	const base = env.R2_PUBLIC_URL.replace(/\/$/, "");
	const path = key.startsWith("/") ? key.slice(1) : key;
	return `${base}/${path}`;
}

export async function getSignedDownloadUrl(
	key: string,
	expiresIn = 3600,
): Promise<string> {
	return getSignedUrl(
		r2,
		new GetObjectCommand({ Bucket: env.R2_BUCKET, Key: key }),
		{ expiresIn },
	);
}

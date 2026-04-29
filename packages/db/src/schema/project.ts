import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const projectStatusEnum = pgEnum("project_status", [
	"pending",
	"extracting",
	"analyzing",
	"rendering_video",
	"rendering_banner",
	"done",
	"failed",
]);

export const project = pgTable(
	"project",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		url: text("url").notNull(),
		status: projectStatusEnum("status").default("pending").notNull(),
		progress: integer("progress").default(0).notNull(),
		errorMessage: text("error_message"),
		videoUrl: text("video_url"),
		screenshotUrl: text("screenshot_url"),
		scriptJson: text("script_json"),
		brandJson: text("brand_json"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(t) => [index("project_userId_idx").on(t.userId)],
);

export const asset = pgTable("asset", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text("project_id")
		.notNull()
		.references(() => project.id, { onDelete: "cascade" }),
	type: text("type").notNull(),
	url: text("url").notNull(),
	mime: text("mime"),
	sizeBytes: integer("size_bytes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const banner = pgTable("banner", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	projectId: text("project_id")
		.notNull()
		.references(() => project.id, { onDelete: "cascade" }),
	format: text("format").notNull(),
	imageUrl: text("image_url").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectRelations = relations(project, ({ one, many }) => ({
	user: one(user, { fields: [project.userId], references: [user.id] }),
	assets: many(asset),
	banners: many(banner),
}));

export const assetRelations = relations(asset, ({ one }) => ({
	project: one(project, {
		fields: [asset.projectId],
		references: [project.id],
	}),
}));

export const bannerRelations = relations(banner, ({ one }) => ({
	project: one(project, {
		fields: [banner.projectId],
		references: [project.id],
	}),
}));

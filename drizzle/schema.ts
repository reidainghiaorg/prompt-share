import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 *
 * `slug` is a URL-safe handle derived from the display name (e.g. "mr-nghia").
 * It powers public author profiles at /u/:slug. Unique when present.
 */
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    openId: varchar("openId", { length: 64 }).notNull().unique(),
    name: text("name"),
    email: varchar("email", { length: 320 }),
    loginMethod: varchar("loginMethod", { length: 64 }),
    role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
    slug: varchar("slug", { length: 80 }),
    bio: text("bio"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  },
  table => ({
    slugIdx: uniqueIndex("users_slug_idx").on(table.slug),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Community prompts submitted by members. Must be approved by an admin
 * before they become visible in the public library.
 *
 * - title / description / promptBody can be provided in EN, VI, or both.
 *   We store both columns; the frontend chooses which to display per user locale.
 * - aiTools: comma-separated list of AI tool slugs (e.g. "chatgpt,midjourney").
 * - category: a single slug like "writing", "coding", "image", etc.
 * - status: pending → approved | rejected (moderation workflow).
 * - likeCount / copyCount: denormalized counters maintained by the API for fast sorting.
 */
export const prompts = mysqlTable(
  "prompts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    titleEn: varchar("titleEn", { length: 200 }).notNull(),
    titleVi: varchar("titleVi", { length: 200 }),
    descriptionEn: text("descriptionEn"),
    descriptionVi: text("descriptionVi"),
    promptEn: text("promptEn").notNull(),
    promptVi: text("promptVi"),
    category: varchar("category", { length: 64 }).notNull(),
    aiTools: varchar("aiTools", { length: 255 }).notNull(),
    tags: varchar("tags", { length: 255 }),
    status: mysqlEnum("status", ["pending", "approved", "rejected"])
      .default("pending")
      .notNull(),
    rejectionReason: text("rejectionReason"),
    reviewedAt: timestamp("reviewedAt"),
    reviewedBy: int("reviewedBy"),
    likeCount: int("likeCount").default(0).notNull(),
    copyCount: int("copyCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    statusIdx: index("prompts_status_idx").on(table.status),
    userIdx: index("prompts_user_idx").on(table.userId),
  })
);

export type Prompt = typeof prompts.$inferSelect;
export type InsertPrompt = typeof prompts.$inferInsert;

/**
 * Likes are explicit relationships between a user and a prompt.
 * A composite unique index keeps each member from liking the same
 * prompt more than once.
 */
export const promptLikes = mysqlTable(
  "prompt_likes",
  {
    id: int("id").autoincrement().primaryKey(),
    promptId: int("promptId").notNull(),
    userId: int("userId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    uniq: uniqueIndex("prompt_likes_uniq").on(table.promptId, table.userId),
    userIdx: index("prompt_likes_user_idx").on(table.userId),
  })
);

export type PromptLike = typeof promptLikes.$inferSelect;
export type InsertPromptLike = typeof promptLikes.$inferInsert;

import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

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

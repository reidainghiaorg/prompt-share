import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ─────────────────────────────────────────────────────────────
// Prompts helpers
// ─────────────────────────────────────────────────────────────
import { and, desc, sql } from "drizzle-orm";
import { InsertPrompt, prompts } from "../drizzle/schema";

export async function createPrompt(input: InsertPrompt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [result] = await db.insert(prompts).values(input).$returningId();
  return result;
}

export async function listApprovedPrompts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: prompts.id,
      titleEn: prompts.titleEn,
      titleVi: prompts.titleVi,
      descriptionEn: prompts.descriptionEn,
      descriptionVi: prompts.descriptionVi,
      promptEn: prompts.promptEn,
      promptVi: prompts.promptVi,
      category: prompts.category,
      aiTools: prompts.aiTools,
      tags: prompts.tags,
      createdAt: prompts.createdAt,
      authorName: users.name,
    })
    .from(prompts)
    .leftJoin(users, eq(prompts.userId, users.id))
    .where(eq(prompts.status, "approved"))
    .orderBy(desc(prompts.createdAt));
}

export async function listMyPrompts(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(prompts)
    .where(eq(prompts.userId, userId))
    .orderBy(desc(prompts.createdAt));
}

export async function listPendingPrompts() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: prompts.id,
      titleEn: prompts.titleEn,
      titleVi: prompts.titleVi,
      descriptionEn: prompts.descriptionEn,
      descriptionVi: prompts.descriptionVi,
      promptEn: prompts.promptEn,
      promptVi: prompts.promptVi,
      category: prompts.category,
      aiTools: prompts.aiTools,
      tags: prompts.tags,
      status: prompts.status,
      createdAt: prompts.createdAt,
      authorName: users.name,
      authorId: prompts.userId,
    })
    .from(prompts)
    .leftJoin(users, eq(prompts.userId, users.id))
    .where(eq(prompts.status, "pending"))
    .orderBy(desc(prompts.createdAt));
}

export async function moderatePrompt(
  promptId: number,
  reviewerId: number,
  decision: "approved" | "rejected",
  rejectionReason?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(prompts)
    .set({
      status: decision,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      rejectionReason: decision === "rejected" ? rejectionReason ?? null : null,
    })
    .where(eq(prompts.id, promptId));
}

export async function countPendingPrompts(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select({ c: sql<number>`count(*)` })
    .from(prompts)
    .where(eq(prompts.status, "pending"));
  return Number(result[0]?.c ?? 0);
}

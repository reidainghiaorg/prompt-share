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
import { InsertPrompt, prompts, promptLikes } from "../drizzle/schema";

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
      likeCount: prompts.likeCount,
      copyCount: prompts.copyCount,
      createdAt: prompts.createdAt,
      authorName: users.name,
      authorSlug: users.slug,
    })
    .from(prompts)
    .leftJoin(users, eq(prompts.userId, users.id))
    .where(eq(prompts.status, "approved"))
    .orderBy(desc(prompts.createdAt));
}

// Approved prompts by a specific user (for public profile page).
export async function listApprovedByUser(userId: number) {
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
      likeCount: prompts.likeCount,
      copyCount: prompts.copyCount,
      createdAt: prompts.createdAt,
    })
    .from(prompts)
    .where(and(eq(prompts.userId, userId), eq(prompts.status, "approved")))
    .orderBy(desc(prompts.createdAt));
}

// Liked prompt IDs for a given user, used to hydrate the heart state on cards.
export async function listLikedPromptIds(userId: number): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({ promptId: promptLikes.promptId })
    .from(promptLikes)
    .where(eq(promptLikes.userId, userId));
  return rows.map(r => r.promptId);
}

// Toggle a like; returns the new like state (true = liked).
export async function togglePromptLike(
  promptId: number,
  userId: number
): Promise<{ liked: boolean; likeCount: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select({ id: promptLikes.id })
    .from(promptLikes)
    .where(and(eq(promptLikes.promptId, promptId), eq(promptLikes.userId, userId)))
    .limit(1);

  let liked: boolean;
  if (existing.length > 0) {
    await db
      .delete(promptLikes)
      .where(and(eq(promptLikes.promptId, promptId), eq(promptLikes.userId, userId)));
    await db
      .update(prompts)
      .set({ likeCount: sql`GREATEST(${prompts.likeCount} - 1, 0)` })
      .where(eq(prompts.id, promptId));
    liked = false;
  } else {
    await db.insert(promptLikes).values({ promptId, userId });
    await db
      .update(prompts)
      .set({ likeCount: sql`${prompts.likeCount} + 1` })
      .where(eq(prompts.id, promptId));
    liked = true;
  }

  const after = await db
    .select({ likeCount: prompts.likeCount })
    .from(prompts)
    .where(eq(prompts.id, promptId))
    .limit(1);

  return { liked, likeCount: Number(after[0]?.likeCount ?? 0) };
}

// Increment the copy counter (called from the card / modal copy button).
export async function incrementCopyCount(promptId: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(prompts)
    .set({ copyCount: sql`${prompts.copyCount} + 1` })
    .where(eq(prompts.id, promptId));
  const after = await db
    .select({ copyCount: prompts.copyCount })
    .from(prompts)
    .where(eq(prompts.id, promptId))
    .limit(1);
  return Number(after[0]?.copyCount ?? 0);
}

// ─────────────────────────────────────────────────────────────
// User profile / slug helpers
// ─────────────────────────────────────────────────────────────

export async function getUserBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.slug, slug))
    .limit(1);
  return rows[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0];
}

export async function setUserSlug(userId: number, slug: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ slug }).where(eq(users.id, userId));
}

export async function updateUserBio(userId: number, bio: string | null): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(users).set({ bio }).where(eq(users.id, userId));
}

export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return { totalPrompts: 0, totalLikes: 0, totalCopies: 0 };
  const rows = await db
    .select({
      totalPrompts: sql<number>`count(*)`,
      totalLikes: sql<number>`coalesce(sum(${prompts.likeCount}), 0)`,
      totalCopies: sql<number>`coalesce(sum(${prompts.copyCount}), 0)`,
    })
    .from(prompts)
    .where(and(eq(prompts.userId, userId), eq(prompts.status, "approved")));
  const r = rows[0];
  return {
    totalPrompts: Number(r?.totalPrompts ?? 0),
    totalLikes: Number(r?.totalLikes ?? 0),
    totalCopies: Number(r?.totalCopies ?? 0),
  };
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

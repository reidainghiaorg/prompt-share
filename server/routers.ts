import { COOKIE_NAME } from "@shared/const";
import { slugify } from "@shared/slug";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  countPendingPrompts,
  createPrompt,
  getUserById,
  getUserBySlug,
  getUserByOpenId,
  getUserStats,
  incrementCopyCount,
  listApprovedByUser,
  listApprovedPrompts,
  listLikedPromptIds,
  listMyPrompts,
  listPendingPrompts,
  moderatePrompt,
  setUserSlug,
  togglePromptLike,
  updateUserBio,
} from "./db";

const CATEGORIES = [
  "writing",
  "coding",
  "image",
  "video",
  "music",
  "marketing",
  "business",
  "education",
  "research",
  "lifestyle",
] as const;

const createPromptInput = z.object({
  titleEn: z.string().min(3).max(200),
  titleVi: z.string().max(200).optional().nullable(),
  descriptionEn: z.string().max(2000).optional().nullable(),
  descriptionVi: z.string().max(2000).optional().nullable(),
  promptEn: z.string().min(10).max(8000),
  promptVi: z.string().max(8000).optional().nullable(),
  category: z.enum(CATEGORIES),
  aiTools: z.array(z.string().min(1)).min(1).max(10),
  tags: z.string().max(255).optional().nullable(),
});

/**
 * Make sure the given user has a unique URL slug.
 * If a collision happens we append a numeric suffix (-2, -3, …)
 * until we find a free slot. Returns the resolved slug.
 */
async function ensureUserSlug(userId: number, name: string | null): Promise<string> {
  const base = slugify(name ?? "") || `user-${userId}`;
  let candidate = base;
  let suffix = 1;
  // Cap retries to prevent runaway loops (extremely unlikely with timestamp suffix).
  while (suffix < 50) {
    const existing = await getUserBySlug(candidate);
    if (!existing || existing.id === userId) {
      await setUserSlug(userId, candidate);
      return candidate;
    }
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
  // Fallback: append id to guarantee uniqueness.
  const fallback = `${base}-${userId}`;
  await setUserSlug(userId, fallback);
  return fallback;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    /**
     * Return the URL slug for the current user, creating one on first call.
     * Used by the header avatar to link "View my profile".
     */
    mySlug: protectedProcedure.query(async ({ ctx }) => {
      const fresh = ctx.user.slug ?? (await getUserByOpenId(ctx.user.openId))?.slug;
      if (fresh) return { slug: fresh };
      const slug = await ensureUserSlug(ctx.user.id, ctx.user.name ?? null);
      return { slug };
    }),
    updateBio: protectedProcedure
      .input(z.object({ bio: z.string().max(280) }))
      .mutation(async ({ ctx, input }) => {
        await updateUserBio(ctx.user.id, input.bio.trim() || null);
        return { success: true } as const;
      }),
  }),
  prompts: router({
    // Public: list approved community prompts. Includes likeCount/copyCount.
    listApproved: publicProcedure.query(() => listApprovedPrompts()),

    // Authenticated: list of prompt IDs the current user has liked, for UI hydration.
    myLikedIds: protectedProcedure.query(({ ctx }) => listLikedPromptIds(ctx.user.id)),

    // Authenticated user: submit a new prompt (status defaults to "pending")
    submit: protectedProcedure
      .input(createPromptInput)
      .mutation(async ({ ctx, input }) => {
        const id = await createPrompt({
          userId: ctx.user.id,
          titleEn: input.titleEn.trim(),
          titleVi: input.titleVi?.trim() || null,
          descriptionEn: input.descriptionEn?.trim() || null,
          descriptionVi: input.descriptionVi?.trim() || null,
          promptEn: input.promptEn.trim(),
          promptVi: input.promptVi?.trim() || null,
          category: input.category,
          aiTools: input.aiTools.join(","),
          tags: input.tags?.trim() || null,
        });

        // Ensure the author has a slug so their public profile resolves immediately.
        if (!ctx.user.slug) {
          ensureUserSlug(ctx.user.id, ctx.user.name ?? null).catch(() => {});
        }

        // Ping the owner so they can moderate promptly
        notifyOwner({
          title: "New prompt awaiting moderation",
          content: `${ctx.user.name ?? "A member"} submitted: ${input.titleEn}`,
        }).catch(() => {});

        return { id, status: "pending" as const };
      }),

    // Authenticated user: see their own prompts (any status)
    mine: protectedProcedure.query(({ ctx }) => listMyPrompts(ctx.user.id)),

    // Authenticated: toggle a like; returns the new state and updated count.
    toggleLike: protectedProcedure
      .input(z.object({ promptId: z.number().int().positive() }))
      .mutation(({ ctx, input }) => togglePromptLike(input.promptId, ctx.user.id)),

    // Public: increment the copy counter. Anonymous copies are still tracked
    // because the value reflects real-world utility of the prompt.
    incrementCopy: publicProcedure
      .input(z.object({ promptId: z.number().int().positive() }))
      .mutation(({ input }) => incrementCopyCount(input.promptId)),
  }),
  users: router({
    /**
     * Public profile page payload: author info + their approved prompts + aggregate stats.
     * Looked up by URL-safe slug.
     */
    profileBySlug: publicProcedure
      .input(z.object({ slug: z.string().min(1).max(80) }))
      .query(async ({ input }) => {
        const author = await getUserBySlug(input.slug);
        if (!author) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Author not found" });
        }
        const [items, stats] = await Promise.all([
          listApprovedByUser(author.id),
          getUserStats(author.id),
        ]);
        return {
          author: {
            id: author.id,
            name: author.name,
            slug: author.slug,
            bio: author.bio,
            role: author.role,
            joinedAt: author.createdAt,
          },
          stats,
          prompts: items,
        };
      }),
  }),
  admin: router({
    pendingCount: adminProcedure.query(() => countPendingPrompts()),
    listPending: adminProcedure.query(() => listPendingPrompts()),
    approve: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        await moderatePrompt(input.id, ctx.user.id, "approved");
        return { success: true } as const;
      }),
    reject: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          reason: z.string().max(500).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await moderatePrompt(input.id, ctx.user.id, "rejected", input.reason);
        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;

// Re-export categories for the frontend (used via type-only or constants file).
export { CATEGORIES };

// Silence unused-import warning when bundler tree-shakes.
void getUserById;

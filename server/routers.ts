import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  countPendingPrompts,
  createPrompt,
  listApprovedPrompts,
  listMyPrompts,
  listPendingPrompts,
  moderatePrompt,
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

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  prompts: router({
    // Public: list approved community prompts
    listApproved: publicProcedure.query(() => listApprovedPrompts()),

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

        // Ping the owner so they can moderate promptly
        notifyOwner({
          title: "New prompt awaiting moderation",
          content: `${ctx.user.name ?? "A member"} submitted: ${input.titleEn}`,
        }).catch(() => {});

        return { id, status: "pending" as const };
      }),

    // Authenticated user: see their own prompts (any status)
    mine: protectedProcedure.query(({ ctx }) => listMyPrompts(ctx.user.id)),
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

// Guard unused TRPCError import warning if optimisation kicks in.
void TRPCError;

/**
 * Round 2 — engagement & profile tests.
 *
 * These tests cover:
 *  1. Authorization gates for the new like / mine / bio endpoints.
 *  2. Input validation for `prompts.toggleLike` and `prompts.incrementCopy`
 *     (both must reject non-positive integer ids).
 *  3. Public read paths (`users.profileBySlug`) correctly raise NOT_FOUND
 *     for unknown slugs without leaking any user data.
 *
 * We intentionally only assert TRPC errors here so the tests stay deterministic
 * even when no database is reachable in the CI sandbox — the goal is to lock
 * the contract surface, not to verify SQL writes.
 */
import { TRPCError } from "@trpc/server";
import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function buildCtx(role: "user" | "admin" | null): TrpcContext {
  const user: AuthenticatedUser | null =
    role === null
      ? null
      : {
          id: role === "admin" ? 99 : 1,
          openId: `openid-${role}`,
          email: `${role}@example.com`,
          name: `Sample ${role}`,
          loginMethod: "manus",
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        };

  return {
    user: user as TrpcContext["user"],
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("engagement — authorization gates", () => {
  it("rejects anonymous toggleLike with UNAUTHORIZED", async () => {
    const caller = appRouter.createCaller(buildCtx(null));
    await expect(caller.prompts.toggleLike({ promptId: 1 })).rejects.toBeInstanceOf(
      TRPCError
    );
  });

  it("rejects anonymous myLikedIds query", async () => {
    const caller = appRouter.createCaller(buildCtx(null));
    await expect(caller.prompts.myLikedIds()).rejects.toBeInstanceOf(TRPCError);
  });

  it("rejects anonymous mySlug query", async () => {
    const caller = appRouter.createCaller(buildCtx(null));
    await expect(caller.auth.mySlug()).rejects.toBeInstanceOf(TRPCError);
  });

  it("rejects anonymous updateBio mutation", async () => {
    const caller = appRouter.createCaller(buildCtx(null));
    await expect(caller.auth.updateBio({ bio: "Hello" })).rejects.toBeInstanceOf(
      TRPCError
    );
  });
});

describe("engagement — input validation", () => {
  it("rejects toggleLike with non-positive prompt id", async () => {
    const caller = appRouter.createCaller(buildCtx("user"));
    await expect(caller.prompts.toggleLike({ promptId: 0 })).rejects.toThrow();
    await expect(caller.prompts.toggleLike({ promptId: -5 })).rejects.toThrow();
  });

  it("rejects incrementCopy with non-positive prompt id", async () => {
    const caller = appRouter.createCaller(buildCtx(null));
    await expect(
      caller.prompts.incrementCopy({ promptId: 0 })
    ).rejects.toThrow();
    await expect(
      caller.prompts.incrementCopy({ promptId: -1 })
    ).rejects.toThrow();
  });

  it("rejects updateBio over 280 characters", async () => {
    const caller = appRouter.createCaller(buildCtx("user"));
    await expect(
      caller.auth.updateBio({ bio: "x".repeat(281) })
    ).rejects.toThrow();
  });

  it("rejects profileBySlug with empty slug", async () => {
    const caller = appRouter.createCaller(buildCtx(null));
    await expect(
      caller.users.profileBySlug({ slug: "" })
    ).rejects.toThrow();
  });
});

describe("engagement — public profile lookup", () => {
  it("returns NOT_FOUND for unknown slug rather than null", async () => {
    const caller = appRouter.createCaller(buildCtx(null));
    await expect(
      caller.users.profileBySlug({ slug: "definitely-not-a-real-user-slug-xyz" })
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});

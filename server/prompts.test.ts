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

describe("prompts router — authorization gates", () => {
  it("rejects unauthenticated submit calls with UNAUTHORIZED", async () => {
    const caller = appRouter.createCaller(buildCtx(null));
    await expect(
      caller.prompts.submit({
        titleEn: "Hello world prompt",
        promptEn: "Act as a helpful assistant and explain quantum physics.",
        category: "education",
        aiTools: ["ChatGPT"],
      })
    ).rejects.toBeInstanceOf(TRPCError);
  });

  it("rejects unauthenticated mine queries", async () => {
    const caller = appRouter.createCaller(buildCtx(null));
    await expect(caller.prompts.mine()).rejects.toBeInstanceOf(TRPCError);
  });

  it("blocks non-admin users from accessing admin.listPending", async () => {
    const caller = appRouter.createCaller(buildCtx("user"));
    await expect(caller.admin.listPending()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("blocks non-admin users from approving prompts", async () => {
    const caller = appRouter.createCaller(buildCtx("user"));
    await expect(caller.admin.approve({ id: 1 })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("blocks non-admin users from rejecting prompts", async () => {
    const caller = appRouter.createCaller(buildCtx("user"));
    await expect(
      caller.admin.reject({ id: 1, reason: "spam" })
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("prompts.submit — input validation", () => {
  it("rejects titles shorter than 3 characters", async () => {
    const caller = appRouter.createCaller(buildCtx("user"));
    await expect(
      caller.prompts.submit({
        titleEn: "Hi",
        promptEn: "Long enough prompt body here for testing.",
        category: "writing",
        aiTools: ["ChatGPT"],
      })
    ).rejects.toThrow();
  });

  it("rejects prompt bodies shorter than 10 characters", async () => {
    const caller = appRouter.createCaller(buildCtx("user"));
    await expect(
      caller.prompts.submit({
        titleEn: "Valid title",
        promptEn: "short",
        category: "writing",
        aiTools: ["ChatGPT"],
      })
    ).rejects.toThrow();
  });

  it("rejects submissions without any AI tool selected", async () => {
    const caller = appRouter.createCaller(buildCtx("user"));
    await expect(
      caller.prompts.submit({
        titleEn: "Valid title",
        promptEn: "Long enough prompt body here for testing.",
        category: "writing",
        aiTools: [],
      })
    ).rejects.toThrow();
  });

  it("rejects unknown categories", async () => {
    const caller = appRouter.createCaller(buildCtx("user"));
    await expect(
      caller.prompts.submit({
        titleEn: "Valid title",
        promptEn: "Long enough prompt body here for testing.",
        // @ts-expect-error invalid category for negative test
        category: "not-a-category",
        aiTools: ["ChatGPT"],
      })
    ).rejects.toThrow();
  });
});

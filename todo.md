# Todo — Upgrade to full-stack with auth + moderation

- [x] Upgrade project to `web-db-user` (database + Manus OAuth)
- [x] Design DB schema: `prompts` table with status enum (pending/approved/rejected)
- [x] Backend tRPC API: prompts.submit, prompts.listApproved, prompts.mine, admin.listPending, admin.approve, admin.reject, admin.pendingCount
- [x] Identify admin (Mr. Nghĩa) by OWNER_OPEN_ID env (auto-promoted via upsertUser)
- [x] Submit Prompt page (/submit): title EN/VI, description EN/VI, prompt EN/VI, category chips, AI tools multi-select, tags
- [x] My Prompts page (/my-prompts): status badges + rejection reason display
- [x] Admin Moderation page (/admin): list pending prompts, approve/reject buttons with reason
- [x] Header: Sign in button → user menu (My prompts, Submit, Admin badge if owner, Sign out) + pending count badge
- [x] Library: include built-in prompts + approved community prompts
- [x] Owner notification triggered when a new prompt is submitted
- [x] Vitest coverage: auth gates + input validation (10 tests passing)
- [x] Save checkpoint and deliver to user

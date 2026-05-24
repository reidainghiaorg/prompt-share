/**
 * Shared engagement logic for prompts:
 *  - `useLike(promptId)`: state + toggle, optimistic, refetch on success
 *  - `recordCopy(promptId)`: fire-and-forget mutation for the real copy counter
 *
 * Both helpers degrade gracefully for built-in seed prompts (no serverId).
 */
import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export function useLikedPromptIds() {
  const { isAuthenticated } = useAuth();
  const { data } = trpc.prompts.myLikedIds.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 30_000,
  });
  // useMemo so a stable Set identity avoids unnecessary re-renders downstream.
  return useMemo(() => new Set(data ?? []), [data]);
}

export function useToggleLike() {
  const utils = trpc.useUtils();
  return trpc.prompts.toggleLike.useMutation({
    onSuccess: () => {
      utils.prompts.listApproved.invalidate();
      utils.prompts.myLikedIds.invalidate();
    },
  });
}

export function useIncrementCopy() {
  const utils = trpc.useUtils();
  return trpc.prompts.incrementCopy.useMutation({
    onSuccess: () => {
      // Light-touch revalidation; the listApproved query is the source of truth
      // for copy counts displayed in the library grid.
      utils.prompts.listApproved.invalidate();
    },
  });
}

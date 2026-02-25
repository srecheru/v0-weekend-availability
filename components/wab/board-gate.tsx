"use client";

/**
 * Gate for pages that require board creation (creator) or board join (participant).
 * Currently a passthrough -- the individual pages handle their own redirect logic.
 */
export function BoardGate({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

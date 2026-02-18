"use client";

import { cn } from "@/lib/utils";
import { TIER_CONFIG, type AggregationSummary, type TierType } from "@/lib/weekend-utils";

interface TierSummaryBarProps {
  summary: AggregationSummary | null;
  hasAggregation: boolean;
  pendingCount: number;
}

export function TierSummaryBar({
  summary,
  hasAggregation,
  pendingCount,
}: TierSummaryBarProps) {
  if (!hasAggregation || !summary) {
    return (
      <div className="rounded-lg bg-muted/50 px-4 py-3 text-sm text-muted-foreground text-center">
        No availability added yet
      </div>
    );
  }

  const items: { tier: TierType; count: number }[] = [
    { tier: "EVERYONE_FREE", count: summary.everyoneFreeCount },
    { tier: "MAJORITY_FREE", count: summary.majorityFreeCount },
    { tier: "MIXED_NOT_MAJORITY", count: summary.mixedNotMajorityCount },
    { tier: "ALL_BUSY", count: summary.allBusyCount },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {items.map(({ tier, count }) => {
          const config = TIER_CONFIG[tier];
          return (
            <div
              key={tier}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                config.className
              )}
            >
              <span className="font-semibold">{count}</span>
              <span>{config.label}</span>
            </div>
          );
        })}
      </div>
      {pendingCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {pendingCount} participant{pendingCount !== 1 ? "s" : ""} pending
        </p>
      )}
    </div>
  );
}

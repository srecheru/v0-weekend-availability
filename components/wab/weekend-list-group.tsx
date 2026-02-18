"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  TIER_CONFIG,
  formatWeekendRange,
  getWeekendCopy,
  getPendingSuffix,
  type WeekendRow,
} from "@/lib/weekend-utils";
import { ChevronDown, ChevronRight } from "lucide-react";

interface WeekendListGroupProps {
  weekends: WeekendRow[];
  hasAggregation: boolean;
}

export function WeekendListGroup({
  weekends,
  hasAggregation,
}: WeekendListGroupProps) {
  if (!hasAggregation) {
    return (
      <div className="rounded-lg bg-muted/50 px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          No availability added yet
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Weekend dates will appear once participants add their availability
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {weekends.map((w) => (
        <WeekendRowComponent key={w.friday} row={w} />
      ))}
    </div>
  );
}

function WeekendRowComponent({ row }: { row: WeekendRow }) {
  const [expanded, setExpanded] = useState(false);
  const config = TIER_CONFIG[row.tier];
  const isMixed =
    row.tier === "MAJORITY_FREE" || row.tier === "MIXED_NOT_MAJORITY";
  const isExpandable = isMixed && row.freeCount > 0 && row.busyCount > 0;

  return (
    <div className="rounded-lg overflow-hidden border border-border/50">
      <button
        type="button"
        onClick={() => isExpandable && setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-3 w-full px-3 py-2.5 text-left transition-colors",
          isExpandable && "cursor-pointer hover:bg-accent/50",
          !isExpandable && "cursor-default"
        )}
      >
        {/* Tier color indicator */}
        <div
          className={cn(
            "w-1.5 self-stretch rounded-full shrink-0",
            config.className
          )}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {formatWeekendRange(row.friday)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {getWeekendCopy(row, true)}
            {getPendingSuffix(row.pendingCount)}
          </p>
        </div>

        {/* Expand chevron */}
        {isExpandable && (
          <span className="text-muted-foreground shrink-0">
            {expanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </span>
        )}
      </button>

      {/* Expanded names */}
      {expanded && isExpandable && (
        <div className="px-3 pb-3 pt-0 ml-4 border-t border-border/30">
          <div className="flex flex-col gap-2 pt-2">
            {row.freeNames.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-tier-everyone-free-foreground bg-tier-everyone-free/15 rounded px-1.5 py-0.5 shrink-0">
                  Free
                </span>
                <span className="text-xs text-muted-foreground">
                  {row.freeNames.join(", ")}
                </span>
              </div>
            )}
            {row.busyNames.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="text-xs font-medium text-tier-all-busy-foreground bg-tier-all-busy/15 rounded px-1.5 py-0.5 shrink-0">
                  Busy
                </span>
                <span className="text-xs text-muted-foreground">
                  {row.busyNames.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

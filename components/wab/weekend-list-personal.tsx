"use client";

import { formatWeekendRange } from "@/lib/weekend-utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface WeekendListPersonalProps {
  busyFridays: string[];
  onRemove: (fridayIso: string) => void;
}

export function WeekendListPersonal({
  busyFridays,
  onRemove,
}: WeekendListPersonalProps) {
  const sorted = [...busyFridays].sort();

  if (sorted.length === 0) {
    return (
      <div className="rounded-lg bg-muted/50 px-4 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          No busy weekends selected
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Tap weekends on the calendar to mark them as busy
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
        Busy Weekends ({sorted.length})
      </p>
      {sorted.map((friday) => (
        <div
          key={friday}
          className="flex items-center justify-between rounded-lg bg-tier-busy-personal/10 px-3 py-2"
        >
          <span className="text-sm font-medium text-foreground">
            {formatWeekendRange(friday)}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(friday)}
            className="shrink-0 text-muted-foreground hover:text-destructive"
            aria-label={`Remove ${formatWeekendRange(friday)}`}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}

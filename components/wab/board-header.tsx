"use client";

import { parseISO, format, startOfDay, isAfter } from "date-fns";
import type { Board } from "@/lib/weekend-utils";
import { CalendarDays, Globe } from "lucide-react";

export function BoardHeader({ board }: { board: Board }) {
  const storedStart = parseISO(board.dateRangeStart);
  const end = parseISO(board.dateRangeEnd);
  // Show today as the effective start if the stored start is in the past
  const today = startOfDay(new Date());
  const start = isAfter(today, storedStart) ? today : storedStart;
  const formattedRange =
    start.getFullYear() === end.getFullYear()
      ? `${format(start, "MMM d")} \u2013 ${format(end, "MMM d, yyyy")}`
      : `${format(start, "MMM d, yyyy")} \u2013 ${format(end, "MMM d, yyyy")}`;

  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-balance text-foreground tracking-tight">
        {board.boardName}
      </h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          {formattedRange}
        </span>
        <span className="flex items-center gap-1.5">
          <Globe className="size-3.5" />
          {board.timezone}
        </span>
      </div>
    </header>
  );
}

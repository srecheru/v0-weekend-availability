"use client";

import { useBoardContext } from "@/lib/board-context";
import { CalendarDays, Globe } from "lucide-react";
import { format, parseISO } from "date-fns";

export function BoardHeader() {
  const { board } = useBoardContext();

  if (!board) return null;

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <header className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-balance text-foreground tracking-tight">
        {board.boardName}
      </h1>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" />
          {formatDate(board.dateRangeStart)} to {formatDate(board.dateRangeEnd)}
        </span>
        <span className="flex items-center gap-1.5">
          <Globe className="size-3.5" />
          {board.timezone}
        </span>
      </div>
    </header>
  );
}

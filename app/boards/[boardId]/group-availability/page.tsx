"use client";

import { useMemo } from "react";
import { useBoardContext } from "@/lib/board-context";
import { computeAggregation } from "@/lib/weekend-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoardHeader } from "@/components/wab/board-header";
import { GroupCalendar } from "@/components/wab/weekend-calendar";
import { TierSummaryBar } from "@/components/wab/tier-summary-bar";
import { WeekendListGroup } from "@/components/wab/weekend-list-group";
import { AvailabilityTabs } from "@/components/wab/screen-nav";
import { Loader2 } from "lucide-react";

export default function GroupAvailabilityPage() {
  const { board, participants, weekendFridays, isLoading } = useBoardContext();

  const { weekends, summary, hasAggregation, pendingCount } = useMemo(
    () => computeAggregation(participants, weekendFridays),
    [participants, weekendFridays]
  );

  if (isLoading || !board) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-md px-4 py-6 flex flex-col gap-5">
        <BoardHeader />

        <AvailabilityTabs activeTab="group" />

        <TierSummaryBar
          summary={summary}
          hasAggregation={hasAggregation}
          pendingCount={pendingCount}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Group Calendar</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <GroupCalendar
              dateRangeStart={board.dateRangeStart}
              dateRangeEnd={board.dateRangeEnd}
              weekends={weekends}
              hasAggregation={hasAggregation}
            />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {hasAggregation ? "Ranked Weekends" : "Weekends"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {hasAggregation
              ? "Sorted by availability. Tap mixed weekends to see who's free."
              : "No availability data yet. Weekends will be ranked once participants add their availability."}
          </p>
          <WeekendListGroup weekends={weekends} hasAggregation={hasAggregation} />
        </div>
      </div>
    </main>
  );
}

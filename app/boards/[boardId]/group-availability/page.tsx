"use client";

import { useMemo } from "react";
import { usePrototype } from "@/lib/prototype-context";
import { computeAggregation } from "@/lib/weekend-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoardHeader } from "@/components/wab/board-header";
import { GroupCalendar } from "@/components/wab/weekend-calendar";
import { TierSummaryBar } from "@/components/wab/tier-summary-bar";
import { WeekendListGroup } from "@/components/wab/weekend-list-group";
import { AvailabilityTabs } from "@/components/wab/screen-nav";
import { ScenarioSwitcher } from "@/components/wab/scenario-switcher";
import { BoardGate } from "@/components/wab/board-gate";
import { ScreenNav } from "@/components/wab/screen-nav";

export default function GroupAvailabilityPage() {
  const { board, participants, weekendFridays, viewRole } = usePrototype();

  const { weekends, summary, hasAggregation, pendingCount } = useMemo(
    () => computeAggregation(participants, weekendFridays),
    [participants, weekendFridays]
  );

  return (
    <BoardGate>
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

      <ScreenNav />
      {viewRole === "creator" && <ScenarioSwitcher />}
    </main>
    </BoardGate>
  );
}

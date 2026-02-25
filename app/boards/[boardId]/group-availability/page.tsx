"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoardHeader } from "@/components/wab/board-header";
import { GroupCalendar } from "@/components/wab/weekend-calendar";
import { TierSummaryBar } from "@/components/wab/tier-summary-bar";
import { WeekendListGroup } from "@/components/wab/weekend-list-group";
import { AvailabilityTabs } from "@/components/wab/screen-nav";
import { BoardGate } from "@/components/wab/board-gate";
import { ScreenNav } from "@/components/wab/screen-nav";
import { useBoard, useAggregation } from "@/lib/wab-hooks";

export default function GroupAvailabilityPage() {
  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId;
  const router = useRouter();
  const { board, currentParticipant, isLoading } = useBoard(boardId);
  const { data } = useAggregation(boardId);

  if (!board || isLoading) {
    return null;
  }

  if (!currentParticipant) {
    router.replace(`/boards/${board.boardId}/participant-join`);
    return null;
  }

  const weekends = data?.weekends ?? [];
  const summary = data?.summary;
  const hasAggregation = data?.hasAggregation ?? false;
  const pendingCount = data?.pendingCount ?? 0;

  return (
    <BoardGate>
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-md px-4 py-6 flex flex-col gap-5">
        <BoardHeader board={board} />

        <AvailabilityTabs activeTab="group" />

        {summary && (
          <TierSummaryBar
            summary={summary}
            hasAggregation={hasAggregation}
            pendingCount={pendingCount}
          />
        )}

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

      <ScreenNav boardId={board.boardId} viewRole="participant" />
    </main>
    </BoardGate>
  );
}

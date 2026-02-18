"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePrototype } from "@/lib/prototype-context";
import { computeAggregation } from "@/lib/weekend-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BoardHeader } from "@/components/wab/board-header";
import { ShareLinkCard } from "@/components/wab/share-link-card";
import { TierSummaryBar } from "@/components/wab/tier-summary-bar";
import { ParticipantList } from "@/components/wab/participant-list";
import { ScenarioSwitcher } from "@/components/wab/scenario-switcher";
import { ScreenNav } from "@/components/wab/screen-nav";
import { CalendarPlus, KeyRound } from "lucide-react";

export default function CreatorJoinPage() {
  const { board, participants, weekendFridays, currentParticipant } =
    usePrototype();

  const { summary, hasAggregation, pendingCount } = useMemo(
    () => computeAggregation(participants, weekendFridays),
    [participants, weekendFridays]
  );

  const boardBase = `/boards/${board.boardId}`;

  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-md px-4 py-6 flex flex-col gap-5">
        <BoardHeader />

        <ShareLinkCard />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Board Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <TierSummaryBar
              summary={summary}
              hasAggregation={hasAggregation}
              pendingCount={pendingCount}
            />
            <ParticipantList />
          </CardContent>
        </Card>

        {currentParticipant && (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex items-center gap-3">
              <KeyRound className="size-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Your claim code</p>
                <p className="text-sm font-mono font-semibold text-foreground">
                  {currentParticipant.claimCode}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button asChild size="lg" className="w-full">
          <Link href={`${boardBase}/my-availability`}>
            <CalendarPlus className="size-4" />
            Add My Availability
          </Link>
        </Button>
      </div>

      <ScreenNav />
      <ScenarioSwitcher />
    </main>
  );
}

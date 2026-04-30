"use client";

import { useRouter } from "next/navigation";
import { useBoardContext } from "@/lib/board-context";
import { Card, CardContent } from "@/components/ui/card";
import { BoardHeader } from "@/components/wab/board-header";
import { PersonalCalendar } from "@/components/wab/weekend-calendar";
import { WeekendListPersonal } from "@/components/wab/weekend-list-personal";
import { SaveIndicator } from "@/components/wab/save-indicator";
import { AvailabilityTabs, ScreenNav } from "@/components/wab/screen-nav";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function MyAvailabilityPage() {
  const router = useRouter();
  const {
    board,
    currentParticipant,
    weekendFridays,
    toggleBusyWeekend,
    isLoading,
    participantJoined,
    saveStatus,
  } = useBoardContext();

  // Redirect to join page if not joined
  useEffect(() => {
    if (!isLoading && !participantJoined && board) {
      router.push(`/boards/${board.boardId}/participant-join`);
    }
  }, [isLoading, participantJoined, board, router]);

  if (isLoading || !board) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!participantJoined || !currentParticipant) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  const busyFridays = currentParticipant.busyWeekendFridays ?? [];

  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-md px-4 py-6 flex flex-col gap-5">
        <BoardHeader />

        <AvailabilityTabs activeTab="my" />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Tap weekend days to mark them as <strong>busy</strong>. Everything
            else stays free.
          </p>
          <SaveIndicator status={saveStatus} />
        </div>

        <Card>
          <CardContent className="pt-2">
            <PersonalCalendar
              dateRangeStart={board.dateRangeStart}
              dateRangeEnd={board.dateRangeEnd}
              busyFridays={busyFridays}
              weekendFridays={weekendFridays}
              onToggleWeekend={toggleBusyWeekend}
            />
          </CardContent>
        </Card>

        <WeekendListPersonal
          busyFridays={busyFridays}
          onRemove={toggleBusyWeekend}
        />

        <p className="text-xs text-center text-muted-foreground">
          Logged in as <strong>{currentParticipant.displayName}</strong>
          {" \u00b7 "}
          Claim code: <strong className="font-mono">{currentParticipant.claimCode}</strong>
        </p>
      </div>
      
      <ScreenNav />
    </main>
  );
}

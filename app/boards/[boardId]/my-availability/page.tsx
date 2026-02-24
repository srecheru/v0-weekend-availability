"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoardHeader } from "@/components/wab/board-header";
import { PersonalCalendar } from "@/components/wab/weekend-calendar";
import { WeekendListPersonal } from "@/components/wab/weekend-list-personal";
import { SaveIndicator } from "@/components/wab/save-indicator";
import { AvailabilityTabs } from "@/components/wab/screen-nav";
import { ScenarioSwitcher } from "@/components/wab/scenario-switcher";
import { BoardGate } from "@/components/wab/board-gate";
import { ScreenNav } from "@/components/wab/screen-nav";
import { useBoard } from "@/lib/wab-hooks";

export default function MyAvailabilityPage() {
  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId;
  const router = useRouter();
  const { board, currentParticipant } = useBoard(boardId);
  const [busyFridays, setBusyFridays] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );

  useEffect(() => {
    if (currentParticipant) {
      setBusyFridays(currentParticipant.busyWeekendFridays ?? []);
    }
  }, [currentParticipant]);

  useEffect(() => {
    if (!board) return;
    if (!currentParticipant) {
      router.replace(`/boards/${board.boardId}/participant-join`);
    }
  }, [board, currentParticipant, router]);

  const handleToggleWeekend = (fridayIso: string) => {
    setBusyFridays((prev) => {
      const isBusy = prev.includes(fridayIso);
      if (isBusy) {
        return prev.filter((f) => f !== fridayIso);
      }
      return [...prev, fridayIso];
    });

    setSaveStatus("saving");

    void (async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      try {
        const res = await fetch(`/api/boards/${boardId}/availability`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ busyWeekendFridays: busyFridays }),
        });
        if (!res.ok) {
          setSaveStatus("idle");
          return;
        }
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch {
        setSaveStatus("idle");
      }
    })();
  };

  if (!board) {
    return null;
  }

  return (
    <BoardGate>
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-md px-4 py-6 flex flex-col gap-5">
        <BoardHeader board={board} />

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
              weekendFridays={[]}
              onToggleWeekend={handleToggleWeekend}
            />
          </CardContent>
        </Card>

        <WeekendListPersonal
          busyFridays={busyFridays}
          onRemove={toggleBusyWeekend}
        />

        {currentParticipant && (
          <p className="text-xs text-center text-muted-foreground">
            Logged in as <strong>{currentParticipant.displayName}</strong>
            {" \u00b7 "}
            Claim code: <strong className="font-mono">{currentParticipant.claimCode}</strong>
          </p>
        )}
      </div>

      <ScreenNav boardId={board.boardId} viewRole="participant" />
      <ScenarioSwitcher />
    </main>
    </BoardGate>
  );
}

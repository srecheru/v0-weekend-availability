"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { parseISO } from "date-fns";
import { getWeekendsInRange, fridayToIso } from "@/lib/weekend-utils";
import { Card, CardContent } from "@/components/ui/card";
import { BoardHeader } from "@/components/wab/board-header";
import { PersonalCalendar } from "@/components/wab/weekend-calendar";
import { WeekendListPersonal } from "@/components/wab/weekend-list-personal";
import { SaveIndicator } from "@/components/wab/save-indicator";
import { AvailabilityTabs } from "@/components/wab/screen-nav";
import { BoardGate } from "@/components/wab/board-gate";
import { ScreenNav } from "@/components/wab/screen-nav";
import { useBoard, useIsCreator } from "@/lib/wab-hooks";

export default function MyAvailabilityPage() {
  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId;
  const router = useRouter();
  const { board, currentParticipant, isLoading } = useBoard(boardId);
  const isCreator = useIsCreator(boardId);
  const [busyFridays, setBusyFridays] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const busyFridaysRef = useRef(busyFridays);

  const weekendFridays = useMemo(() => {
    if (!board) return [];
    const start = parseISO(board.dateRangeStart);
    const end = parseISO(board.dateRangeEnd);
    return getWeekendsInRange(start, end).map(fridayToIso);
  }, [board]);

  useEffect(() => {
    if (currentParticipant) {
      const initial = currentParticipant.busyWeekendFridays ?? [];
      setBusyFridays(initial);
      busyFridaysRef.current = initial;
    }
  }, [currentParticipant]);

  useEffect(() => {
    if (isLoading || !board) return;
    if (!currentParticipant) {
      router.replace(
        isCreator
          ? `/boards/${board.boardId}/creator-join`
          : `/boards/${board.boardId}/participant-join`
      );
    }
  }, [board, currentParticipant, isCreator, isLoading, router]);

  const handleToggleWeekend = useCallback((fridayIso: string) => {
    setBusyFridays((prev) => {
      const isBusy = prev.includes(fridayIso);
      const next = isBusy ? prev.filter((f) => f !== fridayIso) : [...prev, fridayIso];
      busyFridaysRef.current = next;
      return next;
    });

    setSaveStatus("saving");

    void (async () => {
      // Small debounce so rapid taps batch into one save
      await new Promise((resolve) => setTimeout(resolve, 400));
      try {
        const res = await fetch(`/api/boards/${boardId}/availability`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ busyWeekendFridays: busyFridaysRef.current }),
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
  }, [boardId]);

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
              weekendFridays={weekendFridays}
              onToggleWeekend={handleToggleWeekend}
            />
          </CardContent>
        </Card>

        <WeekendListPersonal
          busyFridays={busyFridays}
          onRemove={handleToggleWeekend}
        />

        {currentParticipant && (
          <p className="text-xs text-center text-muted-foreground">
            Logged in as <strong>{currentParticipant.displayName}</strong>
            {" \u00b7 "}
            Claim code: <strong className="font-mono">{currentParticipant.claimCode}</strong>
          </p>
        )}
      </div>

      <ScreenNav boardId={board.boardId} viewRole={isCreator ? "creator" : "participant"} />
    </main>
    </BoardGate>
  );
}

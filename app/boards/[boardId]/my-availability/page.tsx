"use client";

import { usePrototype } from "@/lib/prototype-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BoardHeader } from "@/components/wab/board-header";
import { PersonalCalendar } from "@/components/wab/weekend-calendar";
import { WeekendListPersonal } from "@/components/wab/weekend-list-personal";
import { SaveIndicator } from "@/components/wab/save-indicator";
import { AvailabilityTabs } from "@/components/wab/screen-nav";
import { ScenarioSwitcher } from "@/components/wab/scenario-switcher";
import { ScreenNav } from "@/components/wab/screen-nav";

export default function MyAvailabilityPage() {
  const {
    board,
    currentParticipant,
    weekendFridays,
    toggleBusyWeekend,
  } = usePrototype();

  const busyFridays = currentParticipant?.busyWeekendFridays ?? [];

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
          <SaveIndicator />
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

        {currentParticipant && (
          <p className="text-xs text-center text-muted-foreground">
            Logged in as <strong>{currentParticipant.displayName}</strong>
            {" \u00b7 "}
            Claim code: <strong className="font-mono">{currentParticipant.claimCode}</strong>
          </p>
        )}
      </div>

      <ScreenNav />
      <ScenarioSwitcher />
    </main>
  );
}

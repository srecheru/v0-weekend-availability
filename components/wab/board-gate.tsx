"use client";

import Link from "next/link";
import { usePrototype } from "@/lib/prototype-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, UserPlus } from "lucide-react";
import { ScreenNav } from "@/components/wab/screen-nav";
import { ScenarioSwitcher } from "@/components/wab/scenario-switcher";

/**
 * Gate for pages that require board creation (creator) or board join (participant).
 * Shows a friendly prompt to go create / join first.
 */
export function BoardGate({ children }: { children: React.ReactNode }) {
  const { boardCreated, participantJoined, viewRole, board } = usePrototype();

  // Creator flow: must have created a board
  if (viewRole === "creator" && !boardCreated) {
    return (
      <GateShell
        icon={<CalendarPlus className="size-6 text-muted-foreground" />}
        title="No board yet"
        description="Create a group board first, then you can share it, add your availability, and see the group view."
        actionLabel="Create a Group Board"
        actionHref="/"
      />
    );
  }

  // Participant flow: must have joined (or reclaimed) the board
  if (viewRole === "participant" && !participantJoined) {
    return (
      <GateShell
        icon={<UserPlus className="size-6 text-muted-foreground" />}
        title="Join the board first"
        description="You need to join this board or reclaim your spot with a claim code before you can view availability."
        actionLabel="Go to Join Page"
        actionHref={`/boards/${board.boardId}/participant-join`}
      />
    );
  }

  return <>{children}</>;
}

function GateShell({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-md px-4 py-6 flex flex-col items-center justify-center gap-4 min-h-[60vh]">
        <div className="rounded-full bg-muted p-4">{icon}</div>
        <Card className="w-full">
          <CardContent className="flex flex-col items-center gap-3 text-center pt-6">
            <h2 className="text-lg font-semibold text-foreground text-balance">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground text-balance">
              {description}
            </p>
            <Button asChild className="w-full mt-2">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      <ScreenNav />
      <ScenarioSwitcher />
    </main>
  );
}

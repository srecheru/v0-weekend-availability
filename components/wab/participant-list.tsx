"use client";

import { usePrototype } from "@/lib/prototype-context";
import { Users } from "lucide-react";

export function ParticipantList() {
  const { participants, board } = usePrototype();

  if (participants.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="size-4" />
        No participants yet
      </div>
    );
  }

  const names = participants.map((p) => p.displayName);
  const pendingCount = participants.filter(
    (p) => p.state !== "ADDED_AVAILABILITY"
  ).length;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Users className="size-4" />
        {participants.length} / {board.participantCap} Participants
      </div>
      <p className="text-sm text-muted-foreground">{names.join(", ")}</p>
      {pendingCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {pendingCount} haven{"'"}t added availability yet
        </p>
      )}
    </div>
  );
}

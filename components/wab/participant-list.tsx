"use client";

import type { Participant } from "@/lib/weekend-utils";
import { Users } from "lucide-react";

export function ParticipantList({
  participants,
  participantCap,
}: {
  participants: Participant[];
  participantCap: number;
}) {

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
        {participants.length} / {participantCap} Participants
      </div>
      <p className="text-sm text-muted-foreground">{names.join(", ")}</p>
      {pendingCount > 0 && (
        <p className="text-xs text-muted-foreground">
          {pendingCount} participant{pendingCount !== 1 ? "s" : ""} pending availability
        </p>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  computeAggregation,
  getWeekendsInRange,
  fridayToIso,
} from "@/lib/weekend-utils";
import { parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BoardHeader } from "@/components/wab/board-header";
import { TierSummaryBar } from "@/components/wab/tier-summary-bar";
import { ParticipantList } from "@/components/wab/participant-list";
import { ClaimCodeInput } from "@/components/wab/claim-code-input";
import { ScreenNav } from "@/components/wab/screen-nav";
import { ShareLinkCard } from "@/components/wab/share-link-card";
import { AlertCircle, CalendarPlus, KeyRound } from "lucide-react";
import { useBoard, useIsCreator } from "@/lib/wab-hooks";

export default function ParticipantJoinPage() {
  const router = useRouter();
  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId;
  const { board, participants, currentParticipant } = useBoard(boardId);
  const isCreator = useIsCreator(boardId);
  const isBoardFull =
    (participants?.length ?? 0) >= (board?.participantCap ?? 0);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [reclaimError, setReclaimError] = useState("");
  const [showReclaim, setShowReclaim] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (isCreator) {
      router.replace(`/boards/${boardId}/creator-join`);
    }
  }, [isCreator, boardId, router]);

  const weekendFridays = useMemo(() => {
    if (!board) return [];
    const start = parseISO(board.dateRangeStart);
    const end = parseISO(board.dateRangeEnd);
    return getWeekendsInRange(start, end).map(fridayToIso);
  }, [board]);

  const { summary, hasAggregation, pendingCount } = useMemo(
    () => computeAggregation(participants ?? [], weekendFridays),
    [participants, weekendFridays]
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isJoining) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Display name is required");
      return;
    }
    if (
      participants?.some(
        (p) => p.displayName.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setError("That name is already taken. Use your claim code below to reclaim your session.");
      setShowReclaim(true);
      return;
    }
    setError("");
    setIsJoining(true);
    void (async () => {
      try {
        const res = await fetch(`/api/boards/${boardId}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ displayName: trimmed }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? "Failed to join board");
          setIsJoining(false);
          return;
        }
        window.location.href = `/boards/${boardId}/my-availability`;
      } catch (err) {
        console.error(err);
        setError("Failed to join board");
        setIsJoining(false);
      }
    })();
  };

  const handleReclaim = async (code: string) => {
    setReclaimError("");
    try {
      const res = await fetch(`/api/boards/${boardId}/reclaim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimCode: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReclaimError(data?.error ?? "Invalid claim code. Please try again.");
        return;
      }
      const participantState = data?.participant?.state;
      // Use full page navigation so the browser picks up the new session cookie
      if (participantState === "ADDED_AVAILABILITY") {
        window.location.href = `/boards/${boardId}/group-availability`;
      } else {
        window.location.href = `/boards/${boardId}/my-availability`;
      }
    } catch (err) {
      console.error(err);
      setReclaimError("Invalid claim code. Please try again.");
    }
  };

  if (!board) {
    return null;
  }

  const boardBase = `/boards/${board.boardId}`;

  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-md px-4 py-6 flex flex-col gap-3">
        <BoardHeader board={board} />

        <ShareLinkCard boardId={board.boardId} joinToken={board.joinToken} />

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
            <ParticipantList participants={participants ?? []} participantCap={board.participantCap} currentParticipantId={currentParticipant?.participantId} />
          </CardContent>
        </Card>

        {currentParticipant ? (
          <>
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

            <Button asChild size="lg" className="w-full">
              <Link href={`${boardBase}/my-availability`}>
                <CalendarPlus className="size-4" />
                Add My Availability
              </Link>
            </Button>
          </>
        ) : isBoardFull ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="size-4 text-muted-foreground" />
                Board is Full
              </CardTitle>
              <CardDescription>
                This board already has {board.participantCap} participants. If
                you were already part of this board, use your claim code below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimCodeInput onReclaim={handleReclaim} />
              {reclaimError && (
                <p className="text-xs text-destructive mt-2">{reclaimError}</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Join this Board</CardTitle>
              <CardDescription>
                Enter your name to join. You{"'"}ll be able to mark your busy
                weekends next.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <form onSubmit={handleJoin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex"
                    aria-invalid={!!error}
                  />
                  {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isJoining}>
                  {isJoining ? "Joining..." : "Join Board"}
                </Button>
              </form>

              <div className="border-t pt-4 flex flex-col gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="text-muted-foreground w-full"
                  onClick={() => setShowReclaim((prev) => !prev)}
                >
                  Previously Joined?
                </Button>
                {showReclaim && (
                  <div className="flex flex-col gap-2">
                    <ClaimCodeInput onReclaim={handleReclaim} />
                    {reclaimError && (
                      <p className="text-xs text-destructive">{reclaimError}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ScreenNav boardId={board.boardId} viewRole="participant" />
    </main>
  );
}

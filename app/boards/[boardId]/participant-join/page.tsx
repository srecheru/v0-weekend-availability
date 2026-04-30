"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useBoardContext } from "@/lib/board-context";
import { useJoinBoard, useReclaimSpot } from "@/lib/hooks";
import { computeAggregation } from "@/lib/weekend-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BoardHeader } from "@/components/wab/board-header";
import { TierSummaryBar } from "@/components/wab/tier-summary-bar";
import { ParticipantList } from "@/components/wab/participant-list";
import { ClaimCodeInput } from "@/components/wab/claim-code-input";
import { AlertCircle, Loader2 } from "lucide-react";

export default function ParticipantJoinPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId as string;
  const { board, participants, weekendFridays, isBoardFull, participantJoined, isLoading, refreshSession, refreshParticipants } = useBoardContext();
  const { join, isJoining, error: joinError } = useJoinBoard(boardId);
  const { reclaim, isReclaiming, error: reclaimError } = useReclaimSpot(boardId);

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [localReclaimError, setLocalReclaimError] = useState("");
  const [showReclaim, setShowReclaim] = useState(false);

  const { summary, hasAggregation, pendingCount } = useMemo(
    () => computeAggregation(participants, weekendFridays),
    [participants, weekendFridays]
  );

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Display name is required");
      return;
    }
    setError("");
    
    const result = await join(trimmed);
    if (result) {
      refreshSession();
      refreshParticipants();
      router.push(`/boards/${boardId}/my-availability`);
    }
  };

  const handleReclaim = async (code: string) => {
    setLocalReclaimError("");
    const result = await reclaim(code);
    if (result) {
      refreshSession();
      refreshParticipants();
      if (result.state === "ADDED_AVAILABILITY") {
        router.push(`/boards/${boardId}/group-availability`);
      } else {
        router.push(`/boards/${boardId}/my-availability`);
      }
    } else {
      setLocalReclaimError("Invalid claim code. Please try again.");
    }
  };

  if (isLoading || !board) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="mx-auto max-w-md px-4 py-6 flex flex-col gap-3">
        <BoardHeader />

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

        {!participantJoined && (
          isBoardFull ? (
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
                <ClaimCodeInput onReclaim={handleReclaim} disabled={isReclaiming} />
                {(localReclaimError || reclaimError) && (
                  <p className="text-xs text-destructive mt-2">{localReclaimError || reclaimError}</p>
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
              <CardContent>
                <form onSubmit={handleJoin} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex"
                      aria-invalid={!!(error || joinError)}
                      disabled={isJoining}
                    />
                    {(error || joinError) && <p className="text-xs text-destructive">{error || joinError}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isJoining}>
                    {isJoining ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Board"
                    )}
                  </Button>
                </form>

                <div className="mt-4 border-t pt-4 flex flex-col gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground w-full"
                    onClick={() => setShowReclaim((prev) => !prev)}
                  >
                    Previously Joined?
                  </Button>
                  {showReclaim && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs text-muted-foreground">
                        Enter the claim code you were given when you first joined.
                      </p>
                      <ClaimCodeInput onReclaim={handleReclaim} disabled={isReclaiming} />
                      {(localReclaimError || reclaimError) && (
                        <p className="text-xs text-destructive">{localReclaimError || reclaimError}</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </main>
  );
}

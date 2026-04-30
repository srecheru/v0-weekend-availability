"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBoardContext } from "@/lib/board-context";
import { useJoinBoard } from "@/lib/hooks";
import { computeAggregation } from "@/lib/weekend-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BoardHeader } from "@/components/wab/board-header";
import { ShareLinkCard } from "@/components/wab/share-link-card";
import { TierSummaryBar } from "@/components/wab/tier-summary-bar";
import { ParticipantList } from "@/components/wab/participant-list";
import { CalendarPlus, KeyRound, Loader2 } from "lucide-react";

export default function CreatorJoinPage() {
  const params = useParams();
  const boardId = params.boardId as string;
  const { board, participants, weekendFridays, currentParticipant, isLoading, refreshSession, refreshParticipants } = useBoardContext();
  const { join, isJoining, error: joinError } = useJoinBoard(boardId);
  
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { summary, hasAggregation, pendingCount } = useMemo(
    () => computeAggregation(participants, weekendFridays),
    [participants, weekendFridays]
  );

  const boardBase = `/boards/${boardId}`;
  
  // Creator hasn't joined the board yet
  const creatorNeedsToJoin = !currentParticipant;

  const handleCreatorJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name");
      return;
    }
    setError("");
    
    const result = await join(trimmed);
    if (result) {
      refreshSession();
      refreshParticipants();
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
      <div className="mx-auto max-w-md px-4 py-6 flex flex-col gap-5">
        <BoardHeader />

        <ShareLinkCard />

        {creatorNeedsToJoin && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Join Your Board</CardTitle>
              <CardDescription>
                Enter your name to join the board you created. You{"'"}ll then be able to add your availability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatorJoin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="creator-name">Your Name</Label>
                  <Input
                    id="creator-name"
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
            </CardContent>
          </Card>
        )}

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

        {currentParticipant && (
          <Button asChild size="lg" className="w-full">
            <Link href={`${boardBase}/my-availability`}>
              <CalendarPlus className="size-4" />
              Add My Availability
            </Link>
          </Button>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePrototype } from "@/lib/prototype-context";
import { computeAggregation } from "@/lib/weekend-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BoardHeader } from "@/components/wab/board-header";
import { TierSummaryBar } from "@/components/wab/tier-summary-bar";
import { ParticipantList } from "@/components/wab/participant-list";
import { ClaimCodeInput } from "@/components/wab/claim-code-input";
import { ScenarioSwitcher } from "@/components/wab/scenario-switcher";
import { ScreenNav } from "@/components/wab/screen-nav";
import { AlertCircle } from "lucide-react";

export default function ParticipantJoinPage() {
  const router = useRouter();
  const { board, participants, weekendFridays, isBoardFull, addParticipant } =
    usePrototype();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [reclaimError, setReclaimError] = useState("");
  const [showReclaim, setShowReclaim] = useState(false);

  const { summary, hasAggregation, pendingCount } = useMemo(
    () => computeAggregation(participants, weekendFridays),
    [participants, weekendFridays]
  );

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Display name is required");
      return;
    }
    if (participants.some((p) => p.displayName.toLowerCase() === trimmed.toLowerCase())) {
      setError("That name is already taken. Use your claim code to reclaim.");
      return;
    }
    setError("");
    addParticipant(trimmed);
    router.push(`/boards/${board.boardId}/my-availability`);
  };

  const handleReclaim = (code: string) => {
    const found = participants.find(
      (p) => p.claimCode.toLowerCase() === code.toLowerCase()
    );
    if (!found) {
      setReclaimError("Invalid claim code. Please try again.");
      return;
    }
    setReclaimError("");
    if (found.state === "ADDED_AVAILABILITY") {
      router.push(`/boards/${board.boardId}/group-availability`);
    } else {
      router.push(`/boards/${board.boardId}/my-availability`);
    }
  };

  const boardBase = `/boards/${board.boardId}`;

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

        {isBoardFull ? (
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
            <CardContent>
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
                <Button type="submit" className="w-full">
                  Join Board
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

      <ScreenNav />
      <ScenarioSwitcher />
    </main>
  );
}

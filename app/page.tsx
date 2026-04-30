"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrototype } from "@/lib/prototype-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScenarioSwitcher } from "@/components/wab/scenario-switcher";
import { ScreenNav } from "@/components/wab/screen-nav";
import { CalendarDays } from "lucide-react";

export default function CreateBoardPage() {
  const router = useRouter();
  const { board, updateBoardName, markBoardCreated } = usePrototype();
  const [boardName, setBoardName] = useState("");
  const [duration, setDuration] = useState<string>("3");
  const [participants, setParticipants] = useState<string>("");
  const [error, setError] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim()) {
      setError("Board name is required");
      return;
    }
    if (!participants) {
      setError("Number of participants is required");
      return;
    }
    setError("");
    updateBoardName(boardName.trim());
    markBoardCreated();
    router.push(`/boards/${board.boardId}/creator-join`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 pb-20">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-primary text-primary-foreground">
            <CalendarDays className="size-6" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground text-center text-balance">
            Weekend Availability Board
          </h1>
          <p className="text-sm text-muted-foreground text-center text-pretty max-w-xs">
            Find the best weekends to get your group together.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create a Group Board</CardTitle>
            <CardDescription>
              Set up a new board and share it with your group.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="board-name">Board Name</Label>
                <Input
                  id="board-name"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="e.g. Summer Hangouts"
                  aria-invalid={!!error}
                />
                {error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="participants">Participants</Label>
                <Select value={participants} onValueChange={setParticipants}>
                  <SelectTrigger id="participants" className="w-full">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How many people will be coordinating (1-5).
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="duration">Planning Window</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration" className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Next 1 month</SelectItem>
                    <SelectItem value="3">Next 3 months</SelectItem>
                    <SelectItem value="6">Next 6 months</SelectItem>
                    <SelectItem value="12">Next 12 months</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Full calendar months from today.
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create Board
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <ScreenNav />
      <ScenarioSwitcher />
    </main>
  );
}

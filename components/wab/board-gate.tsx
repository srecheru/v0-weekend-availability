"use client";

import Link from "next/link";
import { usePrototype } from "@/lib/prototype-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { ScreenNav } from "@/components/wab/screen-nav";
import { ScenarioSwitcher } from "@/components/wab/scenario-switcher";

/**
 * Gate for creator-side pages. When the board hasn't been "created" yet
 * in the prototype state, this renders a friendly prompt to go create one
 * instead of the page content.
 */
export function BoardGate({ children }: { children: React.ReactNode }) {
  const { boardCreated, viewRole } = usePrototype();

  // Only gate the creator flow. Participant pages have their own join gating.
  if (viewRole === "creator" && !boardCreated) {
    return (
      <main className="min-h-screen pb-20">
        <div className="mx-auto max-w-md px-4 py-6 flex flex-col items-center justify-center gap-4 min-h-[60vh]">
          <div className="rounded-full bg-muted p-4">
            <CalendarPlus className="size-6 text-muted-foreground" />
          </div>
          <Card className="w-full">
            <CardContent className="flex flex-col items-center gap-3 text-center pt-6">
              <h2 className="text-lg font-semibold text-foreground text-balance">
                No board yet
              </h2>
              <p className="text-sm text-muted-foreground text-balance">
                Create a group board first, then you can share it, add your
                availability, and see the group view.
              </p>
              <Button asChild className="w-full mt-2">
                <Link href="/">Create a Group Board</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <ScreenNav />
        <ScenarioSwitcher />
      </main>
    );
  }

  return <>{children}</>;
}

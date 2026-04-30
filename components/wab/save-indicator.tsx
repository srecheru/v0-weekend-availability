"use client";

import { usePrototype } from "@/lib/prototype-context";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SaveIndicator() {
  const { saveStatus } = usePrototype();

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium transition-opacity duration-300",
        saveStatus === "idle" ? "opacity-0" : "opacity-100"
      )}
      aria-live="polite"
    >
      {saveStatus === "saving" && (
        <>
          <Loader2 className="size-3 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Saving...</span>
        </>
      )}
      {saveStatus === "saved" && (
        <>
          <Check className="size-3 text-tier-everyone-free" />
          <span className="text-tier-everyone-free-foreground">Saved</span>
        </>
      )}
    </div>
  );
}

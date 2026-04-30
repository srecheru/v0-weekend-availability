"use client";

import { useState } from "react";
import { usePrototype, type ScenarioName, type ViewRole } from "@/lib/prototype-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Settings2, X } from "lucide-react";

const SCENARIOS: { name: ScenarioName; label: string; desc: string }[] = [
  {
    name: "empty",
    label: "Empty",
    desc: "0 participants, no availability",
  },
  {
    name: "partial",
    label: "Partial",
    desc: "3 of 5 joined, 2 with availability",
  },
  {
    name: "full",
    label: "Full",
    desc: "5 of 5 joined, all with availability",
  },
  {
    name: "board-full",
    label: "Board Full",
    desc: "5 of 5 joined, new user blocked",
  },
];

export function ScenarioSwitcher() {
  const { scenarioName, setScenario, viewRole, setViewRole } = usePrototype();
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-2 bg-card border rounded-xl shadow-lg p-3 w-72">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Prototype Controls
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(false)}
            >
              <X className="size-3.5" />
            </Button>
          </div>
          <div className="mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Viewing as
            </span>
            <div className="flex rounded-lg bg-muted p-0.5 gap-0.5 mt-1">
              {(["creator", "participant"] as ViewRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setViewRole(role)}
                  className={cn(
                    "flex-1 text-center text-xs font-medium py-1.5 rounded-md transition-colors capitalize",
                    viewRole === role
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Scenario
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {SCENARIOS.map((s) => (
              <button
                key={s.name}
                type="button"
                onClick={() => {
                  setScenario(s.name);
                  setOpen(false);
                }}
                className={cn(
                  "flex flex-col text-left rounded-lg px-3 py-2 transition-colors",
                  scenarioName === s.name
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent text-foreground"
                )}
              >
                <span className="text-sm font-medium">{s.label}</span>
                <span
                  className={cn(
                    "text-xs",
                    scenarioName === s.name
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  )}
                >
                  {s.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(!open)}
        className="rounded-full size-10 shadow-lg bg-card"
        aria-label="Toggle scenario switcher"
      >
        <Settings2 className="size-4" />
      </Button>
    </div>
  );
}

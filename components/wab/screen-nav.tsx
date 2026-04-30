"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

// Tab nav for switching between My Availability and Group View within the board
export function AvailabilityTabs({ activeTab }: { activeTab: "my" | "group" }) {
  const params = useParams();
  const boardId = params.boardId as string;
  const boardBase = `/boards/${boardId}`;

  return (
    <div className="flex rounded-lg bg-muted p-1 gap-1">
      <Link
        href={`${boardBase}/my-availability`}
        className={cn(
          "flex-1 text-center text-sm font-medium py-1.5 rounded-md transition-colors",
          activeTab === "my"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        My Availability
      </Link>
      <Link
        href={`${boardBase}/group-availability`}
        className={cn(
          "flex-1 text-center text-sm font-medium py-1.5 rounded-md transition-colors",
          activeTab === "group"
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Group View
      </Link>
    </div>
  );
}

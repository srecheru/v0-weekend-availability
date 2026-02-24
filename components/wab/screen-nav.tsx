"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendarCheck, Users, Home, UserPlus, Share2 } from "lucide-react";

export function ScreenNav({
  boardId,
  viewRole,
}: {
  boardId: string;
  viewRole: "creator" | "participant";
}) {
  const pathname = usePathname();
  const boardBase = `/boards/${boardId}`;

  const creatorLinks = [
    {
      href: "/",
      label: "Create",
      icon: Home,
    },
    {
      href: `${boardBase}/creator-join`,
      label: "Share",
      icon: Share2,
    },
    {
      href: `${boardBase}/my-availability`,
      label: "My Avail.",
      icon: CalendarCheck,
    },
    {
      href: `${boardBase}/group-availability`,
      label: "Group",
      icon: Users,
    },
  ];

  const participantLinks = [
    {
      href: `${boardBase}/participant-join`,
      label: "Join",
      icon: UserPlus,
    },
    {
      href: `${boardBase}/my-availability`,
      label: "My Avail.",
      icon: CalendarCheck,
    },
    {
      href: `${boardBase}/group-availability`,
      label: "Group",
      icon: Users,
    },
  ];

  const links = viewRole === "creator" ? creatorLinks : participantLinks;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t"
      aria-label="Screen navigation"
    >
      <div className="mx-auto max-w-lg flex items-center justify-around py-1.5 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 rounded-md transition-colors text-center min-w-0",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span className="text-[10px] font-medium leading-none truncate max-w-[56px]">
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Tab nav for switching between My Availability and Group View within the board
export function AvailabilityTabs({ activeTab }: { activeTab: "my" | "group" }) {
  // boardId will come from the current route
  const pathname = usePathname();
  const match = pathname.match(/\/boards\/([^/]+)/);
  const boardId = match?.[1] ?? "";
  const boardBase = boardId ? `/boards/${boardId}` : "";

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

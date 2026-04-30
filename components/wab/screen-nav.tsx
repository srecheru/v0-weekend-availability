"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useBoardContext } from "@/lib/board-context";
import { Home, Share2, CalendarCheck, Users, UserPlus } from "lucide-react";

export function ScreenNav() {
  const params = useParams();
  const pathname = usePathname();
  const boardId = params.boardId as string;
  const boardBase = `/boards/${boardId}`;
  
  // Try to use board context if available, otherwise show basic nav
  let participantJoined = false;
  try {
    const ctx = useBoardContext();
    participantJoined = ctx.participantJoined;
  } catch {
    // Not within BoardProvider, show basic nav
  }

  // Determine if we're in creator or participant flow based on pathname
  const isCreatorFlow = pathname.includes("/creator-join") || pathname === "/";
  
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
      label: participantJoined ? "Board" : "Join",
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

  const links = isCreatorFlow ? creatorLinks : participantLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-md flex justify-around py-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || 
            (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

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

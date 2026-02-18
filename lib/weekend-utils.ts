import {
  addMonths,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  isFriday,
  addDays,
  format,
  isBefore,
  isAfter,
  isSameDay,
  parseISO,
} from "date-fns";

// ---------- Types ----------

export type ParticipantState =
  | "JOINED_NOT_INITIATED"
  | "INITIATED_ZERO_BUSY"
  | "ADDED_AVAILABILITY";

export type TierType =
  | "EVERYONE_FREE"
  | "MAJORITY_FREE"
  | "MIXED_NOT_MAJORITY"
  | "ALL_BUSY";

export interface Board {
  boardId: string;
  boardName: string;
  timezone: string;
  durationMonths: 1 | 3 | 6 | 12;
  dateRangeStart: string; // ISO date
  dateRangeEnd: string; // ISO date
  participantCap: number;
  joinToken: string;
  createdAt: string;
}

export interface Participant {
  participantId: string;
  boardId: string;
  displayName: string;
  claimCode: string;
  state: ParticipantState;
  busyWeekendFridays: string[]; // ISO date strings
  joinedAt: string;
  lastUpdatedAt: string;
}

export interface WeekendRow {
  friday: string; // ISO date YYYY-MM-DD
  tier: TierType;
  freeCount: number;
  busyCount: number;
  pendingCount: number;
  freeNames: string[];
  busyNames: string[];
}

export interface AggregationSummary {
  everyoneFreeCount: number;
  majorityFreeCount: number;
  mixedNotMajorityCount: number;
  allBusyCount: number;
  totalConsideredParticipants: number;
}

// ---------- Weekend Computation ----------

export function computeDateRange(durationMonths: 1 | 3 | 6 | 12): {
  start: Date;
  end: Date;
} {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(addMonths(now, durationMonths - 1));
  return { start, end };
}

export function getWeekendsInRange(start: Date, end: Date): Date[] {
  // Get all weeks starting on Friday within (and slightly overlapping) the range
  const weeks = eachWeekOfInterval(
    { start, end },
    { weekStartsOn: 5 } // Friday
  );

  // Filter: keep only Fridays whose Fri-Sun block overlaps the date range
  return weeks.filter((friday) => {
    if (!isFriday(friday)) return false;
    const sunday = addDays(friday, 2);
    // Weekend overlaps if Friday <= end AND Sunday >= start
    return (
      (isBefore(friday, end) || isSameDay(friday, end)) &&
      (isAfter(sunday, start) || isSameDay(sunday, start))
    );
  });
}

export function formatFridayDate(fridayStr: string): string {
  const friday = parseISO(fridayStr);
  return format(friday, "MMM d");
}

export function formatWeekendRange(fridayStr: string): string {
  const friday = parseISO(fridayStr);
  const sunday = addDays(friday, 2);
  const friMonth = format(friday, "MMM");
  const sunMonth = format(sunday, "MMM");
  if (friMonth === sunMonth) {
    return `${format(friday, "MMM d")} - ${format(sunday, "d")}`;
  }
  return `${format(friday, "MMM d")} - ${format(sunday, "MMM d")}`;
}

export function fridayToIso(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// ---------- Tier Computation ----------

export function computeTier(
  freeCount: number,
  busyCount: number,
  totalAdded: number
): TierType {
  if (totalAdded === 0) return "ALL_BUSY"; // fallback, shouldn't happen with guard
  if (busyCount === 0) return "EVERYONE_FREE";
  if (busyCount === totalAdded) return "ALL_BUSY";
  const freePercent = freeCount / totalAdded;
  if (freePercent > 0.5) return "MAJORITY_FREE";
  return "MIXED_NOT_MAJORITY";
}

export function computeAggregation(
  participants: Participant[],
  weekendFridays: string[]
): {
  weekends: WeekendRow[];
  summary: AggregationSummary;
  hasAggregation: boolean;
  pendingCount: number;
} {
  const addedParticipants = participants.filter(
    (p) => p.state === "ADDED_AVAILABILITY"
  );
  const pendingParticipants = participants.filter(
    (p) => p.state !== "ADDED_AVAILABILITY"
  );
  const pendingCount = pendingParticipants.length;
  const totalAdded = addedParticipants.length;

  if (totalAdded === 0) {
    return {
      weekends: weekendFridays.map((f) => ({
        friday: f,
        tier: "ALL_BUSY" as TierType,
        freeCount: 0,
        busyCount: 0,
        pendingCount,
        freeNames: [],
        busyNames: [],
      })),
      summary: {
        everyoneFreeCount: 0,
        majorityFreeCount: 0,
        mixedNotMajorityCount: 0,
        allBusyCount: 0,
        totalConsideredParticipants: 0,
      },
      hasAggregation: false,
      pendingCount,
    };
  }

  const weekendRows: WeekendRow[] = weekendFridays.map((friday) => {
    const busyNames: string[] = [];
    const freeNames: string[] = [];

    addedParticipants.forEach((p) => {
      if (p.busyWeekendFridays.includes(friday)) {
        busyNames.push(p.displayName);
      } else {
        freeNames.push(p.displayName);
      }
    });

    const tier = computeTier(freeNames.length, busyNames.length, totalAdded);

    return {
      friday,
      tier,
      freeCount: freeNames.length,
      busyCount: busyNames.length,
      pendingCount,
      freeNames,
      busyNames,
    };
  });

  // Sort by tier priority then chronological
  const tierOrder: Record<TierType, number> = {
    EVERYONE_FREE: 0,
    MAJORITY_FREE: 1,
    MIXED_NOT_MAJORITY: 2,
    ALL_BUSY: 3,
  };

  const sortedWeekends = [...weekendRows].sort((a, b) => {
    const tierDiff = tierOrder[a.tier] - tierOrder[b.tier];
    if (tierDiff !== 0) return tierDiff;
    return a.friday.localeCompare(b.friday);
  });

  const summary: AggregationSummary = {
    everyoneFreeCount: sortedWeekends.filter(
      (w) => w.tier === "EVERYONE_FREE"
    ).length,
    majorityFreeCount: sortedWeekends.filter(
      (w) => w.tier === "MAJORITY_FREE"
    ).length,
    mixedNotMajorityCount: sortedWeekends.filter(
      (w) => w.tier === "MIXED_NOT_MAJORITY"
    ).length,
    allBusyCount: sortedWeekends.filter((w) => w.tier === "ALL_BUSY").length,
    totalConsideredParticipants: totalAdded,
  };

  return {
    weekends: sortedWeekends,
    summary,
    hasAggregation: true,
    pendingCount,
  };
}

// ---------- Tier Display Helpers ----------

export const TIER_CONFIG: Record<
  TierType,
  { label: string; className: string; calendarClassName: string }
> = {
  EVERYONE_FREE: {
    label: "Everyone Free",
    className: "bg-tier-everyone-free text-tier-everyone-free-foreground",
    calendarClassName: "bg-tier-everyone-free/20 text-tier-everyone-free-foreground",
  },
  MAJORITY_FREE: {
    label: "Majority Free",
    className: "bg-tier-majority-free text-tier-majority-free-foreground",
    calendarClassName: "bg-tier-majority-free/20 text-tier-majority-free-foreground",
  },
  MIXED_NOT_MAJORITY: {
    label: "Mixed",
    className: "bg-tier-mixed text-tier-mixed-foreground",
    calendarClassName: "bg-tier-mixed/20 text-tier-mixed-foreground",
  },
  ALL_BUSY: {
    label: "All Busy",
    className: "bg-tier-all-busy text-tier-all-busy-foreground",
    calendarClassName: "bg-tier-all-busy/20 text-tier-all-busy-foreground",
  },
};

export function getWeekendCopy(row: WeekendRow, hasAggregation: boolean): string {
  if (!hasAggregation) return "";
  if (row.busyCount === 0) return "Everyone Free";
  if (row.freeCount === 0) return "All Busy";
  return `${row.freeCount} Free \u00b7 ${row.busyCount} Busy`;
}

export function getPendingSuffix(pendingCount: number): string {
  if (pendingCount === 0) return "";
  return ` \u00b7 ${pendingCount} Pending`;
}

"use client";

import { useMemo, useState } from "react";
import {
  parseISO,
  isFriday,
  isSaturday,
  isSunday,
  format,
  addDays,
  addMonths,
  subMonths,
  getDay,
  startOfMonth,
  startOfDay,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isBefore,
  isAfter,
} from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TIER_CONFIG, type TierType, type WeekendRow } from "@/lib/weekend-utils";

// ---------- Shared Helpers ----------

function getFridayForDate(date: Date, weekendFridays: string[]): string | null {
  const dayOfWeek = getDay(date);
  let friday: Date;
  if (dayOfWeek === 5) friday = date;
  else if (dayOfWeek === 6) friday = addDays(date, -1);
  else if (dayOfWeek === 0) friday = addDays(date, -2);
  else return null;
  const iso = format(friday, "yyyy-MM-dd");
  return weekendFridays.includes(iso) ? iso : null;
}

function getCalendarDays(month: Date) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: calStart, end: calEnd });
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ---------- Calendar Shell ----------

function CalendarShell({
  rangeStart,
  rangeEnd,
  renderDay,
}: {
  rangeStart: Date;
  rangeEnd: Date;
  renderDay: (date: Date, inMonth: boolean) => React.ReactNode;
}) {
  // Default to today's month, clamped within the board's date range
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = startOfMonth(new Date());
    if (isBefore(now, startOfMonth(rangeStart))) return rangeStart;
    if (isAfter(now, startOfMonth(rangeEnd))) return rangeEnd;
    return now;
  });
  const days = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);

  const canGoBack = !isBefore(subMonths(startOfMonth(currentMonth), 0), rangeStart) &&
    !isSameMonth(currentMonth, rangeStart);
  const canGoForward = !isAfter(addMonths(startOfMonth(currentMonth), 0), rangeEnd) &&
    !isSameMonth(currentMonth, rangeEnd);

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          disabled={!canGoBack}
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <span className="text-sm font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          disabled={!canGoForward}
          aria-label="Next month"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5 gap-x-0">
        {days.map((date, i) => {
          const inMonth = isSameMonth(date, currentMonth);
          return (
            <div key={i} className="px-0">
              {renderDay(date, inMonth)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Personal Calendar (My Availability) ----------

interface PersonalCalendarProps {
  dateRangeStart: string;
  dateRangeEnd: string;
  busyFridays: string[];
  weekendFridays: string[];
  onToggleWeekend: (fridayIso: string) => void;
}

export function PersonalCalendar({
  dateRangeStart,
  dateRangeEnd,
  busyFridays,
  weekendFridays,
  onToggleWeekend,
}: PersonalCalendarProps) {
  const start = parseISO(dateRangeStart);
  const end = parseISO(dateRangeEnd);
  const today = startOfDay(new Date());

  return (
    <CalendarShell
      rangeStart={start}
      rangeEnd={end}
      renderDay={(date, inMonth) => {
        const isWeekend = isFriday(date) || isSaturday(date) || isSunday(date);
        const fridayIso = getFridayForDate(date, weekendFridays);
        const isBusy = fridayIso ? busyFridays.includes(fridayIso) : false;
        const isWeekendDay = isWeekend && fridayIso !== null;
        // A weekend is in the past if its Sunday (last day) is before today
        const isPast = fridayIso ? isBefore(addDays(parseISO(fridayIso), 2), today) : isBefore(date, today);

        if (!inMonth) {
          return (
            <div className="flex items-center justify-center w-full aspect-square text-sm text-muted-foreground/20">
              {format(date, "d")}
            </div>
          );
        }

        if (!isWeekendDay) {
          return (
            <div className={cn(
              "flex items-center justify-center w-full aspect-square text-sm",
              isPast ? "text-muted-foreground/20" : "text-muted-foreground/30"
            )}>
              {format(date, "d")}
            </div>
          );
        }

        // Past weekends are shown dimmed and not clickable
        if (isPast) {
          return (
            <div
              className={cn(
                "flex items-center justify-center w-full aspect-square text-sm text-muted-foreground/30",
                isFriday(date) && "rounded-l-lg",
                isSunday(date) && "rounded-r-lg",
              )}
            >
              {format(date, "d")}
            </div>
          );
        }

        return (
          <button
            type="button"
            onClick={() => fridayIso && onToggleWeekend(fridayIso)}
            className={cn(
              "flex items-center justify-center w-full aspect-square text-sm font-medium transition-colors cursor-pointer",
              !isBusy && "bg-tier-everyone-free/15 text-foreground hover:bg-tier-everyone-free/30",
              isBusy && "bg-tier-busy-personal text-tier-busy-personal-foreground",
              isFriday(date) && "rounded-l-lg",
              isSunday(date) && "rounded-r-lg",
            )}
          >
            {format(date, "d")}
          </button>
        );
      }}
    />
  );
}

// ---------- Group Calendar (Group Availability) ----------

interface GroupCalendarProps {
  dateRangeStart: string;
  dateRangeEnd: string;
  weekends: WeekendRow[];
  hasAggregation: boolean;
}

export function GroupCalendar({
  dateRangeStart,
  dateRangeEnd,
  weekends,
  hasAggregation,
}: GroupCalendarProps) {
  const start = parseISO(dateRangeStart);
  const end = parseISO(dateRangeEnd);
  const today = startOfDay(new Date());

  const tierMap = useMemo(() => {
    const map = new Map<string, TierType>();
    if (hasAggregation) {
      weekends.forEach((w) => map.set(w.friday, w.tier));
    }
    return map;
  }, [weekends, hasAggregation]);

  const weekendFridays = useMemo(
    () => weekends.map((w) => w.friday),
    [weekends]
  );

  return (
    <CalendarShell
      rangeStart={start}
      rangeEnd={end}
      renderDay={(date, inMonth) => {
        const isWeekend = isFriday(date) || isSaturday(date) || isSunday(date);
        const fridayIso = getFridayForDate(date, weekendFridays);
        const tier = fridayIso ? tierMap.get(fridayIso) : undefined;
        const isWeekendDay = isWeekend && fridayIso !== null;
        const isPast = fridayIso ? isBefore(addDays(parseISO(fridayIso), 2), today) : isBefore(date, today);

        if (!inMonth) {
          return (
            <div className="flex items-center justify-center w-full aspect-square text-sm text-muted-foreground/20">
              {format(date, "d")}
            </div>
          );
        }

        if (!isWeekendDay || isPast) {
          return (
            <div className={cn(
              "flex items-center justify-center w-full aspect-square text-sm",
              isPast ? "text-muted-foreground/20" : "text-muted-foreground/30"
            )}>
              {format(date, "d")}
            </div>
          );
        }

        let colorClass = "bg-muted/50 text-muted-foreground";
        if (tier && hasAggregation) {
          colorClass = TIER_CONFIG[tier].calendarClassName;
        }

        return (
          <div
            className={cn(
              "flex items-center justify-center w-full aspect-square text-sm font-medium",
              colorClass,
              isFriday(date) && "rounded-l-lg",
              isSunday(date) && "rounded-r-lg",
            )}
          >
            {format(date, "d")}
          </div>
        );
      }}
    />
  );
}

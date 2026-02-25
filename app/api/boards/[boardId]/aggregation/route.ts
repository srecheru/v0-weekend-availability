import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { Participant } from "@/lib/weekend-utils";
import {
  computeAggregation,
  getWeekendsInRange,
  fridayToIso,
} from "@/lib/weekend-utils";
import { parseISO } from "date-fns";

interface RouteContext {
  params: Promise<{ boardId: string }>;
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const { boardId } = await context.params;

  const boardRows =
    await sql/* sql */`select
      id,
      date_range_start,
      date_range_end
    from boards
    where id = ${boardId}`;

  if (boardRows.length === 0) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const board = boardRows[0] as {
    id: string;
    date_range_start: string;
    date_range_end: string;
  };

  // Use date-only substrings to avoid UTC-to-local timezone shift
  const toDateOnly = (v: unknown): string => {
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    if (typeof v === "string") return v.slice(0, 10);
    return String(v);
  };
  const start = parseISO(toDateOnly(board.date_range_start));
  const end = parseISO(toDateOnly(board.date_range_end));
  const weekendDates = getWeekendsInRange(start, end);
  const weekendFridays = weekendDates.map(fridayToIso);

  const participantRows =
    await sql/* sql */`select
      p.id,
      p.board_id,
      p.display_name,
      p.claim_code,
      p.state,
      p.joined_at,
      p.last_updated_at,
      coalesce(array_agg(bw.friday::text) filter (where bw.friday is not null), '{}') as busy_fridays
    from participants p
    left join busy_weekends bw on bw.participant_id = p.id
    where p.board_id = ${boardId}
    group by p.id
    order by p.joined_at asc`;

  const participants: Participant[] = participantRows.map((row) => {
    const r = row as {
      id: string;
      board_id: string;
      display_name: string;
      claim_code: string;
      state: string;
      joined_at: string;
      last_updated_at: string;
      busy_fridays: string[];
    };

    return {
      participantId: r.id,
      boardId: r.board_id,
      displayName: r.display_name,
      claimCode: r.claim_code,
      state: r.state as Participant["state"],
      busyWeekendFridays: (r.busy_fridays ?? []).map(toDateOnly),
      joinedAt: r.joined_at,
      lastUpdatedAt: r.last_updated_at,
    };
  });

  const result = computeAggregation(participants, weekendFridays);

  return NextResponse.json(result);
}


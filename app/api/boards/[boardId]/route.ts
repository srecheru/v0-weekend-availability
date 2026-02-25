import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { Board, Participant } from "@/lib/weekend-utils";
import { getParticipantCookieName } from "@/lib/session";

interface RouteContext {
  params: Promise<{ boardId: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { boardId } = await context.params;

  const boardRows =
    await sql/* sql */`select
      id,
      name,
      timezone,
      duration_months,
      date_range_start,
      date_range_end,
      participant_cap,
      join_token,
      created_at
    from boards
    where id = ${boardId}`;

  if (boardRows.length === 0) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const b = boardRows[0] as {
    id: string;
    name: string;
    timezone: string;
    duration_months: number;
    date_range_start: string;
    date_range_end: string;
    participant_cap: number;
    join_token: string;
    created_at: string;
  };

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

  // Strip timestamps to date-only strings (YYYY-MM-DD) so parseISO on the
  // client creates local-midnight dates instead of UTC-midnight (which can
  // shift to the previous day in US timezones).
  const toDateOnly = (iso: string) => iso.slice(0, 10);

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

  const board: Board = {
    boardId: b.id,
    boardName: b.name,
    timezone: b.timezone,
    durationMonths: b.duration_months as Board["durationMonths"],
    dateRangeStart: toDateOnly(b.date_range_start),
    dateRangeEnd: toDateOnly(b.date_range_end),
    participantCap: b.participant_cap,
    joinToken: b.join_token,
    createdAt: b.created_at,
  };

  const cookieName = getParticipantCookieName(boardId);
  const participantCookie = req.cookies.get(cookieName);

  const currentParticipantId = participantCookie?.value ?? null;

  return NextResponse.json({
    board,
    participants,
    currentParticipantId,
  });
}


import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { Participant } from "@/lib/weekend-utils";
import { getParticipantCookieName, PARTICIPANT_COOKIE_OPTIONS } from "@/lib/session";

interface RouteContext {
  params: Promise<{ boardId: string }>;
}

interface ReclaimBody {
  claimCode?: string;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { boardId } = await context.params;
  const body = (await req.json()) as ReclaimBody;
  const claimCode = body.claimCode?.trim();

  if (!claimCode) {
    return NextResponse.json(
      { error: "Please enter your claim code" },
      { status: 400 }
    );
  }

  const rows =
    await sql/* sql */`select
      id,
      board_id,
      display_name,
      claim_code,
      state,
      joined_at,
      last_updated_at
    from participants
    where board_id = ${boardId}
      and lower(claim_code) = lower(${claimCode})
    limit 1`;

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Invalid claim code. Please try again." },
      { status: 404 }
    );
  }

  const r = rows[0] as {
    id: string;
    board_id: string;
    display_name: string;
    claim_code: string;
    state: string;
    joined_at: string;
    last_updated_at: string;
  };

  const busyRows =
    await sql/* sql */`select friday::text as friday from busy_weekends where participant_id = ${r.id} order by friday asc`;

  const busyWeekendFridays = busyRows.map(
    (bw) => (bw as { friday: string }).friday
  );

  const participant: Participant = {
    participantId: r.id,
    boardId: r.board_id,
    displayName: r.display_name,
    claimCode: r.claim_code,
    state: r.state as Participant["state"],
    busyWeekendFridays,
    joinedAt: r.joined_at,
    lastUpdatedAt: r.last_updated_at,
  };

  const cookieName = getParticipantCookieName(boardId);
  const res = NextResponse.json({ participant });
  res.cookies.set(cookieName, participant.participantId, {
    ...PARTICIPANT_COOKIE_OPTIONS,
    path: `/boards/${boardId}`,
  });

  return res;
}


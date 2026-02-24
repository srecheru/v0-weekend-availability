import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { Participant } from "@/lib/weekend-utils";
import { getParticipantCookieName } from "@/lib/session";

interface RouteContext {
  params: Promise<{ boardId: string }>;
}

interface AvailabilityBody {
  busyWeekendFridays?: string[];
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { boardId } = await context.params;
  const body = (await req.json()) as AvailabilityBody;
  const busyWeekendFridays = body.busyWeekendFridays ?? [];

  const cookieName = getParticipantCookieName(boardId);
  const participantCookie = req.cookies.get(cookieName);

  if (!participantCookie?.value) {
    return NextResponse.json(
      { error: "Not joined on this board" },
      { status: 401 }
    );
  }

  const participantId = participantCookie.value;

  const participantRows =
    await sql/* sql */`select
      id,
      board_id,
      state,
      joined_at,
      last_updated_at
    from participants
    where id = ${participantId} and board_id = ${boardId}
    limit 1`;

  if (participantRows.length === 0) {
    return NextResponse.json(
      { error: "Participant not found for this board" },
      { status: 404 }
    );
  }

  const participantInfo = participantRows[0] as {
    id: string;
    board_id: string;
    state: string;
    joined_at: string;
    last_updated_at: string;
  };

  await sql/* sql */`delete from busy_weekends where participant_id = ${participantId}`;

  if (busyWeekendFridays.length > 0) {
    const values = busyWeekendFridays
      .map((friday) => sql`(${participantId}, ${friday}::date)`)
      .reduce((acc, val) => sql`${acc}, ${val}`);
    await sql`insert into busy_weekends (participant_id, friday) values ${values}`;
  }

  const newState: Participant["state"] =
    busyWeekendFridays.length > 0 || participantInfo.state === "ADDED_AVAILABILITY"
      ? "ADDED_AVAILABILITY"
      : "INITIATED_ZERO_BUSY";

  const updatedRows =
    await sql/* sql */`update participants
      set state = ${newState},
          last_updated_at = now()
      where id = ${participantId}
      returning
        id,
        board_id,
        display_name,
        claim_code,
        state,
        joined_at,
        last_updated_at`;

  const r = updatedRows[0] as {
    id: string;
    board_id: string;
    display_name: string;
    claim_code: string;
    state: string;
    joined_at: string;
    last_updated_at: string;
  };

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

  return NextResponse.json({ participant });
}


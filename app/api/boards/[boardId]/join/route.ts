import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { Participant } from "@/lib/weekend-utils";
import { getParticipantCookieName, PARTICIPANT_COOKIE_OPTIONS } from "@/lib/session";

interface RouteContext {
  params: { boardId: string };
}

const CLAIM_WORDS = [
  "mountain",
  "sunset",
  "ocean",
  "forest",
  "meadow",
  "canyon",
  "thunder",
  "glacier",
  "harbor",
  "breeze",
] as const;

interface JoinBody {
  displayName?: string;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { boardId } = context.params;
  const body = (await req.json()) as JoinBody;
  const displayName = body.displayName?.trim();

  if (!displayName) {
    return NextResponse.json(
      { error: "Display name is required" },
      { status: 400 }
    );
  }

  const boardRows =
    await sql/* sql */`select participant_cap from boards where id = ${boardId}`;

  if (boardRows.length === 0) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const { participant_cap } = boardRows[0] as { participant_cap: number };

  const participantCountRows =
    await sql/* sql */`select count(*)::int as count from participants where board_id = ${boardId}`;
  const { count } = participantCountRows[0] as { count: number };

  if (count >= participant_cap) {
    return NextResponse.json(
      { error: "Board is full" },
      { status: 400 }
    );
  }

  const existingNameRows =
    await sql/* sql */`select 1 from participants where board_id = ${boardId} and lower(display_name) = lower(${displayName}) limit 1`;

  if (existingNameRows.length > 0) {
    return NextResponse.json(
      {
        error:
          "That name is already taken. Use your claim code to reclaim.",
      },
      { status: 400 }
    );
  }

  const claimIndexRows =
    await sql/* sql */`select count(*)::int as count from participants where board_id = ${boardId}`;
  const { count: existingCount } = claimIndexRows[0] as { count: number };
  const claimWord =
    CLAIM_WORDS[existingCount % CLAIM_WORDS.length];

  const participantId = crypto.randomUUID();

  const rows =
    await sql/* sql */`insert into participants (
      id,
      board_id,
      display_name,
      claim_code,
      state
    ) values (
      ${participantId},
      ${boardId},
      ${displayName},
      ${claimWord},
      'JOINED_NOT_INITIATED'
    )
    returning
      id,
      board_id,
      display_name,
      claim_code,
      state,
      joined_at,
      last_updated_at`;

  const r = rows[0] as {
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
    busyWeekendFridays: [],
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


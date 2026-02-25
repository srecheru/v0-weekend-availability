import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { Participant } from "@/lib/weekend-utils";
import { getParticipantCookieName, PARTICIPANT_COOKIE_OPTIONS } from "@/lib/session";

interface RouteContext {
  params: Promise<{ boardId: string }>;
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
  const { boardId } = await context.params;
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

  // Use the existing count (already queried above) for the claim word index.
  // Also collect claim codes already in use on this board to avoid collisions.
  const usedClaimRows =
    await sql/* sql */`select lower(claim_code) as code from participants where board_id = ${boardId}`;
  const usedCodes = new Set(usedClaimRows.map((r) => (r as { code: string }).code));

  let claimWord = CLAIM_WORDS[count % CLAIM_WORDS.length];
  // If there's a collision (e.g. a participant was deleted and the index recycled),
  // walk through the list to find an unused word.
  if (usedCodes.has(claimWord)) {
    const available = CLAIM_WORDS.find((w) => !usedCodes.has(w));
    if (!available) {
      return NextResponse.json(
        { error: "Board has exhausted all claim codes. Cannot join." },
        { status: 400 }
      );
    }
    claimWord = available;
  }

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
    path: `/`,
  });

  return res;
}


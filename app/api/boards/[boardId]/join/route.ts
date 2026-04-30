import { NextRequest, NextResponse } from "next/server";
import { sql, generateUUID, generateClaimCode } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const body = await request.json();
    const { displayName } = body;

    if (!displayName || displayName.trim().length === 0) {
      return NextResponse.json(
        { error: "Display name is required" },
        { status: 400 }
      );
    }

    // Check if board exists and get participant cap
    const boardResult = await sql`
      SELECT * FROM boards WHERE id = ${boardId}
    `;

    if (boardResult.length === 0) {
      return NextResponse.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    const board = boardResult[0];

    // Check current participant count
    const countResult = await sql`
      SELECT COUNT(*) as count FROM participants WHERE board_id = ${boardId}
    `;

    const currentCount = parseInt(countResult[0].count, 10);

    if (currentCount >= board.participant_cap) {
      return NextResponse.json(
        { error: "Board is full" },
        { status: 400 }
      );
    }

    // Check for duplicate name
    const dupeResult = await sql`
      SELECT id FROM participants WHERE board_id = ${boardId} AND LOWER(display_name) = LOWER(${displayName.trim()})
    `;

    if (dupeResult.length > 0) {
      return NextResponse.json(
        { error: "A participant with this name already exists" },
        { status: 400 }
      );
    }

    const id = generateUUID();
    const claimCode = generateClaimCode();

    const result = await sql`
      INSERT INTO participants (id, board_id, display_name, claim_code, state, joined_at, last_updated_at)
      VALUES (${id}, ${boardId}, ${displayName.trim()}, ${claimCode}, 'JOINED_NOT_INITIATED', NOW(), NOW())
      RETURNING *
    `;

    const participant = result[0];

    // Set participant ID in cookie for session management
    const cookieStore = await cookies();
    cookieStore.set(`participant_${boardId}`, id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return NextResponse.json({
      participantId: participant.id,
      boardId: participant.board_id,
      displayName: participant.display_name,
      claimCode: participant.claim_code,
      state: participant.state,
      joinedAt: participant.joined_at,
      lastUpdatedAt: participant.last_updated_at,
    });
  } catch (error) {
    console.error("Error joining board:", error);
    return NextResponse.json(
      { error: "Failed to join board" },
      { status: 500 }
    );
  }
}

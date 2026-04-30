import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const body = await request.json();
    const { claimCode } = body;

    if (!claimCode || claimCode.trim().length === 0) {
      return NextResponse.json(
        { error: "Claim code is required" },
        { status: 400 }
      );
    }

    // Find participant with matching claim code
    const result = await sql`
      SELECT * FROM participants 
      WHERE board_id = ${boardId} AND LOWER(claim_code) = LOWER(${claimCode.trim()})
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Invalid claim code" },
        { status: 404 }
      );
    }

    const participant = result[0];

    // Set participant ID in cookie for session management
    const cookieStore = await cookies();
    cookieStore.set(`participant_${boardId}`, participant.id, {
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
    console.error("Error reclaiming participant:", error);
    return NextResponse.json(
      { error: "Failed to reclaim participant" },
      { status: 500 }
    );
  }
}

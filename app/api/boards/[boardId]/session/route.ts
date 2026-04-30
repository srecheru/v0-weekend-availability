import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";

// Get current session/participant info for this board
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const cookieStore = await cookies();
    const participantId = cookieStore.get(`participant_${boardId}`)?.value;

    if (!participantId) {
      return NextResponse.json({ participant: null });
    }

    // Get participant info
    const participantResult = await sql`
      SELECT * FROM participants WHERE id = ${participantId} AND board_id = ${boardId}
    `;

    if (participantResult.length === 0) {
      return NextResponse.json({ participant: null });
    }

    const participant = participantResult[0];

    // Get busy weekends
    const busyResult = await sql`
      SELECT friday FROM busy_weekends WHERE participant_id = ${participantId}
    `;

    return NextResponse.json({
      participant: {
        participantId: participant.id,
        boardId: participant.board_id,
        displayName: participant.display_name,
        claimCode: participant.claim_code,
        state: participant.state,
        busyWeekendFridays: busyResult.map((r) => r.friday),
        joinedAt: participant.joined_at,
        lastUpdatedAt: participant.last_updated_at,
      },
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

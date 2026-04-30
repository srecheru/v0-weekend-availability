import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { cookies } from "next/headers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const cookieStore = await cookies();
    const participantId = cookieStore.get(`participant_${boardId}`)?.value;

    if (!participantId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify participant exists and belongs to this board
    const participantResult = await sql`
      SELECT * FROM participants WHERE id = ${participantId} AND board_id = ${boardId}
    `;

    if (participantResult.length === 0) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { busyWeekendFridays } = body;

    if (!Array.isArray(busyWeekendFridays)) {
      return NextResponse.json(
        { error: "busyWeekendFridays must be an array" },
        { status: 400 }
      );
    }

    // Delete existing busy weekends for this participant
    await sql`
      DELETE FROM busy_weekends WHERE participant_id = ${participantId}
    `;

    // Insert new busy weekends
    for (const friday of busyWeekendFridays) {
      await sql`
        INSERT INTO busy_weekends (participant_id, friday)
        VALUES (${participantId}, ${friday})
      `;
    }

    // Update participant state and last_updated_at
    const newState = busyWeekendFridays.length > 0 ? "ADDED_AVAILABILITY" : "INITIATED_ZERO_BUSY";
    
    await sql`
      UPDATE participants 
      SET state = ${newState}, last_updated_at = NOW()
      WHERE id = ${participantId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating availability:", error);
    return NextResponse.json(
      { error: "Failed to update availability" },
      { status: 500 }
    );
  }
}

// GET current participant's availability
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;
    const cookieStore = await cookies();
    const participantId = cookieStore.get(`participant_${boardId}`)?.value;

    if (!participantId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get participant info
    const participantResult = await sql`
      SELECT * FROM participants WHERE id = ${participantId} AND board_id = ${boardId}
    `;

    if (participantResult.length === 0) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    const participant = participantResult[0];

    // Get busy weekends
    const busyResult = await sql`
      SELECT friday FROM busy_weekends WHERE participant_id = ${participantId}
    `;

    return NextResponse.json({
      participantId: participant.id,
      boardId: participant.board_id,
      displayName: participant.display_name,
      claimCode: participant.claim_code,
      state: participant.state,
      busyWeekendFridays: busyResult.map((r) => r.friday),
      joinedAt: participant.joined_at,
      lastUpdatedAt: participant.last_updated_at,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;

    // Get all participants for this board
    const participantsResult = await sql`
      SELECT * FROM participants WHERE board_id = ${boardId} ORDER BY joined_at ASC
    `;

    // Get all busy weekends for each participant
    const busyWeekendsResult = await sql`
      SELECT participant_id, friday FROM busy_weekends 
      WHERE participant_id IN (SELECT id FROM participants WHERE board_id = ${boardId})
    `;

    // Build a map of participant_id -> busy fridays
    const busyMap: Record<string, string[]> = {};
    for (const row of busyWeekendsResult) {
      const pid = row.participant_id;
      if (!busyMap[pid]) busyMap[pid] = [];
      busyMap[pid].push(row.friday);
    }

    const participants = participantsResult.map((p) => ({
      participantId: p.id,
      boardId: p.board_id,
      displayName: p.display_name,
      claimCode: p.claim_code,
      state: p.state,
      busyWeekendFridays: busyMap[p.id] || [],
      joinedAt: p.joined_at,
      lastUpdatedAt: p.last_updated_at,
    }));

    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error fetching participants:", error);
    return NextResponse.json(
      { error: "Failed to fetch participants" },
      { status: 500 }
    );
  }
}

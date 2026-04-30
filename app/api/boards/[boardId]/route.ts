import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;

    const result = await sql`
      SELECT * FROM boards WHERE id = ${boardId}
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    const board = result[0];

    return NextResponse.json({
      boardId: board.id,
      boardName: board.name,
      timezone: board.timezone,
      durationMonths: board.duration_months,
      dateRangeStart: board.date_range_start,
      dateRangeEnd: board.date_range_end,
      participantCap: board.participant_cap,
      joinToken: board.join_token,
      createdAt: board.created_at,
    });
  } catch (error) {
    console.error("Error fetching board:", error);
    return NextResponse.json(
      { error: "Failed to fetch board" },
      { status: 500 }
    );
  }
}

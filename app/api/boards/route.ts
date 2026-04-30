import { NextRequest, NextResponse } from "next/server";
import { sql, generateUUID, generateJoinToken } from "@/lib/db";
import { addMonths, format, startOfMonth, endOfMonth } from "date-fns";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, durationMonths, participantCap, timezone } = body;

    // Validate required fields
    if (!name || !durationMonths || !participantCap) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate participantCap is 1-5
    if (participantCap < 1 || participantCap > 5) {
      return NextResponse.json(
        { error: "Participant cap must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate durationMonths is valid
    if (![1, 3, 6, 12].includes(durationMonths)) {
      return NextResponse.json(
        { error: "Duration must be 1, 3, 6, or 12 months" },
        { status: 400 }
      );
    }

    const id = generateUUID();
    const joinToken = generateJoinToken();
    const now = new Date();
    const dateRangeStart = startOfMonth(now);
    const dateRangeEnd = endOfMonth(addMonths(now, durationMonths - 1));

    const result = await sql`
      INSERT INTO boards (id, name, timezone, duration_months, date_range_start, date_range_end, participant_cap, join_token, created_at)
      VALUES (${id}, ${name}, ${timezone || "America/New_York"}, ${durationMonths}, ${format(dateRangeStart, "yyyy-MM-dd")}, ${format(dateRangeEnd, "yyyy-MM-dd")}, ${participantCap}, ${joinToken}, NOW())
      RETURNING *
    `;

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
    console.error("Error creating board:", error);
    return NextResponse.json(
      { error: "Failed to create board" },
      { status: 500 }
    );
  }
}

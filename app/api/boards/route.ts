import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import type { Board } from "@/lib/weekend-utils";
import { computeDateRange } from "@/lib/weekend-utils";

type DurationMonths = Board["durationMonths"];

interface CreateBoardBody {
  boardName?: string;
  durationMonths?: DurationMonths;
  participantCap?: number;
  timezone?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateBoardBody;

  const name = body.boardName?.trim();
  const duration = body.durationMonths ?? 3;
  const participantCap = body.participantCap ?? 5;
  const timezone = body.timezone ?? "America/New_York";

  if (!name) {
    return NextResponse.json(
      { error: "Board name is required" },
      { status: 400 }
    );
  }

  if (![1, 3, 6, 12].includes(duration)) {
    return NextResponse.json(
      { error: "Invalid durationMonths" },
      { status: 400 }
    );
  }

  const { start, end } = computeDateRange(duration);

  const boardId = crypto.randomUUID();
  const joinToken = crypto.randomUUID().replace(/-/g, "").slice(0, 16);

  const rows =
    await sql/* sql */`insert into boards (
      id,
      name,
      timezone,
      duration_months,
      date_range_start,
      date_range_end,
      participant_cap,
      join_token
    ) values (
      ${boardId},
      ${name},
      ${timezone},
      ${duration},
      ${start.toISOString().split("T")[0]},
      ${end.toISOString().split("T")[0]},
      ${participantCap},
      ${joinToken}
    )
    returning
      id,
      name,
      timezone,
      duration_months,
      date_range_start,
      date_range_end,
      participant_cap,
      join_token,
      created_at`;

  const row = rows[0] as {
    id: string;
    name: string;
    timezone: string;
    duration_months: number;
    date_range_start: string;
    date_range_end: string;
    participant_cap: number;
    join_token: string;
    created_at: string;
  };

  const board: Board = {
    boardId: row.id,
    boardName: row.name,
    timezone: row.timezone,
    durationMonths: row.duration_months as DurationMonths,
    dateRangeStart: row.date_range_start,
    dateRangeEnd: row.date_range_end,
    participantCap: row.participant_cap,
    joinToken: row.join_token,
    createdAt: row.created_at,
  };

  return NextResponse.json({ board });
}


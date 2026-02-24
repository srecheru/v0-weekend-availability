"use client";

import useSWR from "swr";
import type {
  Board,
  Participant,
  WeekendRow,
  AggregationSummary,
} from "@/lib/weekend-utils";

const jsonFetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
};

interface BoardResponse {
  board: Board;
  participants: Participant[];
  currentParticipantId: string | null;
}

export function useBoard(boardId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<BoardResponse>(
    boardId ? `/api/boards/${boardId}` : null,
    jsonFetcher,
  );

  const board = data?.board;
  const participants = data?.participants ?? [];
  const currentParticipantId = data?.currentParticipantId ?? null;
  const currentParticipant =
    participants.find((p) => p.participantId === currentParticipantId) ??
    null;

  return {
    board,
    participants,
    currentParticipantId,
    currentParticipant,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

export function useParticipants(boardId: string | undefined) {
  return useBoard(boardId);
}

interface AggregationResponse {
  weekends: WeekendRow[];
  summary: AggregationSummary;
  hasAggregation: boolean;
  pendingCount: number;
}

export function useAggregation(boardId: string | undefined) {
  return useSWR<AggregationResponse>(
    boardId ? `/api/boards/${boardId}/aggregation` : null,
    jsonFetcher,
  );
}


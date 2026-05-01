"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import type {
  Board,
  Participant,
  WeekendRow,
  AggregationSummary,
} from "@/lib/weekend-utils";

const CREATOR_BOARDS_KEY = "wab_created_boards";

export function markAsCreator(boardId: string): void {
  try {
    const stored = localStorage.getItem(CREATOR_BOARDS_KEY);
    const boards: string[] = stored ? (JSON.parse(stored) as string[]) : [];
    if (!boards.includes(boardId)) {
      boards.push(boardId);
      localStorage.setItem(CREATOR_BOARDS_KEY, JSON.stringify(boards));
    }
  } catch {
    // ignore
  }
}

export function useIsCreator(boardId: string | undefined): boolean {
  const [isCreator, setIsCreator] = useState(false);
  useEffect(() => {
    if (!boardId) return;
    try {
      const stored = localStorage.getItem(CREATOR_BOARDS_KEY);
      const boards: string[] = stored ? (JSON.parse(stored) as string[]) : [];
      setIsCreator(boards.includes(boardId));
    } catch {
      setIsCreator(false);
    }
  }, [boardId]);
  return isCreator;
}

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


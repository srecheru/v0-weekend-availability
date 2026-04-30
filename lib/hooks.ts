"use client";

import useSWR, { mutate } from "swr";
import { useCallback, useState } from "react";
import type { Board, Participant } from "./weekend-utils";
import { getWeekendsInRange, fridayToIso } from "./weekend-utils";
import { parseISO } from "date-fns";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Hook to fetch board data
export function useBoard(boardId: string | null) {
  const { data, error, isLoading } = useSWR<Board>(
    boardId ? `/api/boards/${boardId}` : null,
    fetcher
  );

  return {
    board: data,
    isLoading,
    error,
  };
}

// Hook to fetch all participants for a board
export function useParticipants(boardId: string | null) {
  const { data, error, isLoading, mutate: mutateParticipants } = useSWR<Participant[]>(
    boardId ? `/api/boards/${boardId}/participants` : null,
    fetcher
  );

  return {
    participants: data || [],
    isLoading,
    error,
    mutateParticipants,
  };
}

// Hook to get current session participant
export function useSession(boardId: string | null) {
  const { data, error, isLoading, mutate: mutateSession } = useSWR<{ participant: Participant | null }>(
    boardId ? `/api/boards/${boardId}/session` : null,
    fetcher
  );

  return {
    currentParticipant: data?.participant || null,
    isLoading,
    error,
    mutateSession,
  };
}

// Hook to join a board
export function useJoinBoard(boardId: string) {
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const join = useCallback(async (displayName: string) => {
    setIsJoining(true);
    setError(null);

    try {
      const res = await fetch(`/api/boards/${boardId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to join board");
        return null;
      }

      // Revalidate session and participants
      mutate(`/api/boards/${boardId}/session`);
      mutate(`/api/boards/${boardId}/participants`);

      return data as Participant;
    } catch (err) {
      setError("Failed to join board");
      return null;
    } finally {
      setIsJoining(false);
    }
  }, [boardId]);

  return { join, isJoining, error };
}

// Hook to reclaim a spot via claim code
export function useReclaimSpot(boardId: string) {
  const [isReclaiming, setIsReclaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reclaim = useCallback(async (claimCode: string) => {
    setIsReclaiming(true);
    setError(null);

    try {
      const res = await fetch(`/api/boards/${boardId}/reclaim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid claim code");
        return null;
      }

      // Revalidate session and participants
      mutate(`/api/boards/${boardId}/session`);
      mutate(`/api/boards/${boardId}/participants`);

      return data as Participant;
    } catch (err) {
      setError("Failed to reclaim spot");
      return null;
    } finally {
      setIsReclaiming(false);
    }
  }, [boardId]);

  return { reclaim, isReclaiming, error };
}

// Hook to update availability
export function useUpdateAvailability(boardId: string) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const updateAvailability = useCallback(async (busyWeekendFridays: string[]) => {
    setIsSaving(true);
    setSaveStatus("saving");

    try {
      const res = await fetch(`/api/boards/${boardId}/availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busyWeekendFridays }),
      });

      if (!res.ok) {
        throw new Error("Failed to update availability");
      }

      // Revalidate session and participants
      mutate(`/api/boards/${boardId}/session`);
      mutate(`/api/boards/${boardId}/participants`);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
      return true;
    } catch (err) {
      setSaveStatus("idle");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [boardId]);

  return { updateAvailability, isSaving, saveStatus };
}

// Hook to create a new board
export function useCreateBoard() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBoard = useCallback(async (data: {
    name: string;
    durationMonths: number;
    participantCap: number;
    timezone?: string;
  }) => {
    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to create board");
        return null;
      }

      return result as Board;
    } catch (err) {
      setError("Failed to create board");
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return { createBoard, isCreating, error };
}

// Helper hook to compute weekend fridays from board date range
export function useWeekendFridays(board: Board | undefined) {
  if (!board || !board.dateRangeStart || !board.dateRangeEnd) return [];
  
  const start = parseISO(board.dateRangeStart);
  const end = parseISO(board.dateRangeEnd);
  const weekendDates = getWeekendsInRange(start, end);
  
  return weekendDates.map(fridayToIso);
}

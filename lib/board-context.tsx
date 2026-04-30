"use client";

import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from "react";
import { useBoard, useParticipants, useSession, useUpdateAvailability, useWeekendFridays } from "./hooks";
import type { Board, Participant } from "./weekend-utils";

interface BoardContextType {
  // Data
  board: Board | undefined;
  participants: Participant[];
  currentParticipant: Participant | null;
  weekendFridays: string[];
  
  // Loading states
  isLoading: boolean;
  
  // Computed
  isBoardFull: boolean;
  participantJoined: boolean;
  
  // Actions
  toggleBusyWeekend: (fridayIso: string) => void;
  saveStatus: "idle" | "saving" | "saved";
  
  // Session revalidation
  refreshSession: () => void;
  refreshParticipants: () => void;
}

const BoardContext = createContext<BoardContextType | null>(null);

interface BoardProviderProps {
  boardId: string;
  children: React.ReactNode;
}

export function BoardProvider({ boardId, children }: BoardProviderProps) {
  const { board, isLoading: boardLoading } = useBoard(boardId);
  const { participants, isLoading: participantsLoading, mutateParticipants } = useParticipants(boardId);
  const { currentParticipant, isLoading: sessionLoading, mutateSession } = useSession(boardId);
  const { updateAvailability, saveStatus } = useUpdateAvailability(boardId);
  const weekendFridays = useWeekendFridays(board);
  
  // Local state for optimistic updates
  const [localBusyFridays, setLocalBusyFridays] = useState<string[]>([]);
  
  // Sync local state with server state
  useEffect(() => {
    if (currentParticipant) {
      setLocalBusyFridays(currentParticipant.busyWeekendFridays);
    }
  }, [currentParticipant]);

  const toggleBusyWeekend = useCallback((fridayIso: string) => {
    setLocalBusyFridays((prev) => {
      const isBusy = prev.includes(fridayIso);
      const newBusy = isBusy
        ? prev.filter((f) => f !== fridayIso)
        : [...prev, fridayIso];
      
      // Trigger save
      updateAvailability(newBusy);
      
      return newBusy;
    });
  }, [updateAvailability]);

  const isLoading = boardLoading || participantsLoading || sessionLoading;
  
  const isBoardFull = board ? participants.length >= board.participantCap : false;
  const participantJoined = !!currentParticipant;

  // Merge local busy fridays with current participant for display
  const mergedCurrentParticipant = useMemo(() => {
    if (!currentParticipant) return null;
    return {
      ...currentParticipant,
      busyWeekendFridays: localBusyFridays,
    };
  }, [currentParticipant, localBusyFridays]);

  // Merge local busy fridays into participants list for aggregation
  const mergedParticipants = useMemo(() => {
    if (!currentParticipant) return participants;
    return participants.map((p) =>
      p.participantId === currentParticipant.participantId
        ? { ...p, busyWeekendFridays: localBusyFridays }
        : p
    );
  }, [participants, currentParticipant, localBusyFridays]);

  const value = useMemo(
    () => ({
      board,
      participants: mergedParticipants,
      currentParticipant: mergedCurrentParticipant,
      weekendFridays,
      isLoading,
      isBoardFull,
      participantJoined,
      toggleBusyWeekend,
      saveStatus,
      refreshSession: () => mutateSession(),
      refreshParticipants: () => mutateParticipants(),
    }),
    [
      board,
      mergedParticipants,
      mergedCurrentParticipant,
      weekendFridays,
      isLoading,
      isBoardFull,
      participantJoined,
      toggleBusyWeekend,
      saveStatus,
      mutateSession,
      mutateParticipants,
    ]
  );

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoardContext must be used within BoardProvider");
  }
  return ctx;
}

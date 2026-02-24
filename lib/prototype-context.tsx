"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { Board, Participant } from "./weekend-utils";
import {
  createPartialScenario,
  createFullScenario,
  createEmptyScenario,
  createBoardFullScenario,
  type Scenario,
} from "./mock-data";

export type ScenarioName = "empty" | "partial" | "full" | "board-full";

interface PrototypeContextType {
  board: Board;
  participants: Participant[];
  currentParticipantId: string;
  weekendFridays: string[];
  scenarioName: ScenarioName;
  setScenario: (name: ScenarioName) => void;
  toggleBusyWeekend: (fridayIso: string) => void;
  addParticipant: (name: string) => void;
  updateBoardName: (name: string) => void;
  isBoardFull: boolean;
  currentParticipant: Participant | undefined;
  saveStatus: "idle" | "saving" | "saved";
}

const PrototypeContext = createContext<PrototypeContextType | null>(null);

function getScenarioByName(name: ScenarioName): Scenario {
  switch (name) {
    case "empty":
      return createEmptyScenario();
    case "partial":
      return createPartialScenario();
    case "full":
      return createFullScenario();
    case "board-full":
      return createBoardFullScenario();
    default:
      return createPartialScenario();
  }
}

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  const [scenarioName, setScenarioName] = useState<ScenarioName>("partial");
  const [scenario, setScenario] = useState<Scenario>(() =>
    getScenarioByName("partial")
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const switchScenario = useCallback((name: ScenarioName) => {
    setScenarioName(name);
    setScenario(getScenarioByName(name));
    setSaveStatus("idle");
  }, []);

  const toggleBusyWeekend = useCallback(
    (fridayIso: string) => {
      setScenario((prev) => {
        const participant = prev.participants.find(
          (p) => p.participantId === prev.currentParticipantId
        );
        if (!participant) return prev;

        const isBusy = participant.busyWeekendFridays.includes(fridayIso);
        const newBusy = isBusy
          ? participant.busyWeekendFridays.filter((f) => f !== fridayIso)
          : [...participant.busyWeekendFridays, fridayIso];

        const newState: Participant["state"] =
          participant.state === "ADDED_AVAILABILITY"
            ? "ADDED_AVAILABILITY"
            : newBusy.length > 0
              ? "ADDED_AVAILABILITY"
              : "INITIATED_ZERO_BUSY";

        return {
          ...prev,
          participants: prev.participants.map((p) =>
            p.participantId === prev.currentParticipantId
              ? {
                  ...p,
                  busyWeekendFridays: newBusy,
                  state: newState,
                  lastUpdatedAt: "2026-02-23T20:00:00.000Z",
                }
              : p
          ),
        };
      });

      // Simulate autosave
      setSaveStatus("saving");
      setTimeout(() => {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }, 800);
    },
    []
  );

  const addParticipant = useCallback(
    (name: string) => {
      setScenario((prev) => {
        if (prev.participants.length >= prev.board.participantCap) return prev;
        // Deterministic ID based on participant count to avoid hydration mismatches
        const idx = prev.participants.length + 1;
        const newId = `p00d00${String(idx).padStart(2, "0")}-bbbb-4000-8000-00000000000${idx}`;
        const claimWords = [
          "river", "cloud", "eagle", "flame", "coral",
          "bridge", "moss", "ridge", "pearl", "leaf",
        ];
        return {
          ...prev,
          currentParticipantId: newId,
          participants: [
            ...prev.participants,
            {
              participantId: newId,
              boardId: prev.board.boardId,
              displayName: name,
              claimCode: claimWords[prev.participants.length % claimWords.length],
              state: "JOINED_NOT_INITIATED" as const,
              busyWeekendFridays: [],
              joinedAt: "2026-02-23T18:00:00.000Z",
              lastUpdatedAt: "2026-02-23T18:00:00.000Z",
            },
          ],
        };
      });
    },
    []
  );

  const updateBoardName = useCallback((name: string) => {
    setScenario((prev) => ({
      ...prev,
      board: { ...prev.board, boardName: name },
    }));
  }, []);

  const isBoardFull = scenario.participants.length >= scenario.board.participantCap;

  const currentParticipant = useMemo(
    () =>
      scenario.participants.find(
        (p) => p.participantId === scenario.currentParticipantId
      ),
    [scenario.participants, scenario.currentParticipantId]
  );

  const value = useMemo(
    () => ({
      board: scenario.board,
      participants: scenario.participants,
      currentParticipantId: scenario.currentParticipantId,
      weekendFridays: scenario.weekendFridays,
      scenarioName,
      setScenario: switchScenario,
      toggleBusyWeekend,
      addParticipant,
      updateBoardName,
      isBoardFull,
      currentParticipant,
      saveStatus,
    }),
    [
      scenario,
      scenarioName,
      switchScenario,
      toggleBusyWeekend,
      addParticipant,
      updateBoardName,
      isBoardFull,
      currentParticipant,
      saveStatus,
    ]
  );

  return (
    <PrototypeContext.Provider value={value}>
      {children}
    </PrototypeContext.Provider>
  );
}

export function usePrototype() {
  const ctx = useContext(PrototypeContext);
  if (!ctx)
    throw new Error("usePrototype must be used within PrototypeProvider");
  return ctx;
}

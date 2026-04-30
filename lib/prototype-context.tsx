"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import type { Board, Participant } from "./weekend-utils";
import {
  createPartialScenario,
  createFullScenario,
  createEmptyScenario,
  createBoardFullScenario,
  type Scenario,
} from "./mock-data";

export type ScenarioName = "empty" | "partial" | "full" | "board-full";
export type ViewRole = "creator" | "participant";

interface PrototypeContextType {
  board: Board;
  participants: Participant[];
  currentParticipantId: string;
  weekendFridays: string[];
  scenarioName: ScenarioName;
  viewRole: ViewRole;
  setScenario: (name: ScenarioName) => void;
  setViewRole: (role: ViewRole) => void;
  toggleBusyWeekend: (fridayIso: string) => void;
  addParticipant: (name: string) => void;
  updateBoardName: (name: string) => void;
  boardCreated: boolean;
  markBoardCreated: () => void;
  participantJoined: boolean;
  markParticipantJoined: () => void;
  isBoardFull: boolean;
  currentParticipant: Participant | undefined;
  saveStatus: "idle" | "saving" | "saved";
  hydrated: boolean;
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

// Helpers to persist prototype controls across page navigations (prototype-only).
function readSession<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = sessionStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeSession(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch { /* noop */ }
}

export function PrototypeProvider({ children }: { children: React.ReactNode }) {
  // Hydrate with deterministic defaults, then sync from sessionStorage in an effect
  const [scenarioName, setScenarioName] = useState<ScenarioName>("partial");
  const [scenario, setScenario] = useState<Scenario>(() =>
    getScenarioByName("partial")
  );
  const [viewRole, setViewRoleState] = useState<ViewRole>("creator");
  const [boardCreated, setBoardCreated] = useState(true);
  const [participantJoined, setParticipantJoined] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [hydrated, setHydrated] = useState(false);

  // On mount, restore persisted prototype controls
  useEffect(() => {
    const savedRole = readSession<ViewRole>("wab-view-role", "creator");
    const savedScenario = readSession<ScenarioName>("wab-scenario", "partial");
    const savedParticipantJoined = readSession<boolean>("wab-participant-joined", false);
    setViewRoleState(savedRole);
    setScenarioName(savedScenario);
    setScenario(getScenarioByName(savedScenario));
    setBoardCreated(savedScenario !== "empty");
    setParticipantJoined(savedParticipantJoined);
    setHydrated(true);
  }, []);

  // Wrap setViewRole to also persist
  const setViewRole = useCallback((role: ViewRole) => {
    setViewRoleState(role);
    writeSession("wab-view-role", role);
  }, []);

  const switchScenario = useCallback((name: ScenarioName) => {
    setScenarioName(name);
    setScenario(getScenarioByName(name));
    setBoardCreated(name !== "empty");
    setParticipantJoined(false);
    writeSession("wab-participant-joined", false);
    setSaveStatus("idle");
    writeSession("wab-scenario", name);
  }, []);

  const markBoardCreated = useCallback(() => {
    setBoardCreated(true);
  }, []);

  const markParticipantJoined = useCallback(() => {
    setParticipantJoined(true);
    writeSession("wab-participant-joined", true);
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
      viewRole,
      setScenario: switchScenario,
      setViewRole,
      toggleBusyWeekend,
      addParticipant,
      updateBoardName,
      boardCreated,
      markBoardCreated,
      participantJoined,
      markParticipantJoined,
      isBoardFull,
      currentParticipant,
      saveStatus,
      hydrated,
    }),
    [
      scenario,
      scenarioName,
      viewRole,
      switchScenario,
      setViewRole,
      toggleBusyWeekend,
      addParticipant,
      updateBoardName,
      boardCreated,
      markBoardCreated,
      participantJoined,
      markParticipantJoined,
      isBoardFull,
      currentParticipant,
      saveStatus,
      hydrated,
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

import {
  type Board,
  type Participant,
  computeDateRange,
  getWeekendsInRange,
  fridayToIso,
} from "./weekend-utils";

// Generate a simple UUID-like string for mock purposes
function mockUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Claim code word pool
const CLAIM_WORDS = [
  "mountain",
  "sunset",
  "ocean",
  "forest",
  "meadow",
  "canyon",
  "thunder",
  "glacier",
  "harbor",
  "breeze",
];

// ---------- Scenario Generators ----------

export interface Scenario {
  board: Board;
  participants: Participant[];
  currentParticipantId: string;
  weekendFridays: string[];
}

function createBoard(): Board {
  const { start, end } = computeDateRange(3);
  return {
    boardId: mockUuid(),
    boardName: "Summer Hangouts",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    durationMonths: 3,
    dateRangeStart: start.toISOString().split("T")[0],
    dateRangeEnd: end.toISOString().split("T")[0],
    participantCap: 5,
    joinToken: "mock-join-token-abc123",
    createdAt: new Date().toISOString(),
  };
}

function getWeekendFridayStrings(board: Board): string[] {
  const start = new Date(board.dateRangeStart + "T00:00:00");
  const end = new Date(board.dateRangeEnd + "T00:00:00");
  return getWeekendsInRange(start, end).map(fridayToIso);
}

export function createEmptyScenario(): Scenario {
  const board = createBoard();
  const weekendFridays = getWeekendFridayStrings(board);
  const creatorId = mockUuid();

  return {
    board,
    participants: [],
    currentParticipantId: creatorId,
    weekendFridays,
  };
}

export function createPartialScenario(): Scenario {
  const board = createBoard();
  const weekendFridays = getWeekendFridayStrings(board);
  const creatorId = mockUuid();

  const participants: Participant[] = [
    {
      participantId: creatorId,
      boardId: board.boardId,
      displayName: "Alex (you)",
      claimCode: CLAIM_WORDS[0],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 3
        ? [weekendFridays[1], weekendFridays[4]]
        : [],
      joinedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      participantId: mockUuid(),
      boardId: board.boardId,
      displayName: "Jordan",
      claimCode: CLAIM_WORDS[1],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 3
        ? [weekendFridays[0], weekendFridays[1], weekendFridays[3]]
        : [],
      joinedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      participantId: mockUuid(),
      boardId: board.boardId,
      displayName: "Sam",
      claimCode: CLAIM_WORDS[2],
      state: "JOINED_NOT_INITIATED",
      busyWeekendFridays: [],
      joinedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    },
  ];

  return {
    board,
    participants,
    currentParticipantId: creatorId,
    weekendFridays,
  };
}

export function createFullScenario(): Scenario {
  const board = createBoard();
  const weekendFridays = getWeekendFridayStrings(board);
  const creatorId = mockUuid();

  const participants: Participant[] = [
    {
      participantId: creatorId,
      boardId: board.boardId,
      displayName: "Alex (you)",
      claimCode: CLAIM_WORDS[0],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 6
        ? [weekendFridays[1], weekendFridays[5]]
        : [],
      joinedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      participantId: mockUuid(),
      boardId: board.boardId,
      displayName: "Jordan",
      claimCode: CLAIM_WORDS[1],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 6
        ? [weekendFridays[0], weekendFridays[1], weekendFridays[3]]
        : [],
      joinedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      participantId: mockUuid(),
      boardId: board.boardId,
      displayName: "Sam",
      claimCode: CLAIM_WORDS[2],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 6
        ? [weekendFridays[1], weekendFridays[2], weekendFridays[5]]
        : [],
      joinedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      participantId: mockUuid(),
      boardId: board.boardId,
      displayName: "Taylor",
      claimCode: CLAIM_WORDS[3],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 6
        ? [weekendFridays[5]]
        : [],
      joinedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    },
    {
      participantId: mockUuid(),
      boardId: board.boardId,
      displayName: "Casey",
      claimCode: CLAIM_WORDS[4],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 6
        ? [weekendFridays[1], weekendFridays[3], weekendFridays[5]]
        : [],
      joinedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    },
  ];

  return {
    board,
    participants,
    currentParticipantId: creatorId,
    weekendFridays,
  };
}

export function createBoardFullScenario(): Scenario {
  const scenario = createFullScenario();
  // For "board full" scenario on participant-join, we set currentParticipantId to empty
  // to simulate a new user who hasn't joined
  return {
    ...scenario,
    currentParticipantId: "",
  };
}

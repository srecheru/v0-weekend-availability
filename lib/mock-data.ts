import {
  type Board,
  type Participant,
  computeDateRange,
  getWeekendsInRange,
  fridayToIso,
} from "./weekend-utils";

// ---------- Deterministic IDs (no Math.random to avoid hydration mismatches) ----------

const STATIC_IDS = {
  board: "b00d0001-aaaa-4000-8000-000000000001",
  creator: "p00d0001-aaaa-4000-8000-000000000001",
  participant2: "p00d0002-aaaa-4000-8000-000000000002",
  participant3: "p00d0003-aaaa-4000-8000-000000000003",
  participant4: "p00d0004-aaaa-4000-8000-000000000004",
  participant5: "p00d0005-aaaa-4000-8000-000000000005",
} as const;

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
    boardId: STATIC_IDS.board,
    boardName: "Summer Hangouts",
    timezone: "America/New_York",
    durationMonths: 3,
    dateRangeStart: start.toISOString().split("T")[0],
    dateRangeEnd: end.toISOString().split("T")[0],
    participantCap: 5,
    joinToken: "mock-join-token-abc123",
    createdAt: "2026-02-23T12:00:00.000Z",
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

  return {
    board,
    participants: [],
    currentParticipantId: STATIC_IDS.creator,
    weekendFridays,
  };
}

export function createPartialScenario(): Scenario {
  const board = createBoard();
  const weekendFridays = getWeekendFridayStrings(board);

  const participants: Participant[] = [
    {
      participantId: STATIC_IDS.creator,
      boardId: board.boardId,
      displayName: "Alex (you)",
      claimCode: CLAIM_WORDS[0],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 5
        ? [weekendFridays[1], weekendFridays[4]]
        : [],
      joinedAt: "2026-02-23T12:00:00.000Z",
      lastUpdatedAt: "2026-02-23T14:00:00.000Z",
    },
    {
      participantId: STATIC_IDS.participant2,
      boardId: board.boardId,
      displayName: "Jordan",
      claimCode: CLAIM_WORDS[1],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 4
        ? [weekendFridays[0], weekendFridays[1], weekendFridays[3]]
        : [],
      joinedAt: "2026-02-23T13:00:00.000Z",
      lastUpdatedAt: "2026-02-23T15:00:00.000Z",
    },
    {
      participantId: STATIC_IDS.participant3,
      boardId: board.boardId,
      displayName: "Sam",
      claimCode: CLAIM_WORDS[2],
      state: "JOINED_NOT_INITIATED",
      busyWeekendFridays: [],
      joinedAt: "2026-02-23T14:00:00.000Z",
      lastUpdatedAt: "2026-02-23T14:00:00.000Z",
    },
  ];

  return {
    board,
    participants,
    currentParticipantId: STATIC_IDS.creator,
    weekendFridays,
  };
}

export function createFullScenario(): Scenario {
  const board = createBoard();
  const weekendFridays = getWeekendFridayStrings(board);

  const participants: Participant[] = [
    {
      participantId: STATIC_IDS.creator,
      boardId: board.boardId,
      displayName: "Alex (you)",
      claimCode: CLAIM_WORDS[0],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 6
        ? [weekendFridays[1], weekendFridays[5]]
        : [],
      joinedAt: "2026-02-23T12:00:00.000Z",
      lastUpdatedAt: "2026-02-23T14:00:00.000Z",
    },
    {
      participantId: STATIC_IDS.participant2,
      boardId: board.boardId,
      displayName: "Jordan",
      claimCode: CLAIM_WORDS[1],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 6
        ? [weekendFridays[0], weekendFridays[1], weekendFridays[3]]
        : [],
      joinedAt: "2026-02-23T13:00:00.000Z",
      lastUpdatedAt: "2026-02-23T15:00:00.000Z",
    },
    {
      participantId: STATIC_IDS.participant3,
      boardId: board.boardId,
      displayName: "Sam",
      claimCode: CLAIM_WORDS[2],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 6
        ? [weekendFridays[1], weekendFridays[2], weekendFridays[5]]
        : [],
      joinedAt: "2026-02-23T14:00:00.000Z",
      lastUpdatedAt: "2026-02-23T16:00:00.000Z",
    },
    {
      participantId: STATIC_IDS.participant4,
      boardId: board.boardId,
      displayName: "Taylor",
      claimCode: CLAIM_WORDS[3],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 6
        ? [weekendFridays[5]]
        : [],
      joinedAt: "2026-02-23T15:00:00.000Z",
      lastUpdatedAt: "2026-02-23T17:00:00.000Z",
    },
    {
      participantId: STATIC_IDS.participant5,
      boardId: board.boardId,
      displayName: "Casey",
      claimCode: CLAIM_WORDS[4],
      state: "ADDED_AVAILABILITY",
      busyWeekendFridays: weekendFridays.length >= 6
        ? [weekendFridays[1], weekendFridays[3], weekendFridays[5]]
        : [],
      joinedAt: "2026-02-23T16:00:00.000Z",
      lastUpdatedAt: "2026-02-23T18:00:00.000Z",
    },
  ];

  return {
    board,
    participants,
    currentParticipantId: STATIC_IDS.creator,
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

const COOKIE_PREFIX = "wab_participant_";

export function getParticipantCookieName(boardId: string) {
  return `${COOKIE_PREFIX}${boardId}`;
}

export const PARTICIPANT_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 365, // 1 year
};


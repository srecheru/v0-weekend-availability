import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const sql = neon(process.env.DATABASE_URL);

// Helper to generate UUIDs
export function generateUUID(): string {
  return crypto.randomUUID();
}

// Helper to generate a random claim code (single memorable word)
const CLAIM_WORDS = [
  "river", "cloud", "eagle", "flame", "coral",
  "bridge", "moss", "ridge", "pearl", "leaf",
  "storm", "frost", "ember", "brook", "cedar",
  "aspen", "dune", "cliff", "bloom", "creek"
];

export function generateClaimCode(): string {
  return CLAIM_WORDS[Math.floor(Math.random() * CLAIM_WORDS.length)];
}

// Helper to generate a join token
export function generateJoinToken(): string {
  return crypto.randomUUID().slice(0, 8);
}

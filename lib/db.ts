import { neon } from "@neondatabase/serverless";

// Simple Neon client helper. Requires DATABASE_URL to be set in the environment.
// Example: postgres://user:password@host/dbname?sslmode=require
export const sql = neon(process.env.DATABASE_URL!);


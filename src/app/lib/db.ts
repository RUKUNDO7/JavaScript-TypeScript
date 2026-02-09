import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __imenaPool: Pool | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Configure your Postgres connection string.");
}

const pool = global.__imenaPool ?? new Pool({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV !== "production") {
  global.__imenaPool = pool;
}

export { pool };

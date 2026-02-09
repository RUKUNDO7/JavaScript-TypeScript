import "server-only";
import crypto from "crypto";
import { InvitationData } from "@/app/types";
import { pool } from "@/app/lib/db";

export type StoredInvitation = {
  id: string;
  slug: string;
  createdAt: string;
  data: InvitationData;
};

const SLUG_ATTEMPTS = 3;

function slugify(input: string) {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
  return base || "invitation";
}

type InvitationRow = {
  id: string;
  slug: string;
  created_at: Date;
  data: InvitationData;
};

function rowToRecord(row: InvitationRow): StoredInvitation {
  return {
    id: row.id,
    slug: row.slug,
    createdAt: row.created_at.toISOString(),
    data: row.data,
  };
}

async function insertInvitation(
  id: string,
  slug: string,
  data: InvitationData
): Promise<StoredInvitation> {
  const result = await pool.query<InvitationRow>(
    `insert into invitations (id, slug, data)
     values ($1, $2, $3)
     returning id, slug, created_at, data`,
    [id, slug, data]
  );
  return rowToRecord(result.rows[0]);
}

export async function saveInvitation(data: InvitationData): Promise<string> {
  const id = crypto.randomUUID();
  const slugBase = slugify(data.title || data.slogan || "");
  let lastError: unknown;

  for (let attempt = 0; attempt < SLUG_ATTEMPTS; attempt += 1) {
    const shortId = crypto.randomBytes(3).toString("hex");
    const slug = `${slugBase}-${shortId}`;
    try {
      await insertInvitation(id, slug, data);
      return slug;
    } catch (err: unknown) {
      if (typeof err === "object" && err && "code" in err && (err as { code: string }).code === "23505") {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  throw lastError ?? new Error("Failed to create a unique invitation slug.");
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getInvitationBySlug(slug: string): Promise<StoredInvitation | null> {
  if (isUuid(slug)) {
    const byId = await pool.query<InvitationRow>(
      `select id, slug, created_at, data from invitations where id = $1`,
      [slug]
    );
    if (byId.rowCount) return rowToRecord(byId.rows[0]);
  }

  const bySlug = await pool.query<InvitationRow>(
    `select id, slug, created_at, data from invitations where slug = $1`,
    [slug]
  );
  if (bySlug.rowCount) return rowToRecord(bySlug.rows[0]);

  return null;
}

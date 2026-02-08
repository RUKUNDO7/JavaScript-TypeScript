import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { InvitationData } from "@/app/types";

export type StoredInvitation = {
  id: string;
  slug: string;
  createdAt: string;
  data: InvitationData;
};

const dataDir = path.join(process.cwd(), "data", "invitations");

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

function slugify(input: string) {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
  return base || "invitation";
}

export async function saveInvitation(data: InvitationData): Promise<string> {
  const id = crypto.randomUUID();
  const shortId = crypto.randomBytes(3).toString("hex");
  const slugBase = slugify(data.title || data.slogan || "");
  const slug = `${slugBase}-${shortId}`;
  const record: StoredInvitation = {
    id,
    slug,
    createdAt: new Date().toISOString(),
    data,
  };

  await ensureDir();
  await fs.writeFile(
    path.join(dataDir, `${slug}.json`),
    JSON.stringify(record, null, 2),
    "utf8"
  );

  return slug;
}

export async function getInvitationBySlug(slug: string): Promise<StoredInvitation | null> {
  try {
    const content = await fs.readFile(path.join(dataDir, `${slug}.json`), "utf8");
    return JSON.parse(content) as StoredInvitation;
  } catch (err: unknown) {
    if (typeof err === "object" && err && "code" in err && (err as { code: string }).code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

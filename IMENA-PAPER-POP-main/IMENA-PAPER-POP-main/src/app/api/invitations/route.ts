import { NextResponse } from "next/server";
import { saveInvitation } from "@/app/lib/invitation-store";
import { InvitationData } from "@/app/types";

export const runtime = "nodejs";

const validCategories = new Set<InvitationData["category"]>(["Announcements", "Birthdays"]);
const validSubFamilies = new Set<InvitationData["subFamily"]>(["Wihogora", "Light", "Hope"]);

export async function POST(request: Request) {
  const payload = (await request.json()) as InvitationData;

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  if (!validCategories.has(payload.category) || !validSubFamilies.has(payload.subFamily)) {
    return NextResponse.json({ error: "Invalid category or subFamily" }, { status: 400 });
  }

  const slug = await saveInvitation(payload);
  return NextResponse.json({ slug }, { status: 201 });
}

import { redirect } from "next/navigation";

export default async function ShortInviteRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/invitation/${id}`);
}

export const dynamic = "force-dynamic";

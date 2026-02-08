import { redirect } from "next/navigation";

export default function ShortInviteRedirect({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/invitation/${params.id}`);
}

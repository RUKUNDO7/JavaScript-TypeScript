import Link from "next/link";
import { notFound } from "next/navigation";
import InvitationPreview from "@/app/components/InvitationPreview";
import { getInvitationBySlug } from "@/app/lib/invitation-store";

import ShareBar from "./share-bar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getInvitationBySlug(id);

  if (!record) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Shared Invitation
            </p>
            <h1 className="text-3xl font-black text-[#153273] tracking-tighter">
              Imena Paper Pop
            </h1>
          </div>
          <Link
            href="/generator"
            className="text-[#153273] font-bold border-2 border-[#153273]/10 px-6 py-3 rounded-full hover:bg-[#153273]/5 transition-all uppercase tracking-widest text-[10px]"
          >
            Create Your Own
          </Link>
        </div>

        <div className="bg-white/60 border border-slate-200 rounded-3xl p-6 md:p-10 shadow-lg">
          <div className="max-w-lg mx-auto">
            <InvitationPreview data={record.data} />
          </div>
        </div>

        <ShareBar />
      </div>
    </main>
  );
}

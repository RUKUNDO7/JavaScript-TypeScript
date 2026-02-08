"use client";

import { useState } from "react";
import InvitationForm from "../components/InvitationForm";
import InvitationPreview from "../components/InvitationPreview";
import { InvitationData } from "../types";

export default function GeneratorPage() {
  const [data, setData] = useState<InvitationData>({
    // Add this line to satisfy the TypeScript requirement
    category: "Announcements", 
    
    subFamily: "Wihogora",
    title: "",
    slogan: "",
    date: "",
    time: "",
    location: "",
    additionalNotes: "",
    host: "Imena Family",
  });

  return (
    <main className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row">
      {/* LEFT: FORM SIDE */}
      <section className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-screen border-r border-slate-200">
        <div className="max-w-md mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-[#153273] tracking-tighter uppercase">
              Design <span className="text-[#96712F] italic font-serif">Studio</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-2">Enter your event details below.</p>
          </header>
          
          <InvitationForm data={data} setData={setData} />
        </div>
      </section>

      {/* RIGHT: PREVIEW SIDE */}
      <section className="w-full md:w-1/2 bg-slate-200/50 p-8 md:p-12 flex items-center justify-center min-h-[600px]">
        <div className="sticky top-12 w-full max-w-lg">
          <div className="mb-6 flex justify-between items-end">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Live Canvas</span>
            <button 
              onClick={() => window.print()}
              className="bg-[#153273] text-white px-6 py-2 rounded-full text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-blue-900/20"
            >
              Export PDF
            </button>
          </div>
          
          <InvitationPreview data={data} />
        </div>
      </section>
    </main>
  );
}
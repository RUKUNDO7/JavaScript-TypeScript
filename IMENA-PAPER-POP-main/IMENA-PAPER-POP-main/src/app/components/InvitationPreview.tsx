"use client";
import { InvitationData } from "../types";
import Image from "next/image";

export default function InvitationPreview({ data }: { data: InvitationData }) {
  // Family-Specific Branding & Official Slogans
  const familyStyles = {
    Wihogora: {
      container: "bg-[#FDFCFB] text-[#153273]",
      accent: "text-[#96712F]",
      border: "border-[#96712F]/30",
      font: "font-serif",
      officialSlogan: "Rooted in love, rising in life, resilience is our might"
    },
    Light: {
      container: "bg-white text-slate-800",
      accent: "text-blue-600",
      border: "border-blue-100",
      font: "font-sans",
      officialSlogan: "Unity, solidarity, Honesty Be Brothers and Sisters"
    },
    Hope: {
      container: "bg-[#153273] text-white",
      accent: "text-[#96712F]",
      border: "border-white/10",
      font: "font-serif",
      officialSlogan: "Ba umwana mu gihe ukina, umugabo mu gihe ukora, kora igikwiye mu gihe gikwiye"
    }
  };

  const style = familyStyles[data.subFamily];

  return (
    <div id="printable-invitation" className={`w-full aspect-[1/1.41] ${style.container} shadow-2xl relative p-12 flex flex-col items-center justify-start text-center transition-all duration-700`}>
      
      {/* Internal Frame */}
      <div className={`absolute inset-6 border ${style.border} pointer-events-none`} />

      {/* 1. THE LOGO */}
      <div className="relative z-10 w-20 h-20 mb-6">
        <Image 
          src="/IMENA.png" 
          alt="Imena Logo"
          fill
          className="object-contain"
        />
      </div>

      <p className={`uppercase tracking-[0.4em] text-[9px] font-bold ${style.accent} mb-4`}>
        Imena {data.subFamily} Presence
      </p>

      {/* 2. CENTERED CONTENT AREA */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-sm">
        {/* Reduced Title Size from 6xl to 3xl/4xl */}
        <h2 className={`text-3xl md:text-4xl ${style.font} italic mb-6 leading-tight`}>
          {data.title || (data.category === 'Birthdays' ? "Birthday Celebration" : "Family Announcement")}
        </h2>

        <div className={`w-10 h-[1px] ${data.subFamily === 'Hope' ? 'bg-white/30' : 'bg-black/10'} mb-6`} />

        {/* User-generated Description / Wishes */}
        <p className={`text-base md:text-lg leading-relaxed italic opacity-85 ${style.font} max-w-[280px]`}>
          "{data.slogan || (data.category === 'Birthdays' ? "Wishing you a year of infinite blessings." : "United in Celebration.")}"
        </p>

        {/* Logistics for Announcements */}
        {data.category === 'Announcements' && data.date && (
          <div className="mt-10 space-y-2">
            <p className="font-bold tracking-tighter text-xl">
              {new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="uppercase tracking-[0.2em] text-[9px] font-bold opacity-60">
              {data.time} • {data.location}
            </p>
          </div>
        )}
      </div>

      {/* 3. FOOTER WITH OFFICIAL FAMILY SLOGAN */}
      <div className="mt-auto pt-8 flex flex-col items-center">
        <div className={`w-8 h-[1px] ${style.accent} opacity-30 mb-4`} />
        <p className={`text-[10px] tracking-[0.15em] uppercase font-bold max-w-[300px] leading-loose opacity-70 mb-2`}>
          {style.officialSlogan}
        </p>
        <p className={`text-xl ${style.font} italic ${style.accent}`}>
          Imena Family
        </p>
      </div>
    </div>
  );
}
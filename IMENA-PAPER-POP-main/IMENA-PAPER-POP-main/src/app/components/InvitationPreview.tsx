"use client";
import { InvitationData } from "../types";
import Image from "next/image";
import { MapPin } from "lucide-react";

export default function InvitationPreview({ data }: { data: InvitationData }) {
  // Family-Specific Branding & Official Slogans
  const familyStyles = {
    Wihogora: {
      container: "bg-[#FDFCFB] text-[#153273]",
      accent: "text-[#96712F]",
      border: "border-[#96712F]/30",
      font: "font-serif",
      officialSlogan: "ndi umurinzi w' igihango, usigasira ibyagezwemo, akirinda amacakubiri, akimakaza amahoro, kuko ari we wihogora. Rooted in love, rising in life, resilience is our might"
    },
    Light: {
      container: "bg-white text-slate-800",
      accent: "text-blue-600",
      border: "border-blue-100",
      font: "font-sans",
      officialSlogan: "Love,unity,honesty,solidarity, be brothers and sisters!! Fly over dangers and go high because you’re a light"
    },
    Hope: {
      container: "bg-[#153273] text-white",
      accent: "text-[#96712F]",
      border: "border-white/10",
      font: "font-serif",
      officialSlogan: "Learn from the past, live for today, hope for tomorrow. Ba umwana mu gihe ukina, umugabo mu gihe ukora, kora igikwiye mu gihe gikwiye ikizere hope family."
    }
  };

  const style = familyStyles[data.subFamily];
  const agendaItems = data.agenda
    .split(/\r?\n|•|,|;/g)
    .map((item) => item.trim())
    .filter(Boolean);
  const toSentenceCase = (input: string) => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return "";
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };
  const formatTime = (time: string) => {
    if (!time) return "";
    const [h, m] = time.split(":").map((part) => Number(part));
    if (Number.isNaN(h) || Number.isNaN(m)) return time;
    const date = new Date(2000, 0, 1, h, m);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div id="printable-invitation" className={`invitation-theme w-full aspect-[1/1.41] ${style.container} shadow-2xl relative p-12 flex flex-col items-center justify-start text-center transition-all duration-700`}>
      
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
        {data.subFamily} Family
      </p>
      <p className={`uppercase tracking-[0.25em] text-[9px] font-bold opacity-70 ${style.accent} mb-6`}>
        Invites You To
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
          "{toSentenceCase(data.slogan || (data.category === 'Birthdays' ? "Wishing you a year of infinite blessings." : "United in Celebration."))}"
        </p>

        {/* Agenda */}
        {agendaItems.length ? (
          <div className="mt-4 max-w-[280px]">
            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-70 ${style.font}`}>
              Agenda
            </p>
            <ul className={`mt-2 text-[12px] italic tracking-[0.02em] opacity-80 ${style.font} space-y-1 list-disc list-inside`}>
              {agendaItems.map((item, index) => (
                <li key={`${item}-${index}`}>{toSentenceCase(item)}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Additional Notes */}
        {data.additionalNotes ? (
          <div className="mt-4 max-w-[280px]">
            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-70 ${style.font}`}>
              Notes
            </p>
            <ul className={`mt-2 text-[12px] italic tracking-[0.02em] opacity-80 ${style.font} list-disc list-inside`}>
              <li>{toSentenceCase(data.additionalNotes)}</li>
            </ul>
          </div>
        ) : null}

        {/* Logistics for Announcements */}
        {data.category === 'Announcements' && data.date && (
          <div className="mt-10 space-y-2">
            <p className="font-bold tracking-tighter text-xl">
              {new Date(data.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            {(data.time || data.location) ? (
              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold opacity-70">
                {data.time ? (
                  <span className={`px-3 py-1 rounded-full ${data.subFamily === "Hope" ? "bg-white/10 text-white" : "bg-[#153273]/10 text-[#153273]"}`}>
                    {formatTime(data.time)}
                  </span>
                ) : null}
                {data.location ? (
                  <span className={`px-3 py-1 rounded-full flex items-center gap-1 ${data.subFamily === "Hope" ? "bg-white/10 text-white" : "bg-[#153273]/10 text-[#153273]"}`}>
                    <MapPin size={12} />
                    {data.location}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* 3. FOOTER WITH OFFICIAL FAMILY SLOGAN */}
      <div className="mt-auto pt-8 flex flex-col items-center">
        <div className={`w-8 h-[1px] ${style.accent} opacity-30 mb-4`} />
        <p className={`text-[10px] tracking-[0.12em] italic max-w-[300px] leading-loose opacity-70 mb-2`}>
          "{toSentenceCase(style.officialSlogan)}"
        </p>
        <p className={`text-xl ${style.font} italic ${style.accent}`}>
          Imena Family
        </p>
      </div>
    </div>
  );
}

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
      border: "border-[rgba(150,113,47,0.3)]",
      font: "font-serif",
      officialSlogan: "Ndi umurinzi w' igihango, usigasira ibyagezwemo, akirinda amacakubiri, akimakaza amahoro, kuko ari we Wihogora. Rooted in love, rising in life, resilience is our might."
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
      border: "border-[rgba(255,255,255,0.1)]",
      font: "font-serif",
      officialSlogan: "Learn from the past, live for today, hope for tomorrow. Ba umwana mu gihe ukina, umugabo mu gihe ukora, kora igikwiye mu gihe gikwiye, ikizere hope family."
    }
  };

  const style = familyStyles[data.subFamily];
  const contentTextClass =
    data.subFamily === "Hope" ? "text-white" : "text-[#153273]";
  const mutedTextClass =
    data.subFamily === "Hope" ? "text-[rgba(255,255,255,0.9)]" : "text-[rgba(21,50,115,0.9)]";
  const subtleTextClass =
    data.subFamily === "Hope" ? "text-[rgba(255,255,255,0.8)]" : "text-[rgba(21,50,115,0.8)]";
  const agendaItems = (data.agenda ?? "")
    .split(/\r?\n|•|,|;/g)
    .map((item) => item.trim())
    .filter(Boolean);
  const notesItems = (data.additionalNotes ?? "")
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
  const formatDateWithOrdinal = (dateValue: string) => {
    if (!dateValue) return "";
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    const day = date.getDate();
    const monthYear = date.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    const suffix = day % 10 === 1 && day % 100 !== 11 ? "st"
      : day % 10 === 2 && day % 100 !== 12 ? "nd"
      : day % 10 === 3 && day % 100 !== 13 ? "rd"
      : "th";
    return `${day}${suffix} ${monthYear}`;
  };

  return (
    <div id="printable-invitation" className={`invitation-theme w-full aspect-[1/1.41] ${style.container} shadow-2xl relative p-12 flex flex-col items-center justify-start text-center transition-all duration-700`}>
      
      {/* Internal Frame removed */}

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
      <p className={`uppercase tracking-[0.25em] text-[9px] font-bold ${subtleTextClass} mb-6`}>
        Invites You To
      </p>

      {/* 2. CENTERED CONTENT AREA */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-sm">
        {/* Reduced Title Size from 6xl to 3xl/4xl */}
        <h2 className={`text-3xl md:text-4xl ${style.font} italic mb-6 leading-tight ${contentTextClass}`}>
          {data.title || (data.category === 'Birthdays' ? "Birthday Celebration" : "Family Announcement")}
        </h2>

        <div
          className={`w-10 h-[1px] ${data.subFamily === 'Hope' ? 'bg-[rgba(255,255,255,0.3)]' : 'bg-[rgba(0,0,0,0.1)]'} mb-6`}
        />

        {/* Date / Time / Location */}
        {(data.date || data.time || data.location) ? (
          <div className="mb-6 space-y-2">
            {data.date ? (
              <p className={`text-[12px] font-bold tracking-[0.15em] uppercase ${contentTextClass}`}>
                On the {formatDateWithOrdinal(data.date)}
              </p>
            ) : null}
            {data.time ? (
              <p className={`text-[11px] font-bold tracking-[0.18em] uppercase ${mutedTextClass}`}>
                At {formatTime(data.time)}
              </p>
            ) : null}
            {data.location ? (
              <p className={`text-[11px] font-bold tracking-[0.18em] uppercase ${mutedTextClass} flex items-center justify-center gap-2`}>
                <MapPin size={12} />
                {data.location}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* User-generated Description / Wishes */}
        <p
          className={`text-base md:text-lg leading-relaxed italic ${mutedTextClass} ${style.font} max-w-[280px] break-words overflow-hidden`}
          style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}
        >
          "{toSentenceCase(data.slogan || (data.category === 'Birthdays' ? "Wishing you a year of infinite blessings." : "United in Celebration."))}"
        </p>

        {/* Agenda */}
        {agendaItems.length ? (
          <div className="mt-4 max-w-[280px]">
            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${subtleTextClass} ${style.font}`}>
              Agenda
            </p>
            <ul className={`mt-2 text-[12px] italic tracking-[0.02em] ${mutedTextClass} ${style.font} space-y-1 list-none`}>
              {agendaItems.map((item, index) => (
                <li key={`${item}-${index}`}>• {toSentenceCase(item)}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Additional Notes */}
        {notesItems.length ? (
          <div className="mt-4 max-w-[280px]">
            <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${subtleTextClass} ${style.font}`}>
              Notes
            </p>
            <ul className={`mt-2 text-[12px] italic tracking-[0.02em] ${mutedTextClass} ${style.font} list-none space-y-1`}>
              {notesItems.map((item, index) => (
                <li key={`${item}-${index}`}>• {toSentenceCase(item)}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {/* 3. FOOTER WITH OFFICIAL FAMILY SLOGAN */}
      <div className="mt-auto pt-8 flex flex-col items-center">
        <div className={`w-8 h-[1px] ${style.accent} opacity-30 mb-4`} />
        <p className={`text-[10px] tracking-[0.12em] italic max-w-[300px] leading-loose ${mutedTextClass} mb-2`}>
          "{style.officialSlogan}"
        </p>
        <p className={`text-xl ${style.font} italic ${style.accent}`}>
          Imena Family
        </p>
      </div>
    </div>
  );
}

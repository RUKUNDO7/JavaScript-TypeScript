"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Share2 } from "lucide-react";
import InvitationForm from "../components/InvitationForm";
import InvitationPreview from "../components/InvitationPreview";
import { InvitationData } from "../types";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, XIcon } from "../components/brand-icons";

export default function GeneratorPage() {
  const [data, setData] = useState<InvitationData>({
    // Add this line to satisfy the TypeScript requirement
    category: "Announcements", 
    
    subFamily: "Wihogora",
    title: "",
    slogan: "",
    agenda: "",
    date: "",
    time: "",
    location: "",
    additionalNotes: "",
    host: "Imena Family",
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const addBleedGuides = (target: HTMLElement) => {
    const overlay = document.createElement("div");
    overlay.setAttribute("data-export-guides", "true");
    overlay.style.position = "absolute";
    overlay.style.inset = "0";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "50";

    const bleed = document.createElement("div");
    bleed.style.position = "absolute";
    bleed.style.inset = "12px";
    bleed.style.border = "1px dashed rgba(21, 50, 115, 0.35)";

    const safe = document.createElement("div");
    safe.style.position = "absolute";
    safe.style.inset = "36px";
    safe.style.border = "1px dashed rgba(150, 113, 47, 0.45)";

    overlay.appendChild(bleed);
    overlay.appendChild(safe);
    target.appendChild(overlay);

    return () => overlay.remove();
  };

  const handleExportPdf = async () => {
    if (isExporting) return;
    const target = document.getElementById("printable-invitation");
    if (!target) return;

    try {
      setIsExporting(true);
      setExportError(null);
      const removeGuides = addBleedGuides(target);

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      removeGuides();
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "p",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("imena-invitation.pdf");
    } catch (err) {
      setExportError("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const buildShareUrl = async () => {
    if (isSharing) return;
    setShareError(null);
    setShareCopied(false);

    try {
      setIsSharing(true);
      let url = shareUrl;

      if (!url) {
        const res = await fetch("/api/invitations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          setShareError("Failed to create link. Please try again.");
          return;
        }

        const result = (await res.json()) as { slug: string };
        const origin = window.location.origin;
        url = `${origin}/i/${result.slug}`;
        setShareUrl(url);
      }

      return url;
    } catch {
      setShareError("Failed to create link. Please try again.");
      return;
    } finally {
      setIsSharing(false);
    }
  };

  const handleShare = async () => {
    const url = await buildShareUrl();
    if (!url) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Imena Invitation",
          text: "You're invited. View the invitation here:",
          url,
        });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
        return;
      }

      setShareError("Sharing not supported on this device.");
    } catch {
      setShareError("Failed to share. Please try again.");
    }
  };

  const handleSharePlatform = async (platform: "whatsapp" | "facebook" | "x" | "instagram") => {
    const url = await buildShareUrl();
    if (!url) return;

    const text = encodeURIComponent("You're invited. View the invitation here:");
    const encodedUrl = encodeURIComponent(url);

    const shareLinks = {
      whatsapp: `https://wa.me/?text=${text}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
      instagram: `https://www.instagram.com/`,
    };

    const link = shareLinks[platform];
    window.open(link, "_blank", "noopener,noreferrer");
  };

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
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Live Canvas</span>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={handleExportPdf}
                disabled={isExporting}
                className="bg-[#153273] text-white px-6 py-2 rounded-full text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isExporting ? "Exporting..." : "Export PDF"}
              </button>
              <div className="relative group">
                <button 
                  onClick={handleShare}
                  disabled={isSharing}
                  className="bg-white text-[#153273] border border-[#153273]/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#153273]/5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Share link"
                >
                  <Share2 size={16} />
                </button>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] px-2 py-1 rounded-full bg-[#153273] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  Share link
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSharePlatform("whatsapp")}
                  disabled={isSharing}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Share on WhatsApp"
                  title="Share on WhatsApp"
                >
                  <WhatsAppIcon size={16} />
                </button>
                <button
                  onClick={() => handleSharePlatform("facebook")}
                  disabled={isSharing}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2]/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Share on Facebook"
                  title="Share on Facebook"
                >
                  <FacebookIcon size={16} />
                </button>
                <button
                  onClick={() => handleSharePlatform("x")}
                  disabled={isSharing}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-black flex items-center justify-center hover:bg-black/5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Share on X"
                  title="Share on X"
                >
                  <XIcon size={16} />
                </button>
                <button
                  onClick={() => handleSharePlatform("instagram")}
                  disabled={isSharing}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 text-[#E1306C] flex items-center justify-center hover:bg-[#E1306C]/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Share on Instagram"
                  title="Share on Instagram"
                >
                  <InstagramIcon size={16} />
              </button>
            </div>
          </div>
          {exportError ? (
            <p className="mb-3 text-[11px] text-red-600">{exportError}</p>
          ) : null}
          </div>

          {shareUrl ? (
            <div className="mb-6 flex flex-col gap-1">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Share Link</p>
              <div className="text-[11px] text-slate-600 bg-white/70 border border-slate-200 rounded-lg px-3 py-2">
                {shareUrl}
              </div>
              {shareCopied ? (
                <p className="text-[10px] text-[#153273] font-bold uppercase tracking-widest">
                  Link copied
                </p>
              ) : null}
            </div>
          ) : null}
          {shareError ? (
            <p className="text-[11px] text-red-600 mb-4">{shareError}</p>
          ) : null}
          
          <InvitationPreview data={data} />
        </div>
      </section>
    </main>
  );
}

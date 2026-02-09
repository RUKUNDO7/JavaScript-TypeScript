"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Share2 } from "lucide-react";
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
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const addBleedGuides = (_target: HTMLElement) => {
    return () => {};
  };

  const handleExportPdf = async () => {
    if (isExporting) return;
    const target = document.getElementById("printable-invitation");
    if (!target) return;

    let removeGuides: (() => void) | null = null;
    try {
      setIsExporting(true);
      setExportError(null);
      removeGuides = addBleedGuides(target);

      const images = Array.from(target.querySelectorAll("img"));
      await Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );
      if ("fonts" in document) {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      }

      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "p",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("imena-invitation.pdf");
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Export failed. Please try again.");
    } finally {
      if (removeGuides) removeGuides();
      setIsExporting(false);
    }
  };

  const handleDownloadImage = async () => {
    if (isExporting) return;
    const target = document.getElementById("printable-invitation");
    if (!target) return;

    let removeGuides: (() => void) | null = null;
    try {
      setIsExporting(true);
      setExportError(null);
      removeGuides = addBleedGuides(target);
      const images = Array.from(target.querySelectorAll("img"));
      await Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );
      if ("fonts" in document) {
        await (document as Document & { fonts: FontFaceSet }).fonts.ready;
      }
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });
      canvas.toBlob((blob) => {
        if (!blob) {
          setExportError("Download failed. Please try again.");
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "imena-invitation.png";
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (err) {
      setExportError(err instanceof Error ? err.message : "Download failed. Please try again.");
    } finally {
      if (removeGuides) removeGuides();
      setIsExporting(false);
    }
  };

  const buildShareUrl = async () => {
    if (isSharing) return;
    setShareError(null);
    setShareCopied(false);

    try {
      setIsSharing(true);
      const endpoint = "/api/invitations";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        setShareError(`Failed to create link (${res.status}). ${text || ""}`.trim());
        return;
      }

      const result = (await res.json()) as { slug?: string; id?: string };
      const slug = result.slug ?? result.id;
      if (!slug) {
        setShareError("Failed to create link. Please try again.");
        return;
      }
      const origin = window.location.origin;
      const url = `${origin}/i/${slug}`;
      setShareUrl(url);

      return url;
    } catch (err) {
      setShareError(err instanceof Error ? err.message : "Failed to create link. Please try again.");
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
              <div className="relative">
                <button
                  onClick={() => setIsDownloadOpen((prev) => !prev)}
                  disabled={isExporting}
                  className="bg-[#153273] text-white px-5 py-2 rounded-full text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  <Download size={14} />
                  {isExporting ? "Downloading..." : "Download"}
                </button>
                {isDownloadOpen ? (
                  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-10">
                    <button
                      onClick={() => {
                        setIsDownloadOpen(false);
                        handleExportPdf();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#153273] hover:bg-[#153273]/5"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => {
                        setIsDownloadOpen(false);
                        handleDownloadImage();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#153273] hover:bg-[#153273]/5"
                    >
                      Download Image
                    </button>
                  </div>
                ) : null}
              </div>
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

          {shareCopied ? (
            <div className="mb-2">
              <p className="text-[10px] text-[#153273] font-bold uppercase tracking-widest">
                Link copied
              </p>
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

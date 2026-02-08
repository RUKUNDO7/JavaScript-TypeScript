"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, XIcon } from "@/app/components/brand-icons";

export default function ShareBar() {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    setError(null);
    const url = window.location.href;
    const title = "Imena Invitation";
    const text = "You're invited. View the invitation here:";

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      setError("Sharing not supported on this device.");
    } catch {
      setError("Unable to share. Please try again.");
    }
  };

  const handleSharePlatform = (platform: "whatsapp" | "facebook" | "x" | "instagram") => {
    const url = window.location.href;
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
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="relative group">
          <button
            onClick={handleShare}
            className="bg-[#153273] text-white w-11 h-11 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg shadow-blue-900/20"
            aria-label="Share link"
          >
            <Share2 size={16} />
          </button>
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] px-2 py-1 rounded-full bg-[#153273] text-white opacity-0 group-hover:opacity-100 transition-opacity">
            Share link
          </span>
        </div>
        <button
          onClick={() => handleSharePlatform("whatsapp")}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#25D366] flex items-center justify-center hover:bg-[#25D366]/10 transition-all"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        >
          <WhatsAppIcon size={16} />
        </button>
        <button
          onClick={() => handleSharePlatform("facebook")}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2]/10 transition-all"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <FacebookIcon size={16} />
        </button>
        <button
          onClick={() => handleSharePlatform("x")}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-black flex items-center justify-center hover:bg-black/5 transition-all"
          aria-label="Share on X"
          title="Share on X"
        >
          <XIcon size={16} />
        </button>
        <button
          onClick={() => handleSharePlatform("instagram")}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#E1306C] flex items-center justify-center hover:bg-[#E1306C]/10 transition-all"
          aria-label="Share on Instagram"
          title="Share on Instagram"
        >
          <InstagramIcon size={16} />
        </button>
      </div>
      {copied ? (
        <p className="text-[11px] text-[#153273] font-bold uppercase tracking-widest">
          Link copied
        </p>
      ) : null}
      {error ? <p className="text-[11px] text-red-600">{error}</p> : null}
    </div>
  );
}

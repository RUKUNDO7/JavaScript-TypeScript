import { ArrowDown, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const steps = [
    { title: "Select Template", desc: "Choose your sub-family branding: Wihogora, Light, or Hope.", side: "left" },
    { title: "Fill Details", desc: "Add event time, date, location, and your custom message.", side: "right" },
    { title: "Live Preview", desc: "Watch the design update in real-time as you type.", side: "left" },
    { title: "Download", desc: "Get your high-res invitation instantly for print or digital.", side: "right" },
  ];

  return (
    <main className="min-h-screen bg-[#F9FAFB]">
      
      {/* --- SECTION 1: THE HERO (RESTORING YOUR EXACT UI) --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* 1. THE 5-POINT ANCHOR SYSTEM (Restored) */}
        <div className="absolute inset-0 z-50 pointer-events-none p-10 flex flex-col justify-between">
          <div className="flex justify-between items-start w-full">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#96712F] font-bold leading-loose">
              Light <br /> Family
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#96712F] font-bold text-center">
              Ku bw'umurava n'icyizere <br /> Imbere hacu heza <br /> Ntituzazima
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#96712F] font-bold text-right">
              Wihogora<br /> Family
            </div>
          </div>
          <div className="flex justify-between items-end w-full">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#96712F] font-bold">
              Hope Family
            </div>
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#96712F] font-bold text-right">
              NKONGI <br /> Family
            </div>
          </div>
        </div>


{/* 2. THE BACKGROUND CRAWL (Restored & Refined) */}
<div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-30">
  <div className="animate-background-crawl whitespace-nowrap flex italic font-[family-name:var(--font-playfair)]">
    {[1, 2, 3].map((i) => (
      <span 
        key={i} 
        className="text-[14rem] px-16 text-transparent border-gold-glow uppercase"
      >
        Imena Family • United in Celebration •
      </span>
    ))}
  </div>
</div>


        {/* 3. HERO CONTENT */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
          <div className="mb-8 inline-flex items-center gap-3 bg-white border border-[#96712F]/20 px-4 py-2 rounded-full shadow-sm">
             <div className="relative w-6 h-6 rounded-full bg-white border border-[#153273]/10 flex items-center justify-center">
               <Image
                 src="/IMENA.png"
                 alt="Imena Logo"
                 fill
                 className="object-contain p-[2px]"
               />
             </div>
             <span className="text-[9px] font-bold tracking-widest text-[#96712F] uppercase">Imena Paper Pop</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-[#153273] leading-[0.9] tracking-tighter mb-8">
            Create Beautiful <br />
            <span className="text-[#96712F] italic font-serif font-normal">
              Imena Invitations
            </span>
          </h1>

          <div className="mt-12 animate-bounce flex flex-col items-center gap-2">
            <p className="text-[10px] font-bold tracking-widest text-[#96712F] uppercase">Scroll to Explore</p>
            <ArrowDown size={30} className="text-[#96712F]" strokeWidth={1} />
          </div>
        </section>
      </section>

      {/* --- SECTION 2: THE TIMELINE (Clean & Separate) --- */}
      <section className="relative z-20 py-32 px-6 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center text-4xl font-black text-[#153273] mb-32 uppercase tracking-tighter">
            How it <span className="text-[#96712F] italic font-serif">Works</span>
          </h2>

          <div className="relative">
            {/* Central Vertical Line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-[#96712F]/20" />

            {steps.map((step, idx) => (
              <div key={idx} className="relative mb-32 last:mb-0">
                {/* Horizontal Connector Line + Circle Terminal */}
                <div className={`absolute top-1/2 -translate-y-1/2 flex items-center ${
                  step.side === 'left' ? 'right-1/2 flex-row-reverse' : 'left-1/2 flex-row'
                }`}>
                  <div className="w-16 h-[2px] bg-[#96712F]/30" />
                  <div className="w-4 h-4 rounded-full border-2 border-[#96712F] bg-white z-10" />
                </div>

                {/* Alternating Cards */}
                <div className={`flex w-full ${step.side === 'left' ? 'justify-start pr-12 md:pr-24' : 'justify-end pl-12 md:pl-24'}`}>
                  <div className="w-full md:w-[420px] bg-[#F9FAFB] p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#96712F]/20 transition-all group">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl font-serif italic text-[#96712F]/40 font-bold group-hover:text-[#96712F] transition-colors">0{idx + 1}</span>
                      <h3 className="text-xl font-bold text-[#153273]">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Links at the bottom of Timeline */}
          <div className="mt-40 flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/generator" className="group flex items-center gap-4 bg-[#153273] text-white px-12 py-5 rounded-full font-bold shadow-2xl transition-all hover:scale-105">
              Open Invitation Form
              <CheckCircle2 size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import Image from "next/image";
import { useRevealChildren } from "../hooks/useReveal";

const FORMATS = [
  {
    id: "imax70mm",
    label: "IMAX 70MM",
    ratio: "1.43:1",
    ratioNum: 1.43,
    tag: "Full Frame",
    desc: "The tallest and widest cinematic canvas ever projected. Shot natively, presented completely.",
    image: "/formats/imax70mm.webp",
    logo: "/imax70mm.svg",
  },
  {
    id: "imax",
    label: "IMAX",
    ratio: "1.90:1",
    ratioNum: 1.90,
    tag: "Digital Laser",
    desc: "40% more picture than standard. Laser-sharp with expanded vertical framing.",
    image: "/formats/imax.webp",
    logo: "/imax.svg",
  },
  {
    id: "70mm",
    label: "70MM FILM",
    ratio: "2.20:1",
    ratioNum: 2.20,
    tag: "Photochemical",
    desc: "Organic grain, rich shadow depth, and a warmth that only photochemical film can produce.",
    image: "/formats/70mm.webp",
    logo: "/70mm.svg",
  },
  {
    id: "35mm",
    label: "35MM SCOPE",
    ratio: "2.39:1",
    ratioNum: 2.39,
    tag: "Anamorphic",
    desc: "Cinema's most iconic widescreen ratio. Oval bokeh, lens flares, the grammar of great films.",
    image: "/formats/35mm.webp",
    logo: "/35mm.svg",
  },
  {
    id: "dolby",
    label: "DOLBY VISION",
    ratio: "1.85:1",
    ratioNum: 1.85,
    tag: "HDR",
    desc: "Three times the brightness. Sixty-four times the contrast. Colours your eye has never seen projected.",
    image: "/formats/dolby-vision.webp",
    logo: "/dolby.svg",
  },
  {
    id: "large",
    label: "LARGE FORMAT",
    ratio: "1.90:1",
    ratioNum: 1.90,
    tag: "PLF",
    desc: "Purpose-built for total immersion. Every seat, every surface, every speaker designed for this.",
    image: "/formats/large-format.webp",
    logo: "/large-format.svg",
  },
];

const MAX_RATIO = 2.39;

export default function FormatGuide() {
  const sectionRef = useRevealChildren(0.08);

  return (
    <section
      id="format-guide"
      className="relative w-full"
      style={{ background: "linear-gradient(to bottom, #000 0%, #060608 50%, #000 100%)" }}
    >
      {/* Ambient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "600px", height: "200px",
          background: "radial-gradient(ellipse, rgba(200,169,110,0.04) 0%, transparent 65%)",
          filter: "blur(45px)",
        }}
      />

      <div ref={sectionRef as React.RefObject<HTMLDivElement>} className="guide-inner">

        {/* Header */}
        <div className="section-header reveal">
          <p className="section-eyebrow">The Formats</p>
          <h2 className="section-title">A Guide to Every Screen</h2>
          <div className="section-rule-sm" />
        </div>

        {/* Premium Grid Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ marginTop: "24px" }}>
          {FORMATS.map((f, i) => (
            <div
              key={f.id}
              className={`reveal reveal-delay-${Math.min(i + 1, 6)} relative flex flex-col justify-between p-8 md:p-9 bg-[#040406]/75 border border-white/[0.04] backdrop-blur-md transition-all duration-500 hover:border-gold/30 hover:bg-[#07070a]/90 hover:shadow-[0_16px_48px_rgba(0,0,0,0.9),0_0_30px_rgba(200,169,110,0.06)] group h-full`}
            >
              {/* Corner decorative marks */}
              <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-white/[0.06] group-hover:border-gold/30 transition-colors duration-300" />
              <div className="absolute top-3 right-3 w-1.5 h-1.5 border-t border-r border-white/[0.06] group-hover:border-gold/30 transition-colors duration-300" />
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 border-b border-l border-white/[0.06] group-hover:border-gold/30 transition-colors duration-300" />
              <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-white/[0.06] group-hover:border-gold/30 transition-colors duration-300" />

              {/* Card Body - Content Stack (Format info first) */}
              <div className="flex-1 flex flex-col justify-between gap-8">
                
                {/* 1. Typography & Info Block */}
                <div>
                  {/* Logo + Tag/Ratio Header */}
                  <div className="flex justify-between items-center mb-7">
                    {/* Format SVG Logo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.logo}
                      alt=""
                      className="format-chip-logo"
                      style={{ height: "14px", width: "auto", display: "block" }}
                      draggable={false}
                    />
                    <div className="flex items-center gap-2.5">
                      <span className="text-[9px] tracking-[0.25em] text-gold/40 uppercase font-sans">
                        {f.tag}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gold/20" />
                      <span className="guide-ratio-label text-[9px] tracking-widest text-gold/50 font-sans border border-gold/15 px-2 py-0.5 bg-gold/[0.02]">
                        {f.ratio}
                      </span>
                    </div>
                  </div>

                  {/* Format Title */}
                  <h3
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "1.2rem",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontWeight: 300,
                      color: "rgba(255, 255, 255, 0.95)",
                      marginBottom: "14px",
                      transition: "color 0.3s ease",
                    }}
                    className="group-hover:text-gold"
                  >
                    {f.label}
                  </h3>

                  {/* Accent separator */}
                  <div className="w-12 h-px bg-gold/15 group-hover:bg-gold/40 transition-all duration-500 mb-5" />

                  {/* Clean, readable description */}
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "0.76rem",
                      lineHeight: "1.8",
                      color: "rgba(255, 255, 255, 0.38)",
                      letterSpacing: "0.025em",
                      transition: "color 0.4s ease",
                      textAlign: "left",
                    }}
                    className="group-hover:text-white/60"
                  >
                    {f.desc}
                  </p>
                </div>

                {/* 2. Preview Frame still (restricted height, wide proportion) */}
                <div
                  className="relative w-full overflow-hidden border border-white/[0.05] bg-black/60 group-hover:border-gold/20 transition-all duration-500"
                  style={{ height: "120px", marginTop: "8px" }}
                >
                  <Image
                    src={f.image}
                    alt={`${f.label} preview`}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:brightness-[1.05]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
                </div>

              </div>

              {/* 3. Aspect Ratio Indicator (placed uniformly at the very bottom of the card) */}
              <div className="guide-ratio-bar-wrap w-full mt-7">
                <div className="guide-ratio-track h-[1px] bg-white/5 w-full overflow-hidden">
                  <div
                    className="guide-ratio-fill h-full bg-gradient-to-r from-gold/40 to-gold/10 transition-all duration-700 ease-out"
                    style={{ width: `${(f.ratioNum / MAX_RATIO) * 100}%` }}
                  />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

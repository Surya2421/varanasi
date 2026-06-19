"use client";

import { useState } from "react";
import Link from "next/link";
import { FORMATS } from "../components/FormatExperience";

export default function ABTestPage() {
  const [activeFormat, setActiveFormat] = useState(FORMATS[0]);

  // Use the exact same aspect ratio spread formula
  const rawPb = (1 / activeFormat.ratio) * 100;
  const mid = 53;
  const pb = mid + (rawPb - mid) * 1.4;

  const isWiderThanVideo = pb < 56.25;
  const iframeWidth = isWiderThanVideo ? "100%" : `${(16 * pb) / 9}%`;
  const iframeHeight = isWiderThanVideo ? `${5625 / pb}%` : "100%";

  return (
    <div className="min-h-screen bg-[#050508] text-white p-8 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold/60 font-semibold" style={{ color: "#c8a96e" }}>Diagnostic Tool</span>
          <h1 className="text-2xl md:text-3xl font-light tracking-wide mt-1">Trailer Sourcing A/B Comparison</h1>
          <p className="text-sm text-white/50 mt-1">Comparing YouTube Iframe vs. Native HTML5 MP4 under identical aspect ratio constraints.</p>
        </div>
        <Link href="/" className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-xs uppercase tracking-widest transition-all duration-300">
          Back to Site
        </Link>
      </header>

      <main className="max-w-7xl mx-auto">
        {/* Format Selector Bar */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center bg-black/40 p-4 border border-white/5">
          {FORMATS.map((format) => {
            const isActive = activeFormat.id === format.id;
            return (
              <button
                key={format.id}
                onClick={() => setActiveFormat(format)}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 border ${
                  isActive
                    ? "bg-[#c8a96e]/10 border-[#c8a96e] text-[#c8a96e]"
                    : "bg-white/5 border-white/5 hover:border-white/20 text-white/60"
                }`}
              >
                {format.label} ({format.ratioLabel})
              </button>
            );
          })}
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* LEFT: YouTube Embed */}
          <div className="flex flex-col gap-4 bg-black/30 p-6 border border-white/5 rounded-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold tracking-wider text-white/90">A: YouTube Iframe Embed</h3>
              <span className="text-[10px] bg-red-900/40 text-red-400 border border-red-900/60 px-2 py-0.5 rounded">
                YouTube Player
              </span>
            </div>
            
            <p className="text-xs text-white/50 leading-relaxed">
              Uses the iframe component with aspect ratio calculations. Rendered inside a box with dynamic width/height percentages to hide letterboxes.
            </p>

            <div className="relative w-full overflow-hidden bg-black border border-white/10" style={{ paddingBottom: `${pb}%`, transition: "padding-bottom 0.75s ease" }}>
              <iframe
                src="https://www.youtube.com/embed/43b6vryuR6I?autoplay=1&mute=1&loop=1&playlist=43b6vryuR6I&playsinline=1&rel=0&modestbranding=1"
                title="YouTube Embed"
                allow="autoplay; encrypted-media"
                className="absolute border-0"
                style={{
                  width: iframeWidth,
                  height: iframeHeight,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  transition: "width 0.75s ease, height 0.75s ease",
                }}
              />
              <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 text-[9px] tracking-wider font-mono text-white/60">
                W: {iframeWidth} | H: {iframeHeight}
              </div>
            </div>
          </div>

          {/* RIGHT: HTML5 Video */}
          <div className="flex flex-col gap-4 bg-black/30 p-6 border border-white/5 rounded-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold tracking-wider text-white/90">B: Native HTML5 Video Element</h3>
              <span className="text-[10px] bg-emerald-900/40 text-emerald-400 border border-emerald-900/60 px-2 py-0.5 rounded">
                Self-Hosted MP4
              </span>
            </div>

            <p className="text-xs text-white/50 leading-relaxed">
              Uses HTML5 <code className="bg-white/5 px-1 py-0.5 text-yellow-400 text-[11px]">&lt;video&gt;</code> with <code className="bg-white/5 px-1 py-0.5 text-yellow-400 text-[11px]">object-fit: cover</code> directly. Hardware accelerated, zero cropping container calculations needed.
            </p>

            <div className="relative w-full overflow-hidden bg-black border border-white/10" style={{ paddingBottom: `${pb}%`, transition: "padding-bottom 0.75s ease" }}>
              <video
                src="/videos/trailer.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  transition: "all 0.75s ease",
                }}
              />
              <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 text-[9px] tracking-wider font-mono text-white/60">
                object-fit: cover
              </div>
            </div>
          </div>
        </div>

        {/* Audit Findings Panel */}
        <section className="bg-black/50 border border-[#c8a96e]/20 p-8 rounded-sm mb-12">
          <h2 className="text-lg font-light tracking-wide text-[#c8a96e] mb-4">Diagnostic Audit Parameters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-white/70 leading-relaxed">
            <div>
              <h3 className="font-semibold text-white mb-2">1. Image Quality & Compression</h3>
              <p className="mb-4">
                <strong>YouTube Iframe:</strong> YouTube applies heavy real-time VP9/AV1 compression. Since it runs inside a third-party frame, the browser cannot optimize rendering with sub-pixel sub-rendering, and the quality is subject to network bandwidth scaling.
              </p>
              <p>
                <strong>HTML5 MP4:</strong> Played directly by the browser's native media player. Natively uses GPU decoding, keeps pixel mapping 1:1, and displays the video with maximum fidelity and sharpness.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">2. Viewport Formatting & Aspect Ratios</h3>
              <p className="mb-4">
                <strong>YouTube Iframe:</strong> Since YouTube wraps the video stream with its own player skin and letterboxing layers, we have to use custom responsive width and height overrides to push YouTube's baked-in black bars outside the parent container.
              </p>
              <p>
                <strong>HTML5 MP4:</strong> Natively supports standard CSS <code className="bg-white/5 px-1 py-0.5 text-yellow-400 text-[11px]">object-fit: cover</code>. The browser automatically handles layout bounds and crops the video stream natively, meaning zero scaling calculations are needed in JS.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

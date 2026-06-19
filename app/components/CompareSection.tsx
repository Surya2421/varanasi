"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRevealChildren } from "../hooks/useReveal";

const SCENES = [
  { id: "africa", label: "Africa Scene", image: "/formats/africa.webp" },
  { id: "antarctica", label: "Antarctica", image: "/formats/antarctica.webp" },
  { id: "asteroid", label: "Asteroid Field", image: "/formats/asteroid.webp" },
  { id: "cave", label: "Ancient Cave", image: "/formats/cave.webp" },
];

interface CompareSectionProps {
  onClose?: () => void;
}

export default function CompareSection({ onClose }: CompareSectionProps) {
  const [activeScene, setActiveScene] = useState(SCENES[0]);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRevealChildren(0.1);

  const updatePos = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (isDragging) updatePos(e.clientX); };
    const onUp   = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isDragging, updatePos]);

  useEffect(() => {
    const onMove = (e: TouchEvent) => { if (isDragging) updatePos(e.touches[0].clientX); };
    const onEnd  = () => setIsDragging(false);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend",  onEnd);
    return () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
  }, [isDragging, updatePos]);

  return (
    <section
      id="compare"
      className="relative w-full"
      style={{
        background: "#000",
        paddingTop: "clamp(56px, 9vw, 104px)",
        paddingBottom: "clamp(56px, 9vw, 104px)",
      }}
    >
      {/* Ambient */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "700px", height: "200px",
          background: "radial-gradient(ellipse, rgba(200,169,110,0.04) 0%, transparent 65%)",
          filter: "blur(55px)",
        }}
      />

      <div
        ref={sectionRef as React.RefObject<HTMLDivElement>}
        className="compare-section-inner"
      >
        {/* Header */}
        <div className="section-header reveal">
          <p className="section-eyebrow">Side by Side</p>
          <h2 className="section-title">Format Comparison</h2>
          <div className="section-rule-sm" />
          <p style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(0.68rem, 1.4vw, 0.78rem)",
            color: "rgba(255,255,255,0.26)",
            textAlign: "center",
            maxWidth: "320px",
            lineHeight: "1.75",
            letterSpacing: "0.03em",
            marginTop: "4px",
          }}>
            Drag to compare how aspect ratio transforms the same frame
          </p>
        </div>

        {/* Scene Tabs Selector */}
        <div
          className="reveal reveal-delay-2"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "32px",
            flexWrap: "wrap",
          }}
        >
          {SCENES.map((scene) => {
            const isActive = activeScene.id === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => setActiveScene(scene)}
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.64rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "10px 20px",
                  background: isActive ? "rgba(200, 169, 110, 0.08)" : "rgba(255, 255, 255, 0.02)",
                  border: `1px solid ${isActive ? "rgba(200, 169, 110, 0.45)" : "rgba(255, 255, 255, 0.08)"}`,
                  color: isActive ? "var(--gold)" : "rgba(255, 255, 255, 0.4)",
                  cursor: "pointer",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className={`hover:border-gold/30 hover:text-white/80`}
              >
                {scene.label}
              </button>
            );
          })}
        </div>

        {/* Slider */}
        <div
          ref={containerRef}
          className="compare-container reveal reveal-delay-3"
          style={{ cursor: isDragging ? "grabbing" : "ew-resize" }}
          onMouseDown={(e) => { e.preventDefault(); setIsDragging(true); updatePos(e.clientX); }}
          onTouchStart={(e) => { setIsDragging(true); updatePos(e.touches[0].clientX); }}
        >
          {/* Right panel: IMAX 70MM — full frame */}
          <div className="absolute inset-0" style={{ background: "#080508" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeScene.image}
              alt={`${activeScene.label} - IMAX 70MM`}
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(1.04)", display: "block" }}
            />
            {/* Letterbox bars showing extra vertical IMAX space */}
            <div className="absolute inset-x-0 top-0" style={{ height: "5%", background: "#030203" }} />
            <div className="absolute inset-x-0 bottom-0" style={{ height: "5%", background: "#030203" }} />
            {/* Label */}
            <div className="absolute bottom-5 right-5" style={{ opacity: sliderPos < 88 ? 1 : 0, transition: "opacity 0.3s ease" }}>
              <p className="label-micro" style={{ color: "rgba(200,169,110,0.65)", textAlign: "right" }}>IMAX 70MM</p>
              <p className="label-micro" style={{ color: "rgba(255,255,255,0.22)", textAlign: "right", fontSize: "0.5rem", marginTop: "2px" }}>1.43:1 · Full Frame</p>
            </div>
          </div>

          {/* Left panel: Mobile 16:9 — clipped by slider */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeScene.image}
              alt={`${activeScene.label} - Mobile 16:9`}
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.76) saturate(0.6)", display: "block" }}
            />
            {/* Label */}
            <div className="absolute bottom-5 left-5" style={{ opacity: sliderPos > 12 ? 1 : 0, transition: "opacity 0.3s ease" }}>
              <p className="label-micro" style={{ color: "rgba(255,255,255,0.5)" }}>Mobile</p>
              <p className="label-micro" style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.5rem", marginTop: "2px" }}>16:9 · Standard</p>
            </div>
          </div>

          {/* Drag handle */}
          <div
            className="absolute inset-y-0 flex flex-col items-center pointer-events-none"
            style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
          >
            <div className="flex-1 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(200,169,110,0.5) 15%, rgba(200,169,110,0.5) 85%, transparent)" }} />
            <div
              className="drag-pulse flex items-center justify-center rounded-full flex-shrink-0"
              style={{
                width: "44px", height: "44px",
                background: "rgba(0,0,0,0.85)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(200,169,110,0.5)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ width: "20px", height: "20px", color: "#c8a96e" }}>
                <path d="M9 18l-6-6 6-6" /><path d="M15 6l6 6-6 6" />
              </svg>
            </div>
            <div className="flex-1 w-px" style={{ background: "linear-gradient(to bottom, rgba(200,169,110,0.5) 15%, transparent)" }} />
          </div>

          {/* Corner marks */}
          <div className="player-corner player-corner-tl" />
          <div className="player-corner player-corner-tr" />
          <div className="player-corner player-corner-bl" />
          <div className="player-corner player-corner-br" />
        </div>

        {/* Legend */}
        <div
          className="reveal reveal-delay-3"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "16px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "10px", height: "10px", border: "1px solid rgba(255,255,255,0.16)" }} />
            <span className="label-micro" style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.52rem" }}>Mobile · 16:9</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="label-micro" style={{ color: "rgba(200,169,110,0.42)", fontSize: "0.52rem" }}>IMAX 70MM · 1.43:1</span>
            <div style={{ width: "10px", height: "10px", border: "1px solid rgba(200,169,110,0.25)" }} />
          </div>
        </div>

        {/* Collapse Button */}
        {onClose && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }} className="reveal reveal-delay-3">
            <button
              onClick={onClose}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "11px 26px",
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "rgba(255, 255, 255, 0.45)",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.35s ease",
              }}
              className="hover:border-white/20 hover:text-white hover:bg-white/[0.04]"
            >
              Collapse Feature
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

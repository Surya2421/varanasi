"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onWatchClick: () => void;
  onExploreClick: () => void;
}

export default function HeroSection({ onWatchClick, onExploreClick }: HeroSectionProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize position between -0.5 and 0.5
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-[100dvh] overflow-hidden"
      style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {/* ── Background ── */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px) scale(1.02)`,
          transition: "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        <Image
          src="/hero-background.webp"
          alt="Varanasi"
          fill
          priority
          quality={95}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-vignette" />
        <div className="absolute inset-x-0 bottom-0 hero-bottom-fade" style={{ height: "55%" }} />
        <div className="absolute inset-x-0 top-0 hero-top-fade" style={{ height: "160px" }} />
      </div>

      {/* Ambient Cinematic Particles */}
      <div className="ambient-particles-wrap">
        <div className="ambient-particle" style={{ left: "15%", animationDuration: "24s", animationDelay: "0s" }} />
        <div className="ambient-particle" style={{ left: "35%", animationDuration: "32s", animationDelay: "-8s" }} />
        <div className="ambient-particle" style={{ left: "55%", animationDuration: "28s", animationDelay: "-14s" }} />
        <div className="ambient-particle" style={{ left: "75%", animationDuration: "36s", animationDelay: "-5s" }} />
        <div className="ambient-particle" style={{ left: "85%", animationDuration: "30s", animationDelay: "-18s" }} />
      </div>

      {/* ── Content — centered column on all breakpoints ── */}
      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          padding: "0 clamp(20px, 6vw, 80px)",
          maxWidth: "860px",
          width: "100%",
          paddingBottom: "clamp(85px, 12vh, 125px)",
        }}
      >
        {/* Director label */}
        <p
          className="label-micro fade-up fade-up-delay-1"
          style={{ color: "rgba(255,255,255,0.35)", marginBottom: "clamp(16px, 3vw, 28px)" }}
        >
          JAI BABU
        </p>

        {/* ── Logo ── transparent PNG, no box */}
        <div
          className="hero-logo-wrap fade-up fade-up-delay-2"
          style={{ marginBottom: "clamp(20px, 4vw, 36px)", width: "100%", position: "relative" }}
        >
          <div 
            className="hero-logo-atmosphere" 
            style={{
              transform: `translate(${mousePos.x * 24}px, ${mousePos.y * 24}px)`,
              transition: "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/varanasi-logo-transparent.png"
            alt="Vāranāsi"
            className="hero-logo-img"
            draggable={false}
            loading="eager"
            style={{ 
              margin: "0 auto",
              transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`,
              transition: "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          />
        </div>

        {/* Tagline */}
        <p
          className="fade-up fade-up-delay-3"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(0.7rem, 1.8vw, 0.95rem)",
            letterSpacing: "0.55em",
            textTransform: "uppercase",
            fontStyle: "italic",
            color: "rgba(255,255,255,0.26)",
            marginBottom: "clamp(36px, 6vw, 56px)",
          }}
        >
          The beginning of everything
        </p>

        {/* CTA row */}
        <div
          className="fade-up fade-up-delay-4"
          style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" }}
        >
          {/* PRIMARY */}
          <button id="hero-watch-trailer" onClick={onWatchClick} className="cta-primary">
            <span className="cta-play-ring">
              <span className="cta-play-ring-outer" />
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "14px", height: "14px", marginLeft: "2px", color: "var(--gold)" }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="cta-primary-text">
              <span className="cta-primary-label">Into The World</span>
              <span className="cta-primary-sub"> In Cinema's April 7, 2027</span>
            </span>
          </button>

          {/* SECONDARY */}
          <button id="hero-explore-formats" onClick={onExploreClick} className="cta-secondary">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.1" className="cta-secondary-icon" style={{ width: "16px", height: "16px" }}>
              <rect x="2" y="2" width="6.5" height="6.5" rx="0.5" />
              <rect x="11.5" y="2" width="6.5" height="4" rx="0.5" />
              <rect x="2" y="11.5" width="6.5" height="6.5" rx="0.5" />
              <rect x="11.5" y="9" width="6.5" height="9" rx="0.5" />
            </svg>
            <span className="cta-secondary-label">Expreance Formats</span>
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute left-1/2 fade-up fade-up-delay-5"
        style={{
          bottom: "clamp(24px, 4vw, 40px)",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          opacity: 0.3,
        }}
      >
        <span className="label-micro" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.5rem" }}>Scroll</span>
        <div
          className="bounce-gentle"
          style={{
            width: "1px",
            height: "36px",
            background: "linear-gradient(to bottom, rgba(200,169,110,0.6), transparent)",
          }}
        />
      </div>
    </section>
  );
}

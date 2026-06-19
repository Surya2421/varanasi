"use client";

import { useRef, useState } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FormatExperience from "./components/FormatExperience";
import CompareSection from "./components/CompareSection";
import FormatGuide from "./components/FormatGuide";
import Footer from "./components/Footer";

export default function Home() {
  const formatRef = useRef<HTMLElement>(null);
  const [playTrailerTrigger, setPlayTrailerTrigger] = useState(0);
  const [isCompareVisible, setIsCompareVisible] = useState(false);

  const scrollToTrailer = () => {
    setPlayTrailerTrigger((prev) => prev + 1);
    formatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToFormats = () => {
    formatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="grain relative min-h-screen bg-black">
      <Navbar onCompareClick={() => setIsCompareVisible(true)} />
      <HeroSection onWatchClick={scrollToTrailer} onExploreClick={scrollToFormats} />

      {/* Section divider */}
      <div className="section-rule" />

      <FormatExperience ref={formatRef} playTrailerTrigger={playTrailerTrigger} />

      <div className="section-rule" />

      {/* Compare Section Teaser / Interactive Slider */}
      {!isCompareVisible ? (
        <section
          id="compare"
          className="relative w-full flex flex-col items-center justify-center text-center"
          style={{
            background: "#000",
            paddingTop: "clamp(80px, 12vw, 140px)",
            paddingBottom: "clamp(80px, 12vw, 140px)",
            paddingLeft: "var(--pad-x)",
            paddingRight: "var(--pad-x)",
          }}
        >
          {/* Ambient background glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              width: "500px", height: "200px",
              background: "radial-gradient(ellipse, rgba(200, 169, 110, 0.03) 0%, transparent 60%)",
              filter: "blur(50px)",
            }}
          />

          <div className="relative z-10 max-w-[500px] w-full flex flex-col items-center gap-6">
            <p className="section-eyebrow">Interactive Feature</p>
            <h2 className="section-title">Format Comparison</h2>
            <div className="section-rule-sm" />
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(0.75rem, 1.6vw, 0.88rem)",
                color: "rgba(255,255,255,0.45)",
                lineHeight: "1.75",
                letterSpacing: "0.03em",
                maxWidth: "360px",
                marginTop: "4px",
              }}
            >
              Compare the giant IMAX 70mm canvas side-by-side with standard mobile framing across various scenes.
            </p>

            <button
              onClick={() => setIsCompareVisible(true)}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.68rem",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                padding: "14px 32px",
                background: "rgba(200, 169, 110, 0.04)",
                border: "1px solid rgba(200, 169, 110, 0.35)",
                color: "#fff",
                cursor: "pointer",
                marginTop: "12px",
                backdropFilter: "blur(8px)",
                transition: "all 0.4s ease",
              }}
              className="hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_24px_rgba(200,169,110,0.25)] hover:scale-105"
            >
              Launch Comparison
            </button>
          </div>
        </section>
      ) : (
        <CompareSection onClose={() => setIsCompareVisible(false)} />
      )}

      <div className="section-rule" />

      <FormatGuide />

      <Footer />
    </main>
  );
}

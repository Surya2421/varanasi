"use client";

import { useState, useRef, forwardRef, useEffect } from "react";

export interface Format {
  id: string;
  label: string;
  tag: string;
  ratio: number;
  ratioLabel: string;
  description: string;
  detail: string;
  imageUrl: string;
  logoUrl: string;
}

export const FORMATS: Format[] = [
  {
    id: "imax70mm",
    label: "IMAX 70MM",
    tag: "Full Frame",
    ratio: 1.43,
    ratioLabel: "1.43:1",
    description: "The largest film format ever projected",
    detail: "Shot and presented in the full IMAX 70mm frame — the tallest, widest canvas in cinematic history. Every frame fills your peripheral vision completely.",
    imageUrl: "/formats/imax70mm.webp",
    logoUrl: "/imax70mm.svg",
  },
  {
    id: "imax",
    label: "IMAX",
    tag: "Digital",
    ratio: 1.90,
    ratioLabel: "1.90:1",
    description: "Laser-projected with expanded vertical frame",
    detail: "IMAX Digital laser projection delivers 40% more picture than standard. Crystal-clear 4K imagery with expanded vertical framing designed for the biggest screens.",
    imageUrl: "/formats/imax.webp",
    logoUrl: "/imax.svg",
  },
  {
    id: "70mm",
    label: "70MM",
    tag: "Film",
    ratio: 2.20,
    ratioLabel: "2.20:1",
    description: "Photochemical grain — organic warmth",
    detail: "Projected from actual 70mm film stock. The photochemical process creates organic grain, rich shadows, and a tactile warmth that digital cannot replicate.",
    imageUrl: "/formats/70mm.webp",
    logoUrl: "/70mm.svg",
  },
  {
    id: "35mm",
    label: "35MM",
    tag: "Scope",
    ratio: 2.39,
    ratioLabel: "2.39:1",
    description: "Anamorphic scope — the classic widescreen",
    detail: "The anamorphic 2.39:1 scope ratio — cinema's most iconic widescreen format. Horizontal lens flares, oval bokeh, and the expansive canvas of classic cinema.",
    imageUrl: "/formats/35mm.webp",
    logoUrl: "/35mm.svg",
  },
  {
    id: "dolby",
    label: "DOLBY VISION",
    tag: "HDR",
    ratio: 1.85,
    ratioLabel: "1.85:1",
    description: "HDR with expanded colour and contrast",
    detail: "Dolby Vision HDR at 1.85:1 — three times the brightness, 64 times the contrast of standard. Colours and shadow detail the eye has never seen in a cinema.",
    imageUrl: "/formats/dolby-vision.webp",
    logoUrl: "/dolby.svg",
  },
  {
    id: "large",
    label: "LARGE FORMAT",
    tag: "PLF",
    ratio: 1.90,
    ratioLabel: "1.90:1",
    description: "Premium screens — total immersion",
    detail: "Purpose-built premium large format screens with enhanced projection, superior sound, and immersive seating designed to dissolve the boundary between audience and film.",
    imageUrl: "/formats/large-format.webp",
    logoUrl: "/large-format.svg",
  },
];

const FormatExperience = forwardRef<HTMLElement, { playTrailerTrigger?: number }>(
  ({ playTrailerTrigger = 0 }, ref) => {
    const [activeFormat, setActiveFormat] = useState<Format>(FORMATS[0]);
    const [isChanging, setIsChanging] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const chipsRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const savedTimeRef = useRef<number>(0);
    const wasPlayingRef = useRef<boolean>(false);
    const stalledTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      return () => {
        if (stalledTimeoutRef.current) {
          clearTimeout(stalledTimeoutRef.current);
        }
      };
    }, []);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const selectFormat = (format: Format) => {
      if (format.id === activeFormat.id) {
        setIsPlayingTrailer((prev) => !prev);
        return;
      }

      // Capture time and play status before changing format
      if (videoRef.current && isPlayingTrailer) {
        savedTimeRef.current = videoRef.current.currentTime;
        wasPlayingRef.current = !videoRef.current.paused;
        try {
          videoRef.current.pause();
        } catch (e) {
          console.error("Error pausing video during selectFormat:", e);
        }
      } else {
        savedTimeRef.current = 0;
        wasPlayingRef.current = false;
      }

      setIsLoaded(false);
      setIsChanging(true);
      setTimeout(() => {
        setActiveFormat(format);
        setIsChanging(false);
      }, 380);
    };

    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        const restoreTime = savedTimeRef.current;
        if (restoreTime > 0) {
          videoRef.current.currentTime = restoreTime;
          savedTimeRef.current = 0; // Reset after restoring
        }
        if (wasPlayingRef.current) {
          videoRef.current.play().catch((err) => {
            console.warn("Auto-play recovery failed/blocked:", err);
          });
        }
      }
    };

    const handleCanPlay = () => {
      setIsLoaded(true);
      if (stalledTimeoutRef.current) {
        clearTimeout(stalledTimeoutRef.current);
      }
    };

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
    };

    const handleWaiting = () => {
      setIsLoaded(false);
    };

    const handlePlaying = () => {
      setIsLoaded(true);
      if (stalledTimeoutRef.current) {
        clearTimeout(stalledTimeoutRef.current);
      }
    };

    const handleStalled = () => {
      setIsLoaded(false);

      if (stalledTimeoutRef.current) {
        clearTimeout(stalledTimeoutRef.current);
      }
      stalledTimeoutRef.current = setTimeout(() => {
        if (videoRef.current && !videoRef.current.paused) {
          console.warn("Video playback stalled, attempting play recovery...");
          videoRef.current.play().catch((err) => {
            console.error("Failed to recover stalled video playback:", err);
          });
        }
      }, 4000);
    };

    useEffect(() => {
      if (playTrailerTrigger > 0) {
        wasPlayingRef.current = true;
        savedTimeRef.current = 0;
        setIsPlayingTrailer(true);
      }
    }, [playTrailerTrigger]);

    useEffect(() => {
      setIsLoaded(false);

      // Re-initialize and load the new video element on format change
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.src = activeFormat.id === "imax70mm" ? "/videos/imax70mm.mp4" : "/videos/trailer.mp4";
          videoRef.current.load();
        } catch (e) {
          console.error("Error preparing new video element during activeFormat change:", e);
        }
      }

      if (!chipsRef.current) return;
      const btn = chipsRef.current.querySelector<HTMLElement>(".format-chip-btn.active");
      btn?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [activeFormat.id]);

    // Amplify the visual spread between aspect ratios.
    // Raw range: ~42% (2.39:1) to ~70% (1.43:1) = 28pt spread.
    // Amplified: ~37% to ~77% = 40pt spread — IMAX 70MM feels
    // dramatically taller, 35MM Scope feels noticeably more cropped.
    const rawPb = (1 / activeFormat.ratio) * 100;
    const mid = 53;
    const pb = mid + (rawPb - mid) * 1.4;

    const isImax70mm = activeFormat.id === "imax70mm";
    const objectFitMode = "cover";


    return (
      <section
        id="format-experience"
        ref={ref}
        className="relative w-full"
        style={{ background: "linear-gradient(to bottom, #000 0%, #05050a 55%, #000 100%)" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "900px", height: "260px",
            background: "radial-gradient(ellipse, rgba(200,169,110,0.065) 0%, transparent 65%)",
            filter: "blur(70px)",
          }}
        />

        <div className="relative w-full" style={{ maxWidth: "var(--container-max)", margin: "0 auto" }}>

          {/* ── Section header ── */}
          <div
            className="text-center"
            style={{ paddingTop: "clamp(56px,8vw,96px)", paddingBottom: "clamp(28px,4vw,48px)", paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}
          >
            <p className="section-eyebrow" style={{ marginBottom: "10px" }}>Format Experience</p>
            <h2 className="section-title">Choose How You See It</h2>
            <div className="section-rule-sm" style={{ margin: "14px auto 0" }} />
          </div>

          {/* ── Two-column layout (stacked mobile, side-by-side desktop) ── */}
          <div className="fe-layout">

            {/* LEFT / TOP: Player column */}
            <div className="fe-player-col">

              {/* Format announcement — above player */}
              <div
                key={`announcement-${activeFormat.id}`}
                className={`format-announcement animate-format-title ${isChanging ? "changing" : ""}`}
                style={{
                  paddingLeft: "var(--pad-x)",
                  paddingRight: "var(--pad-x)",
                  paddingBottom: "clamp(14px, 2.5vw, 22px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "6px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeFormat.logoUrl}
                    alt=""
                    className="format-announcement-logo"
                    style={{
                      height: "clamp(20px, 4vw, 32px)",
                      width: "auto",
                      transition: "all 0.3s ease",
                    }}
                    draggable={false}
                  />
                  <div className="format-name-display">{activeFormat.label}</div>
                </div>
                <div className="format-ratio-display">{activeFormat.ratioLabel} · {activeFormat.tag}</div>
              </div>

              {/* Player */}
              <div style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)" }}>
                <div
                  className={`format-player-frame ${isChanging ? "changing" : ""}`}
                  style={{ paddingBottom: `${pb}%` }}
                >
                  {isPlayingTrailer ? (
                    <>
                      {!isLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center animate-fade-in" style={{ background: "#050508", zIndex: 1 }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                            <div
                              style={{
                                width: "32px", height: "32px",
                                border: "1px solid rgba(200,169,110,0.2)",
                                borderTopColor: "#c8a96e",
                                borderRadius: "50%",
                                animation: "spin 0.9s linear infinite",
                              }}
                            />
                            <span className="label-micro" style={{ color: "rgba(200,169,110,0.38)" }}>Loading Trailer</span>
                          </div>
                        </div>
                      )}
                      <video
                        ref={videoRef}
                        src={isImax70mm ? "/videos/imax70mm.mp4" : "/videos/trailer.mp4"}
                        poster="/trailer-poster.jpg"
                        preload="metadata"
                        autoPlay
                        controls
                        playsInline
                        onLoadedMetadata={handleLoadedMetadata}
                        onCanPlay={handleCanPlay}
                        onCanPlayThrough={handleCanPlayThrough}
                        onWaiting={handleWaiting}
                        onPlaying={handlePlaying}
                        onStalled={handleStalled}
                        className="absolute inset-0 w-full h-full border-0"
                        style={{
                          zIndex: 0,
                          objectFit: objectFitMode,
                          filter: activeFormat.id === "dolby" ? "contrast(1.12) brightness(1.02) saturate(1.08)" : "none",
                          opacity: isLoaded ? 1 : 0,
                          transition: "opacity 0.5s ease, filter 0.55s ease",
                        }}
                      />
                      {/* Glassmorphic back button to return to format preview */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          savedTimeRef.current = 0;
                          wasPlayingRef.current = false;
                          if (stalledTimeoutRef.current) {
                            clearTimeout(stalledTimeoutRef.current);
                          }
                          setIsPlayingTrailer(false);
                          setIsLoaded(false);
                        }}
                        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded bg-black/85 hover:bg-black/95 border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-[10px] uppercase tracking-widest transition-all duration-300 font-sans cursor-pointer shadow-lg"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: "12px", height: "12px" }}>
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                        Close Video
                      </button>
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 w-full h-full overflow-hidden group cursor-pointer"
                      onClick={() => {
                        wasPlayingRef.current = true;
                        savedTimeRef.current = 0;
                        setIsPlayingTrailer(true);
                        setIsLoaded(false);
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeFormat.imageUrl}
                        alt={activeFormat.label}
                        className="absolute inset-0 w-full h-full border-0"
                        style={{
                          objectFit: "cover",
                          transform: isChanging ? "scale(1.05)" : "scale(1.005)",
                          filter: `${activeFormat.id === "dolby" ? "contrast(1.15) brightness(1.05) saturate(1.1) " : ""}${isChanging ? "blur(8px) brightness(0.6)" : "blur(0px) brightness(1)"
                            }`,
                          opacity: isChanging ? 0.35 : 1,
                          transition: "filter 0.55s ease, transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.55s ease",
                        }}
                      />

                      {/* Cinematic vignette / depth overlay */}
                      <div className="absolute inset-0 hero-vignette pointer-events-none" />

                      {/* Play CTA Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 group-hover:bg-black/15 transition-colors duration-500">
                        <div className="relative flex items-center justify-center w-16 h-16 rounded-full border border-gold/30 bg-black/70 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-gold group-hover:shadow-[0_0_24px_rgba(200,169,110,0.35)]">
                          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "22px", height: "22px", color: "var(--gold)", marginLeft: "2px" }}>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <span className="label-micro text-gold/80 tracking-widest text-[0.6rem] mt-3 group-hover:text-gold transition-colors duration-300">Play Trailer</span>
                      </div>
                    </div>
                  )}
                  {isImax70mm && (
                    <div className="absolute inset-0 border border-gold/30 pointer-events-none z-10 animate-imax-frame-pulse" />
                  )}
                  <div className="player-corner player-corner-tl" />
                  <div className="player-corner player-corner-tr" />
                  <div className="player-corner player-corner-bl" />
                  <div className="player-corner player-corner-br" />
                </div>
                {/* Fallback direct link below player */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "12px" }}>
                  <a
                    href={isImax70mm ? "/videos/imax70mm.mp4" : "/videos/trailer.mp4"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label-micro hover:text-gold transition-colors duration-300"
                    style={{ fontSize: "0.55rem", opacity: 0.4, display: "flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "10px", height: "10px" }}>
                      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                    </svg>
                    Trouble viewing? Watch Native Source
                  </a>
                </div>
              </div>

              {/* Detail text — under player on mobile, hidden on desktop (shown in sidebar) */}
              <div
                className={`format-desc-band fe-mobile-desc ${isChanging ? "changing" : ""}`}
                style={{ paddingLeft: "var(--pad-x)", paddingRight: "var(--pad-x)", paddingBottom: "4px" }}
              >
                <p style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(0.78rem, 1.8vw, 0.88rem)",
                  color: "rgba(255,255,255,0.48)",
                  maxWidth: "560px",
                  margin: "0 auto",
                  textAlign: "center",
                  lineHeight: "1.75",
                  letterSpacing: "0.03em",
                }}>
                  {activeFormat.detail}
                </p>
              </div>

              {/* Chips bar — horizontal scroll on mobile, hidden on desktop (shown in sidebar) */}
              <div
                ref={chipsRef}
                className="format-chips-bar fe-mobile-chips"
                style={{ marginTop: "clamp(16px, 3vw, 28px)" }}
              >
                {FORMATS.map((format) => {
                  const isActive = activeFormat.id === format.id;
                  return (
                    <button
                      key={format.id}
                      id={`format-chip-${format.id}`}
                      onClick={() => selectFormat(format)}
                      className={`format-chip-btn ${isActive ? "active" : ""}`}
                    >
                      <div className="chip-content-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={format.logoUrl}
                          alt=""
                          className="format-chip-logo"
                          draggable={false}
                        />
                        <span className="chip-name">{format.label}</span>
                      </div>
                      <span className="chip-ratio">{format.ratioLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Sidebar — only visible on desktop (lg+) */}
            <div className="fe-sidebar">
              <div className="fe-sidebar-inner">

                {/* Active format info */}
                <div
                  key={`sidebar-desc-${activeFormat.id}`}
                  className={`animate-format-title ${isChanging ? "changing" : ""}`}
                  style={{ transition: "opacity 0.28s ease, transform 0.28s ease" }}
                >
                  {/* Eyebrow */}
                  <p className="label-micro" style={{ color: "rgba(200,169,110,0.4)", marginBottom: "8px" }}>
                    Now Selecting
                  </p>

                  {/* Active Format Logo and Tag */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeFormat.logoUrl}
                      alt=""
                      className="format-sidebar-logo"
                      style={{
                        height: "18px",
                        width: "auto",
                        transition: "all 0.3s ease",
                      }}
                      draggable={false}
                    />
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "0.6rem",
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        color: "rgba(200,169,110,0.55)",
                      }}
                    >
                      {activeFormat.tag}
                    </p>
                  </div>

                  {/* Gold rule */}
                  <div style={{ width: "32px", height: "1px", background: "rgba(200,169,110,0.3)", marginBottom: "20px" }} />

                  {/* Detail text */}
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "0.78rem",
                      color: "rgba(255,255,255,0.32)",
                      lineHeight: "1.8",
                      letterSpacing: "0.025em",
                    }}
                  >
                    {activeFormat.detail}
                  </p>
                </div>

                {/* Separator */}
                <div
                  style={{
                    width: "100%",
                    height: "1px",
                    background: "linear-gradient(to right, rgba(200,169,110,0.15), transparent)",
                    margin: "28px 0",
                  }}
                />

                {/* Vertical chip list — desktop only */}
                {(() => {
                  const activeIndex = FORMATS.findIndex((f) => f.id === activeFormat.id);
                  
                  return (
                    <div
                      className="format-chips-bar fe-desktop-chips relative"
                      style={{ flex: 1 }}
                    >
                      {/* Sliding active indicator bar */}
                      <div
                        className="absolute left-0 w-[2px] pointer-events-none transition-all duration-300 ease-out"
                        style={{
                          height: "54px",
                          transform: `translateY(${activeIndex * 54}px)`,
                          background: "var(--gold)",
                          boxShadow: "0 0 10px rgba(200,169,110,0.4)",
                        }}
                      />
                      {FORMATS.map((format) => {
                        const isActive = activeFormat.id === format.id;
                        return (
                          <button
                            key={`sidebar-${format.id}`}
                            id={`sidebar-chip-${format.id}`}
                            onClick={() => selectFormat(format)}
                            className={`format-chip-btn ${isActive ? "active" : ""}`}
                            style={{ height: "54px" }}
                          >
                            <div className="chip-content-wrapper" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={format.logoUrl}
                                alt=""
                                className="format-chip-logo"
                                draggable={false}
                              />
                              <span className="chip-name">{format.label}</span>
                            </div>
                            <span className="chip-ratio">{format.ratioLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Bottom padding */}
          <div style={{ height: "clamp(48px, 8vw, 96px)" }} />
        </div>
      </section>
    );
  });

FormatExperience.displayName = "FormatExperience";
export default FormatExperience;

import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="relative w-full"
      style={{
        borderTop: "1px solid rgba(200,169,110,0.06)",
        padding: "96px 24px 80px",
        background: "linear-gradient(to bottom, #000 0%, #030305 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-14">

        {/* Theatrical Credits Block */}
        <div
          className="flex flex-col md:flex-row justify-center items-center md:items-stretch gap-12 md:gap-24 w-full"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {/* Left Column: Special Thanks */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right gap-4 flex-1">
            <span className="label-micro text-[10px] tracking-[0.3em] text-white/30 uppercase">
              Special Thanks
            </span>
            <div className="flex flex-col gap-2">
              <p className="font-serif text-white/80 text-sm tracking-widest font-light hover:text-gold transition-colors duration-300">
                S. S. RAJAMOULI
              </p>
              <p className="font-serif text-white/80 text-sm tracking-widest font-light hover:text-gold transition-colors duration-300">
                MAHESH BABU
              </p>
              <p className="font-serif text-white/50 text-xs tracking-widest font-light">
                THE ENTIRE VARANASI TEAM
              </p>
            </div>
          </div>

          {/* Vertical Divider line for MD+ screens */}
          <div className="hidden md:block w-px bg-white/5" style={{ minHeight: "100px" }} />

          {/* Right Column: Creation credits */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 flex-1">
            <span className="label-micro text-[10px] tracking-[0.3em] text-white/30 uppercase">
              Concept, Design & Development
            </span>
            <div className="flex flex-col gap-2">
              <p className="font-serif text-gold/85 text-sm tracking-widest font-light hover:text-gold transition-colors duration-300">
                SURYA
              </p>
            </div>
          </div>
        </div>

        {/* Small transparent logo centered */}
        <div className="flex flex-col items-center gap-4 w-full mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/varanasi-logo-transparent.png"
            alt="Varanasi"
            draggable={false}
            style={{
              width: "110px",
              height: "auto",
              opacity: 0.16,
              filter: "brightness(0.9) grayscale(1) drop-shadow(0 0 4px rgba(200,169,110,0.15))",
              mixBlendMode: "screen",
              display: "block",
            }}
          />
          <span
            className="label-micro tracking-[0.45em] text-white/20 text-[9px] uppercase font-sans"
            style={{ marginTop: "8px" }}
          >
            JAI BABU A Fan-Made Cinematic Experience
          </span>
          <p className="label-micro text-[8px] tracking-widest text-white/10 mt-1 font-sans">
            &copy; {new Date().getFullYear()} Varanasi Project. Built with passion.
          </p>
        </div>
      </div>
    </footer>
  );
}

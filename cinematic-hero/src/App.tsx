import React from 'react';
import { ArrowRight } from 'lucide-react';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260717_120352_eb988725-1351-43b3-8095-16e4a1005e3d.mp4';

export const App: React.FC = () => {
  return (
    <div className="h-screen w-full bg-black p-3 md:p-4 font-inter select-none">
      {/* Inner Container: Liquid-glass container with rounded corners and background video */}
      <div className="w-full h-full rounded-2xl flex flex-col overflow-hidden relative bg-black">
        {/* Background Video */}
        <video
          src={BG_VIDEO}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover anim-fade"
          style={{ animationDelay: '0.2s' }}
        />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
          {/* Logo Block */}
          <div
            className="anim-stagger flex flex-col items-center"
            style={{ animationDelay: '0.1s' }}
          >
            <svg
              viewBox="0 0 256 256"
              className="w-14 h-14 md:w-16 md:h-16 fill-white"
            >
              <path d="M 128 128 L 128 0 A 128 128 0 0 0 0 128 Z M 128 128 L 256 128 A 128 128 0 0 0 128 0 Z M 128 128 L 128 256 A 128 128 0 0 0 256 128 Z M 128 128 L 0 128 A 128 128 0 0 0 128 256 Z" />
            </svg>
            <span className="text-white text-[10px] md:text-xs tracking-[0.4em] mt-1 font-light block text-center">
              V O R T X
            </span>
          </div>

          {/* Nav Buttons */}
          <div
            className="anim-stagger flex items-center gap-3"
            style={{ animationDelay: '0.2s' }}
          >
            <button
              type="button"
              className="hidden md:block px-5 py-2.5 text-white text-sm hover:bg-white/10 btn-cut-border cursor-pointer transition-colors"
            >
              <span>Neural Synergy</span>
            </button>

            <button
              type="button"
              className="hidden md:block px-5 py-2.5 bg-white text-black text-sm hover:bg-white/90 btn-cut cursor-pointer transition-colors"
            >
              <span>Cyber Synthesis</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-between px-6 md:px-10 pb-8 md:pb-10">
          {/* Top Section */}
          <div className="flex-1 flex items-center relative">
            {/* Left Column (hidden below lg) */}
            <div
              className="anim-stagger hidden lg:flex flex-col gap-6 absolute left-0 top-[18%]"
              style={{ animationDelay: '0.4s' }}
            >
              <p className="text-white/80 text-base leading-relaxed max-w-[220px]">
                Come with us
                <br />
                exploring the
                <br />
                horizon
              </p>

              {/* Decorative Group */}
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full border border-white/40" />
                  <div className="w-1 h-1 rounded-full border border-white/40" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-white/70 text-xs leading-tight">
                    Perpetual
                    <br />
                    Immersion
                  </span>
                  <span className="text-white/50 text-xs font-mono">01</span>
                </div>
              </div>
            </div>

            {/* Center Heading */}
            <div
              className="anim-stagger w-full text-center"
              style={{ animationDelay: '0.5s' }}
            >
              <h1
                className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal leading-[1.1] tracking-[-0.04em]"
                style={{ textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}
              >
                Forging Tomorrow
                <br />
                Virtual Horizon
                <br />
                VortxLab Creations
              </h1>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mt-8">
            {/* Col 1 */}
            <div
              className="anim-stagger flex items-center justify-center md:justify-end"
              style={{ animationDelay: '0.7s' }}
            >
              <p className="text-white text-sm leading-relaxed max-w-[260px] text-center md:text-left md:ml-auto">
                We push past conventions, reshaping the virtual terrain with
                next-level technologies.
              </p>
            </div>

            {/* Col 2 */}
            <div
              className="anim-stagger flex flex-col items-center gap-8 md:gap-24"
              style={{ animationDelay: '0.85s' }}
            >
              <span className="text-white text-2xl md:text-3xl font-medium">
                Net Dynamics
              </span>
              <button
                type="button"
                className="w-full max-w-[280px] py-3.5 bg-white flex items-center justify-center gap-2 text-black hover:bg-white/90 transition-colors group btn-cut cursor-pointer"
              >
                <span className="text-sm font-medium">Discover Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Col 3: Social Icons */}
            <div
              className="anim-stagger flex items-center justify-center md:justify-end gap-3"
              style={{ animationDelay: '1s' }}
            >
              {/* X (Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="w-10 h-10 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors btn-cut-sm cursor-pointer"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors btn-cut-sm cursor-pointer"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-white flex items-center justify-center text-black hover:bg-white/90 transition-colors btn-cut-sm cursor-pointer"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

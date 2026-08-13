import React from 'react';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260714_113715_c7e0daa0-8bdd-4486-a2da-040901f8f0ea.mp4';

export const App: React.FC = () => {
  const navLinks = [
    { label: 'Collection', href: '#collection' },
    { label: 'Our Story', href: '#story' },
    { label: 'Rituals', href: '#rituals' },
    { label: 'Reach Us', href: '#contact' },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-start text-center px-4 font-sans select-none">
      {/* Background Video (z-0) */}
      <video
        src={BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 w-full h-[130%] object-cover object-top pointer-events-none"
      />

      {/* Navigation Bar (z-20) */}
      <header className="relative z-20 w-full pt-4 md:pt-6 flex justify-center px-4">
        <nav className="inline-flex items-center justify-between gap-6 sm:gap-8 bg-white/70 backdrop-blur-md rounded-xl px-4 md:px-6 py-3 shadow-sm border border-white/40">
          {/* YOUNOYA Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80 select-none group"
          >
            <div className="w-5 h-5 flex items-center justify-center text-[#B8860B] font-bold text-sm">
              ✦
            </div>
            <span className="font-serif tracking-widest text-base font-semibold text-[#1B133C] uppercase">
              YOUNOYA
            </span>
          </a>

          {/* Navigation Links (hidden on mobile, shown sm+) */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#1B133C]/80 hover:text-[#1B133C] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* Hero Content (z-10) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-8 md:mt-16 max-w-4xl mx-auto px-4">
        {/* Badge: YOUNOYA Signature */}
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-xl border border-[#1B133C]/10 bg-white/70 backdrop-blur-sm px-4 py-2 text-sm font-medium text-[#1B133C] shadow-xs animate-fade-rise">
          <div className="bg-[#B8860B] rounded w-5 h-5 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            ✦
          </div>
          <span>YOUNOYA // For Every Chapter</span>
        </div>

        {/* Heading */}
        <h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight text-[#1B133C] max-w-4xl animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Consecrated grace
          <br />
          for every chapter
        </h1>

        {/* Subtitle */}
        <p className="mt-5 sm:mt-6 max-w-3xl text-xs sm:text-sm md:text-base leading-relaxed text-[#1B133C]/70 font-normal animate-fade-rise-delay">
          Handcrafted spiritual keepsakes, sacred elements, and timeless
          artistry energized with authentic Vedic blessings. Delivered across
          India with frictionless zero-password express checkout.
        </p>

        {/* CTA Button */}
        <button
          type="button"
          className="mt-7 sm:mt-8 rounded-xl bg-[#FEFEFE] px-6 sm:px-8 py-3 sm:py-3.5 text-sm font-semibold text-[#1B133C] shadow-[0px_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0px_6px_16px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 animate-fade-rise-delay-2 cursor-pointer"
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: 'Collection', href: '#collection' },
    { label: 'Our Story', href: '#story' },
    { label: 'Rituals', href: '#rituals' },
    { label: 'Vedic Science', href: '#science' },
    { label: 'Reach Us', href: '#contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none px-6 sm:px-10 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo (top-left) with custom SVG geometric logo + YOUNOYA */}
          <a
            href="#"
            className="pointer-events-auto flex items-center gap-3 group select-none"
          >
            <div className="w-7 h-7 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <svg
                viewBox="0 0 256 256"
                className="w-7 h-7 fill-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              >
                <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
              </svg>
            </div>
            <span className="font-serif tracking-widest text-lg sm:text-xl font-normal text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              YOUNOYA
            </span>
          </a>

          {/* Desktop center pill nav (hidden on mobile) */}
          <nav className="pointer-events-auto hidden md:flex items-center gap-1 px-4 py-2 rounded-full liquid-glass shadow-2xl">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/70 hover:text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA (top-right, hidden on mobile) */}
          <div className="pointer-events-auto hidden md:flex items-center">
            <a
              href="#reserve"
              className="liquid-glass rounded-full px-5 py-2.5 flex items-center gap-2.5 text-sm font-medium text-white hover:text-white transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>Reserve Yours</span>
            </a>
          </div>

          {/* Mobile hamburger (top-right, hidden md+) */}
          <div className="pointer-events-auto flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="liquid-glass rounded-full p-3 flex flex-col items-center justify-center gap-1.5 w-11 h-11 transition-transform hover:scale-105"
              aria-label="Open navigation menu"
            >
              <span className="w-5 h-[1.5px] bg-white rounded-full block" />
              <span className="w-3.5 h-[1.5px] bg-white rounded-full block self-start ml-0.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu (z-55) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-55 bg-[#0a0a0a] text-white flex flex-col justify-between p-8 sm:p-12 animate-fade-rise">
          {/* Top header inside mobile menu */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 256 256" className="w-7 h-7 fill-white">
                <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
              </svg>
              <span className="font-serif tracking-widest text-xl font-normal text-white uppercase">
                YOUNOYA
              </span>
            </div>

            {/* Close button with rotated X lines */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="liquid-glass rounded-full w-11 h-11 flex items-center justify-center relative transition-transform hover:scale-110"
              aria-label="Close navigation menu"
            >
              <span className="absolute w-5 h-[1.5px] bg-white rotate-45 rounded-full" />
              <span className="absolute w-5 h-[1.5px] bg-white -rotate-45 rounded-full" />
            </button>
          </div>

          {/* Nav items stacked vertically, centered */}
          <nav className="flex flex-col items-center justify-center space-y-7 my-auto">
            {navItems.map((item, idx) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-3xl sm:text-4xl text-white/90 hover:text-white font-medium tracking-tight transition-all duration-300 hover:scale-105"
                style={{
                  animation: `fadeRise 0.6s cubic-bezier(0.77, 0, 0.18, 1) ${
                    100 + idx * 60
                  }ms backwards`,
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Reserve Yours CTA at bottom */}
          <div
            className="w-full flex justify-center pb-4"
            style={{
              animation:
                'fadeRise 0.6s cubic-bezier(0.77, 0, 0.18, 1) 420ms backwards',
            }}
          >
            <a
              href="#reserve"
              onClick={() => setIsMobileMenuOpen(false)}
              className="liquid-glass rounded-full px-8 py-4 flex items-center justify-center gap-3 text-base font-medium text-white w-full max-w-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span>Reserve Yours</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState } from 'react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', active: true, href: '#' },
    { name: 'Studio', active: false, href: '#studio' },
    { name: 'About', active: false, href: '#about' },
    { name: 'Journal', active: false, href: '#journal' },
    { name: 'Reach Us', active: false, href: '#reach-us' },
  ];

  return (
    <header className="relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-serif text-3xl tracking-tight text-[#000000] select-none inline-flex items-start transition-opacity duration-200 hover:opacity-80"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          <span>Aethera</span>
          <sup className="text-sm font-sans font-normal ml-0.5 mt-0.5">®</sup>
        </a>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-10">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`text-sm font-sans transition-colors duration-200 ${
                item.active
                  ? 'text-[#000000] font-medium'
                  : 'text-[#6F6F6F] hover:text-[#000000]'
              }`}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center">
          <button
            type="button"
            className="rounded-full px-6 py-2.5 text-sm font-sans bg-[#000000] text-[#FFFFFF] font-normal transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-xs"
          >
            Begin Journey
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#000000] focus:outline-hidden"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 8h16M4 16h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-8 pt-2 pb-6 border-b border-black/5 bg-white/95 backdrop-blur-md transition-all duration-300">
          <div className="flex flex-col space-y-4">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-sans py-1 transition-colors ${
                  item.active
                    ? 'text-[#000000] font-medium'
                    : 'text-[#6F6F6F] hover:text-[#000000]'
                }`}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-2">
              <button
                type="button"
                className="w-full rounded-full px-6 py-3 text-sm font-sans bg-[#000000] text-[#FFFFFF] transition-transform hover:scale-[1.02]"
              >
                Begin Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

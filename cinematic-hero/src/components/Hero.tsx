import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section
      className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
      style={{ paddingTop: 'calc(8rem - 75px)' }}
    >
      {/* Main Headline */}
      <h1
        className="font-serif text-5xl sm:text-7xl md:text-8xl font-normal max-w-7xl text-[#000000] animate-fade-rise"
        style={{
          lineHeight: 0.95,
          letterSpacing: '-2.46px',
          fontFamily: "'Instrument Serif', Georgia, serif",
        }}
      >
        Beyond <span className="italic text-[#6F6F6F]">silence,</span> we build{' '}
        <span className="italic text-[#6F6F6F]">the eternal.</span>
      </h1>

      {/* Description */}
      <p className="font-sans text-base sm:text-lg max-w-2xl mt-8 text-[#6F6F6F] leading-relaxed animate-fade-rise-delay">
        Building platforms for brilliant minds, fearless makers, and thoughtful
        souls. Through the noise, we craft digital havens for deep work and pure
        flows.
      </p>

      {/* Hero CTA Button */}
      <button
        type="button"
        className="rounded-full px-14 py-5 text-base font-sans font-normal mt-12 bg-[#000000] text-[#FFFFFF] hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200 animate-fade-rise-delay-2 cursor-pointer shadow-md"
      >
        Begin Journey
      </button>
    </section>
  );
};

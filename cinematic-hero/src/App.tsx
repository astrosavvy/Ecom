import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoBackground } from './components/VideoBackground';

export const App: React.FC = () => {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#FFFFFF] text-[#000000] selection:bg-black selection:text-white">
      {/* Background Video Layer (z-0) with custom fade loop & gradient overlays */}
      <VideoBackground />

      {/* Navigation Bar (z-10) */}
      <Navbar />

      {/* Hero Section (z-10) */}
      <Hero />
    </main>
  );
};

export default App;

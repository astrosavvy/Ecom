import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';

export const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen h-[100dvh] overflow-hidden bg-[#0a0a0a] text-white">
      {/* Frosted Glass Floating Navbar */}
      <Navbar />

      {/* 5-Layer Interactive Hero Section */}
      <Hero />
    </div>
  );
};

export default App;

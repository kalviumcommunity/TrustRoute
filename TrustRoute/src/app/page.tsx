'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductPreview from '@/components/ProductPreview';
import Problem from '@/components/Problem';
import Solution from '@/components/Solution';
import Confidence from '@/components/Confidence';
import CTA from '@/components/CTA';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {

    // Global refresh after a delay to ensure layout is ready
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    const ctx = gsap.context(() => { }, containerRef);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <main ref={containerRef} className="relative min-h-screen">
      <Hero />
      <ProductPreview />
      <Problem />
      <Solution />
      <Confidence />
      <CTA />
      <Navbar />

      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A3FF00] rounded-full blur-[160px] opacity-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gray-200 rounded-full blur-[160px] opacity-20" />
      </div>
    </main>
  );
}

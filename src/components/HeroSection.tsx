"use client";

import { useEffect } from "react";
import { UnifiedSearchWidget } from "./search/UnifiedSearchWidget";
import { useSearch } from "@/contexts/SearchContext";

export function HeroSection() {
  const { searchWidgetRef, setIsSearchHidden } = useSearch();

  // Set up Intersection Observer to detect when search widget is out of view
  useEffect(() => {
    const element = searchWidgetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // If the element is NOT intersecting (not visible), search is hidden
        setIsSearchHidden(!entry.isIntersecting);
      },
      {
        // rootMargin: negative top margin means we detect when element
        // is completely above the viewport
        rootMargin: "-64px 0px 0px 0px", // Account for navbar height
        threshold: 0, // Trigger as soon as any part leaves/enters
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [searchWidgetRef, setIsSearchHidden]);

  return (
    <section className="relative pt-14 lg:pt-16">
      {/* Hero Image Container - Panoramic with visible 24px edge gaps */}
      <div className="relative h-[55vh] min-h-[420px] max-h-[600px] w-full max-w-[calc(100%-48px)] mx-auto rounded-xl overflow-hidden shadow-xl">
        {/* Background Image */}
        <img
          src="/images/hero-gilgit-baltistan.jpg"
          alt="Majestic mountains of Gilgit-Baltistan with turquoise river"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay - darker for better text visibility */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.35) 0%, rgba(15, 23, 42, 0.5) 100%)'
          }}
        />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
              Journey to the Roof of the World
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Discover the majestic valleys, glaciers, and culture of Gilgit-Baltistan.
              Your gateway to the North starts here.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Search Widget - attach ref for visibility detection */}
      <div ref={searchWidgetRef} className="relative z-10 px-4 -mt-16 md:-mt-20 pb-12">
        <UnifiedSearchWidget showTabs={true} variant="hero" />
      </div>
    </section>
  );
}

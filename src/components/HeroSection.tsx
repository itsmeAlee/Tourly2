import Image from "next/image";
import { UnifiedSearchWidget } from "./search/UnifiedSearchWidget";
import { HeroSearchObserver } from "./HeroSearchObserver";

export function HeroSection() {
  return (
    <section className="relative pt-14 lg:pt-16">
      {/* Hero Image Container - Panoramic with visible 24px edge gaps */}
      <div className="relative h-[55vh] min-h-[420px] max-h-[600px] w-full max-w-[calc(100%-48px)] mx-auto rounded-xl overflow-hidden shadow-xl">
        {/* Background Image */}
        <Image
          src="/images/hero-gilgit-baltistan.jpg"
          alt="Majestic mountains of Gilgit-Baltistan with turquoise river"
          fill
          priority
          sizes="100vw"
          className="object-cover"
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

      {/* Floating Search Widget - attach ref for visibility detection via Client Component wrapper */}
      <div className="relative z-10 px-4 -mt-16 md:-mt-20 pb-12">
        <HeroSearchObserver>
          <UnifiedSearchWidget showTabs={true} variant="hero" />
        </HeroSearchObserver>
      </div>
    </section>
  );
}

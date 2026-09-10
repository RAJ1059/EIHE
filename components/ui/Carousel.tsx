"use client";

import { useRef, type ReactNode } from "react";
import { ChevronDownIcon } from "@/components/ui/icons";

export function Carousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => scrollBy(-1)}
        className="absolute top-1/2 -left-2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sage/20 bg-white text-sage shadow-md transition-colors hover:bg-sage hover:text-white sm:-left-4 sm:flex"
      >
        <ChevronDownIcon className="h-4 w-4 rotate-90" />
      </button>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => scrollBy(1)}
        className="absolute top-1/2 -right-2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sage/20 bg-white text-sage shadow-md transition-colors hover:bg-sage hover:text-white sm:-right-4 sm:flex"
      >
        <ChevronDownIcon className="h-4 w-4 -rotate-90" />
      </button>
    </div>
  );
}

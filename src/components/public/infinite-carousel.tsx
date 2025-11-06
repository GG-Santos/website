"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface CardData {
  category: string;
  title: string;
  src: string;
  content: React.ReactNode;
}

interface InfiniteCarouselProps {
  cards: CardData[];
}

export function InfiniteCarousel({ cards }: InfiniteCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [cardWidth, setCardWidth] = useState(384); // md:w-96 = 384px
  const gap = 16; // gap-4 = 16px

  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth < 768) {
        setCardWidth(224); // w-56 = 224px on mobile
      } else {
        setCardWidth(384); // md:w-96 = 384px on desktop
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  // Duplicate cards multiple times for infinite loop
  const duplicatedCards = [...cards, ...cards, ...cards, ...cards, ...cards];

  // Calculate starting position: half card + 3 full cards visible
  useEffect(() => {
    if (scrollRef.current && cards.length > 0) {
      const singleSetWidth = (cardWidth + gap) * cards.length;
      // Start at second set, offset by half a card to show half on left
      const startPosition = singleSetWidth + (cardWidth / 2);
      scrollRef.current.scrollLeft = startPosition;
    }
  }, [cardWidth, cards.length]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const singleSetWidth = (cardWidth + gap) * cards.length;

    // If scrolled too far left, jump to middle
    if (scrollLeft < singleSetWidth) {
      scrollRef.current.scrollLeft = scrollLeft + singleSetWidth * 2;
    }
    // If scrolled too far right, jump back to middle
    else if (scrollLeft > singleSetWidth * 3) {
      scrollRef.current.scrollLeft = scrollLeft - singleSetWidth * 2;
    }
  }, [cardWidth, cards.length]);

  // Auto-scroll functionality - continuous, no pause on hover
  useEffect(() => {
    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({
          left: 1,
          behavior: "auto",
        });
      }
    }, 20); // Small increments for smooth scrolling

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="infinite-carousel-container relative w-screen overflow-hidden"
      style={{ 
        marginLeft: 'calc(-50vw + 50%)', 
        marginRight: 'calc(-50vw + 50%)',
      }}
      onWheel={(e) => e.preventDefault()} // Prevent wheel scrolling
      onTouchStart={(e) => e.preventDefault()} // Prevent touch scrolling
      onTouchMove={(e) => e.preventDefault()} // Prevent touch scrolling
      onMouseDown={(e) => e.preventDefault()} // Prevent mouse drag
    >

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-scroll scroll-smooth py-10 md:py-20 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
        onWheel={(e) => e.preventDefault()} // Prevent wheel scrolling
        onTouchStart={(e) => e.preventDefault()} // Prevent touch scrolling
        onTouchMove={(e) => e.preventDefault()} // Prevent touch scrolling
      >
        {duplicatedCards.map((card, index) => (
          <div
            key={`card-${index}`}
            className="flex-shrink-0"
            style={{
              width: `${cardWidth}px`,
            }}
          >
            <div className="relative h-80 w-full overflow-hidden rounded-3xl bg-gray-100 dark:bg-neutral-900 md:h-[40rem]">
              {/* Image */}
              <div className="relative h-full w-full">
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  className="object-cover"
                  sizes={`${cardWidth}px`}
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                
                {/* Category and Title Overlay - positioned higher like Apple Cards */}
                <div className="relative z-40" style={{ paddingLeft: '2rem', paddingTop: '2rem', paddingRight: '2rem', paddingBottom: '2rem' }}>
                  <p className="text-left font-sans text-sm font-medium text-white md:text-base [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]">
                    {card.category}
                  </p>
                  <p className="mt-2 max-w-xs text-left font-sans text-xl font-semibold [text-wrap:balance] text-white md:text-3xl [text-shadow:0_2px_4px_rgba(0,0,0,0.6)]">
                    {card.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


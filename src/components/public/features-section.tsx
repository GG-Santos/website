"use client";

import React from "react";
import { PolygonDivider } from "./polygon-divider";
import { InfiniteCarousel } from "./infinite-carousel";

interface CardData {
  category: string;
  title: string;
  src: string;
  content: React.ReactNode;
}

interface FeaturesSectionProps {
  cards: CardData[];
}

export function FeaturesSection({ cards }: FeaturesSectionProps) {
  return (
    <section id="services">
      {/* Dividers */}
      <PolygonDivider position="top" />
      <PolygonDivider position="bottom" />
      {/* !Dividers */}
      <div className="container">
        {/* Main Title */}
        <div className="neoh_fn_title">
          <h3 className="fn_title">Game Objectives</h3>
          <div className="line">
            <span />
          </div>
        </div>
        {/* !Main Title */}
      </div>
      <InfiniteCarousel cards={cards} />
    </section>
  );
}


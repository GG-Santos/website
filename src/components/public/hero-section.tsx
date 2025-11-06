"use client";

import { MouseScrollIndicator } from "./mouse-scroll-indicator";

type HeroSectionProps = {
  title: string;
  subtitle: string;
  backgroundImage: string;
};

export function HeroSection({ title, subtitle, backgroundImage }: HeroSectionProps) {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="neoh_fn_hero">
      {/* Overlay (of hero header) */}
      <div className="bg_overlay">
        {/* Overlay Color */}
        <div className="bg_color" />
        {/* !Overlay Color */}
        {/* Overlay Image */}
        <div
          className="bg_image"
          style={{
            backgroundImage: `url(${backgroundImage || "/img/hero/bg.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* !Overlay Image */}
      </div>
      {/* !Overlay (of hero header) */}
      
      {/* Hero Content */}
      <div className="hero_content">
        <div className="container">
          <div className="content">
            <h2 className="fn_title" title={title}>
              {title}
            </h2>
            <p className="fn_subtitle">
              {subtitle}
            </p>
            <p className="fn_desc fn_animated_text">
              Embark on an epic adventure crafted by passionate game developers. 
              A journey through Philippine mythology, quality education, and innovative game development.
            </p>
          </div>
        </div>
        <a 
          href="#about" 
          className="neoh_fn_down mouse-scroll-wrapper magic-hover magic-hover__square"
          onClick={scrollToSection}
        >
          <MouseScrollIndicator />
          <span className="text">Scroll Down</span>
        </a>
      </div>
      {/* !Hero Content */}
    </div>
  );
}


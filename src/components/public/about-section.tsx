import Link from "next/link";
import Image from "next/image";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import type { AboutHomeSection } from "@/lib/site-settings";

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
}

interface AboutSectionProps {
  testimonials: Testimonial[];
  aboutHomeSection: AboutHomeSection;
}

export function AboutSection({ testimonials, aboutHomeSection }: AboutSectionProps) {
  return (
    <section id="about">
      <div className="container">
        {/* About Item #1 - Testimonials */}
        <div className="testimonials-wrapper">
          <AnimatedTestimonials autoplay testimonials={testimonials} />
        </div>
        {/* !About Item #1 */}
        {/* About Item #2 - The Rise of Juanito Bayani */}
        <div className="neoh_fn_about_item reverse">
          <div
            className="img_item"
            style={{ aspectRatio: "1 / 1", maxWidth: "500px", width: "100%", position: "relative" }}
          >
            <Image
              alt={aboutHomeSection.title}
              src={aboutHomeSection.image || "/img/about/1.jpg"}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="content_item">
            <div className="neoh_fn_title" data-align="left">
              <h3 className="fn_title">{aboutHomeSection.title}</h3>
              <div className="line">
                <span />
              </div>
            </div>
            <div className="desc">
              {aboutHomeSection.description.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="buttons">
              <Link className="neoh_fn_button only_text" href="/about">
                <span className="text">More About Us</span>
              </Link>
            </div>
          </div>
        </div>
        {/* !About Item #2 */}
      </div>
    </section>
  );
}

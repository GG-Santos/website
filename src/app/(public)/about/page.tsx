import { AboutSectionServer } from "@/components/public/about-section-server";
import { PageBannerServer } from "@/components/public/page-banner-server";
import { getSiteSettings } from "@/lib/site-settings-server";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export const metadata = {
  title: "About Us - Juanito Bayani",
  description: "Learn more about Underdogs Studios and the team behind Juanito Bayani",
};

async function TeamSection() {
  const settings = await getSiteSettings();
  const team = settings.aboutPage.team;

  if (team.length === 0) {
    return null;
  }

  return (
    <section id="team">
      <div className="container">
        {/* Main Title */}
        <div className="neoh_fn_title">
          <h3 className="fn_title">Our Team Members</h3>
          <div className="line">
            <span />
          </div>
        </div>
        {/* !Main Title */}
        <div className="mw_650 fn_description">
          <p className="fn_desc fn_animated_text">
            The idea was born in London and rapidly became a borderless
            vision - A team of Neoh with a background in computer graphics,
            crypto, technology, and art.
          </p>
        </div>
        {/* Team List Shortcode */}
        <div className="neoh_fn_team">
          <ul className="team_list">
            {team.map((member) => (
              <li key={member.name} className="team_item">
                <div className="t_item">
                  <div className="person_info">
                    <div className="img_holder">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        width={300}
                        height={300}
                        className="object-cover"
                      />
                    </div>
                    <div className="title_holder">
                      <h3 className="fn_title">{member.name}</h3>
                      <p className="fn_desc">{member.title}</p>
                    </div>
                  </div>
                  {member.socialLinks && (
                    <div className="person_social">
                      <ul>
                        {member.socialLinks.twitter && (
                          <li>
                            <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                              <Twitter size={18} />
                            </a>
                          </li>
                        )}
                        {member.socialLinks.facebook && (
                          <li>
                            <a href={member.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                              <Facebook size={18} />
                            </a>
                          </li>
                        )}
                        {member.socialLinks.instagram && (
                          <li>
                            <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                              <Instagram size={18} />
                            </a>
                          </li>
                        )}
                        {member.socialLinks.youtube && (
                          <li>
                            <a href={member.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                              <Youtube size={18} />
                            </a>
                          </li>
                        )}
                        {member.socialLinks.linkedin && (
                          <li>
                            <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                              <Linkedin size={18} />
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* !Team List Shortcode */}
      </div>
    </section>
  );
}

async function AboutPageImage() {
  const settings = await getSiteSettings();
  const image = settings.aboutPage.image;

  if (!image) {
    return null;
  }

  return (
    <section className="container py-12">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={image}
          alt="About Us"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}

export default async function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageBannerServer
        page="about"
        fallbackTitle="About"
        fallbackSubtitle="Learn more about Underdogs Studios"
      />

      <div className="neoh_fn_aboutpage">
        <AboutSectionServer />
        {/* About Page Image */}
        <AboutPageImage />
        {/* Team Section */}
        <TeamSection />
        {/* !Team Section */}
      </div>
    </div>
  );
}

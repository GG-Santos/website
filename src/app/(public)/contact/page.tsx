import { PageBannerServer } from "@/components/public/page-banner-server";
import { ContactForm } from "@/components/public/contact-form";

export const metadata = {
  title: "Contact Us - Juanito Bayani",
  description: "Get in touch with Underdogs Studios",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageBannerServer
        page="contact"
        fallbackTitle="Contact"
        fallbackSubtitle="Get in touch with the team"
      />
      <ContactForm />
    </div>
  );
}


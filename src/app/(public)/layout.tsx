import { unstable_noStore } from "next/cache";
import { PublicHeader } from "@/components/layouts/public/header";
import { PublicFooter } from "@/components/layouts/public/footer";
import { getSiteSettings } from "@/lib/site-settings-server";
import "../../styles/neoh-plugins.css";
import "../../styles/neoh-theme.css";

export const metadata = {
  title: {
    template: "%s | Juanito Bayani - Underdogs Studios",
    default: "Juanito Bayani - Underdogs Studios",
  },
  description: "Juanito Bayani - An epic adventure game by Underdogs Studios. Join us on this incredible journey crafted by passionate game developers.",
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mark as dynamic to allow database access and new Date() usage
  unstable_noStore();
  const settings = await getSiteSettings();

  return (
    <div className="neoh_fn_main" data-footer-transition="enabled">
      <PublicHeader
        siteName={settings.header.siteName}
        menuItems={settings.header.menuItems}
        footerText={settings.footer.text}
      />
      {children}
      <PublicFooter text={settings.footer.text} links={settings.footer.links} />
    </div>
  );
}


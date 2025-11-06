import Image from "next/image";
import Link from "next/link";
import { PolygonDivider } from "./polygon-divider";

type Investor = {
  id: string;
  name: string | null;
  logo: string;
  url: string | null;
};

type InvestorSectionProps = {
  investors: Investor[];
};

export function InvestorSection({ investors }: InvestorSectionProps) {

  return (
    <section id="investor">
      {/* Dividers */}
      <PolygonDivider position="top" />
      <PolygonDivider position="bottom" />
      {/* !Dividers */}
      <div className="container">
        {/* Main Title */}
        <div className="neoh_fn_title">
          <h3 className="fn_title">Techstack</h3>
          <div className="line">
            <span />
          </div>
        </div>
        {/* !Main Title */}
        
        {/* Investor List Shortcode */}
        <div className="neoh_fn_investor">
          <ul>
            {investors.length > 0 ? (
              investors.map((investor) => (
                <li key={investor.id}>
                  <div className="item">
                    <Image
                      src={investor.logo}
                      alt={investor.name || `Investor ${investor.id}`}
                      width={200}
                      height={100}
                      className="object-contain"
                    />
                    {investor.url ? (
                      <Link className="full_link" href={investor.url} />
                    ) : (
                      <span className="full_link" />
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li>
                <div className="item">
                  <p className="text-muted-foreground text-sm">
                    No techstack to display
                  </p>
                </div>
              </li>
            )}
          </ul>
        </div>
        {/* !Investor List Shortcode */}
      </div>
    </section>
  );
}

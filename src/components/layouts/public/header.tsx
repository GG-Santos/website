"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PublicHeaderProps = {
  siteName: string;
  menuItems: Array<{
    label: string;
    href: string;
  }>;
  footerText: string;
};

export function PublicHeader({ siteName, menuItems, footerText }: PublicHeaderProps) {
  const [toggle, setToggle] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <>
      {/* Nav Overlay */}
      <div
        className={`nav_overlay ${toggle ? "go" : ""}`}
        onClick={() => setToggle(false)}
      />
      
      {/* Right Navigation */}
      <div className={`neoh_fn_nav ${toggle ? "go" : ""}`}>
        <div className="trigger is-active">
          <div className="trigger_in" onClick={() => setToggle(false)}>
            <span className="text">Close</span>
            <span className="hamb">
              <span className="hamb_a" />
              <span className="hamb_b" />
              <span className="hamb_c" />
            </span>
          </div>
        </div>
        
        <div className="nav_content">
          <div className="nav_menu">
            <ul>
              {menuItems.map((item) => (
                <li className="menu-item" key={`${item.href}-${item.label}`}>
                  <Link href={item.href} onClick={() => setToggle(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="nav_buttons">
            <Link href="/sign-in" className="neoh_fn_button">
              <span className="text">Sign In</span>
            </Link>
            <Link href="/sign-up" className="neoh_fn_button">
              <span className="text">Sign Up</span>
            </Link>
          </div>
        </div>
        
        {/* Nav Footer */}
        <div className={`nav_footer ${toggle ? "ready" : ""}`}>
          <div className="nf_left">
            <p>{footerText || `© ${currentYear ?? "2024"}`}</p>
          </div>
          <div className="nf_right">
            <div className="neoh_fn_social_list">
              <ul>
                <li><a href="#"><i className="fn-icon-twitter" /></a></li>
                <li><a href="#"><i className="fn-icon-facebook" /></a></li>
                <li><a href="#"><i className="fn-icon-instagram" /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <header className="neoh_fn_header">
        <div className="container">
          <div className="header_in">
            <div className="logo">
              <Link href="/">
                <span className="font-bold text-2xl text-white">{siteName}</span>
              </Link>
            </div>
            <div className="trigger">
              <div className="trigger_in" onClick={() => setToggle(!toggle)}>
                <span className="text">Menu</span>
                <span className="hamb">
                  <span className="hamb_a" />
                  <span className="hamb_b" />
                  <span className="hamb_c" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}


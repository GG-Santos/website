type PublicFooterProps = {
  text: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

export function PublicFooter({ text, links }: PublicFooterProps) {
  return (
    <footer className="neoh_fn_footer">
      <div className="footer_bottom">
        <div className="container">
          <div className="fb_in">
            <div className="fb_left">
              <p>{text}</p>
            </div>
            <nav aria-label="Footer" className="fb_right">
              <ul>
                {links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

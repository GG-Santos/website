export function PageBanner({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="neoh_fn_pagetitle">
      <div className="bg_overlay">
        <div className="bg_color" />
        <div className="bg_image" />
      </div>
      <div className="pt_content">
        <div className="container">
          <h3 className="fn_title">{title}</h3>
          {subtitle ? <p className="fn_desc fn_animated_text mt-2 max-w-2xl">{subtitle}</p> : null}
        </div>
      </div>
    </div>
  );
}


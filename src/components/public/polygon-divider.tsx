interface PolygonDividerProps {
  position?: "top" | "bottom";
  className?: string;
}

export function PolygonDivider({ 
  position = "top",
  className = ""
}: PolygonDividerProps) {
  // Polygon points from the reference (matching divider.svg exactly)
  // Creates the angular "W"-like shape with centered "V" indentation
  const polygonPoints = "1920,0 1920,8 1064,28 1040,42 1001,32 960,59 919,32 880,42 856,28 0,8 0,0";
  
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 1920 59"
      className={`fn__svg fn__divider ${position === "top" ? "top_divider" : "bottom_divider"} replaced-svg ${className}`}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        width: "100%",
        height: "auto",
        display: "block",
        zIndex: 6,
        ...(position === "top" ? { top: "-1px" } : { bottom: "-1px", transform: "rotate(180deg)" }),
      }}
      xmlSpace="preserve"
      preserveAspectRatio="none"
    >
      <polygon points={polygonPoints} />
    </svg>
  );
}


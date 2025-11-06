import { getSiteSettings } from "@/lib/site-settings-server";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Generate apple-icon dynamically from database
export default async function AppleIcon(request: NextRequest) {
  try {
    const settings = await getSiteSettings();
    
    // If favicon URL exists in database, fetch and return it
    if (settings.favicon) {
      try {
        const imageResponse = await fetch(settings.favicon);
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer();
          return new Response(imageBuffer, {
            headers: {
              "Content-Type": imageResponse.headers.get("Content-Type") || "image/png",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch favicon from URL:", error);
        // Fall through to default icon
      }
    }
  } catch (error) {
    console.error("Failed to get site settings for apple-icon:", error);
    // Fall through to default icon
  }

  // Default icon if no favicon in database or fetch fails
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 72,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        JB
      </div>
    ),
    {
      ...size,
    }
  );
}


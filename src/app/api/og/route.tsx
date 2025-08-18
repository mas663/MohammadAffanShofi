/* eslint-disable @next/next/no-img-element */
// OG Image dynamic – Satori-safe

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

export async function GET(req: Request) {
  // bangun URL absolut ke /avatar.jpg (aman di Edge)
  const url = new URL(req.url);
  const origin = `${url.protocol}//${url.host}`;
  const avatar = new URL("/avatar.jpg", origin).toString();

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "60px",
            color: "#fff",
            background:
              "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #0b1220 100%)",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", maxWidth: 800 }}
          >
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>
              Mohammad Affan Shofi
            </div>
            <div style={{ fontSize: 28, opacity: 0.95, marginTop: 12 }}>
              FrontEnd • DevOps • Mobile
            </div>
            <div style={{ fontSize: 20, opacity: 0.8, marginTop: 18 }}>
              mohammad-affan-shofi.vercel.app
            </div>
          </div>

          {/* Avatar */}
          <img
            src={avatar}
            alt="Portrait of Mohammad Affan Shofi"
            title="Mohammad Affan Shofi"
            width={220}
            height={220}
            style={{
              borderRadius: 9999,
              border: "8px solid rgba(255,255,255,.25)",
              boxShadow: "0 15px 40px rgba(0,0,0,.35)",
              objectFit: "cover",
            }}
          />
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (err) {
    // fallback supaya tidak blank bila terjadi error rendering
    console.error("OG render failed:", err);
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0b1220",
            color: "#fff",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Mohammad Affan Shofi
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}

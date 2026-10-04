import { ImageResponse } from "next/og";
import { profile } from "./content";

export const ogSize = { width: 1200, height: 630 };
export const ogAlt = "Naveen B — Generative AI Engineer | Full-Stack & Agentic Systems";

/** Shared social card: name, role, and a minimal rendering of the core. */
export function renderOgImage() {
  const nodes = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const r = i % 2 ? 150 : 200;
    return { x: 900 + Math.cos(a) * r, y: 315 + Math.sin(a) * r * 0.8 };
  });
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#060709",
          color: "#ecebe6",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="1200" height="630" style={{ position: "absolute", top: 0, left: 0 }}>
          <circle cx="900" cy="315" r="260" fill="#8fb3ff" fillOpacity="0.06" />
          {nodes.map((n, i) => (
            <line key={`l${i}`} x1="900" y1="315" x2={n.x} y2={n.y} stroke="#8fb3ff" strokeOpacity="0.3" />
          ))}
          {nodes.map((n, i) => (
            <circle key={`c${i}`} cx={n.x} cy={n.y} r="5" fill="#c9d6f2" />
          ))}
          <polygon points="900,265 943,290 943,340 900,365 857,340 857,290" fill="#0d1017" stroke="#8fb3ff" strokeWidth="2" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 720 }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#9196a0", textTransform: "uppercase" }}>{profile.role}</div>
          <div style={{ fontSize: 132, fontWeight: 600, letterSpacing: -6, lineHeight: 1, marginTop: 24 }}>NAVEEN B</div>
          <div style={{ fontSize: 34, marginTop: 28, color: "#ecebe6", lineHeight: 1.2 }}>{profile.headline}</div>
          <div style={{ fontSize: 22, marginTop: 28, color: "#8fb3ff" }}>{profile.specialization}</div>
        </div>
      </div>
    ),
    ogSize,
  );
}

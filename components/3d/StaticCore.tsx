/**
 * Lightweight, dependency-free stand-in for the WebGL core. Shown while the
 * 3D scene loads, and permanently when WebGL or data budget is unavailable.
 */
export default function StaticCore() {
  const nodes = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const r = i % 2 ? 150 : 205;
    // Rounded so server and browser trig results serialise identically.
    return { x: Math.round((300 + Math.cos(a) * r) * 100) / 100, y: Math.round((300 + Math.sin(a) * r * 0.8) * 100) / 100 };
  });
  return (
    <svg viewBox="0 0 600 600" className="static-core" role="presentation">
      <defs>
        <radialGradient id="sc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8fb3ff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#8fb3ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="260" fill="url(#sc-glow)" />
      <g stroke="#8fb3ff" strokeOpacity="0.22" fill="none">
        {nodes.map((n, i) => (
          <line key={`l${i}`} x1="300" y1="300" x2={n.x} y2={n.y} />
        ))}
        <ellipse cx="300" cy="300" rx="190" ry="60" className="static-core-ring" />
        <ellipse cx="300" cy="300" rx="120" ry="200" className="static-core-ring is-alt" />
      </g>
      <polygon points="300,240 352,270 352,330 300,360 248,330 248,270" fill="#0d1017" stroke="#8fb3ff" strokeOpacity="0.6" />
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.x} cy={n.y} r={i % 3 ? 3 : 4.5} fill="#c9d6f2" fillOpacity="0.7" />
      ))}
    </svg>
  );
}

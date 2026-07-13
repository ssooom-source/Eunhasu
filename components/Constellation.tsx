"use client";

import { generateConstellation } from "@/lib/constellation";

export default function Constellation({ seedKey }: { seedKey: string }) {
  const width = 320;
  const height = 220;
  const { points, edges } = generateConstellation(seedKey, { width, height });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="생년월일로 그려진 나만의 별자리"
    >
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f2efe6" stopOpacity="1" />
          <stop offset="100%" stopColor="#f2efe6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={points[a].x}
          y1={points[a].y}
          x2={points[b].x}
          y2={points[b].y}
          stroke="#d4af6a"
          strokeOpacity={0.35}
          strokeWidth={1}
        />
      ))}

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={p.r * 4} fill="url(#starGlow)" opacity={0.5} />
          <circle cx={p.x} cy={p.y} r={p.r} fill="#f2efe6" />
        </g>
      ))}
    </svg>
  );
}

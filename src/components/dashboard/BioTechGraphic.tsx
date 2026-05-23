"use client";

export function BioTechGraphic() {
  // DNA helix
  const strandPairs: [number, number, number, number][] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const y = t * 380 + 10;
    const wave = Math.sin(t * Math.PI * 4);
    const x1 = 100 + wave * 36;
    const x2 = 100 - wave * 36;
    strandPairs.push([x1, y, x2, y]);
  }
  const rungs = strandPairs.filter((_, i) => i % 2 === 0);

  // Hex grid positions for the bio-cell backdrop
  const hexPositions = [
    [230, 60],
    [290, 95],
    [350, 60],
    [410, 95],
    [350, 130],
    [290, 165],
    [230, 130],
    [170, 165],
    [110, 130],
    [170, 95],
    [230, 200],
    [290, 235],
    [350, 200],
  ];

  // Code lines for terminal panel
  const codeLines = [
    "SEQ_ID: AXSM·BCR·001",
    "TARGET: MDM2·p53",
    "PHASE: II",
    "ORR: 38.4%",
    "BBB: HIGH",
    "MTD: 180mg",
    "T½: 14.2h",
    "AUC: 2840",
    "Cmax: 312ng/mL",
    "SEQ_ID: VRTX·VX880",
    "TARGET: ISLET·CELL",
    "PHASE: III",
    "HbA1c: -2.1%",
    "PDUFA: OCT 2026",
    "ENGRAFT: 91%",
    "SEQ_ID: CRSP·CTX001",
  ];

  return (
    <div
      className="graphic-float"
      style={{
        position: "relative",
        width: 480,
        height: 480,
        flexShrink: 0,
      }}
    >
      {/* Ambient bloom */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 420,
          height: 420,
          borderRadius: "50%",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(79,142,247,0.07) 0%, rgba(34,211,160,0.03) 50%, transparent 72%)",
        }}
      />

      <svg
        viewBox="0 0 480 480"
        width="480"
        height="480"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow2" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <linearGradient id="helixA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f8ef7" stopOpacity="0.05" />
            <stop offset="40%" stopColor="#4f8ef7" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#22d3a0" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22d3a0" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="helixB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3a0" stopOpacity="0.05" />
            <stop offset="40%" stopColor="#22d3a0" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#4f8ef7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="traceH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4f8ef7" stopOpacity="0" />
            <stop offset="50%" stopColor="#4f8ef7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="traceV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3a0" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3a0" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#22d3a0" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="cellGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="rgba(79,142,247,0.25)" />
            <stop offset="60%" stopColor="rgba(9,18,35,0.85)" />
            <stop offset="100%" stopColor="rgba(9,18,35,0.95)" />
          </radialGradient>
          <clipPath id="termClip">
            <rect x="290" y="280" width="168" height="160" rx="8" />
          </clipPath>
        </defs>

        {/* ══ 1. HEX GRID BACKDROP ══ */}
        {hexPositions.map(([hx, hy], i) => {
          const size = 22;
          const pts = Array.from({ length: 6 }, (_, k) => {
            const a = ((k * 60 - 30) * Math.PI) / 180;
            return `${hx + size * Math.cos(a)},${hy + size * Math.sin(a)}`;
          }).join(" ");
          return (
            <polygon
              key={`hex${i}`}
              points={pts}
              fill="rgba(79,142,247,0.025)"
              stroke="rgba(79,142,247,0.1)"
              strokeWidth="0.6"
              style={{
                animation: `glowPulse ${3 + i * 0.4}s ${i * 0.2}s ease-in-out infinite`,
              }}
            />
          );
        })}

        {/* ══ 2. CIRCUIT TRACES (right side) ══ */}
        {[95, 135, 175, 215, 255, 295, 335].map((y, i) => (
          <line
            key={`ht${i}`}
            x1="240"
            y1={y}
            x2="430"
            y2={y}
            stroke="url(#traceH)"
            strokeWidth="0.6"
            strokeDasharray="8 5"
            style={{ animation: `dash 4s ${i * 0.3}s linear infinite` }}
          />
        ))}
        {[300, 350, 400, 445].map((x, i) => (
          <line
            key={`vt${i}`}
            x1={x}
            y1="60"
            x2={x}
            y2="280"
            stroke="rgba(79,142,247,0.07)"
            strokeWidth="0.5"
            strokeDasharray="4 8"
          />
        ))}
        {/* circuit nodes */}
        {[[300, 135], [350, 175], [400, 215], [300, 255], [350, 95]].map(
          ([x, y], i) => (
            <g key={`cn${i}`}>
              <rect
                x={x - 5}
                y={y - 5}
                width="10"
                height="10"
                rx="1.5"
                fill="rgba(79,142,247,0.06)"
                stroke="rgba(79,142,247,0.3)"
                strokeWidth="0.6"
              />
              <circle
                cx={x}
                cy={y}
                r="2"
                fill="#4f8ef7"
                opacity="0.7"
                filter="url(#glow)"
                style={{
                  animation: `cellPulse ${2 + i * 0.25}s ${i * 0.15}s ease-in-out infinite`,
                }}
              />
            </g>
          )
        )}

        {/* ══ 3. DNA DOUBLE HELIX (left column) ══ */}
        <path
          d={`M ${strandPairs
            .map(([x1, y]) => `${x1},${y + 30}`)
            .join(" L ")}`}
          fill="none"
          stroke="url(#helixA)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="10 3"
          style={{ animation: "helixFlow 2.2s linear infinite" }}
          filter="url(#glow)"
        />
        <path
          d={`M ${strandPairs.map(([, , x2, y]) => `${x2},${y + 30}`).join(" L ")}`}
          fill="none"
          stroke="url(#helixB)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="10 3"
          style={{ animation: "helixFlow 2.2s 1.1s linear infinite" }}
          filter="url(#glow)"
        />
        {/* base pair rungs */}
        {rungs.map(([x1, y, x2], i) => {
          const colors = ["#4f8ef7", "#22d3a0", "#fbbf24", "#f87171", "#a78bfa", "#38bdf8"];
          const c = colors[i % colors.length];
          return (
            <g key={`rung${i}`}>
              <line
                x1={x1}
                y1={y + 30}
                x2={x2}
                y2={y + 30}
                stroke={c}
                strokeWidth="1.6"
                opacity="0.4"
                style={{
                  animation: `glowPulse ${1.8 + i * 0.1}s ${i * 0.07}s ease-in-out infinite`,
                }}
              />
              <circle
                cx={x1}
                cy={y + 30}
                r="4"
                fill={c}
                opacity="0.9"
                filter="url(#glow)"
                style={{
                  animation: `cellPulse ${2.4 + i * 0.12}s ${i * 0.09}s ease-in-out infinite`,
                }}
              />
              <circle
                cx={x2}
                cy={y + 30}
                r="4"
                fill={c}
                opacity="0.9"
                filter="url(#glow)"
                style={{
                  animation: `cellPulse ${2.4 + i * 0.12}s ${i * 0.09 + 0.5}s ease-in-out infinite`,
                }}
              />
            </g>
          );
        })}

        {/* ══ 4. CENTRAL BIO-CELL ══ */}
        {/* outer membrane — morphing ellipse */}
        <ellipse
          cx="255"
          cy="230"
          rx="72"
          ry="64"
          fill="url(#cellGrad)"
          stroke="rgba(79,142,247,0.22)"
          strokeWidth="1.2"
          strokeDasharray="6 3"
          style={{
            animation:
              "membraneFlow 8s linear infinite, rotateSlow 25s linear infinite",
            transformOrigin: "255px 230px",
          }}
        />
        {/* inner membrane */}
        <ellipse
          cx="255"
          cy="230"
          rx="52"
          ry="46"
          fill="rgba(9,18,35,0.7)"
          stroke="rgba(34,211,160,0.18)"
          strokeWidth="1"
        />
        {/* nucleus */}
        <circle
          cx="255"
          cy="230"
          r="28"
          fill="rgba(9,18,35,0.95)"
          stroke="rgba(79,142,247,0.55)"
          strokeWidth="1.5"
          filter="url(#glow2)"
          style={{ animation: `glowPulse 3s ease-in-out infinite` }}
        />
        {/* nucleus inner glow */}
        <circle
          cx="255"
          cy="230"
          r="14"
          fill="rgba(79,142,247,0.75)"
          filter="url(#glow2)"
          style={{ animation: `glowPulse 2.2s 0.3s ease-in-out infinite` }}
        />
        <circle cx="255" cy="230" r="6" fill="rgba(255,255,255,0.88)" filter="url(#glow)" />
        {/* crosshair */}
        {[
          [255, 197, 255, 212],
          [255, 248, 255, 263],
          [220, 230, 235, 230],
          [275, 230, 290, 230],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={`cx${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(79,142,247,0.5)"
            strokeWidth="0.8"
          />
        ))}
        {/* radar sweep inside cell */}
        <line
          x1="255"
          y1="230"
          x2="283"
          y2="230"
          stroke="rgba(79,142,247,0.6)"
          strokeWidth="1"
          style={{
            animation: "radarSweep 3s linear infinite",
            transformOrigin: "255px 230px",
          }}
        />
        {/* radar ping rings */}
        {[0, 0.8, 1.6].map((d, i) => (
          <circle key={`rp${i}`} cx="255" cy="230" r="2" fill="none" stroke="rgba(79,142,247,0.5)" strokeWidth="1">
            <animate
              attributeName="r"
              from="2"
              to="26"
              dur="2.4s"
              begin={`${d}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.7"
              to="0"
              dur="2.4s"
              begin={`${d}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
        {/* organelles */}
        {[[-28, 14], [18, -22], [22, 20], [-18, -18]].map(([dx, dy], i) => {
          const colors = ["rgba(34,211,160,0.5)", "rgba(251,191,36,0.4)", "rgba(79,142,247,0.45)", "rgba(248,113,113,0.4)"];
          return (
            <ellipse
              key={`org${i}`}
              cx={255 + dx}
              cy={230 + dy}
              rx="6"
              ry="4"
              fill={colors[i]}
              opacity="0.8"
              filter="url(#glow)"
              style={{
                animation: `cellPulse ${2 + i * 0.4}s ${i * 0.3}s ease-in-out infinite`,
              }}
            />
          );
        })}

        {/* ══ 5. SATELLITE NODES orbiting the cell ══ */}
        {[
          { label: "mRNA", color: "#22d3a0", r: 88, speed: "12s", startDeg: 0 },
          { label: "API", color: "#fbbf24", r: 88, speed: "17s", startDeg: 120 },
          { label: "TCR", color: "#a78bfa", r: 88, speed: "22s", startDeg: 240 },
        ].map(({ label, color, r, speed, startDeg }, i) => {
          const rad = (startDeg * Math.PI) / 180;
          const sx = 255 + Math.cos(rad) * r;
          const sy = 230 + Math.sin(rad) * r;
          return (
            <g
              key={`sat${i}`}
              style={{
                animation: `rotateSlow ${speed} ${i * 2}s linear infinite`,
                transformOrigin: "255px 230px",
              }}
            >
              <circle cx={sx} cy={sy} r="8" fill={color} opacity="0.85" filter="url(#glow)" />
              <text
                x={sx}
                y={sy + 4}
                textAnchor="middle"
                fill="rgba(9,18,35,0.9)"
                fontSize="5.5"
                fontWeight="800"
                fontFamily="monospace"
              >
                {label}
              </text>
            </g>
          );
        })}
        {/* orbit ring */}
        <circle
          cx="255"
          cy="230"
          r="88"
          fill="none"
          stroke="rgba(79,142,247,0.08)"
          strokeWidth="1"
          strokeDasharray="5 8"
          style={{
            animation: "rotateSlow 30s linear infinite",
            transformOrigin: "255px 230px",
          }}
        />

        {/* ══ 6. CONNECTOR LINES: helix → cell ══ */}
        {[rungs[3], rungs[6], rungs[9]]
          .filter(Boolean)
          .map(([x1, y, , ], i) => (
            <line
              key={`cl${i}`}
              x1={x1 + 3}
              y1={y + 30}
              x2="183"
              y2="230"
              stroke="rgba(79,142,247,0.12)"
              strokeWidth="0.8"
              strokeDasharray="4 5"
              style={{
                animation: `glowPulse ${3 + i}s ${i * 0.4}s ease-in-out infinite`,
              }}
            />
          ))}

        {/* ══ 7. TERMINAL PANEL (bottom-right) ══ */}
        {/* panel body */}
        <rect
          x="290"
          y="282"
          width="168"
          height="158"
          rx="8"
          fill="rgba(6,9,15,0.92)"
          stroke="rgba(79,142,247,0.25)"
          strokeWidth="1"
        />
        {/* title bar */}
        <rect x="290" y="282" width="168" height="20" rx="8" fill="rgba(79,142,247,0.12)" />
        <rect x="290" y="292" width="168" height="10" fill="rgba(79,142,247,0.12)" />
        <circle cx="302" cy="292" r="3.5" fill="rgba(248,113,113,0.7)" />
        <circle cx="314" cy="292" r="3.5" fill="rgba(251,191,36,0.7)" />
        <circle cx="326" cy="292" r="3.5" fill="rgba(34,211,160,0.7)" />
        <text
          x="374"
          y="295"
          fill="rgba(79,142,247,0.5)"
          fontSize="6.5"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="1"
        >
          BCR·LIVE·FEED
        </text>
        {/* scan line */}
        <rect
          x="290"
          y="302"
          width="168"
          height="1.5"
          fill="rgba(79,142,247,0.15)"
          style={{ animation: "scanY 3.5s ease-in-out infinite" }}
        />
        {/* scrolling code text — clipped */}
        <g clipPath="url(#termClip)">
          <g style={{ animation: "codeScroll 12s linear infinite" }}>
            {[...codeLines, ...codeLines].map((line, i) => {
              const isKey = line.startsWith("SEQ_ID");
              const isVal = line.includes(":");
              const color = isKey ? "#22d3a0" : isVal ? "#4f8ef7" : "rgba(79,142,247,0.4)";
              const prefix = isKey ? ">" : isVal ? " ·" : "  ";
              return (
                <text
                  key={i}
                  x="298"
                  y={315 + i * 11}
                  fill={color}
                  fontSize="6.5"
                  fontFamily="monospace"
                  opacity="0.85"
                >
                  {prefix} {line}
                </text>
              );
            })}
          </g>
        </g>

        {/* ══ 8. MOVING DATA PACKETS ══ */}
        <circle r="3.5" fill="#4f8ef7" filter="url(#glow)">
          <animateMotion
            dur="3.2s"
            repeatCount="indefinite"
            path="M 120 160 Q 185 180 183 230"
          />
        </circle>
        <circle r="2.5" fill="#22d3a0" filter="url(#glow)">
          <animateMotion
            dur="4.5s"
            begin="1s"
            repeatCount="indefinite"
            path="M 110 290 Q 165 270 183 235"
          />
        </circle>
        <circle r="2" fill="#fbbf24" filter="url(#glow)">
          <animateMotion
            dur="2.8s"
            begin="0.6s"
            repeatCount="indefinite"
            path="M 327 230 Q 310 260 290 310"
          />
        </circle>
        <circle r="1.8" fill="#a78bfa" filter="url(#glow)">
          <animateMotion
            dur="5s"
            begin="2s"
            repeatCount="indefinite"
            path="M 255 302 Q 270 320 290 340"
          />
        </circle>

        {/* ══ 9. FLOATING PARTICLES ══ */}
        {[
          { cx: 185, cy: 60, r: 2.5, c: "#4f8ef7", d: 0 },
          { cx: 375, cy: 80, r: 2, c: "#22d3a0", d: 0.7 },
          { cx: 445, cy: 165, r: 2, c: "#fbbf24", d: 1.2 },
          { cx: 155, cy: 390, r: 2.5, c: "#a78bfa", d: 1.6 },
          { cx: 415, cy: 265, r: 1.8, c: "#f87171", d: 1.0 },
          { cx: 250, cy: 450, r: 2, c: "#4f8ef7", d: 0.4 },
          { cx: 65, cy: 215, r: 1.8, c: "#22d3a0", d: 2.1 },
        ].map((p, i) => (
          <circle
            key={`dp${i}`}
            cx={p.cx}
            cy={p.cy}
            r={p.r}
            fill={p.c}
            filter="url(#glow)"
            style={{
              animation: `particleDrift 5.5s ${p.d}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* ══ 10. LABELS ══ */}
        <text
          x="52"
          y="52"
          fill="rgba(79,142,247,0.5)"
          fontSize="7.5"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          GENOME
        </text>
        <text
          x="365"
          y="70"
          fill="rgba(34,211,160,0.4)"
          fontSize="7"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          mRNA·SIG
        </text>
        <text
          x="278"
          y="270"
          fill="rgba(79,142,247,0.35)"
          fontSize="7"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          CATALYST
        </text>
        <text
          x="130"
          y="420"
          fill="rgba(251,191,36,0.35)"
          fontSize="7"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          PROTEIN·Σ
        </text>
        <text
          x="58"
          y="390"
          fill="rgba(168,139,250,0.35)"
          fontSize="7"
          fontFamily="monospace"
          letterSpacing="1.5"
        >
          PHASE·II
        </text>
      </svg>
    </div>
  );
}
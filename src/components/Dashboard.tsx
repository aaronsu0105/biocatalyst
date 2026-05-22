"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { mockBiotechCompanies } from "@/data/mockData";
import { BiotechCompany, TrialPhase } from "@/types/biotech";

// ── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bgBase:        "#06090f",
  bgSurface:     "#0b1120",
  bgCard:        "#0f1929",
  bgCardHover:   "#131f33",
  border:        "rgba(255,255,255,0.07)",
  borderBright:  "rgba(255,255,255,0.14)",
  textPrimary:   "#eef2ff",
  textSecondary: "#7a90b4",
  textMuted:     "#3d506e",
  accent:        "#4f8ef7",
  accentSoft:    "rgba(79,142,247,0.10)",
  accentGlow:    "rgba(79,142,247,0.18)",
  green:         "#22d3a0",
  greenSoft:     "rgba(34,211,160,0.10)",
  amber:         "#fbbf24",
  amberSoft:     "rgba(251,191,36,0.10)",
  red:           "#f87171",
  redSoft:       "rgba(248,113,113,0.10)",
};

const riskCfg = {
  HIGH:   { bg: C.redSoft,   text: C.red,   border: "rgba(248,113,113,0.2)"  },
  MEDIUM: { bg: C.amberSoft, text: C.amber, border: "rgba(251,191,36,0.2)"   },
  LOW:    { bg: C.greenSoft, text: C.green, border: "rgba(34,211,160,0.2)"   },
};

const phaseCfg = {
  COMPLETED: { color: C.green, bg: C.greenSoft, border: "rgba(34,211,160,0.2)" },
  ONGOING:   { color: C.accent, bg: C.accentSoft, border: "rgba(79,142,247,0.2)" },
  UPCOMING:  { color: C.textMuted, bg: "rgba(255,255,255,0.04)", border: C.border },
  FAILED:    { color: C.red, bg: C.redSoft, border: "rgba(248,113,113,0.2)" },
};

// ── Keyframes ────────────────────────────────────────────────────────────────
const STYLES = `
@keyframes fadeUp      { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
@keyframes fadeIn      { from { opacity:0 } to { opacity:1 } }
@keyframes pulse       { 0%,100% { opacity:1 } 50% { opacity:.4 } }
@keyframes floatY      { 0%,100% { transform:translateY(0px) } 50% { transform:translateY(-10px) } }
@keyframes glowPulse   { 0%,100% { opacity:0.45 } 50% { opacity:1 } }
@keyframes dash        { to { stroke-dashoffset: -24 } }
@keyframes dashRev     { from { stroke-dashoffset: -24 } to { stroke-dashoffset: 0 } }
@keyframes helixFlow   { from { stroke-dashoffset: 0 } to { stroke-dashoffset: -80 } }
@keyframes rotateSlow  { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
@keyframes rotateSlowRev { from { transform: rotate(0deg) } to { transform: rotate(-360deg) } }
@keyframes cellPulse   { 0%,100% { transform:scale(1); opacity:0.7 } 50% { transform:scale(1.1); opacity:1 } }
@keyframes scanY       { from { transform: translateY(0%) } to { transform: translateY(1300%) } }
@keyframes particleDrift {
  0%   { transform: translate(0,0) scale(1);       opacity:0.8 }
  50%  { transform: translate(4px,-14px) scale(1.4); opacity:1  }
  100% { transform: translate(-3px,-28px) scale(0.4); opacity:0  }
}
@keyframes cellMorph {
  0%,100% { rx:18; ry:14 }
  33%     { rx:14; ry:20 }
  66%     { rx:22; ry:12 }
}
@keyframes membraneFlow {
  from { stroke-dashoffset: 0   }
  to   { stroke-dashoffset: -60 }
}
@keyframes codeScroll {
  from { transform: translateY(0)    }
  to   { transform: translateY(-50%) }
}
@keyframes radarSweep {
  from { transform: rotate(0deg);   opacity:0.7 }
  to   { transform: rotate(360deg); opacity:0.7 }
}
@keyframes radarPing {
  0%   { r:2;  opacity:1   }
  100% { r:28; opacity:0   }
}
@keyframes sectionReveal {
  from { opacity:0; transform:translateY(40px) scale(0.98) }
  to   { opacity:1; transform:translateY(0)    scale(1)    }
}
@keyframes bannerSlide {
  from { opacity:0; transform:scaleX(0) }
  to   { opacity:1; transform:scaleX(1) }
}
@keyframes lineGrow    { from { stroke-dashoffset:400 } to { stroke-dashoffset:0 } }
@keyframes hexSpin     { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
.card-hover { transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease; }
.card-hover:hover { transform: translateY(-3px); border-color: rgba(79,142,247,0.3) !important; background: #131f33 !important; }
.btn-hover  { transition: all 0.2s ease; }
.btn-hover:hover { background: rgba(79,142,247,0.2) !important; border-color: rgba(79,142,247,0.4) !important; }
.fade-up    { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
.fade-up-1  { animation: fadeUp 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both; }
.fade-up-2  { animation: fadeUp 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) both; }
.fade-up-3  { animation: fadeUp 0.6s 0.3s cubic-bezier(0.22,1,0.36,1) both; }
.fade-up-4  { animation: fadeUp 0.6s 0.4s cubic-bezier(0.22,1,0.36,1) both; }
.fade-up-5  { animation: fadeUp 0.6s 0.5s cubic-bezier(0.22,1,0.36,1) both; }
.graphic-float { animation: floatY 7s ease-in-out infinite; }
input::placeholder { color: #3d506e; }
input:focus { outline: none; }
* { box-sizing: border-box; }
`;

// ── Bio+Tech graphic ─────────────────────────────────────────────────────────
function BioTechGraphic() {
  // DNA helix
  const strandPairs: [number,number,number,number][] = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const y = t * 380 + 10;
    const wave = Math.sin(t * Math.PI * 4);
    const x1 = 100 + wave * 36;
    const x2 = 100 - wave * 36;
    strandPairs.push([x1, y, x2, y]);
  }
  const rungs = strandPairs.filter((_,i) => i % 2 === 0);

  // Hex grid positions for the bio-cell backdrop
  const hexPositions = [
    [230,60],[290,95],[350,60],[410,95],[350,130],
    [290,165],[230,130],[170,165],[110,130],
    [170,95],[230,200],[290,235],[350,200],
  ];
  // Code lines for terminal panel
  const codeLines = [
    "SEQ_ID: AXSM·BCR·001","TARGET: MDM2·p53","PHASE: II","ORR: 38.4%",
    "BBB: HIGH","MTD: 180mg","T½: 14.2h","AUC: 2840","Cmax: 312ng/mL",
    "SEQ_ID: VRTX·VX880","TARGET: ISLET·CELL","PHASE: III","HbA1c: -2.1%",
    "PDUFA: OCT 2026","ENGRAFT: 91%","SEQ_ID: CRSP·CTX001",
  ];

  return (
    <div className="graphic-float" style={{ position:"relative", width:480, height:480, flexShrink:0 }}>
      {/* Ambient bloom */}
      <div style={{
        position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
        width:420, height:420, borderRadius:"50%", pointerEvents:"none",
        background:"radial-gradient(circle, rgba(79,142,247,0.07) 0%, rgba(34,211,160,0.03) 50%, transparent 72%)",
      }}/>

      <svg viewBox="0 0 480 480" width="480" height="480" style={{ position:"absolute", inset:0, overflow:"visible" }}>
        <defs>
          <filter id="glow"  x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow2" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="7" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="blur4" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
          <linearGradient id="helixA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#4f8ef7" stopOpacity="0.05"/>
            <stop offset="40%"  stopColor="#4f8ef7" stopOpacity="0.9"/>
            <stop offset="70%"  stopColor="#22d3a0" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#22d3a0" stopOpacity="0.05"/>
          </linearGradient>
          <linearGradient id="helixB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#22d3a0" stopOpacity="0.05"/>
            <stop offset="40%"  stopColor="#22d3a0" stopOpacity="0.9"/>
            <stop offset="70%"  stopColor="#4f8ef7"  stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#4f8ef7"  stopOpacity="0.05"/>
          </linearGradient>
          <linearGradient id="traceH" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="#4f8ef7" stopOpacity="0"/>
            <stop offset="50%" stopColor="#4f8ef7" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#4f8ef7" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="traceV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"  stopColor="#22d3a0" stopOpacity="0"/>
            <stop offset="50%" stopColor="#22d3a0" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#22d3a0" stopOpacity="0"/>
          </linearGradient>
          <radialGradient id="cellGrad" cx="40%" cy="35%">
            <stop offset="0%"  stopColor="rgba(79,142,247,0.25)"/>
            <stop offset="60%" stopColor="rgba(9,18,35,0.85)"/>
            <stop offset="100%" stopColor="rgba(9,18,35,0.95)"/>
          </radialGradient>
          <clipPath id="termClip">
            <rect x="290" y="280" width="168" height="160" rx="8"/>
          </clipPath>
        </defs>

        {/* ══ 1. HEX GRID BACKDROP ══ */}
        {hexPositions.map(([hx,hy],i) => {
          const size = 22;
          const pts = Array.from({length:6},(_,k) => {
            const a = (k*60-30)*Math.PI/180;
            return `${hx+size*Math.cos(a)},${hy+size*Math.sin(a)}`;
          }).join(" ");
          return (
            <polygon key={`hex${i}`} points={pts}
              fill="rgba(79,142,247,0.025)"
              stroke="rgba(79,142,247,0.1)" strokeWidth="0.6"
              style={{ animation:`glowPulse ${3+i*0.4}s ${i*0.2}s ease-in-out infinite` }}/>
          );
        })}

        {/* ══ 2. CIRCUIT TRACES (right side) ══ */}
        {[95,135,175,215,255,295,335].map((y,i) => (
          <line key={`ht${i}`} x1="240" y1={y} x2="430" y2={y}
            stroke="url(#traceH)" strokeWidth="0.6" strokeDasharray="8 5"
            style={{ animation:`dash 4s ${i*0.3}s linear infinite` }}/>
        ))}
        {[300,350,400,445].map((x,i) => (
          <line key={`vt${i}`} x1={x} y1="60" x2={x} y2="280"
            stroke="rgba(79,142,247,0.07)" strokeWidth="0.5" strokeDasharray="4 8"/>
        ))}
        {/* circuit nodes */}
        {[[300,135],[350,175],[400,215],[300,255],[350,95]].map(([x,y],i) => (
          <g key={`cn${i}`}>
            <rect x={x-5} y={y-5} width="10" height="10" rx="1.5"
              fill="rgba(79,142,247,0.06)" stroke="rgba(79,142,247,0.3)" strokeWidth="0.6"/>
            <circle cx={x} cy={y} r="2" fill="#4f8ef7" opacity="0.7" filter="url(#glow)"
              style={{ animation:`cellPulse ${2+i*0.25}s ${i*0.15}s ease-in-out infinite` }}/>
          </g>
        ))}

        {/* ══ 3. DNA DOUBLE HELIX (left column) ══ */}
        <path d={`M ${strandPairs.map(([x1,y]) => `${x1},${y+30}`).join(" L ")}`}
          fill="none" stroke="url(#helixA)" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="10 3" style={{ animation:"helixFlow 2.2s linear infinite" }} filter="url(#glow)"/>
        <path d={`M ${strandPairs.map(([,,x2,y]) => `${x2},${y+30}`).join(" L ")}`}
          fill="none" stroke="url(#helixB)" strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="10 3" style={{ animation:"helixFlow 2.2s 1.1s linear infinite" }} filter="url(#glow)"/>
        {/* base pair rungs */}
        {rungs.map(([x1,y,x2],i) => {
          const colors = ["#4f8ef7","#22d3a0","#fbbf24","#f87171","#a78bfa","#38bdf8"];
          const c = colors[i % colors.length];
          return (
            <g key={`rung${i}`}>
              <line x1={x1} y1={y+30} x2={x2} y2={y+30}
                stroke={c} strokeWidth="1.6" opacity="0.4"
                style={{ animation:`glowPulse ${1.8+i*0.1}s ${i*0.07}s ease-in-out infinite` }}/>
              <circle cx={x1} cy={y+30} r="4" fill={c} opacity="0.9" filter="url(#glow)"
                style={{ animation:`cellPulse ${2.4+i*0.12}s ${i*0.09}s ease-in-out infinite` }}/>
              <circle cx={x2} cy={y+30} r="4" fill={c} opacity="0.9" filter="url(#glow)"
                style={{ animation:`cellPulse ${2.4+i*0.12}s ${i*0.09+0.5}s ease-in-out infinite` }}/>
            </g>
          );
        })}

        {/* ══ 4. CENTRAL BIO-CELL ══ */}
        {/* outer membrane — morphing ellipse */}
        <ellipse cx="255" cy="230" rx="72" ry="64"
          fill="url(#cellGrad)"
          stroke="rgba(79,142,247,0.22)" strokeWidth="1.2"
          strokeDasharray="6 3"
          style={{ animation:"membraneFlow 8s linear infinite, rotateSlow 25s linear infinite", transformOrigin:"255px 230px" }}/>
        {/* inner membrane */}
        <ellipse cx="255" cy="230" rx="52" ry="46"
          fill="rgba(9,18,35,0.7)"
          stroke="rgba(34,211,160,0.18)" strokeWidth="1"/>
        {/* nucleus */}
        <circle cx="255" cy="230" r="28"
          fill="rgba(9,18,35,0.95)"
          stroke="rgba(79,142,247,0.55)" strokeWidth="1.5" filter="url(#glow2)"
          style={{ animation:`glowPulse 3s ease-in-out infinite` }}/>
        {/* nucleus inner glow */}
        <circle cx="255" cy="230" r="14"
          fill="rgba(79,142,247,0.75)" filter="url(#glow2)"
          style={{ animation:`glowPulse 2.2s 0.3s ease-in-out infinite` }}/>
        <circle cx="255" cy="230" r="6" fill="rgba(255,255,255,0.88)" filter="url(#glow)"/>
        {/* crosshair */}
        {[[255,197,255,212],[255,248,255,263],[220,230,235,230],[275,230,290,230]].map(([x1,y1,x2,y2],i)=>(
          <line key={`cx${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(79,142,247,0.5)" strokeWidth="0.8"/>
        ))}
        {/* radar sweep inside cell */}
        <line x1="255" y1="230" x2="283" y2="230"
          stroke="rgba(79,142,247,0.6)" strokeWidth="1"
          style={{ animation:"radarSweep 3s linear infinite", transformOrigin:"255px 230px" }}/>
        {/* radar ping rings */}
        {[0, 0.8, 1.6].map((d,i)=>(
          <circle key={`rp${i}`} cx="255" cy="230" r="2" fill="none"
            stroke="rgba(79,142,247,0.5)" strokeWidth="1">
            <animate attributeName="r"   from="2"  to="26" dur="2.4s" begin={`${d}s`} repeatCount="indefinite"/>
            <animate attributeName="opacity" from="0.7" to="0" dur="2.4s" begin={`${d}s`} repeatCount="indefinite"/>
          </circle>
        ))}
        {/* organelles */}
        {[[-28,14],[18,-22],[22,20],[-18,-18]].map(([dx,dy],i)=>{
          const colors = ["rgba(34,211,160,0.5)","rgba(251,191,36,0.4)","rgba(79,142,247,0.45)","rgba(248,113,113,0.4)"];
          return <ellipse key={`org${i}`} cx={255+dx} cy={230+dy} rx="6" ry="4"
            fill={colors[i]} opacity="0.8" filter="url(#glow)"
            style={{ animation:`cellPulse ${2+i*0.4}s ${i*0.3}s ease-in-out infinite` }}/>;
        })}

        {/* ══ 5. SATELLITE NODES orbiting the cell ══ */}
        {[
          { label:"mRNA", color:"#22d3a0", r:88,  speed:"12s",  startDeg:0   },
          { label:"API",  color:"#fbbf24", r:88,  speed:"17s",  startDeg:120 },
          { label:"TCR",  color:"#a78bfa", r:88,  speed:"22s",  startDeg:240 },
        ].map(({label,color,r,speed,startDeg},i)=>{
          const rad = startDeg*Math.PI/180;
          const sx = 255+Math.cos(rad)*r;
          const sy = 230+Math.sin(rad)*r;
          return (
            <g key={`sat${i}`} style={{ animation:`rotateSlow ${speed} ${i*2}s linear infinite`, transformOrigin:"255px 230px" }}>
              <circle cx={sx} cy={sy} r="8" fill={color} opacity="0.85" filter="url(#glow)"/>
              <text x={sx} y={sy+4} textAnchor="middle" fill="rgba(9,18,35,0.9)"
                fontSize="5.5" fontWeight="800" fontFamily="monospace">{label}</text>
            </g>
          );
        })}
        {/* orbit ring */}
        <circle cx="255" cy="230" r="88"
          fill="none" stroke="rgba(79,142,247,0.08)" strokeWidth="1" strokeDasharray="5 8"
          style={{ animation:"rotateSlow 30s linear infinite", transformOrigin:"255px 230px" }}/>

        {/* ══ 6. CONNECTOR LINES: helix → cell ══ */}
        {[rungs[3],rungs[6],rungs[9]].filter(Boolean).map(([x1,y,,],i)=>(
          <line key={`cl${i}`} x1={x1+3} y1={y+30} x2="183" y2="230"
            stroke="rgba(79,142,247,0.12)" strokeWidth="0.8" strokeDasharray="4 5"
            style={{ animation:`glowPulse ${3+i}s ${i*0.4}s ease-in-out infinite` }}/>
        ))}

        {/* ══ 7. TERMINAL PANEL (bottom-right) ══ */}
        {/* panel body */}
        <rect x="290" y="282" width="168" height="158" rx="8"
          fill="rgba(6,9,15,0.92)" stroke="rgba(79,142,247,0.25)" strokeWidth="1"/>
        {/* title bar */}
        <rect x="290" y="282" width="168" height="20" rx="8" fill="rgba(79,142,247,0.12)"/>
        <rect x="290" y="292" width="168" height="10" fill="rgba(79,142,247,0.12)"/>
        <circle cx="302" cy="292" r="3.5" fill="rgba(248,113,113,0.7)"/>
        <circle cx="314" cy="292" r="3.5" fill="rgba(251,191,36,0.7)"/>
        <circle cx="326" cy="292" r="3.5" fill="rgba(34,211,160,0.7)"/>
        <text x="374" y="295" fill="rgba(79,142,247,0.5)" fontSize="6.5" fontFamily="monospace" textAnchor="middle" letterSpacing="1">BCR·LIVE·FEED</text>
        {/* scan line */}
        <rect x="290" y="302" width="168" height="1.5" fill="rgba(79,142,247,0.15)"
          style={{ animation:"scanY 3.5s ease-in-out infinite" }}/>
        {/* scrolling code text — clipped */}
        <g clipPath="url(#termClip)">
          <g style={{ animation:"codeScroll 12s linear infinite" }}>
            {[...codeLines,...codeLines].map((line,i)=>{
              const isKey = line.startsWith("SEQ_ID");
              const isVal = line.includes(":");
              const color = isKey ? "#22d3a0" : isVal ? "#4f8ef7" : "rgba(79,142,247,0.4)";
              const prefix = isKey ? ">" : isVal ? " ·" : "  ";
              return (
                <text key={i} x="298" y={315+i*11}
                  fill={color} fontSize="6.5" fontFamily="monospace" opacity="0.85">
                  {prefix} {line}
                </text>
              );
            })}
          </g>
        </g>

        {/* ══ 8. MOVING DATA PACKETS ══ */}
        <circle r="3.5" fill="#4f8ef7" filter="url(#glow)">
          <animateMotion dur="3.2s" repeatCount="indefinite" path="M 120 160 Q 185 180 183 230"/>
        </circle>
        <circle r="2.5" fill="#22d3a0" filter="url(#glow)">
          <animateMotion dur="4.5s" begin="1s" repeatCount="indefinite" path="M 110 290 Q 165 270 183 235"/>
        </circle>
        <circle r="2" fill="#fbbf24" filter="url(#glow)">
          <animateMotion dur="2.8s" begin="0.6s" repeatCount="indefinite" path="M 327 230 Q 310 260 290 310"/>
        </circle>
        <circle r="1.8" fill="#a78bfa" filter="url(#glow)">
          <animateMotion dur="5s" begin="2s" repeatCount="indefinite" path="M 255 302 Q 270 320 290 340"/>
        </circle>

        {/* ══ 9. FLOATING PARTICLES ══ */}
        {[
          {cx:185,cy:60,  r:2.5,c:"#4f8ef7",d:0  },
          {cx:375,cy:80,  r:2,  c:"#22d3a0",d:0.7},
          {cx:445,cy:165, r:2,  c:"#fbbf24",d:1.2},
          {cx:155,cy:390, r:2.5,c:"#a78bfa",d:1.6},
          {cx:415,cy:265, r:1.8,c:"#f87171",d:1.0},
          {cx:250,cy:450, r:2,  c:"#4f8ef7",d:0.4},
          {cx:65,cy:215,  r:1.8,c:"#22d3a0",d:2.1},
        ].map((p,i)=>(
          <circle key={`dp${i}`} cx={p.cx} cy={p.cy} r={p.r} fill={p.c} filter="url(#glow)"
            style={{ animation:`particleDrift 5.5s ${p.d}s ease-in-out infinite` }}/>
        ))}

        {/* ══ 10. LABELS ══ */}
        <text x="52"  y="52"  fill="rgba(79,142,247,0.5)"  fontSize="7.5" fontFamily="monospace" letterSpacing="1.5">GENOME</text>
        <text x="365" y="70"  fill="rgba(34,211,160,0.4)"  fontSize="7"   fontFamily="monospace" letterSpacing="1.5">mRNA·SIG</text>
        <text x="278" y="270" fill="rgba(79,142,247,0.35)" fontSize="7"   fontFamily="monospace" letterSpacing="1.5">CATALYST</text>
        <text x="130" y="420" fill="rgba(251,191,36,0.35)" fontSize="7"   fontFamily="monospace" letterSpacing="1.5">PROTEIN·Σ</text>
        <text x="58"  y="390" fill="rgba(168,139,250,0.35)"fontSize="7"   fontFamily="monospace" letterSpacing="1.5">PHASE·II</text>
      </svg>
    </div>
  );
}

// ── Scroll transition banner ─────────────────────────────────────────────────
function ScrollTransition() {
  const ref   = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      background: C.bgBase,
      padding:"56px 0 0",
      display:"flex", flexDirection:"column", alignItems:"center", gap:0,
      overflow:"hidden",
    }}>
      {/* animated horizontal rule that draws itself */}
      <div style={{
        width: vis ? "100%" : "0%",
        height:1, background:`linear-gradient(90deg, transparent, ${C.accent}, ${C.green}, transparent)`,
        transition:"width 1.2s cubic-bezier(0.22,1,0.36,1)",
      }}/>

      {/* label strip */}
      <div style={{
        display:"flex", alignItems:"center", gap:16, padding:"18px 0",
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(16px)",
        transition:"opacity 0.7s 0.4s ease, transform 0.7s 0.4s ease",
      }}>
        {/* left dots */}
        {[C.accent, C.green, C.amber].map((c,i) => (
          <div key={i} style={{
            width:6, height:6, borderRadius:"50%", background:c,
            opacity: vis ? 1 : 0,
            transition:`opacity 0.4s ${0.5+i*0.15}s ease`,
            boxShadow:`0 0 8px ${c}`,
          }}/>
        ))}
        <span style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:C.textMuted, fontWeight:700 }}>
          Company Intelligence
        </span>
        {[C.amber, C.green, C.accent].map((c,i) => (
          <div key={i} style={{
            width:6, height:6, borderRadius:"50%", background:c,
            opacity: vis ? 1 : 0,
            transition:`opacity 0.4s ${0.95+i*0.15}s ease`,
            boxShadow:`0 0 8px ${c}`,
          }}/>
        ))}
      </div>

      {/* animated SVG waveform */}
      <div style={{
        width:"100%", opacity: vis ? 1 : 0,
        transition:"opacity 0.8s 0.3s ease",
      }}>
        <svg viewBox="0 0 1200 60" width="100%" height="60" preserveAspectRatio="none" style={{ display:"block" }}>
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor={C.accent}  stopOpacity="0"/>
              <stop offset="30%"  stopColor={C.accent}  stopOpacity="0.5"/>
              <stop offset="50%"  stopColor={C.green}   stopOpacity="0.7"/>
              <stop offset="70%"  stopColor={C.accent}  stopOpacity="0.5"/>
              <stop offset="100%" stopColor={C.accent}  stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* three offset sine waves */}
          {[
            { amp:10, freq:1,   phase:0,   op:0.5, sw:1.2 },
            { amp:6,  freq:1.7, phase:0.8, op:0.3, sw:0.8 },
            { amp:14, freq:0.6, phase:1.5, op:0.2, sw:0.5 },
          ].map(({amp,freq,phase,op,sw},wi) => {
            const pts = Array.from({length:121},(_,i) => {
              const x = i * 10;
              const y = 30 + amp * Math.sin(freq * i * 0.1 + phase);
              return `${x},${y}`;
            }).join(" ");
            return <polyline key={wi} points={pts} fill="none"
              stroke="url(#waveGrad)" strokeWidth={sw} opacity={op}/>;
          })}
          {/* data tick marks */}
          {Array.from({length:24},(_,i) => (
            <line key={i} x1={i*52} y1="28" x2={i*52} y2={i%4===0?18:24}
              stroke="rgba(79,142,247,0.2)" strokeWidth="0.7"/>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ── Scroll-reveal wrapper ────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.6s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.6s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
    }}>
      {children}
    </div>
  );
}

// ── Small components ─────────────────────────────────────────────────────────
function Tag({ label }: { label: string }) {
  return (
    <span style={{
      display:"inline-block", padding:"3px 9px", borderRadius:5,
      fontSize:10, fontWeight:600, letterSpacing:"0.07em", textTransform:"uppercase",
      background:C.accentSoft, color:C.accent, border:`1px solid rgba(79,142,247,0.18)`,
    }}>{label}</span>
  );
}

function RiskBadge({ risk }: { risk:"LOW"|"MEDIUM"|"HIGH" }) {
  const r = riskCfg[risk];
  return (
    <span style={{
      padding:"3px 9px", borderRadius:5,
      fontSize:10, fontWeight:700, letterSpacing:"0.09em",
      background:r.bg, color:r.text, border:`1px solid ${r.border}`,
    }}>{risk} RISK</span>
  );
}

function StatCard({ label, value }: { label:string; value:string }) {
  return (
    <div style={{
      padding:"18px 20px", borderRadius:12,
      background:C.bgCard, border:`1px solid ${C.border}`,
      transition:"border-color 0.2s",
    }} className="card-hover">
      <p style={{ fontSize:10, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted, margin:"0 0 8px" }}>{label}</p>
      <p style={{ fontSize:15, fontWeight:700, color:C.textPrimary, margin:0, lineHeight:1.3 }}>{value}</p>
    </div>
  );
}

function WatchlistCard({ company, selected, onClick }: { company:BiotechCompany; selected:boolean; onClick:()=>void }) {
  return (
    <div onClick={onClick} className="card-hover" style={{
      padding:"16px 18px", borderRadius:12, cursor:"pointer", marginBottom:10,
      border:`1px solid ${selected ? "rgba(79,142,247,0.4)" : C.border}`,
      background: selected ? "rgba(79,142,247,0.08)" : C.bgCard,
      position:"relative", overflow:"hidden",
    }}>
      {selected && <div style={{ position:"absolute", left:0, top:0, bottom:0, width:3, background:C.accent, borderRadius:"3px 0 0 3px" }} />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
        <div>
          <span style={{ fontSize:16, fontWeight:800, color:C.textPrimary, letterSpacing:"-0.02em" }}>{company.ticker}</span>
          <span style={{ fontSize:11, color:C.textMuted, marginLeft:7 }}>{company.drugName}</span>
        </div>
        <RiskBadge risk={company.riskScore} />
      </div>
      <p style={{ fontSize:12, color:C.textSecondary, margin:"0 0 10px", lineHeight:1.5 }}>{company.name}</p>
      <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
        {company.tags.slice(0,2).map(t => <Tag key={t} label={t} />)}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:11, color:C.textMuted }}>{company.marketCap}</span>
        <span style={{
          fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:5,
          background:C.accentSoft, color:C.accent, border:`1px solid rgba(79,142,247,0.18)`,
          letterSpacing:"0.05em",
        }}>PHASE {company.currentPhase}</span>
      </div>
    </div>
  );
}

function PipelinePhase({ phase, isEasyMode, index }: { phase:TrialPhase; isEasyMode:boolean; index:number }) {
  const cfg = phaseCfg[phase.status] || phaseCfg.UPCOMING;
  return (
    <Reveal>
      <div style={{ display:"flex", gap:18, alignItems:"flex-start", marginBottom:14 }}>
        <div style={{
          width:38, height:38, borderRadius:"50%", flexShrink:0,
          background:cfg.bg, border:`1.5px solid ${cfg.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:13, fontWeight:800, color:cfg.color, zIndex:1,
        }}>{index + 1}</div>
        <div style={{
          flex:1, padding:"16px 20px", borderRadius:12,
          background:C.bgCard, border:`1px solid ${C.border}`,
          transition:"border-color 0.2s",
        }} className="card-hover">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <span style={{
              fontSize:10, fontWeight:700, letterSpacing:"0.09em", textTransform:"uppercase",
              padding:"3px 9px", borderRadius:5,
              background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`,
            }}>{phase.status}</span>
            <span style={{ fontSize:11, color:C.textMuted }}>Est. {phase.estimatedCompletionDate}</span>
          </div>
          <p style={{
            fontSize:13, lineHeight:1.65, margin:0,
            color: isEasyMode ? C.textPrimary : C.textSecondary,
            fontFamily: isEasyMode ? "inherit" : "var(--font-geist-mono, monospace)",
          }}>
            {isEasyMode ? phase.simplifiedObjective : phase.rawScientificTitle}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [selected, setSelected]           = useState<BiotechCompany>(mockBiotechCompanies[0]);
  const [isEasyMode, setIsEasyMode]       = useState(true);
  const [query, setQuery]                 = useState("");
  const [dropOpen, setDropOpen]           = useState(false);
  const searchRef                         = useRef<HTMLDivElement>(null);
  const detailRef                         = useRef<HTMLDivElement>(null);

  const [livePrice, setLivePrice]         = useState<string|null>(null);
  const [priceChange, setPriceChange]     = useState<string|null>(null);
  const [isPositive, setIsPositive]       = useState(true);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [apiError, setApiError]           = useState<string|null>(null);
  const [livePipeline, setLivePipeline]   = useState<TrialPhase[]>([]);
  const [isLoadingTrials, setIsLoadingTrials] = useState(false);
  const [translated, setTranslated]       = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const searchResults = query.trim()
    ? mockBiotechCompanies.filter(c =>
        c.ticker.toLowerCase().includes(query.toLowerCase()) ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const scrollToDetail = () => detailRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });

  const selectCompany = (c: BiotechCompany) => {
    setSelected(c); setQuery(""); setDropOpen(false);
    setTimeout(scrollToDetail, 80);
  };

  useEffect(() => {
    async function go() {
      setIsLoadingPrice(true); setApiError(null);
      try {
        const res = await fetch(`/api/stock?ticker=${selected.ticker}`);
        const d   = await res.json();
        if (res.ok && d.price) { setLivePrice(d.price); setPriceChange(d.changePercent); setIsPositive(d.isPositive); }
        else { setApiError(d.error || "Unavailable"); setLivePrice(null); }
      } catch { setApiError("Network error"); setLivePrice(null); }
      setIsLoadingPrice(false);
    }
    go();
  }, [selected.ticker]);

  useEffect(() => {
    async function go() {
      setIsLoadingTrials(true);
      try {
        const res = await fetch(`/api/trials?company=${selected.name}`);
        const d   = await res.json();
        setLivePipeline(res.ok && d.pipeline ? d.pipeline : selected.pipeline);
      } catch { setLivePipeline(selected.pipeline); }
      setIsLoadingTrials(false);
    }
    go();
  }, [selected.name]);

  useEffect(() => {
    async function go() {
      setIsTranslating(true);
      try {
        const res = await fetch("/api/translate", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body: JSON.stringify({ text: selected.rawMechanism }),
        });
        const d = await res.json();
        setTranslated(res.ok && d.translatedText ? d.translatedText : selected.simplifiedMechanism);
      } catch { setTranslated(selected.simplifiedMechanism); }
      setIsTranslating(false);
    }
    go();
  }, [selected.rawMechanism, selected.simplifiedMechanism]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const pipeline = livePipeline.length ? livePipeline : selected.pipeline;

  return (
    <>
      <style>{STYLES}</style>

      <div style={{ background:C.bgBase, color:C.textPrimary, fontFamily:"var(--font-geist-sans, -apple-system, sans-serif)", WebkitFontSmoothing:"antialiased" }}>

        {/* ══ HERO — full viewport ══════════════════════════════════════════ */}
        <section style={{
          minHeight:"100vh", display:"flex", flexDirection:"column",
          justifyContent:"center", alignItems:"center",
          position:"relative", overflow:"hidden", padding:"0 24px",
        }}>
          {/* background grid */}
          <div style={{
            position:"absolute", inset:0, zIndex:0,
            backgroundImage:`
              linear-gradient(rgba(79,142,247,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79,142,247,0.04) 1px, transparent 1px)`,
            backgroundSize:"64px 64px",
          }} />
          {/* radial glow */}
          <div style={{
            position:"absolute", top:"40%", left:"50%", transform:"translate(-50%,-50%)",
            width:600, height:600, borderRadius:"50%",
            background:"radial-gradient(circle, rgba(79,142,247,0.07) 0%, transparent 70%)",
            zIndex:0, pointerEvents:"none",
          }} />

          <div style={{ position:"relative", zIndex:1, maxWidth:1100, width:"100%", display:"flex", alignItems:"center", gap:80, justifyContent:"center" }}>
            {/* Left copy */}
            <div style={{ flex:1, maxWidth:580 }}>
              {/* wordmark */}
              <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
                <div style={{
                  width:32, height:32, borderRadius:9,
                  background:`linear-gradient(135deg, ${C.accent}, #1d3a8a)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:14, fontWeight:900, color:"#fff",
                  boxShadow:`0 4px 16px rgba(79,142,247,0.4)`,
                }}>B</div>
                <span style={{ fontSize:13, fontWeight:700, letterSpacing:"0.15em", color:C.textMuted, textTransform:"uppercase" }}>BioCatalyst Radar</span>
              </div>

              <h1 className="fade-up-1" style={{
                fontSize:"clamp(38px,5vw,62px)", fontWeight:900, lineHeight:1.1,
                letterSpacing:"-0.04em", margin:"0 0 20px",
                color:C.textPrimary,
              }}>
                Biotech intelligence,{" "}
                <span style={{
                  background:`linear-gradient(90deg, ${C.accent}, ${C.green})`,
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                }}>decoded.</span>
              </h1>

              <p className="fade-up-2" style={{
                fontSize:18, color:C.textSecondary, lineHeight:1.7,
                margin:"0 0 40px", maxWidth:480, fontWeight:400,
              }}>
                Track clinical pipelines, live market data, and trial catalysts — translated from dense science into plain language.
              </p>

              {/* Search bar */}
              <div className="fade-up-3" ref={searchRef} style={{ position:"relative", marginBottom:32 }}>
                <div style={{
                  display:"flex", alignItems:"center", gap:12,
                  padding:"14px 20px", borderRadius:14,
                  background:C.bgCard, border:`1px solid ${dropOpen ? "rgba(79,142,247,0.5)" : C.borderBright}`,
                  transition:"border-color 0.2s, box-shadow 0.2s",
                  boxShadow: dropOpen ? `0 0 0 3px rgba(79,142,247,0.08)` : "none",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" style={{ flexShrink:0 }}>
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    value={query}
                    onChange={e => { setQuery(e.target.value); setDropOpen(true); }}
                    onFocus={() => setDropOpen(true)}
                    placeholder="Search ticker, company, or therapy type…"
                    style={{
                      flex:1, background:"transparent", border:"none",
                      fontSize:15, color:C.textPrimary, caretColor:C.accent,
                    }}
                  />
                  {query && (
                    <button onClick={() => { setQuery(""); setDropOpen(false); }} style={{ background:"none", border:"none", cursor:"pointer", color:C.textMuted, fontSize:18, lineHeight:1 }}>×</button>
                  )}
                </div>

                {/* Dropdown */}
                {dropOpen && searchResults.length > 0 && (
                  <div style={{
                    position:"absolute", top:"calc(100% + 8px)", left:0, right:0, zIndex:100,
                    background:C.bgSurface, border:`1px solid ${C.borderBright}`,
                    borderRadius:12, overflow:"hidden",
                    boxShadow:"0 16px 48px rgba(0,0,0,0.6)",
                    animation:"fadeIn 0.15s ease",
                  }}>
                    {searchResults.map(c => (
                      <button key={c.id} onMouseDown={() => selectCompany(c)} style={{
                        width:"100%", display:"flex", alignItems:"center", gap:12,
                        padding:"12px 16px", background:"none", border:"none",
                        borderBottom:`1px solid ${C.border}`, cursor:"pointer", textAlign:"left",
                        transition:"background 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.bgCardHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                        <div style={{
                          width:34, height:34, borderRadius:8,
                          background:C.accentSoft, border:`1px solid rgba(79,142,247,0.18)`,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:9, fontWeight:800, color:C.accent, letterSpacing:"0.04em",
                        }}>{c.ticker.slice(0,3)}</div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:13, fontWeight:700, color:C.textPrimary, margin:0 }}>{c.ticker} — {c.name}</p>
                          <p style={{ fontSize:11, color:C.textMuted, margin:0 }}>{c.targetCondition}</p>
                        </div>
                        <RiskBadge risk={c.riskScore} />
                      </button>
                    ))}
                  </div>
                )}
                {dropOpen && query && searchResults.length === 0 && (
                  <div style={{
                    position:"absolute", top:"calc(100% + 8px)", left:0, right:0, zIndex:100,
                    background:C.bgSurface, border:`1px solid ${C.border}`, borderRadius:12,
                    padding:"20px", textAlign:"center", color:C.textMuted, fontSize:13,
                  }}>No results for "{query}"</div>
                )}
              </div>

              {/* Quick filters */}
              <div className="fade-up-4" style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:48 }}>
                {["CRISPR","mRNA","Oncology","Cell Therapy","Rare Disease"].map(tag => (
                  <button key={tag} onClick={() => { setQuery(tag); setDropOpen(true); }} className="btn-hover" style={{
                    padding:"6px 14px", borderRadius:20, fontSize:12, fontWeight:600, cursor:"pointer",
                    background:"rgba(255,255,255,0.04)", color:C.textSecondary,
                    border:`1px solid ${C.border}`,
                  }}>{tag}</button>
                ))}
              </div>

              {/* Scroll CTA */}
              <button className="fade-up-5 btn-hover" onClick={scrollToDetail} style={{
                display:"inline-flex", alignItems:"center", gap:10,
                padding:"13px 24px", borderRadius:12, cursor:"pointer",
                background:`linear-gradient(135deg, rgba(79,142,247,0.9), rgba(37,99,235,0.9))`,
                border:"none", color:"#fff", fontSize:14, fontWeight:700,
                boxShadow:`0 8px 32px rgba(79,142,247,0.3)`,
                letterSpacing:"0.02em",
              }}>
                Explore Companies
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </button>
            </div>

            {/* Right molecule */}
            <div className="fade-up-2" style={{ flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <BioTechGraphic />
            </div>
          </div>

          {/* Stat strip at bottom of hero */}
          <div className="fade-up-5" style={{
            position:"absolute", bottom:36, left:"50%", transform:"translateX(-50%)",
            display:"flex", gap:48, alignItems:"center",
          }}>
            {[
              { n: mockBiotechCompanies.length, label:"Companies" },
              { n: mockBiotechCompanies.reduce((a,c) => a + c.pipeline.length, 0), label:"Active Trials" },
              { n: mockBiotechCompanies.filter(c => c.riskScore==="LOW").length, label:"Low Risk" },
            ].map(({ n, label }) => (
              <div key={label} style={{ textAlign:"center" }}>
                <p style={{ fontSize:28, fontWeight:900, color:C.textPrimary, margin:0, letterSpacing:"-0.04em" }}>{n}</p>
                <p style={{ fontSize:11, color:C.textMuted, margin:0, letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:600 }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div style={{
            position:"absolute", bottom:36, right:40,
            display:"flex", flexDirection:"column", alignItems:"center", gap:4, opacity:0.4,
            animation:"fadeIn 1s 1.5s both",
          }}>
            <span style={{ fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:C.textMuted, fontWeight:600 }}>scroll</span>
            <div style={{ width:1, height:32, background:`linear-gradient(${C.accent}, transparent)` }} />
          </div>
        </section>

        {/* ══ SCROLL TRANSITION ═════════════════════════════════════════════ */}
        <div ref={detailRef}>
          <ScrollTransition />
        </div>

        {/* ══ DETAIL SECTION ════════════════════════════════════════════════ */}
        <section style={{
          display:"flex", minHeight:"100vh",
          background:C.bgSurface,
          borderTop:`1px solid ${C.border}`,
        }}>

          {/* ── Sidebar ── */}
          <div style={{
            width:300, flexShrink:0,
            borderRight:`1px solid ${C.border}`,
            display:"flex", flexDirection:"column",
            position:"sticky", top:0, height:"100vh", overflowY:"auto",
          }}>
            <div style={{ padding:"28px 20px 16px", borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:C.textMuted, margin:"0 0 14px" }}>
                Watchlist · {mockBiotechCompanies.length}
              </p>
            </div>
            <div style={{ flex:1, padding:"16px 16px", overflowY:"auto" }}>
              {mockBiotechCompanies.map(c => (
                <WatchlistCard key={c.id} company={c} selected={selected.id === c.id} onClick={() => setSelected(c)} />
              ))}
            </div>
          </div>

          {/* ── Detail content ── */}
          <div style={{ flex:1, overflowY:"auto" }}>
            <div style={{ maxWidth:820, padding:"48px 48px 80px", margin:"0 auto" }}>

              {/* Company header */}
              <Reveal>
                <div style={{ marginBottom:32 }}>
                  <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:20, flexWrap:"wrap", marginBottom:16 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
                        <h2 style={{ fontSize:34, fontWeight:900, letterSpacing:"-0.04em", margin:0, color:C.textPrimary }}>{selected.name}</h2>
                        <span style={{ fontSize:18, color:C.textMuted, fontWeight:400 }}>({selected.ticker})</span>
                      </div>
                      <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                        <RiskBadge risk={selected.riskScore} />
                        {selected.tags.map(t => <Tag key={t} label={t} />)}
                      </div>
                    </div>
                    {/* Live price */}
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontSize:10, color:C.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", margin:"0 0 4px" }}>{selected.ticker} / USD</p>
                      {isLoadingPrice ? (
                        <p style={{ fontSize:22, color:C.textMuted, margin:0, animation:"pulse 1.5s infinite" }}>—</p>
                      ) : apiError ? (
                        <p style={{ fontSize:12, color:C.red, margin:0 }}>{apiError}</p>
                      ) : livePrice ? (
                        <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"flex-end" }}>
                          <span style={{ fontSize:26, fontWeight:800, color:C.textPrimary, letterSpacing:"-0.03em" }}>${livePrice}</span>
                          {priceChange && (
                            <span style={{ fontSize:12, fontWeight:700, padding:"3px 8px", borderRadius:5, background: isPositive ? C.greenSoft : C.redSoft, color: isPositive ? C.green : C.red }}>
                              {isPositive ? "▲" : "▼"} {priceChange}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize:20, fontWeight:700, color:C.textSecondary }}>{selected.marketCap}</span>
                      )}
                    </div>
                  </div>

                  {/* Catalyst bar */}
                  <div style={{
                    padding:"12px 18px", borderRadius:10,
                    background:C.accentSoft, border:`1px solid rgba(79,142,247,0.18)`,
                    display:"flex", alignItems:"center", gap:10, flexWrap:"wrap",
                  }}>
                    <span style={{ fontSize:10, fontWeight:700, color:C.accent, letterSpacing:"0.1em", textTransform:"uppercase", flexShrink:0 }}>Next Catalyst</span>
                    <span style={{ width:1, height:12, background:"rgba(79,142,247,0.3)", flexShrink:0 }} />
                    <span style={{ fontSize:13, fontWeight:700, color:C.textPrimary }}>{selected.nextCatalystDate}</span>
                    <span style={{ fontSize:13, color:C.textSecondary }}>— {selected.catalystDescription}</span>
                  </div>
                </div>
              </Reveal>

              {/* Stats */}
              <Reveal delay={0.1}>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:28 }}>
                  <StatCard label="Drug Candidate" value={selected.drugName} />
                  <StatCard label="Target Condition" value={selected.targetCondition} />
                  <StatCard label="Market Cap" value={selected.marketCap} />
                </div>
              </Reveal>

              {/* Mode toggle + Science card */}
              <Reveal delay={0.15}>
                <div style={{ marginBottom:32 }}>
                  {/* Toggle */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                    <h3 style={{ fontSize:14, fontWeight:700, color:C.textPrimary, margin:0, letterSpacing:"0.02em" }}>Mechanism of Action</h3>
                    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", borderRadius:20, background:C.bgCard, border:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", color: !isEasyMode ? C.textPrimary : C.textMuted }}>CLINICAL</span>
                      <button onClick={() => setIsEasyMode(!isEasyMode)} style={{
                        position:"relative", width:38, height:21, borderRadius:11,
                        background: isEasyMode ? C.accent : C.borderBright,
                        border:"none", cursor:"pointer", flexShrink:0,
                        transition:"background 0.2s",
                      }}>
                        <span style={{
                          position:"absolute", top:3.5, left: isEasyMode ? 19 : 3.5,
                          width:14, height:14, borderRadius:"50%", background:"#fff",
                          transition:"left 0.2s",
                        }} />
                      </button>
                      <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.06em", color: isEasyMode ? C.accent : C.textMuted }}>EASY</span>
                    </div>
                  </div>

                  <div style={{
                    padding:"22px 24px", borderRadius:14,
                    background: isEasyMode ? "rgba(79,142,247,0.06)" : C.bgCard,
                    border:`1px solid ${isEasyMode ? "rgba(79,142,247,0.2)" : C.border}`,
                    transition:"all 0.3s ease",
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                      <span style={{ fontSize:18 }}>{isEasyMode ? "🧬" : "🔬"}</span>
                      <span style={{ fontSize:11, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", color:C.textMuted }}>
                        Target: {selected.targetCondition}
                      </span>
                    </div>
                    <div style={{ fontSize:15, lineHeight:1.75, color: isEasyMode ? C.textPrimary : C.textSecondary }}>
                      {isEasyMode ? (
                        isTranslating
                          ? <span style={{ color:C.accent, fontSize:13, animation:"pulse 1.5s infinite" }}>✦ Translating clinical data…</span>
                          : <span>"{translated}"</span>
                      ) : (
                        <span style={{ fontFamily:"var(--font-geist-mono, monospace)", fontSize:12, lineHeight:1.8 }}>{selected.rawMechanism}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Pipeline */}
              <Reveal delay={0.2}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                  <h3 style={{ fontSize:14, fontWeight:700, color:C.textPrimary, margin:0, letterSpacing:"0.02em" }}>Clinical Trial Pipeline</h3>
                  {isLoadingTrials && <span style={{ fontSize:11, color:C.accent, animation:"pulse 1.5s infinite" }}>Syncing…</span>}
                </div>
              </Reveal>

              <div style={{ position:"relative" }}>
                <div style={{
                  position:"absolute", left:19, top:0, bottom:0, width:1,
                  background:`linear-gradient(${C.border}, transparent)`, zIndex:0,
                }} />
                {pipeline.map((phase, i) => <PipelinePhase key={i} phase={phase} isEasyMode={isEasyMode} index={i} />)}
              </div>

            </div>
          </div>
        </section>
      </div>
    </>
  );
}
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { mockBiotechCompanies } from "@/data/mockData";
import { BiotechCompany, TrialPhase } from "@/types/biotech";
import { Tag, RiskBadge, StatCard } from "@/components/common";
import { Reveal } from "./Reveal";
import { BioTechGraphic } from "./BioTechGraphic";
import { ScrollTransition } from "./ScrollTransition";
import { WatchlistCard } from "./WatchlistCard";
import { PipelinePhase } from "./pipeline/PipelinePhase";
import { ExplorationPanel } from "./exploration/ExplorationPanel";

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

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selected, setSelected]           = useState<BiotechCompany>(mockBiotechCompanies[0]);
  const [isEasyMode, setIsEasyMode]       = useState(true);
  const [query, setQuery]                 = useState("");
  const [dropOpen, setDropOpen]           = useState(false);
  
  // NEW GLOBAL SEARCH STATES
  const [isSearching, setIsSearching]     = useState(false);
  const [searchError, setSearchError]     = useState<string|null>(null);

  const searchRef                         = useRef<HTMLDivElement>(null);
  const detailRef                         = useRef<HTMLDivElement>(null);
  const explorationRef                    = useRef<HTMLDivElement>(null);

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
        (c.tags && c.tags.some(t => t.toLowerCase().includes(query.toLowerCase())))
      )
    : [];

  const scrollToDetail = () => detailRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });
  const scrollToExploration = () => explorationRef.current?.scrollIntoView({ behavior:"smooth", block:"start" });

  const selectCompany = (c: BiotechCompany) => {
    setSelected(c); setQuery(""); setDropOpen(false); setSearchError(null);
    setTimeout(scrollToDetail, 80);
  };

  // NEW: Global Fetch Function triggered by pressing 'Enter'
  const handleGlobalSearch = async (tickerToSearch: string) => {
    const cleanTicker = tickerToSearch.trim().toUpperCase();
    if (!cleanTicker) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/stock?ticker=${cleanTicker}&type=overview`);
      const data = await res.json();

      if (!res.ok) {
        setSearchError(data.error || "Ticker profile execution halted.");
        setIsSearching(false);
        return;
      }

      const discoveredCompany: BiotechCompany = {
        id: `dynamic-${Date.now()}`,
        name: data.name,
        ticker: cleanTicker,
        marketCap: data.marketCap,
        riskScore: "MEDIUM",
        drugName: "Primary Pipeline Asset",
        targetCondition: "Indication Discovery Pending",
        rawMechanism: data.description,
        simplifiedMechanism: "Processing AI translation matrix...",
        currentPhase: 1,
        pipeline: [],
        tags: ["Global Market"],
        nextCatalystDate: "TBD",
        catalystDescription: "Awaiting secondary profile updates."
      };

      selectCompany(discoveredCompany);
    } catch (err) {
      setSearchError("Global directory connection timeout.");
    }
    setIsSearching(false);
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

  if (!mounted) {
    return (
      <div suppressHydrationWarning style={{ background:C.bgBase, minHeight:"100vh" }} />
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      <div suppressHydrationWarning style={{ background:C.bgBase, color:C.textPrimary, fontFamily:"var(--font-geist-sans, -apple-system, sans-serif)", WebkitFontSmoothing:"antialiased" }}>

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
                    onChange={e => { setQuery(e.target.value); setDropOpen(true); setSearchError(null); }}
                    onFocus={() => setDropOpen(true)}
                    // NEW: The 'Enter' key detection to trigger live Alpha Vantage search!
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleGlobalSearch(query);
                      }
                    }}
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

                {/* UPGRADED: Smart Global Search Prompt */}
                {dropOpen && query && searchResults.length === 0 && (
                  <div style={{
                    position:"absolute", top:"calc(100% + 8px)", left:0, right:0, zIndex:100,
                    background:C.bgSurface, border:`1px solid ${C.borderBright}`, borderRadius:12,
                    padding:"20px", textAlign:"center", color:C.textMuted, fontSize:13,
                    boxShadow:"0 16px 48px rgba(0,0,0,0.6)",
                  }}>
                    {isSearching ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%",
                          border: `2px solid ${C.accentSoft}`, borderTopColor: C.accent,
                          animation: "spin 1s linear infinite"
                        }} />
                        <span style={{ color: C.accent }}>Querying global market data for <strong style={{color: C.textPrimary}}>{query.toUpperCase()}</strong>...</span>
                      </div>
                    ) : searchError ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: 24 }}>⚠️</span>
                        <span style={{ color: C.red, fontWeight: 600 }}>{searchError}</span>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: C.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontSize: 18 }}>
                          🌎
                        </div>
                        <div>
                          <span style={{ display: "block", color: C.textPrimary, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
                            Search Global Directory
                          </span>
                          <span style={{ display: "block", color: C.textSecondary }}>
                            Press <kbd style={{ background: C.bgCard, padding: "2px 6px", borderRadius: 4, border: `1px solid ${C.border}`, fontFamily: "monospace", color: C.textPrimary }}>Enter</kbd> to analyze <strong>{query.toUpperCase()}</strong>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
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
                        {selected.tags?.map(t => <Tag key={t} label={t} />)}
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

              <div style={{ position:"relative", marginBottom:40 }}>
                <div style={{
                  position:"absolute", left:19, top:0, bottom:0, width:1,
                  background:`linear-gradient(${C.border}, transparent)`, zIndex:0,
                }} />
                {pipeline.map((phase, i) => <PipelinePhase key={i} phase={phase} isEasyMode={isEasyMode} index={i} />)}
              </div>

              {/* Explore more button */}
              <Reveal delay={0.25}>
                <button onClick={scrollToExploration} className="btn-hover" style={{
                  width:"100%", 
                  padding:"16px 24px", 
                  borderRadius:12, 
                  marginTop:40,
                  background:"rgba(79,142,247,0.08)", 
                  border:`1px solid rgba(79,142,247,0.2)`,
                  color:C.accent, 
                  fontSize:14, 
                  fontWeight:700, 
                  cursor:"pointer",
                  transition:"all 0.2s ease",
                }}>
                  Explore Other Companies ↓
                </button>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ══ EXPLORATION PANEL (NEW) ══ */}
        <div ref={explorationRef}>
          <ExplorationPanel 
            companies={mockBiotechCompanies.filter(c => c.id !== selected.id)}
            onSelectCompany={(c) => { 
              setSelected(c); 
              setTimeout(() => detailRef.current?.scrollIntoView({ behavior:"smooth" }), 100); 
            }}
            currentSelected={selected}
          />
        </div>

      </div>
    </>
  );
}
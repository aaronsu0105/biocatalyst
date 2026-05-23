"use client";

import { useRef, useState, useEffect } from "react";

const C = {
  bgBase: "#06090f",
  accent: "#4f8ef7",
  green: "#22d3a0",
  amber: "#fbbf24",
  textMuted: "#3d506e",
};

export function ScrollTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        background: C.bgBase,
        padding: "56px 0 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* animated horizontal rule that draws itself */}
      <div
        style={{
          width: vis ? "100%" : "0%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.accent}, ${C.green}, transparent)`,
          transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* label strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "18px 0",
          opacity: vis ? 1 : 0,
          transform: vis ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.7s 0.4s ease, transform 0.7s 0.4s ease",
        }}
      >
        {/* left dots */}
        {[C.accent, C.green, C.amber].map((c, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: c,
              opacity: vis ? 1 : 0,
              transition: `opacity 0.4s ${0.5 + i * 0.15}s ease`,
              boxShadow: `0 0 8px ${c}`,
            }}
          />
        ))}
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.textMuted,
            fontWeight: 700,
          }}
        >
          Company Intelligence
        </span>
        {[C.amber, C.green, C.accent].map((c, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: c,
              opacity: vis ? 1 : 0,
              transition: `opacity 0.4s ${0.95 + i * 0.15}s ease`,
              boxShadow: `0 0 8px ${c}`,
            }}
          />
        ))}
      </div>

      {/* Simple waveform (no dynamic calculation) */}
      <div
        style={{
          width: "100%",
          opacity: vis ? 1 : 0,
          transition: "opacity 0.8s 0.3s ease",
          height: 60,
          background: `linear-gradient(90deg, 
            transparent, 
            rgba(79,142,247,0.1) 30%, 
            rgba(34,211,160,0.15) 50%, 
            rgba(79,142,247,0.1) 70%, 
            transparent)`,
        }}
      />
    </div>
  );
}
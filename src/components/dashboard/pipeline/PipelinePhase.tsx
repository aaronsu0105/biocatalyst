"use client";

import { TrialPhase } from "@/types/biotech";
import { Reveal } from "../Reveal";

const C = {
  bgCard: "#0f1929",
  border: "rgba(255,255,255,0.07)",
  textPrimary: "#eef2ff",
  textMuted: "#3d506e",
  textSecondary: "#7a90b4",
};

const phaseCfg = {
  COMPLETED: {
    color: "#22d3a0",
    bg: "rgba(34,211,160,0.10)",
    border: "rgba(34,211,160,0.2)",
  },
  ONGOING: {
    color: "#4f8ef7",
    bg: "rgba(79,142,247,0.10)",
    border: "rgba(79,142,247,0.2)",
  },
  UPCOMING: {
    color: "#3d506e",
    bg: "rgba(255,255,255,0.04)",
    border: C.border,
  },
  FAILED: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.10)",
    border: "rgba(248,113,113,0.2)",
  },
};

export function PipelinePhase({
  phase,
  isEasyMode,
  index,
}: {
  phase: TrialPhase;
  isEasyMode: boolean;
  index: number;
}) {
  const cfg = phaseCfg[phase.status] || phaseCfg.UPCOMING;
  return (
    <Reveal>
      <div style={{ display: "flex", gap: 18, alignItems: "flex-start", marginBottom: 14 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            flexShrink: 0,
            background: cfg.bg,
            border: `1.5px solid ${cfg.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 800,
            color: cfg.color,
            zIndex: 1,
          }}
        >
          {index + 1}
        </div>
        <div
          style={{
            flex: 1,
            padding: "16px 20px",
            borderRadius: 12,
            background: C.bgCard,
            border: `1px solid ${C.border}`,
            transition: "border-color 0.2s",
          }}
          className="card-hover"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                padding: "3px 9px",
                borderRadius: 5,
                background: cfg.bg,
                color: cfg.color,
                border: `1px solid ${cfg.border}`,
              }}
            >
              {phase.status}
            </span>
            <span style={{ fontSize: 11, color: C.textMuted }}>
              Est. {phase.estimatedCompletionDate}
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.65,
              margin: 0,
              color: isEasyMode ? C.textPrimary : C.textSecondary,
              fontFamily: isEasyMode ? "inherit" : "var(--font-geist-mono, monospace)",
            }}
          >
            {isEasyMode ? phase.simplifiedObjective : phase.rawScientificTitle}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
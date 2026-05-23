"use client";

const riskCfg = {
  HIGH: { bg: "rgba(248,113,113,0.10)", text: "#f87171", border: "rgba(248,113,113,0.2)" },
  MEDIUM: { bg: "rgba(251,191,36,0.10)", text: "#fbbf24", border: "rgba(251,191,36,0.2)" },
  LOW: { bg: "rgba(34,211,160,0.10)", text: "#22d3a0", border: "rgba(34,211,160,0.2)" },
};

export function RiskBadge({ risk }: { risk: "LOW" | "MEDIUM" | "HIGH" }) {
  const r = riskCfg[risk];
  return (
    <span style={{
      padding: "3px 9px",
      borderRadius: 5,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.09em",
      background: r.bg,
      color: r.text,
      border: `1px solid ${r.border}`,
    }}>
      {risk} RISK
    </span>
  );
}
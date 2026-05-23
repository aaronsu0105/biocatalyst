"use client";

import { BiotechCompany } from "@/types/biotech";
import { RiskBadge, Tag } from "@/components/common";

const C = {
  bgCard: "#0f1929",
  border: "rgba(255,255,255,0.07)",
  textPrimary: "#eef2ff",
  textMuted: "#3d506e",
  textSecondary: "#7a90b4",
  accentSoft: "rgba(79,142,247,0.10)",
  accent: "#4f8ef7",
};

export function WatchlistCard({
  company,
  selected,
  onClick,
}: {
  company: BiotechCompany;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="card-hover"
      style={{
        padding: "16px 18px",
        borderRadius: 12,
        cursor: "pointer",
        marginBottom: 10,
        border: `1px solid ${selected ? "rgba(79,142,247,0.4)" : C.border}`,
        background: selected ? "rgba(79,142,247,0.08)" : C.bgCard,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {selected && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: C.accent,
            borderRadius: "3px 0 0 3px",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: C.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            {company.ticker}
          </span>
          <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 7 }}>
            {company.drugName}
          </span>
        </div>
        <RiskBadge risk={company.riskScore} />
      </div>
      <p
        style={{
          fontSize: 12,
          color: C.textSecondary,
          margin: "0 0 10px",
          lineHeight: 1.5,
        }}
      >
        {company.name}
      </p>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
        {company.tags.slice(0, 2).map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: C.textMuted }}>{company.marketCap}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 5,
            background: C.accentSoft,
            color: C.accent,
            border: `1px solid rgba(79,142,247,0.18)`,
            letterSpacing: "0.05em",
          }}
        >
          PHASE {company.currentPhase}
        </span>
      </div>
    </div>
  );
}
"use client";

import { BiotechCompany } from "@/types/biotech";
import { Tag, RiskBadge } from "@/components/common";

const C = {
  bgCard: "#0f1929",
  border: "rgba(255,255,255,0.07)",
  accent: "#4f8ef7",
  green: "#22d3a0",
  textPrimary: "#eef2ff",
  textMuted: "#3d506e",
  textSecondary: "#7a90b4",
};

export function CompanyGalleryCard({
  company,
  onClick,
  isActive,
}: {
  company: BiotechCompany;
  onClick: () => void;
  isActive: boolean;
}) {
  const trialCount = company.pipeline.length;
  const completedTrials = company.pipeline.filter((p) => p.status === "COMPLETED").length;

  return (
    <div
      onClick={onClick}
      className="card-hover"
      style={{
        padding: "20px",
        borderRadius: 14,
        cursor: "pointer",
        border: `2px solid ${isActive ? C.accent : C.border}`,
        background: isActive ? "rgba(79,142,247,0.12)" : C.bgCard,
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minWidth: 280,
        flexShrink: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: C.accent,
          }}
        />
      )}

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: 8,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: C.textPrimary,
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              {company.ticker}
            </p>
            <p
              style={{
                fontSize: 12,
                color: C.textMuted,
                margin: "4px 0 0",
              }}
            >
              {company.name}
            </p>
          </div>
          <RiskBadge risk={company.riskScore} />
        </div>

        <p
          style={{
            fontSize: 13,
            color: C.textSecondary,
            margin: "8px 0 0",
            lineHeight: 1.5,
          }}
        >
          {company.drugName}
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {company.tags.slice(0, 2).map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          paddingTop: 12,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 10,
              color: C.textMuted,
              fontWeight: 600,
              letterSpacing: "0.05em",
              margin: "0 0 4px",
              textTransform: "uppercase",
            }}
          >
            Trials
          </p>
          <p style={{ fontSize: 16, fontWeight: 800, color: C.accent, margin: 0 }}>
            {trialCount}
          </p>
        </div>
        <div>
          <p
            style={{
              fontSize: 10,
              color: C.textMuted,
              fontWeight: 600,
              letterSpacing: "0.05em",
              margin: "0 0 4px",
              textTransform: "uppercase",
            }}
          >
            Completed
          </p>
          <p style={{ fontSize: 16, fontWeight: 800, color: C.green, margin: 0 }}>
            {completedTrials}
          </p>
        </div>
      </div>

      <div style={{ paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>
          Phase {company.currentPhase}
        </span>
        <div
          style={{
            width: "100%",
            height: 6,
            borderRadius: 3,
            background: "rgba(255,255,255,0.04)",
            marginTop: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: C.accent,
              width: `${(company.currentPhase / 4) * 100}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}
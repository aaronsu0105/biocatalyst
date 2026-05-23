"use client";

const C = {
  bgCard: "#0f1929",
  border: "rgba(255,255,255,0.07)",
  textPrimary: "#eef2ff",
  textMuted: "#3d506e",
};

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "18px 20px",
        borderRadius: 12,
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        transition: "border-color 0.2s",
      }}
      className="card-hover"
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: C.textMuted,
          margin: "0 0 8px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: C.textPrimary,
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {value}
      </p>
    </div>
  );
}
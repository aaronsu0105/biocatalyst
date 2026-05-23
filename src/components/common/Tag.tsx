"use client";

const C = {
  accentSoft: "rgba(79,142,247,0.10)",
  accent: "#4f8ef7",
};

export function Tag({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 9px",
      borderRadius: 5,
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      background: C.accentSoft,
      color: C.accent,
      border: `1px solid rgba(79,142,247,0.18)`,
    }}>
      {label}
    </span>
  );
}
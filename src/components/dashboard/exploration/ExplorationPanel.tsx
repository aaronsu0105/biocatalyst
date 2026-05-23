"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { BiotechCompany } from "@/types/biotech";
import { CompanyGalleryCard } from "./CompanyGalleryCard";
import { Reveal } from "../Reveal";

const C = {
  bgBase: "#06090f",
  bgCard: "#0f1929",
  border: "rgba(255,255,255,0.07)",
  accent: "#4f8ef7",
  textPrimary: "#eef2ff",
  textSecondary: "#7a90b4",
};

export function ExplorationPanel({
  companies,
  onSelectCompany,
  currentSelected,
}: {
  companies: BiotechCompany[];
  onSelectCompany: (c: BiotechCompany) => void;
  currentSelected: BiotechCompany;
}) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const width = carouselRef.current?.offsetWidth || 0;
      setVisibleCount(width > 1200 ? 3 : width > 768 ? 2 : 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCarouselIndex(
      (prev) =>
        (prev + 1) % Math.max(1, companies.length - visibleCount + 1)
    );
  }, [companies.length, visibleCount]);

  const prevSlide = useCallback(() => {
    setCarouselIndex((prev) =>
      prev === 0 ? Math.max(0, companies.length - visibleCount) : prev - 1
    );
  }, [companies.length, visibleCount]);

  return (
    <section
      style={{
        display: "flex",
        minHeight: "80vh",
        background: C.bgBase,
        borderTop: `1px solid ${C.border}`,
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "48px 48px 32px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Reveal>
          <div>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: C.textPrimary,
                margin: "0 0 8px",
                letterSpacing: "-0.03em",
              }}
            >
              Explore Companies
            </h2>
            <p
              style={{
                fontSize: 14,
                color: C.textSecondary,
                margin: 0,
              }}
            >
              Discover other biotech companies and their pipeline progress
            </p>
          </div>
        </Reveal>

        {/* Controls */}
        <Reveal delay={0.1}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={prevSlide}
              className="btn-hover"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.accent}
                strokeWidth="2.5"
              >
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="btn-hover"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.accent}
                strokeWidth="2.5"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </Reveal>
      </div>

      {/* Carousel */}
      <div
        style={{
          flex: 1,
          padding: "32px 48px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          ref={carouselRef}
          style={{
            display: "flex",
            gap: 20,
            width: "100%",
            transform: `translateX(-${carouselIndex * (100 / visibleCount)}%)`,
            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {companies.map((c) => (
            <div
              key={c.id}
              style={{
                flex: `0 0 ${100 / visibleCount}%`,
                minWidth: 0,
              }}
            >
              <Reveal>
                <CompanyGalleryCard
                  company={c}
                  onClick={() => onSelectCompany(c)}
                  isActive={currentSelected.id === c.id}
                />
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 6,
          paddingBottom: 32,
        }}
      >
        {Array.from({
          length: Math.max(1, companies.length - visibleCount + 1),
        }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCarouselIndex(i)}
            style={{
              width: carouselIndex === i ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: carouselIndex === i ? C.accent : C.border,
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
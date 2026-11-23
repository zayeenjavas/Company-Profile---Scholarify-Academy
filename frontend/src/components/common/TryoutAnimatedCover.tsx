"use client";

import React from "react";

const VARIANTS = [
  {
    bg: "from-[#0B1B3B] via-[#132C63] to-[#2B44FF]",
    accent: "#FF6B4A",
    chip: "UTBK-SNBT",
    subtests: ["PU", "PPU", "PBM", "PK"],
  },
  {
    bg: "from-[#062829] via-[#0A4A44] to-[#008C8D]",
    accent: "#C0EBD7",
    chip: "CBT TIMER",
    subtests: ["LBI", "LBE", "PM", "PU"],
  },
  {
    bg: "from-[#1A1333] via-[#2F2168] to-[#5B6CFF]",
    accent: "#FFB347",
    chip: "HOTS + REVIEW",
    subtests: ["PK", "PM", "LBI", "PPU"],
  },
  {
    bg: "from-[#1F1100] via-[#4A2500] to-[#E16C10]",
    accent: "#FFE0B2",
    chip: "TRYOUT AKBAR",
    subtests: ["7 SUBTEST", "0-1000"],
  },
] as const;

export function TryoutAnimatedCover({
  index = 0,
  tier = "FREE",
  questionCount = 0,
}: {
  index?: number;
  tier?: "FREE" | "PREMIUM";
  questionCount?: number;
}) {
  const v = VARIANTS[index % VARIANTS.length];

  return (
    <div
      className={`relative h-44 w-full overflow-hidden rounded-xl bg-gradient-to-br ${v.bg} p-4 text-white select-none`}
    >
      {/* Subtle animated grid backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Glowing ambient orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full opacity-35 blur-2xl animate-pulse"
        style={{ backgroundColor: v.accent, animationDuration: "4s" }}
      />

      {/* Top status bar */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 font-semibold backdrop-blur-sm">
          <span
            className="size-1.5 rounded-full animate-ping"
            style={{ backgroundColor: v.accent, animationDuration: "2.2s" }}
          />
          {v.chip}
        </span>
        <span className="rounded-full border border-white/25 bg-black/20 px-2 py-0.5 font-semibold">
          {tier === "FREE" ? "GRATIS" : "PREMIUM"}
        </span>
      </div>

      {/* Center animated mini CBT card */}
      <div className="relative z-10 mt-3 flex items-center gap-3">
        <div
          className="flex-1 rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md shadow-lg animate-[tryoutFloat_5s_ease-in-out_infinite]"
        >
          <div className="flex items-center justify-between text-[10px] text-white/80">
            <span className="font-semibold">Simulasi Aktif</span>
            <span className="font-mono">{questionCount > 0 ? `${questionCount} Soal` : "CBT"}</span>
          </div>
          {/* Animated progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full animate-[tryoutBar_3.5s_ease-in-out_infinite]"
              style={{ backgroundColor: v.accent, width: "68%" }}
            />
          </div>
          {/* Subtest chips */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {v.subtests.map((code) => (
              <span
                key={code}
                className="rounded-md bg-white/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-white/95"
              >
                {code}
              </span>
            ))}
          </div>
        </div>

        {/* Right animated score ring */}
        <div className="hidden sm:grid size-16 shrink-0 place-content-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md animate-[tryoutFloatAlt_6s_ease-in-out_infinite]">
          <svg viewBox="0 0 48 48" className="size-12 -rotate-90" aria-hidden>
            <circle
              cx="24"
              cy="24"
              r="18"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="4"
            />
            <circle
              cx="24"
              cy="24"
              r="18"
              fill="none"
              stroke={v.accent}
              strokeWidth="4"
              strokeDasharray="113"
              strokeDashoffset="28"
              strokeLinecap="round"
            />
          </svg>
          <span className=" -mt-8 text-center font-mono text-[10px] font-bold">UTBK</span>
        </div>
      </div>

      <style>{`
        @keyframes tryoutFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        @keyframes tryoutFloatAlt {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(3px); }
        }
        @keyframes tryoutBar {
          0%, 100% { width: 52%; }
          50% { width: 84%; }
        }
      `}</style>
    </div>
  );
}

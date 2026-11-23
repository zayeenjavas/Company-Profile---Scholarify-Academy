"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const programs = [
  {
    id: "tryout",
    title: "TryOut UTBK Online",
    subtitle: "Simulasi 7 Subtest + Analitik Skor",
    image: "/images/ig-models/cutout-male-pointing.png",
    backdrop: "bg-[#9BD4FA]",
  },
  {
    id: "intensif",
    title: "Kelas Intensif SNBT",
    subtitle: "Pendalaman Materi & Bedah Soal",
    image: "/images/ig-models/cutout-hijab-blue.png",
    backdrop: "bg-[#FDE68A]",
  },
  {
    id: "reguler",
    title: "Kelas Reguler Sekolah",
    subtitle: "Pemahaman Konsep Dasar Terstruktur",
    image: "/images/ig-models/cutout-male-thinking.png",
    backdrop: "bg-[#F6A5B8]",
  },
  {
    id: "konsultasi",
    title: "Konsultasi Jurusan & PTN",
    subtitle: "Strategi Pemilihan Prodi Impian",
    image: "/images/ig-models/cutout-hijab-beige.png",
    backdrop: "bg-[#C7D2FE]",
  },
];

export function LandingPrograms() {
  const [active, setActive] = useState(programs[0]);

  return (
    <section
      id="program"
      className="relative overflow-hidden bg-[#0E2492] text-white py-16 sm:py-24"
    >
      {/* Subtle Diagonal & Dot Texture (ala referensi) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.28) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[140%] w-1/2 -rotate-12 bg-white/[0.04]"
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12">
        {/* Kiri: Header Editorial + Daftar Program */}
        <div className="space-y-7 lg:col-span-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/85">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
              PROGRAM UNGGULAN
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl leading-[1.15]">
              Pilih Program Belajar
              <span className="block">
                Sesuai Target{" "}
                <span className="relative inline-block">
                  <em
                    className="italic font-normal text-[#9BD4FA]"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                  >
                    Impianmu
                  </em>
                  <svg
                    viewBox="0 0 150 10"
                    fill="none"
                    className="pointer-events-none absolute -bottom-1 left-0 w-full h-2 text-white/70"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8C48 2 102 2 148 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h2>
          </div>

          <div className="divide-y divide-white/15 border-b border-white/15">
            {programs.map((p) => {
              const isSelected = p.id === active.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p)}
                  className={`group flex w-full items-center justify-between py-4 text-left transition-colors ${
                    isSelected ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  <div>
                    <p className="text-base font-semibold sm:text-lg">{p.title}</p>
                    <p className="text-xs italic text-white/70">{p.subtitle}</p>
                  </div>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? "border-white bg-white text-[#0E2492]"
                        : "border-white/30 text-white group-hover:border-white/60"
                    }`}
                  >
                    <ArrowUpRight className="size-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kanan: Notched Asymmetric Cutout Frame + Vertical PTN Strip */}
        <div className="flex items-center justify-center gap-6 lg:col-span-6">
          <div
            className={`relative flex h-[340px] sm:h-[400px] w-full max-w-[420px] items-end ${
              active.id === "tryout" ? "justify-end pr-0 pl-4" : "justify-center px-6"
            } overflow-hidden rounded-[2rem] ${active.backdrop} pt-8 shadow-2xl transition-colors duration-300`}
          >
            {/* Top-left organic notch cutout (ala referensi, jauh dari kepala model) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-20 h-14 w-14 rounded-br-[1.75rem] bg-[#0E2492]"
            />

            <img
              src={active.image}
              alt={active.title}
              className="relative z-10 max-h-full w-auto object-contain object-bottom drop-shadow-xl transition-all duration-300"
            />
          </div>

          {/* Vertical Trust Strip (desktop only, writing-mode vertical-rl agar tidak bertumpuk) */}
          <div className="hidden xl:flex flex-col items-center justify-center gap-6 py-2 text-[11px] font-bold tracking-[0.22em] text-white/75 select-none">
            {["UGM", "ITB", "UI", "UNAIR", "UNDIP"].map((ptn) => (
              <span
                key={ptn}
                className="rotate-180 whitespace-nowrap"
                style={{ writingMode: "vertical-rl" }}
              >
                {ptn}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

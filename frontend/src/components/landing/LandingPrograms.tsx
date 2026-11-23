"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const programs = [
  {
    id: "tryout",
    title: "TryOut UTBK Online",
    subtitle: "Simulasi 7 Subtest + Analitik Skor",
    image: "/images/ig-models/cutout-male-pointing.png",
    backdrop: "bg-[#8FD3FA]",
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
    <section id="program" className="bg-[#1E34C8] text-white pt-20 pb-16 sm:pt-28 sm:pb-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/75">
              Program Unggulan
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Pilih Program Belajar Sesuai Targetmu
            </h2>
          </div>

          <div className="divide-y divide-white/15 border-y border-white/15">
            {programs.map((p) => {
              const isSelected = p.id === active.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActive(p)}
                  className={`flex w-full items-center justify-between py-4 text-left transition-colors ${
                    isSelected ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  <div>
                    <p className="text-base font-semibold sm:text-lg">{p.title}</p>
                    <p className="text-xs text-white/70">{p.subtitle}</p>
                  </div>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? "border-white bg-white text-[#1E34C8]"
                        : "border-white/30 text-white"
                    }`}
                  >
                    <ArrowRight className="size-4" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div
            className={`relative flex h-80 sm:h-96 items-end justify-center overflow-hidden rounded-[2rem] ${active.backdrop} px-6 pt-6 shadow-xl transition-colors duration-300`}
          >
            <img
              src={active.image}
              alt={active.title}
              className="max-h-full w-auto object-contain object-bottom drop-shadow-lg transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

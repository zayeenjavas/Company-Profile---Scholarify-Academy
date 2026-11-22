"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const programs = [
  {
    id: "tryout",
    title: "TryOut UTBK Online",
    subtitle: "Simulasi 7 Subtest + Analitik Skor",
    image: "/images/program-tryout.jpg",
  },
  {
    id: "intensif",
    title: "Kelas Intensif SNBT",
    subtitle: "Pendalaman Materi & Bedah Soal",
    image: "/images/program-intensif.jpg",
  },
  {
    id: "reguler",
    title: "Kelas Reguler Sekolah",
    subtitle: "Pemahaman Konsep Dasar Terstruktur",
    image: "/images/program-regular.jpg",
  },
  {
    id: "konsultasi",
    title: "Konsultasi Jurusan & PTN",
    subtitle: "Strategi Pemilihan Prodi Impian",
    image: "/images/program-konsultasi.jpg",
  },
];

export function LandingPrograms() {
  const [active, setActive] = useState(programs[0]);

  return (
    <section id="program" className="bg-[#1E34C8] text-white py-14 sm:py-16">
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
          <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-3 backdrop-blur">
            <img
              src={active.image}
              alt={active.title}
              className="h-72 w-full rounded-2xl object-cover sm:h-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

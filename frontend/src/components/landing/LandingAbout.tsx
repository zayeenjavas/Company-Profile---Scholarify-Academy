"use client";

import Link from "next/link";
import { Compass, GraduationCap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingAbout() {
  return (
    <section
      id="tentang"
      className="relative overflow-hidden bg-background py-16 sm:py-24"
    >
      {/* Subtle Side Dot Grid Accents (ala referensi) */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute left-0 top-12 h-64 w-32 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(rgba(79, 107, 255, 0.35) 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute right-0 bottom-12 h-64 w-32 opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(rgba(79, 107, 255, 0.35) 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12">
        {/* Kiri: Kolase Asimetris Model Scholarify + Floating Badges (ala referensi) */}
        <div className="relative grid grid-cols-2 gap-4 sm:gap-5 lg:col-span-5">
          {/* Kolom Kiri Kolase */}
          <div className="space-y-4">
            <div className="relative flex h-56 sm:h-64 items-end justify-center overflow-hidden rounded-2xl bg-[#C4B5FD] px-2 pt-4 shadow-md">
              <img
                src="/images/ig-models/about-denim-books.png"
                alt="Siswa Scholarify"
                className="max-h-full w-auto object-contain object-bottom"
              />
            </div>

            <div className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-foreground tabular-nums">
                140+
              </p>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-muted-foreground">
                Bank Soal Terkurasi
              </p>
            </div>
          </div>

          {/* Kolom Kanan Kolase */}
          <div className="space-y-4 pt-3">
            <div className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-800/80 dark:border-border bg-white dark:bg-card px-3.5 py-2.5 shadow-sm">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EBEFFE] text-[#4F6BFF]">
                <GraduationCap className="size-4" />
              </span>
              <div className="text-left leading-tight">
                <p className="text-xs font-extrabold text-slate-900 dark:text-foreground">
                  7 Subtest
                </p>
                <p className="text-[10px] text-slate-500 dark:text-muted-foreground">
                  Standar SNBT
                </p>
              </div>
            </div>

            <div className="relative flex h-56 sm:h-64 items-end justify-center overflow-hidden rounded-2xl bg-[#F472B6] px-2 pt-4 shadow-md">
              <img
                src="/images/ig-models/about-denim-pointing.png"
                alt="Persiapan UTBK Scholarify"
                className="max-h-full w-auto object-contain object-bottom"
              />
            </div>
          </div>
        </div>

        {/* Kanan: Editorial Story, Misi & Visi Terbuka (ala referensi) */}
        <div className="space-y-5 lg:col-span-7">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-muted-foreground">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#4F6BFF]" />
              TENTANG KAMI
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl leading-[1.15]">
              Dibangun Dari Nilai,
              <span className="block">
                Digerakkan{" "}
                <span className="relative inline-block">
                  <em
                    className="italic font-normal text-[#4F6BFF]"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                  >
                    Inovasi
                  </em>
                  <svg
                    viewBox="0 0 130 10"
                    fill="none"
                    className="pointer-events-none absolute -bottom-1 left-0 w-full h-2 text-[#FF6B4A]"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8C42 2 88 2 128 8"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-muted-foreground sm:text-base">
            Scholarify hadir mendampingi siswa menghadapi UTBK-SNBT dengan sistem evaluasi terukur, mentor dari berbagai PTN terbaik, serta simulasi CBT yang stabil.
          </p>

          <div className="grid grid-cols-1 gap-6 pt-1 sm:grid-cols-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF6B4A]/15 text-[#FF6B4A]">
                  <Target className="size-4" />
                </span>
                Misi Kami:
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-muted-foreground">
                Menyediakan akses latihan soal berkualitas dan analisis skor yang transparan bagi seluruh siswa.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400">
                  <Compass className="size-4" />
                </span>
                Visi Kami:
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-muted-foreground">
                Menjadi platform persiapan masuk perguruan tinggi yang adaptif, terpercaya, dan menyenangkan.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/tryout" className="inline-block">
              <Button className="min-h-[44px] rounded-full bg-[#5B6CFF] hover:bg-[#4657EB] text-white px-6 font-semibold shadow-sm">
                &raquo; Lihat Paket TryOut
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

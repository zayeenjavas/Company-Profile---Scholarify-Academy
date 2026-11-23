"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, FileText } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { SubtestDto } from "@/src/api/contracts";
import { mapSubtestDto } from "@/src/api/mappers";
import type { SubtestInfo } from "@/src/types/domain";
import { LandingPrograms } from "@/src/components/landing/LandingPrograms";
import { LandingDigitalProducts } from "@/src/components/landing/LandingDigitalProducts";
import {
  EditorialHeading,
  PageShell,
  SectionEyebrow,
  SplitPillButton,
  SubpageHero,
} from "@/src/components/ui-kit/ScholarifyKit";

const PROGRAM_DETAILS = [
  {
    title: "TryOut UTBK Online",
    badge: "CBT Realistis",
    points: [
      "7 Subtest standar SNBT dengan timer tersinkron server",
      "Auto-save & antrean offline tahan gangguan koneksi",
      "Pembahasan lengkap mendukung rumus matematika KaTeX",
    ],
  },
  {
    title: "Kelas UTBK Online (PK · PM · PU)",
    badge: "12 Pertemuan · Des 2026",
    points: [
      "Pendalaman 3 subtes penalaran utama: PK, PM, dan PU bersama mentor Scholarify",
      "Bedah soal HOTS dan strategi manajemen waktu pengerjaan UTBK-SNBT",
      "Tersedia tiket Early Bird Rp 349.000 melalui Loket.com",
    ],
  },
  {
    title: "Kelas Reguler Sekolah",
    badge: "Konsep Dasar",
    points: [
      "Pemahaman materi kelas 10, 11, dan 12 secara terstruktur",
      "Latihan soal bertahap dari dasar hingga tingkat olimpiade/SNBT",
      "Konsultasi PR dan persiapan ulangan harian/semester",
    ],
  },
  {
    title: "Konsultasi Jurusan & PTN",
    badge: "Mentoring 1-on-1",
    points: [
      "Pemetaan minat, bakat, dan daya saing prodi impian",
      "Analisis peluang lolos berdasarkan tren skor tryout",
      "Pendampingan strategi pemilihan SNBP & SNBT",
    ],
  },
];

export default function ProgramPage() {
  const [subtests, setSubtests] = useState<SubtestInfo[]>([]);

  useEffect(() => {
    apiRequest<{ subtests: SubtestDto[] }>("/subtests")
      .then((res) => setSubtests(res.subtests.map(mapSubtestDto)))
      .catch(() => {});
  }, []);

  return (
    <PageShell>
      <SubpageHero
        eyebrow="PROGRAM UNGGULAN"
        titleLine1="Program Belajar & Simulasi"
        titleLine2Prefix="Terarah Menuju"
        highlight="PTN Impian"
        subtitle="Pilih jalur belajar yang paling sesuai dengan targetmu — mulai dari simulasi CBT UTBK realistis, kelas intensif, hingga konsultasi pemilihan jurusan."
        actions={<SplitPillButton href="/tryout" label="» Mulai TryOut" />}
      />

      <LandingPrograms />

      <LandingDigitalProducts />

      {/* Detail 4 Program */}
      <section className="bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
          <div className="space-y-2">
            <SectionEyebrow label="RINCIAN KURIKULUM" />
            <EditorialHeading line1="Keunggulan Setiap" highlight="Program" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {PROGRAM_DETAILS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <span className="rounded-full bg-[#EBEFFE] dark:bg-primary/15 px-3 py-1 text-[11px] font-semibold text-[#5B6CFF]">
                    {item.badge}
                  </span>
                </div>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {item.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#5B6CFF]" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 Subtes SNBT */}
      <section className="bg-[#EBEFFE] dark:bg-muted/30 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
          <div className="space-y-2">
            <SectionEyebrow label="STRUKTUR UJIAN" />
            <EditorialHeading line1="7 Subtest Standar" highlight="UTBK-SNBT" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subtests.map((st) => (
              <div
                key={st.id}
                className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-4 shadow-sm space-y-2"
              >
                <span className="inline-block rounded-md bg-[#FF6B4A]/10 px-2.5 py-0.5 text-xs font-bold text-[#FF6B4A]">
                  {st.code}
                </span>
                <h3 className="text-sm font-bold leading-snug">{st.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{st.description}</p>
                <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="size-3.5 text-[#5B6CFF]" />
                    {st.questionCount} soal
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5 text-[#5B6CFF]" />
                    {st.durationMinutes} mnt
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

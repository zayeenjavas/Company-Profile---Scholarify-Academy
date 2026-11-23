"use client";

import { Award, ShieldCheck, Sparkles, Users } from "lucide-react";
import { LandingAbout } from "@/src/components/landing/LandingAbout";
import {
  EditorialHeading,
  PageShell,
  SectionEyebrow,
  SplitPillButton,
  SubpageHero,
} from "@/src/components/ui-kit/ScholarifyKit";

const VALUES = [
  {
    icon: Users,
    title: "Mentor PTN Terbaik",
    desc: "Dibimbing langsung oleh pengajar dan alumni berprestasi dari UGM, ITB, UI, UNAIR, dan PTN unggulan lainnya.",
  },
  {
    icon: ShieldCheck,
    title: "Evaluasi Terukur & Jujur",
    desc: "Sistem CBT tahan gangguan dengan analitik skor per subtes dan pembahasan terstruktur.",
  },
  {
    icon: Sparkles,
    title: "Pembelajaran Adaptif",
    desc: "Materi, soal HOTS, dan dukungan notasi matematika LaTeX yang nyaman dibaca di desktop maupun mobile.",
  },
  {
    icon: Award,
    title: "Terbukti Membantu Lolos",
    desc: "Kurikulum disusun mengikuti kisi-kisi SNBT terbaru agar siswa terbiasa dengan pola soal sesungguhnya.",
  },
];

export default function TentangPage() {
  return (
    <PageShell>
      <SubpageHero
        eyebrow="TENTANG SCHOLARIFY"
        titleLine1="Cerita, Misi & Nilai"
        titleLine2Prefix="Di Balik"
        highlight="Scholarify"
        subtitle="Mengenal lebih dekat visi kami membangun ekosistem persiapan masuk perguruan tinggi yang terarah, transparan, dan menyenangkan."
        actions={<SplitPillButton href="/tim" label="» Kenali Tim & Mentor" />}
      />

      <LandingAbout />

      <section className="bg-[#EBEFFE] dark:bg-muted/30 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
          <div className="space-y-2 text-center">
            <SectionEyebrow label="PILAR KAMI" />
            <EditorialHeading line1="Mengapa Belajar di" highlight="Scholarify" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-5 shadow-sm space-y-3"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBEFFE] text-[#5B6CFF]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="text-base font-bold">{v.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

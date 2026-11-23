"use client";

import { LandingContactFooter } from "@/src/components/landing/LandingContactFooter";
import {
  EditorialHeading,
  PageShell,
  SectionEyebrow,
  SubpageHero,
} from "@/src/components/ui-kit/ScholarifyKit";

const FAQS = [
  {
    q: "Bagaimana cara mengikuti TryOut Gratis?",
    a: "Kamu bisa langsung masuk ke halaman TryOut, memilih paket berlabel Gratis, lalu mulai mengerjakan subtes tanpa perlu aktivasi berbayar.",
  },
  {
    q: "Bagaimana cara aktivasi akun Premium?",
    a: "Hubungi admin Scholarify melalui formulir kontak di bawah ini atau kunjungi Instagram @official_scholarify untuk mendapatkan akun Premium aktif.",
  },
  {
    q: "Apakah pembahasan soal bisa dibuka setelah ujian?",
    a: "Ya, setelah sesi ujian selesai dan berstatus DINILAI, kunci jawaban serta pembahasan lengkap (termasuk rumus matematika) langsung terbuka.",
  },
];

export default function KontakPage() {
  return (
    <PageShell hideContactSection>
      <SubpageHero
        eyebrow="HUBUNGI KAMI"
        titleLine1="Butuh Bantuan atau"
        titleLine2Prefix="Info"
        highlight="Aktivasi?"
        subtitle="Tim Scholarify siap membantu pertanyaan seputar paket TryOut, kelas intensif, maupun kendala teknis akunmu."
      />

      <section className="bg-[#EBEFFE] dark:bg-muted/30 py-14">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
          <div className="space-y-1.5">
            <SectionEyebrow label="FAQ SINGKAT" />
            <EditorialHeading line1="Pertanyaan yang" highlight="Sering Diajukan" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {FAQS.map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-5 shadow-sm space-y-2"
              >
                <h3 className="text-sm font-bold">{item.q}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingContactFooter />
    </PageShell>
  );
}

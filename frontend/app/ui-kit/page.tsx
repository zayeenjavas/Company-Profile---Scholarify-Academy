"use client";

import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  EditorialHeading,
  PageShell,
  SCHOLARIFY_TOKENS,
  SectionEyebrow,
  SplitPillButton,
  SubpageHero,
} from "@/src/components/ui-kit/ScholarifyKit";

export default function UiKitPage() {
  return (
    <PageShell>
      <SubpageHero
        eyebrow="DESIGN SYSTEM"
        titleLine1="Scholarify Design System"
        titleLine2Prefix="& Editorial"
        highlight="UI Kit"
        subtitle="Dokumentasi warna, tipografi, komponen kartu, tombol, dan pola layout yang digunakan secara konsisten di seluruh Landing Page, Portal TryOut, dan halaman detail."
      />

      <section className="mx-auto max-w-6xl space-y-12 px-4 py-14 sm:px-6">
        {/* 1. Color Palette */}
        <div className="space-y-4">
          <SectionEyebrow label="PALET WARNA" />
          <EditorialHeading line1="Sistem Warna" highlight="Scholarify" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 pt-2">
            {SCHOLARIFY_TOKENS.colors.map((c) => (
              <div
                key={c.name}
                className="rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-3 shadow-sm"
              >
                <div
                  className="h-20 w-full rounded-xl border border-black/5"
                  style={{ backgroundColor: c.hex }}
                />
                <p className="mt-2.5 text-sm font-bold">{c.name}</p>
                <p className="text-xs font-mono text-muted-foreground">{c.hex}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{c.usage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Typography & Headings */}
        <div className="space-y-4 rounded-3xl bg-[#EBEFFE] dark:bg-muted/30 p-6 sm:p-10">
          <SectionEyebrow label="TIPOGRAFI & HEADING" />
          <EditorialHeading
            line1="Tipografi Editorial,"
            line2Prefix="Aksen"
            highlight="Instrument Serif"
          />
          <p className="max-w-2xl text-sm text-slate-600 dark:text-muted-foreground">
            Kombinasi sans-serif geometris untuk keterbacaan UI &amp; data (`tabular-nums`), dipadukan `Instrument Serif` italic dengan garis lengkung coral `#FF6B4A` untuk penekanan kata kunci.
          </p>
        </div>

        {/* 3. Buttons & Controls */}
        <div className="space-y-5">
          <SectionEyebrow label="TOMBOL & KONTROL" />
          <div className="flex flex-wrap items-center gap-4">
            <SplitPillButton href="/tryout" label="» Mulai TryOut" />
            <Button className="min-h-[42px] rounded-full bg-[#5B6CFF] hover:bg-[#4657EB] text-white px-6 text-xs font-semibold">
              Primary Pill
            </Button>
            <Button variant="outline" className="min-h-[42px] rounded-full px-6 text-xs font-semibold">
              Outline Pill
            </Button>
            <Input
              placeholder="Contoh input UI Kit..."
              className="max-w-xs h-11 rounded-lg border-slate-200 dark:border-border bg-white dark:bg-card"
            />
          </div>
        </div>

        {/* 4. Signature Cards Preview */}
        <div className="space-y-5">
          <SectionEyebrow label="KARTU SIGNATURE" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Bell-Curve Team Card Sample */}
            <div className="mx-auto w-full max-w-[260px] flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-1.5 shadow-[0_8px_28px_rgba(15,23,42,0.06)]">
              <div className="relative aspect-[4/4.1] w-full overflow-hidden rounded-xl bg-[#F6A5B8] flex items-end justify-center">
                <img
                  src="/images/mentors/studio/maldini.jpg"
                  alt="Maldini"
                  className="h-full w-full object-cover object-top"
                />
                <svg
                  viewBox="0 0 400 44"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -bottom-px left-0 z-10 h-8 w-full text-white dark:text-card fill-current"
                >
                  <path d="M0,44 L0,38 C115,38 158,6 200,6 C242,6 285,38 400,38 L400,44 Z" />
                </svg>
              </div>
              <div
                className="relative rounded-b-xl bg-white dark:bg-card px-3 pb-4 pt-4 text-center"
                style={{
                  backgroundImage:
                    "radial-gradient(rgba(148, 163, 184, 0.22) 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                }}
              >
                <div className="absolute left-1/2 -top-6 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white dark:border-card bg-[#5B6CFF] text-white shadow-sm">
                  <Plus className="size-4 stroke-[2.5]" />
                </div>
                <h3 className="text-[15px] font-bold">Maldini</h3>
                <p className="text-xs text-muted-foreground">Founder Lead Instructor</p>
              </div>
            </div>

            {/* Package Card Sample */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-3.5 shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
              <div>
                <div className="overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src="/images/program-tryout.jpg"
                    alt="Paket TryOut"
                    className="h-44 w-full object-cover"
                  />
                </div>
                <div className="mt-3.5 flex items-center justify-between text-[11px]">
                  <span className="rounded-md border border-[#FF6B4A]/30 bg-[#FF6B4A]/10 px-2 py-0.5 font-semibold text-[#FF6B4A]">
                    TryOut Gratis
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="size-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <h3 className="mt-2.5 text-base font-bold">TryOut SNBT Batch 1 (Gratis)</h3>
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-3.5">
                <Button
                  size="sm"
                  className="min-h-[38px] rounded-full bg-[#5B6CFF] text-white px-5 text-xs font-semibold"
                >
                  &raquo; Mulai TryOut
                </Button>
                <span className="text-sm font-extrabold text-[#FF6B4A]">Gratis</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

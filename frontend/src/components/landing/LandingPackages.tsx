"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  Star,
} from "lucide-react";
import type { TryoutPackage } from "@/src/types/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TryoutAnimatedCover } from "@/src/components/common/TryoutAnimatedCover";

const PACKAGE_COVERS = [
  "/images/program-tryout.jpg",
  "/images/program-intensif.jpg",
  "/images/program-regular.jpg",
  "/images/program-konsultasi.jpg",
];

export function LandingPackages({
  packages,
  loading,
  isSubscribed,
  searchQuery,
}: {
  packages: TryoutPackage[];
  loading: boolean;
  isSubscribed: boolean;
  searchQuery: string;
}) {
  const [page, setPage] = useState(0);

  const filtered = packages.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.tier.toLowerCase().includes(q)
    );
  });

  const perPage = 3;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(safePage * perPage, safePage * perPage + perPage);

  return (
    <section id="paket" className="bg-[#EBEFFE] dark:bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        {/* Centered Editorial Header (ala referensi) */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-muted-foreground">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#4F6BFF]" />
            PAKET TRYOUT
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl leading-[1.15]">
            Lebih Dari Sekadar Latihan:
            <span className="block">
              Simulasi Menuju{" "}
              <span className="relative inline-block">
                <em
                  className="italic font-normal text-[#4F6BFF]"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  PTN Impian
                </em>
                <svg
                  viewBox="0 0 150 10"
                  fill="none"
                  className="pointer-events-none absolute -bottom-1 left-0 w-full h-2 text-[#FF6B4A]"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8C48 2 102 2 148 8"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </span>
          </h2>
          <p className="mx-auto max-w-xl pt-1 text-xs sm:text-sm text-slate-500 dark:text-muted-foreground">
            {isSubscribed
              ? "Status langgananmu aktif — seluruh paket TryOut tersedia untuk dikerjakan."
              : "Paket Gratis terbuka untuk semua pengunjung. Aktifkan akun Premium untuk membuka seluruh batch."}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-2xl bg-white/70 dark:bg-card/60"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              {searchQuery
                ? `Tidak ada paket yang cocok dengan pencarian "${searchQuery}".`
                : "Belum ada paket tryout yang dipublikasikan."}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {visible.map((pkg, idx) => {
                const cover = PACKAGE_COVERS[(safePage * perPage + idx) % PACKAGE_COVERS.length];
                return (
                  <div
                    key={pkg.id}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-3.5 shadow-[0_8px_28px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_14px_34px_rgba(79,107,255,0.12)]"
                  >
                    <div>
                      {/* Animated TryOut Cover */}
                      <div className="overflow-hidden rounded-xl">
                        <TryoutAnimatedCover
                          index={safePage * perPage + idx}
                          tier={pkg.tier}
                          questionCount={pkg.questionCount}
                        />
                      </div>

                      {/* Meta Row */}
                      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-muted-foreground tabular-nums">
                        <span className="rounded-md border border-[#FF6B4A]/30 bg-[#FF6B4A]/10 px-2 py-0.5 font-semibold text-[#FF6B4A]">
                          {pkg.tier === "FREE" ? "TryOut Gratis" : "SNBT Premium"}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="size-3.5 text-[#5B6CFF]" />
                            {pkg.questionCount} Soal
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3.5 text-[#5B6CFF]" />
                            {pkg.durationMinutes} Menit
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="mt-2.5 line-clamp-2 text-base font-bold leading-snug text-slate-900 dark:text-foreground">
                        {pkg.title}
                      </h3>

                      {/* Rating + Access Status */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[0, 1, 2, 3, 4].map((s) => (
                              <Star key={s} className="size-3.5 fill-current" />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-muted-foreground">
                            {pkg.isAccessible ? "Siap Dikerjakan" : "Khusus Member"}
                          </span>
                        </div>
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs ${
                            pkg.isAccessible
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "border-slate-200 bg-slate-50 text-slate-400 dark:border-border dark:bg-muted"
                          }`}
                          title={pkg.isAccessible ? "Terbuka" : "Terkunci"}
                        >
                          {pkg.isAccessible ? (
                            <CheckCircle2 className="size-3.5" />
                          ) : (
                            <Lock className="size-3.5" />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Footer: Enroll Pill + Tier Label */}
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-border pt-3.5">
                      {pkg.isAccessible ? (
                        <Link href={`/tryout/${pkg.slug}/do`}>
                          <Button
                            size="sm"
                            className="min-h-[38px] rounded-full bg-[#5B6CFF] hover:bg-[#4657EB] text-white px-5 text-xs font-semibold"
                          >
                            &raquo; Mulai TryOut
                          </Button>
                        </Link>
                      ) : (
                        <Link href="/login">
                          <Button
                            size="sm"
                            className="min-h-[38px] rounded-full bg-[#5B6CFF] hover:bg-[#4657EB] text-white px-5 text-xs font-semibold"
                          >
                            &raquo; Aktifkan
                          </Button>
                        </Link>
                      )}

                      <span className="text-sm font-extrabold text-[#FF6B4A]">
                        {pkg.tier === "FREE" ? "Gratis" : "Premium"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls: Coral Active Dot + Right Circular Arrows (ala referensi) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPage(idx)}
                      aria-label={`Halaman paket ${idx + 1}`}
                      className={`h-3 w-3 rounded-full transition-all ${
                        idx === safePage
                          ? "scale-110 bg-[#FF6B4A]"
                          : "bg-white dark:bg-card hover:bg-[#5B6CFF]/40"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
                    aria-label="Paket sebelumnya"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-card text-slate-700 dark:text-foreground shadow-sm transition hover:bg-[#5B6CFF] hover:text-white"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => (p + 1) % totalPages)}
                    aria-label="Paket berikutnya"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-card text-slate-700 dark:text-foreground shadow-sm transition hover:bg-[#5B6CFF] hover:text-white"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

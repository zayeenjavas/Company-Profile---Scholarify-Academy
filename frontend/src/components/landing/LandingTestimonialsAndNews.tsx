"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Calendar, GraduationCap, Send, Star } from "lucide-react";
import type { SanityNews, SanityTestimonial } from "@/src/api/sanity";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RichMathText } from "@/src/components/common/RichMathText";

export function LandingTestimonialsAndNews({
  isSubscribed,
  testimonials,
  news,
}: {
  isSubscribed: boolean;
  testimonials: SanityTestimonial[];
  news: SanityNews[];
}) {
  const [tIdx, setTIdx] = useState(0);
  const current = testimonials[tIdx] ?? testimonials[0];

  const prev = () =>
    setTIdx((i) => (i - 1 + testimonials.length) % Math.max(1, testimonials.length));
  const next = () =>
    setTIdx((i) => (i + 1) % Math.max(1, testimonials.length));

  return (
    <>
      {/* Banner CTA Coral ala Referensi — disembunyikan jika user sudah berlangganan */}
      {!isSubscribed && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#FF4D3D] px-6 py-10 text-center text-white shadow-lg sm:px-12 sm:py-12">
            {/* Left Student Model Cutout (ala referensi) */}
            <img
              src="/images/ig-models/cutout-hijab-blue.png"
              alt="Siswa Scholarify"
              className="pointer-events-none hidden md:block absolute left-6 bottom-0 h-44 w-auto object-contain object-bottom drop-shadow-md"
            />

            {/* Right Hand-drawn Paper Plane Doodle (ala referensi) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 64 64"
              fill="none"
              className="pointer-events-none hidden sm:block absolute right-8 bottom-7 h-14 w-14 text-white/30"
            >
              <path
                d="M56 10L8 29L25 36L32 53L56 10Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M56 10L25 36"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <div className="relative z-10 mx-auto max-w-2xl space-y-4">
              <h2
                className="text-3xl font-extrabold tracking-tight sm:text-5xl text-transparent"
                style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.92)" }}
              >
                Buka Semua TryOut
              </h2>
              <p className="mx-auto max-w-md text-xs leading-relaxed text-white/90 sm:text-sm">
                Akses penuh seluruh batch simulasi UTBK-SNBT, analitik skor akurat, dan pembahasan lengkap tiap nomor.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = "/login";
                }}
                className="mx-auto mt-6 flex w-full max-w-md items-center gap-2 rounded-full bg-white p-1.5 pl-4 shadow-md"
              >
                <input
                  type="email"
                  placeholder="Masukkan email kamu..."
                  className="min-w-0 flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="min-h-[38px] shrink-0 rounded-full bg-[#4F6BFF] px-5 text-xs font-semibold text-white hover:bg-[#3B56E6]"
                >
                  &raquo; Mulai Sekarang
                </Button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Testimoni Section (Lavender Editorial Layout ala Referensi) */}
      <section
        id="testimoni"
        className="relative overflow-hidden bg-[#E9ECFF] dark:bg-muted/30 py-16 sm:py-20"
      >
        {/* Subtle Giant Watermark Quote */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute left-1/2 top-4 -translate-x-1/4 text-[220px] sm:text-[300px] font-serif leading-none text-[#4F6BFF]/[0.06] dark:text-white/[0.04]"
        >
          &rdquo;
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
          {/* Top-Left Editorial Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-muted-foreground">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#4F6BFF]" />
              TESTIMONI
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl leading-[1.15]">
              Cerita Sukses
              <span className="block">
                dari{" "}
                <span className="relative inline-block">
                  <em
                    className="italic font-normal text-[#4F6BFF]"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                  >
                    Alumni Scholarify
                  </em>
                  <svg
                    viewBox="0 0 180 12"
                    fill="none"
                    className="pointer-events-none absolute -bottom-1 left-0 w-full h-2.5 text-[#FF6B4A]"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9.5C55 2.5 125 2.5 178 9.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </h2>
          </div>

          {/* 3-Column Open Testimonial Showcase */}
          {current && (
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
              {/* Left: Circular Avatar with Orbital Ring & Badge */}
              <div className="flex justify-center md:col-span-4">
                <div className="relative flex h-44 w-44 sm:h-52 sm:w-52 items-center justify-center rounded-full border border-[#4F6BFF]/25 p-3">
                  {/* Small Graduation Cap Badge (top-left) */}
                  <div className="absolute left-2 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#5B6CFF] text-white shadow-md">
                    <GraduationCap className="size-4" />
                  </div>
                  {/* Tiny Coral Dot (bottom-left) */}
                  <span className="absolute bottom-6 left-4 h-2.5 w-2.5 rounded-full bg-[#FF6B4A]" />
                  {/* Tiny Ring Dot (right) */}
                  <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-[#4F6BFF]/40 bg-[#E9ECFF] dark:bg-background" />

                  <div className="h-full w-full overflow-hidden rounded-full bg-white p-1.5 shadow-md">
                    {current.fotoUrl ? (
                      <div className="h-full w-full overflow-hidden rounded-full">
                        <img
                          src={current.fotoUrl}
                          alt={current.nama}
                          className={
                            current.nama.toLowerCase().includes("aurelia")
                              ? "h-full w-full object-cover object-[42%_46%] origin-[42%_46%] scale-[2.2]"
                              : "h-full w-full object-cover object-center"
                          }
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#4F6BFF]/10 text-3xl font-bold text-[#4F6BFF]">
                        {current.nama.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center: Name, Campus, Quote & Rating Pill */}
              <div className="space-y-4 text-center md:col-span-7 md:text-left">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-foreground">
                    {current.nama}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground">
                    {current.asalKampus}
                  </p>
                </div>

                <p className="text-sm italic leading-relaxed text-slate-700 dark:text-foreground/90 sm:text-base">
                  &ldquo;{current.isi}&rdquo;
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <div className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-card px-3.5 py-1.5 shadow-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i < (current.rating || 5)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Vertical Controls & Coral Indicator Dots */}
              <div className="flex flex-row items-center justify-center gap-3 md:col-span-1 md:flex-col">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Testimoni sebelumnya"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-card text-slate-700 dark:text-foreground shadow-sm transition hover:bg-[#4F6BFF] hover:text-white"
                >
                  <ArrowUp className="size-4 -rotate-90 md:rotate-0" />
                </button>

                <div className="flex flex-row items-center gap-2 md:flex-col">
                  {testimonials.slice(0, 5).map((item, idx) => {
                    const active = idx === tIdx % Math.min(5, Math.max(1, testimonials.length));
                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => setTIdx(idx)}
                        aria-label={`Testimoni ${idx + 1}`}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${
                          active
                            ? "scale-110 bg-[#FF6B4A]"
                            : "bg-white/90 dark:bg-card hover:bg-[#4F6BFF]/40"
                        }`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={next}
                  aria-label="Testimoni berikutnya"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-card text-slate-700 dark:text-foreground shadow-sm transition hover:bg-[#4F6BFF] hover:text-white"
                >
                  <ArrowDown className="size-4 -rotate-90 md:rotate-0" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Blue Divider Strip */}
      <div className="bg-[#2B44FF] py-3 text-center text-xs font-semibold tracking-widest uppercase text-white/90">
        Testimoni Terverifikasi • TryOut UTBK • Pembahasan Lengkap • Scholarify
      </div>

      {/* Berita & Artikel Terbaru */}
      <section id="berita" className="bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="border-[#2B44FF]/30 text-[#2B44FF] dark:text-primary">
              Artikel &amp; Informasi
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Wawasan &amp; Strategi{" "}
              <span className="text-[#2B44FF]">Terbaru UTBK</span>
            </h2>
            <div>
              <Link
                href="/berita"
                className="text-xs font-semibold text-[#5B6CFF] hover:underline"
              >
                Lihat Semua Artikel &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {news.map((item) => (
              <Card key={item._id} className="flex flex-col justify-between overflow-hidden">
                <div>
                  <img
                    src={item.gambarUrl || "/images/program-tryout.jpg"}
                    alt={item.judul}
                    className="h-44 w-full object-cover"
                  />
                  <CardHeader className="pb-2">
                    <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                      <Calendar className="size-3.5" />
                      {item.tanggal}
                    </div>
                    <CardTitle className="text-base leading-snug line-clamp-2 pt-1">
                      {item.judul}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
                      <RichMathText text={item.ringkasan} />
                    </p>
                  </CardContent>
                </div>
                <CardFooter className="pt-0">
                  <Link href={`/berita/${encodeURIComponent(item._id)}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full rounded-full">
                      Baca Selengkapnya
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

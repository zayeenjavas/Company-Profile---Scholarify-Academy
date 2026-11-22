"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Send, Star } from "lucide-react";
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
      {/* Banner CTA Coral — disembunyikan jika user sudah berlangganan */}
      {!isSubscribed && (
        <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#FF4D3D] p-6 text-white shadow-lg sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl space-y-2">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Siap Buka Semua Paket TryOut Premium?
                </h2>
                <p className="text-sm text-white/90">
                  Dapatkan akses penuh ke seluruh batch simulasi UTBK, analitik performa, dan pembahasan lengkap tiap nomor.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="min-h-[44px] rounded-full bg-white text-[#FF4D3D] hover:bg-white/90 font-semibold gap-2"
                  >
                    Masuk / Aktivasi
                    <Send className="size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimoni Section (Lavender Tint) */}
      <section id="testimoni" className="bg-[#EBEFFE] dark:bg-muted/30 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-4">
              <Badge variant="outline" className="border-[#2B44FF]/30 text-[#2B44FF] dark:text-primary">
                Testimoni Peserta
              </Badge>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Cerita Sukses Dari{" "}
                <span className="text-[#2B44FF]">Alumni Scholarify</span>
              </h2>
              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={prev}
                  aria-label="Testimoni sebelumnya"
                  className="rounded-full"
                >
                  <ArrowLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={next}
                  aria-label="Testimoni berikutnya"
                  className="rounded-full"
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-8">
              {current && (
                <Card className="p-6 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border bg-[#2B44FF]/10 flex items-center justify-center">
                      {current.fotoUrl ? (
                        <img
                          src={current.fotoUrl}
                          alt={current.nama}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-[#2B44FF]">
                          {current.nama.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: current.rating || 5 }).map((_, i) => (
                          <Star key={i} className="size-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground sm:text-base">
                        &ldquo;{current.isi}&rdquo;
                      </p>
                      <div>
                        <p className="text-sm font-bold">{current.nama}</p>
                        <p className="text-xs text-muted-foreground">{current.asalKampus}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
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

"use client";

import Link from "next/link";
import { ArrowRight, Compass, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LandingAbout() {
  return (
    <section id="tentang" className="bg-background py-14 sm:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12">
        {/* Kiri: Kolase Gambar + Badge */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          <div className="space-y-4">
            <img
              src="/images/program-intensif.jpg"
              alt="Belajar Intensif Scholarify"
              className="h-48 w-full rounded-2xl object-cover border"
            />
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-[#2B44FF] tabular-nums">140+</p>
              <p className="text-xs text-muted-foreground">Bank Soal Terkurasi</p>
            </Card>
          </div>
          <div className="space-y-4 pt-6">
            <Card className="p-4 text-center bg-[#2B44FF] text-white border-0">
              <p className="text-2xl font-bold tabular-nums">7 Subtest</p>
              <p className="text-xs text-white/80">Sesuai Standar SNBT</p>
            </Card>
            <img
              src="/images/program-regular.jpg"
              alt="Diskusi Mentor Scholarify"
              className="h-48 w-full rounded-2xl object-cover border"
            />
          </div>
        </div>

        {/* Kanan: Cerita, Misi & Visi */}
        <div className="space-y-5 lg:col-span-7">
          <Badge variant="outline" className="border-[#2B44FF]/30 text-[#2B44FF] dark:text-primary">
            Tentang Scholarify
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Dibangun Untuk Memaksimalkan Peluang Lolos{" "}
            <span className="text-[#2B44FF]">PTN Impianmu</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Scholarify hadir mendampingi siswa menghadapi UTBK-SNBT dengan sistem evaluasi terukur, mentor dari berbagai PTN terbaik, serta simulasi CBT yang stabil.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Target className="size-4 text-[#2B44FF]" />
                Misi Kami
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Menyediakan akses latihan soal berkualitas dan analisis skor yang transparan bagi seluruh siswa.
              </p>
            </Card>
            <Card className="p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Compass className="size-4 text-[#2B44FF]" />
                Visi Kami
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Menjadi platform persiapan masuk perguruan tinggi yang adaptif, terpercaya, dan menyenangkan.
              </p>
            </Card>
          </div>

          <Link href="/tryout" className="inline-block">
            <Button className="min-h-[44px] rounded-full bg-[#2B44FF] hover:bg-[#1E34C8] text-white gap-2 px-6">
              Lihat Paket TryOut
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

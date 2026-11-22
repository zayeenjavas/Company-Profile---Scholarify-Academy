"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Lock } from "lucide-react";
import type { TryoutPackage } from "@/src/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const filtered = packages.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.tier.toLowerCase().includes(q)
    );
  });

  return (
    <section id="paket" className="bg-[#EEF1FF] dark:bg-muted/30 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="border-[#2B44FF]/30 text-[#2B44FF] dark:text-primary">
            Paket TryOut
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Pilih Paket Simulasi{" "}
            <span className="text-[#2B44FF]">Terbaik Untukmu</span>
          </h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            {isSubscribed
              ? "Status langgananmu aktif — seluruh paket TryOut tersedia untuk dikerjakan."
              : "Paket FREE terbuka untuk semua pengunjung. Aktifkan akun Premium untuk membuka seluruh batch."}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-card/60" />
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {filtered.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col justify-between overflow-hidden">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      className={
                        pkg.tier === "FREE"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                          : "bg-[#2B44FF] text-white"
                      }
                      variant={pkg.tier === "FREE" ? "outline" : "default"}
                    >
                      {pkg.tier}
                    </Badge>
                    {pkg.isAccessible ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" />
                        Terbuka
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Lock className="size-3.5" />
                        Terkunci
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-snug">{pkg.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {pkg.description || "Simulasi UTBK 7 Subtest standar SNBT."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <BookOpen className="size-3.5" />
                    {pkg.questionCount} soal
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {pkg.durationMinutes} menit
                  </span>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  {pkg.isAccessible ? (
                    <Link href={`/tryout/${pkg.slug}/do`} className="w-full">
                      <Button className="w-full min-h-[42px] rounded-full bg-[#2B44FF] hover:bg-[#1E34C8] text-white gap-1.5">
                        Mulai TryOut
                        <ArrowRight className="size-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full min-h-[42px] rounded-full">
                        Masuk / Aktifkan Premium
                      </Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

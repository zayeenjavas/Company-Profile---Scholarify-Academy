"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Crown,
  FileText,
  Lock,
  Search,
  Star,
} from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { ExamResultDto, TryoutPackageDto, UserDto } from "@/src/api/contracts";
import { mapPackageDto, mapResultDto, mapUserDto } from "@/src/api/mappers";
import type { ExamResultSummary, TryoutPackage, UserProfile } from "@/src/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  EditorialHeading,
  PageShell,
  SectionEyebrow,
  SubpageHero,
} from "@/src/components/ui-kit/ScholarifyKit";

const PACKAGE_COVERS = [
  "/images/program-tryout.jpg",
  "/images/program-intensif.jpg",
  "/images/program-regular.jpg",
  "/images/program-konsultasi.jpg",
];

export default function TryoutPortalPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [packages, setPackages] = useState<TryoutPackage[]>([]);
  const [results, setResults] = useState<ExamResultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter] = useState<"ALL" | "FREE" | "PREMIUM">("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, pkgRes, resData] = await Promise.all([
          apiRequest<{ ok: boolean; user: UserDto }>("/auth/me").catch(() => null),
          apiRequest<{ packages: TryoutPackageDto[] }>("/packages").catch(() => ({ packages: [] })),
          apiRequest<{ results: ExamResultDto[] }>("/results").catch(() => ({ results: [] })),
        ]);
        if (meRes?.user) setUser(mapUserDto(meRes.user));
        setPackages(pkgRes.packages.map(mapPackageDto));
        setResults(resData.results.map(mapResultDto));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const isSubscribed = Boolean(user?.subscription.isActive);

  const filteredPackages = packages.filter((pkg) => {
    if (tierFilter !== "ALL" && pkg.tier !== tierFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        pkg.title.toLowerCase().includes(q) ||
        pkg.description.toLowerCase().includes(q) ||
        pkg.slug.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <PageShell user={user}>
      <SubpageHero
        eyebrow="PORTAL TRYOUT UTBK-SNBT"
        titleLine1="Pilih Paket Simulasi"
        titleLine2Prefix="Menuju"
        highlight="PTN Impian"
        subtitle={
          isSubscribed
            ? `Halo ${user?.name}! Status Premium aktif — seluruh paket TryOut dan pembahasan lengkap terbuka untukmu.`
            : "Paket Gratis terbuka untuk semua pengunjung. Masuk atau aktifkan akun Premium untuk membuka seluruh batch simulasi."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <Badge className="rounded-full bg-white text-[#0E2492] px-3.5 py-1.5 text-xs font-semibold gap-1.5">
                {isSubscribed && <Crown className="size-3.5" />}
                {isSubscribed ? "Premium Aktif" : "Akun Gratis"}
              </Badge>
            ) : (
              <Link href="/login">
                <Button className="rounded-full bg-[#FF6B4A] hover:bg-[#E55838] text-white px-5 text-xs font-semibold">
                  Masuk / Aktivasi Akun
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Daftar Paket TryOut (Lavender Surface matching LandingPackages) */}
      <section className="bg-[#EBEFFE] dark:bg-muted/30 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1.5">
              <SectionEyebrow label="DAFTAR PAKET" />
              <EditorialHeading line1="Paket Simulasi" highlight="Tersedia" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Cari paket tryout..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-52 rounded-full bg-white dark:bg-card pl-9 text-xs"
                />
              </div>
              <div className="inline-flex rounded-full border bg-white dark:bg-card p-1 text-xs">
                {[
                  { id: "ALL", label: "Semua" },
                  { id: "FREE", label: "Gratis" },
                  { id: "PREMIUM", label: "Premium" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTierFilter(t.id as "ALL" | "FREE" | "PREMIUM")}
                    className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                      tierFilter === t.id
                        ? "bg-[#5B6CFF] text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
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
          ) : filteredPackages.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-sm text-muted-foreground">
                Tidak ada paket tryout yang sesuai filter.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {filteredPackages.map((pkg, idx) => {
                const cover = PACKAGE_COVERS[idx % PACKAGE_COVERS.length];
                return (
                  <div
                    key={pkg.id}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-3.5 shadow-[0_8px_28px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_14px_34px_rgba(79,107,255,0.12)]"
                  >
                    <div>
                      <div className="overflow-hidden rounded-xl bg-slate-100 dark:bg-muted">
                        <img
                          src={cover}
                          alt={pkg.title}
                          className="h-44 w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>

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

                      <h3 className="mt-2.5 line-clamp-2 text-base font-bold leading-snug text-slate-900 dark:text-foreground">
                        {pkg.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-muted-foreground">
                        {pkg.description || "Simulasi 7 Subtest UTBK standar SNBT."}
                      </p>

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
                        >
                          {pkg.isAccessible ? (
                            <CheckCircle2 className="size-3.5" />
                          ) : (
                            <Lock className="size-3.5" />
                          )}
                        </span>
                      </div>
                    </div>

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
          )}
        </div>
      </section>

      {/* Riwayat & Nilai TryOut */}
      <section className="bg-background py-14 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
          <div className="space-y-1.5">
            <SectionEyebrow label="HASIL & PEMBAHASAN" />
            <EditorialHeading line1="Riwayat Nilai" highlight="TryOut Kamu" />
          </div>

          <Card className="rounded-2xl border-slate-200/80 dark:border-border shadow-sm overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paket</TableHead>
                    <TableHead>Subtest</TableHead>
                    <TableHead>Skor</TableHead>
                    <TableHead>Benar / Salah</TableHead>
                    <TableHead className="text-right">Pembahasan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                        {user
                          ? "Belum ada sesi TryOut yang dinilai. Mulai kerjakan paket di atas!"
                          : "Masuk dengan akunmu untuk melihat riwayat skor dan pembahasan."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    results.map((r) => (
                      <TableRow key={r.sessionId}>
                        <TableCell className="font-medium">{r.packageTitle}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{r.subtestCode}</Badge>
                        </TableCell>
                        <TableCell className="font-bold text-[#5B6CFF] tabular-nums">
                          {Math.round(r.totalScore)}
                        </TableCell>
                        <TableCell className="tabular-nums text-xs text-muted-foreground">
                          {r.correctCount} benar · {r.wrongCount} salah · {r.emptyCount} kosong
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/tryout/review/${r.sessionId}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full gap-1.5 text-xs"
                            >
                              <FileText className="size-3.5" />
                              Pembahasan
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageShell>
  );
}

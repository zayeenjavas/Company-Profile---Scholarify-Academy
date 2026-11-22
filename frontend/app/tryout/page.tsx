"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Crown, Lock, FileText } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { ExamResultDto, TryoutPackageDto, UserDto } from "@/src/api/contracts";
import { mapPackageDto, mapResultDto, mapUserDto } from "@/src/api/mappers";
import type { ExamResultSummary, TryoutPackage, UserProfile } from "@/src/types/domain";
import { ThemeToggle } from "@/src/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TryoutPortalPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [packages, setPackages] = useState<TryoutPackage[]>([]);
  const [results, setResults] = useState<ExamResultSummary[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold">
            <img src="/images/scholarify-logo.png" alt="Scholarify" className="h-8 w-8 object-contain" />
            <span>Scholarify TryOut</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Badge variant={isSubscribed ? "default" : "secondary"} className="gap-1">
                {isSubscribed && <Crown className="size-3" />}
                {isSubscribed ? "Premium Aktif" : "Akun Gratis"}
              </Badge>
            ) : (
              <Link href="/login">
                <Button size="sm">Masuk</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6">
        <section className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Daftar Paket TryOut</h1>
            <p className="text-sm text-muted-foreground">
              {isSubscribed
                ? "Semua paket aktif siap dikerjakan."
                : "Pilih paket berlabel FREE atau masuk dengan akun langganan Premium."}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-44 animate-pulse bg-muted/40" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={pkg.tier === "FREE" ? "secondary" : "default"}>
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
                    <CardTitle className="pt-2 text-base">{pkg.title}</CardTitle>
                    <CardDescription>{pkg.description || "TryOut UTBK 7 Subtest"}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex items-center justify-between border-t pt-4">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                      <BookOpen className="size-3.5" />
                      {pkg.questionCount} soal
                    </span>
                    {pkg.isAccessible ? (
                      <Link href={`/tryout/${pkg.slug}/do`}>
                        <Button size="sm" className="min-h-[40px] gap-1.5">
                          Kerjakan
                          <ArrowRight className="size-3.5" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/login">
                        <Button size="sm" variant="outline" className="min-h-[40px]">
                          Perlu Langganan
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Riwayat Hasil & Pembahasan */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Riwayat Nilai & Pembahasan</h2>
            <p className="text-sm text-muted-foreground">
              Hasil pengerjaan tersimpan permanen di server dan dapat ditinjau pembahasannya.
            </p>
          </div>
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paket</TableHead>
                    <TableHead>Subtest</TableHead>
                    <TableHead className="text-right">Benar / Salah / Kosong</TableHead>
                    <TableHead className="text-right">Skor</TableHead>
                    <TableHead className="text-right">Pembahasan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        {user
                          ? "Belum ada riwayat subtest yang selesai dinilai."
                          : "Masuk untuk melihat riwayat nilai dan pembahasanmu."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    results.map((r) => (
                      <TableRow key={r.sessionId}>
                        <TableCell className="font-medium">{r.packageTitle}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="mr-1.5">
                            {r.subtestCode}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{r.subtestTitle}</span>
                        </TableCell>
                        <TableCell className="text-right text-xs tabular-nums">
                          {r.correctCount} / {r.wrongCount} / {r.emptyCount}
                        </TableCell>
                        <TableCell className="text-right font-bold tabular-nums">
                          {Math.round(r.totalScore)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/tryout/review/${r.sessionId}`}>
                            <Button size="sm" variant="outline" className="gap-1.5">
                              <FileText className="size-3.5" />
                              Review
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
        </section>
      </main>
    </div>
  );
}

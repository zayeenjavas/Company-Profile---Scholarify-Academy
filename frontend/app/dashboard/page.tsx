"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Crown,
  FileText,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { ExamResultDto, UserDto } from "@/src/api/contracts";
import { mapResultDto, mapUserDto } from "@/src/api/mappers";
import type { ExamResultSummary, UserProfile } from "@/src/types/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageShell, SubpageHero } from "@/src/components/ui-kit/ScholarifyKit";

const PTN_PRESETS = [
  { id: "ugm-fk", label: "UGM — Kedokteran", grade: 785 },
  { id: "itb-stei", label: "ITB — STEI-K", grade: 765 },
  { id: "ui-ilkom", label: "UI — Ilmu Komputer", grade: 755 },
  { id: "ugm-tif", label: "UGM — Teknik Informatika", grade: 745 },
  { id: "its-if", label: "ITS — Teknik Informatika", grade: 725 },
  { id: "undip-hukum", label: "UNDIP — Ilmu Hukum", grade: 675 },
  { id: "ub-manajemen", label: "UB — Manajemen", grade: 660 },
  { id: "uny-pmat", label: "UNY — Pendidikan Matematika", grade: 630 },
  { id: "custom", label: "Custom Target Sendiri", grade: 700 },
];

export default function StudentDashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [results, setResults] = useState<ExamResultSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPreset, setSelectedPreset] = useState("ugm-tif");
  const [customGrade, setCustomGrade] = useState(745);

  useEffect(() => {
    const savedPreset = localStorage.getItem("scholarify_ptn_preset");
    const savedGrade = localStorage.getItem("scholarify_ptn_grade");
    if (savedPreset) setSelectedPreset(savedPreset);
    if (savedGrade && !Number.isNaN(Number(savedGrade))) setCustomGrade(Number(savedGrade));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [meRes, resData] = await Promise.all([
          apiRequest<{ ok: boolean; user: UserDto }>("/auth/me").catch(() => null),
          apiRequest<{ results: ExamResultDto[] }>("/results").catch(() => ({ results: [] })),
        ]);
        if (meRes?.user) setUser(mapUserDto(meRes.user));
        setResults(resData.results.map(mapResultDto));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePresetChange = (val: string | null) => {
    if (!val) return;
    setSelectedPreset(val);
    localStorage.setItem("scholarify_ptn_preset", val);
    const found = PTN_PRESETS.find((p) => p.id === val);
    if (found && val !== "custom") {
      setCustomGrade(found.grade);
      localStorage.setItem("scholarify_ptn_grade", String(found.grade));
    }
  };

  const handleCustomGradeChange = (v: number) => {
    const clamped = Math.max(300, Math.min(950, v || 0));
    setCustomGrade(clamped);
    localStorage.setItem("scholarify_ptn_grade", String(clamped));
  };

  const stats = useMemo(() => {
    if (results.length === 0) {
      return { avgAccuracy: 0, avgUtbk: 0, totalCorrect: 0 };
    }
    const sumAcc = results.reduce((acc, r) => acc + r.totalScore, 0);
    const avgAccuracy = Math.round(sumAcc / results.length);
    const avgUtbk = Math.round(avgAccuracy * 10);
    const totalCorrect = results.reduce((acc, r) => acc + r.correctCount, 0);
    return { avgAccuracy, avgUtbk, totalCorrect };
  }, [results]);

  const targetPreset = PTN_PRESETS.find((p) => p.id === selectedPreset) || PTN_PRESETS[3];
  const targetScore = selectedPreset === "custom" ? customGrade : targetPreset.grade;
  const gap = stats.avgUtbk - targetScore;
  const progressPct = Math.min(100, Math.round((stats.avgUtbk / Math.max(targetScore, 1)) * 100));

  return (
    <PageShell user={user}>
      <SubpageHero
        eyebrow="DASHBOARD SISWA"
        titleLine1="Pantau Progres &"
        highlight="Target Kampus"
        subtitle="Analisis skor UTBK skala 0–1000, akurasi per subtest, serta simulasi rasionalisasi passing grade PTN impianmu."
      />

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
        {loading ? (
          <Card>
            <CardContent className="py-16 text-center text-sm text-muted-foreground">
              Memuat dashboard siswa...
            </CardContent>
          </Card>
        ) : !user ? (
          <Card className="rounded-2xl border-slate-200/80 dark:border-border">
            <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
              <GraduationCap className="size-10 text-[#5B6CFF]" />
              <div className="space-y-1">
                <h2 className="text-lg font-bold">Masuk untuk Melihat Dashboard Progresmu</h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Daftar akun gratis atau masuk dengan akun siswa untuk menyimpan riwayat skor UTBK dan target PTN impianmu.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <Button className="rounded-full bg-[#2B44FF] hover:bg-[#1E34C8] text-white px-6">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="rounded-full px-6">
                    Daftar Gratis
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Ringkasan KPI Siswa */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="rounded-2xl border-slate-200/80 dark:border-border">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center justify-between text-xs">
                    Rata-rata Skor UTBK
                    <TrendingUp className="size-4 text-[#5B6CFF]" />
                  </CardDescription>
                  <CardTitle className="text-3xl font-extrabold tabular-nums text-[#5B6CFF]">
                    {stats.avgUtbk}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">/ 1000</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Akurasi rata-rata: <strong>{stats.avgAccuracy}%</strong>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200/80 dark:border-border">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center justify-between text-xs">
                    Subtest Diselesaikan
                    <BookOpen className="size-4 text-emerald-500" />
                  </CardDescription>
                  <CardTitle className="text-3xl font-extrabold tabular-nums">
                    {results.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Total {stats.totalCorrect} jawaban benar
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200/80 dark:border-border">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center justify-between text-xs">
                    Target PTN
                    <Target className="size-4 text-[#FF6B4A]" />
                  </CardDescription>
                  <CardTitle className="text-3xl font-extrabold tabular-nums">
                    {targetScore}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground truncate">
                  {targetPreset.label}
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200/80 dark:border-border">
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center justify-between text-xs">
                    Status Akses
                    <Crown className="size-4 text-amber-500" />
                  </CardDescription>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    {user.subscription.isActive ? (
                      <Badge className="bg-emerald-600 text-white">PREMIUM AKTIF</Badge>
                    ) : (
                      <Badge variant="secondary">AKUN GRATIS</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href="/tryout" className="text-xs font-semibold text-[#5B6CFF] hover:underline">
                    {user.subscription.isActive ? "Buka Portal TryOut →" : "Tukarkan Voucher / Mulai TryOut →"}
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Target Kampus & Passing Grade PTN */}
            <Card className="rounded-2xl border-slate-200/80 dark:border-border">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <Award className="size-5 text-[#FF6B4A]" />
                      Rasionalisasi Target Kampus &amp; Jurusan (Passing Grade PTN)
                    </CardTitle>
                    <CardDescription>
                      Pilih kampus &amp; jurusan tujuan untuk mengukur kesiapan skor UTBK kamu saat ini.
                    </CardDescription>
                  </div>
                  {results.length > 0 && (
                    <Badge
                      className={
                        gap >= 0
                          ? "bg-emerald-600 text-white"
                          : gap >= -50
                          ? "bg-amber-500 text-white"
                          : "bg-rose-600 text-white"
                      }
                    >
                      {gap >= 0
                        ? `Peluang Tinggi (+${gap} poin)`
                        : gap >= -50
                        ? `Kompetitif (${gap} poin)`
                        : `Perlu Tingkatkan (${gap} poin)`}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Pilih PTN &amp; Program Studi
                    </label>
                    <Select value={selectedPreset} onValueChange={handlePresetChange}>
                      <SelectTrigger className="h-11 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PTN_PRESETS.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.label} {p.id !== "custom" ? `(${p.grade})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Passing Grade Target (0–1000)
                    </label>
                    <Input
                      type="number"
                      value={targetScore}
                      disabled={selectedPreset !== "custom"}
                      onChange={(e) => handleCustomGradeChange(Number(e.target.value))}
                      className="h-11 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Skor UTBK Kamu: <strong className="text-foreground">{stats.avgUtbk}</strong>
                    </span>
                    <span className="font-mono font-semibold">{progressPct}% dari target</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2B44FF] to-[#FF6B4A] transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Riwayat Skor TryOut */}
            <Card className="rounded-2xl border-slate-200/80 dark:border-border overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold">Riwayat Nilai &amp; Pembahasan</CardTitle>
                  <CardDescription>Daftar subtest yang sudah kamu selesaikan</CardDescription>
                </div>
                <Link href="/tryout">
                  <Button size="sm" className="rounded-full bg-[#2B44FF] text-white hover:bg-[#1E34C8]">
                    Kerjakan TryOut
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paket</TableHead>
                      <TableHead>Subtest</TableHead>
                      <TableHead>Skor UTBK</TableHead>
                      <TableHead>Akurasi</TableHead>
                      <TableHead>Detail</TableHead>
                      <TableHead className="text-right">Pembahasan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                          Belum ada subtest yang selesai. Mulai kerjakan TryOut di{" "}
                          <Link href="/tryout" className="font-semibold text-[#5B6CFF] underline">
                            Portal TryOut
                          </Link>
                          .
                        </TableCell>
                      </TableRow>
                    ) : (
                      results.map((r) => (
                        <TableRow key={r.sessionId}>
                          <TableCell className="font-medium">{r.packageTitle}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{r.subtestCode}</Badge>
                          </TableCell>
                          <TableCell className="font-mono font-bold text-[#5B6CFF] tabular-nums">
                            {Math.round(r.totalScore * 10)}
                          </TableCell>
                          <TableCell className="font-mono text-xs tabular-nums">
                            {Math.round(r.totalScore)}%
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground tabular-nums">
                            <span className="inline-flex items-center gap-1">
                              <CheckCircle2 className="size-3.5 text-emerald-500" />
                              {r.correctCount}B · {r.wrongCount}S · {r.emptyCount}K
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/tryout/review/${r.sessionId}`}>
                              <Button variant="outline" size="sm" className="rounded-full gap-1.5 text-xs">
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
          </>
        )}
      </section>
    </PageShell>
  );
}

"use client";

import {
  Activity,
  ArrowRight,
  BookOpen,
  Layers,
  Trophy,
  Users,
} from "lucide-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DensBadge,
  DensButton,
  DensRunStrip,
  DensStatusDot,
} from "@/src/components/admin/dens-ui";
import type { TabId } from "@/app/admin/components/AdminDashboard";

export interface AdminOverviewData {
  stats: {
    users: {
      total: number;
      students: number;
      admins: number;
      activeSubscribers: number;
    };
    packages: {
      total: number;
      published: number;
      totalQuestions: number;
    };
    sessions: {
      live: number;
      graded: number;
      avgScore: number;
    };
  };
  subtestStats: Array<{
    code: string;
    title: string;
    questionCount: number;
    attemptCount: number;
    avgScore: number;
  }>;
  topUsers: Array<{
    username: string;
    name: string;
    avgScore: number;
    attemptCount: number;
  }>;
}

function SubtestDotChart({
  subtests,
}: {
  subtests: AdminOverviewData["subtestStats"];
}) {
  if (!subtests.length) {
    return (
      <div className="flex h-40 items-center justify-center text-xs text-[var(--muted-foreground)]">
        Belum ada data subtest UTBK.
      </div>
    );
  }

  const W = 520;
  const H = 148;
  const cols = Math.max(subtests.length, 7);
  const colW = W / cols;
  const pitch = 9.5;
  const r = 3.2;
  const maxDots = 12;

  const cy = (k: number) => H - 6 - k * pitch;
  const cx = (i: number) => i * colW + colW / 2;

  return (
    <svg
      viewBox={`0 0 ${W} ${H + 26}`}
      className="h-auto w-full"
      role="img"
      aria-label="Distribusi skor rata-rata dan bank soal per subtest UTBK"
    >
      {subtests.map((sub, i) => {
        const scoreDots = Math.max(1, Math.min(maxDots, Math.round((sub.avgScore / 100) * maxDots)));
        const targetDots = Math.max(
          scoreDots,
          Math.min(maxDots, Math.round((sub.questionCount / Math.max(...subtests.map((s) => s.questionCount), 1)) * maxDots))
        );
        const isLow = sub.attemptCount > 0 && sub.avgScore < 50;
        const isPeak = sub.avgScore >= 70;

        return (
          <g key={sub.code}>
            {/* Target / question capacity outline dots */}
            {Array.from({ length: targetDots }, (_, k) =>
              k >= scoreDots ? (
                <circle
                  key={`q-${i}-${k}`}
                  cx={cx(i)}
                  cy={cy(k)}
                  r={r - 0.6}
                  className="fill-none stroke-[var(--muted-foreground)]/40"
                  strokeWidth={1.1}
                />
              ) : null
            )}
            {/* Score dots */}
            {Array.from({ length: scoreDots }, (_, k) => (
              <circle
                key={`s-${i}-${k}`}
                cx={cx(i)}
                cy={cy(k)}
                r={r}
                className={
                  isLow
                    ? "fill-[var(--highlight)]"
                    : isPeak
                    ? "fill-[var(--brand)]"
                    : "fill-[var(--foreground)]/80"
                }
              />
            ))}
            {/* Baseline tick */}
            <circle cx={cx(i)} cy={H + 2} r={1} className="fill-[var(--muted-foreground)]/45" />
            {/* Subtest code label */}
            <text
              x={cx(i)}
              y={H + 18}
              textAnchor="middle"
              className="fill-[var(--muted-foreground)] font-mono text-[10px] font-medium"
            >
              {sub.code}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function buildStrip(sub: AdminOverviewData["subtestStats"][number]) {
  const filled = Math.max(2, Math.min(20, Math.round((sub.avgScore / 100) * 20)));
  const chars: string[] = [];
  for (let i = 0; i < 20; i++) {
    if (i < filled) {
      if (sub.avgScore < 50 && sub.attemptCount > 0 && i >= filled - 3) chars.push("s");
      else if (sub.avgScore >= 70) chars.push("b");
      else chars.push("p");
    } else {
      chars.push("n");
    }
  }
  return chars.join("");
}

export function AdminOverviewTab({
  data,
  onNavigateTab,
}: {
  data: AdminOverviewData;
  onNavigateTab?: (tab: TabId) => void;
}) {
  const draftPackages = Math.max(0, data.stats.packages.total - data.stats.packages.published);

  return (
    <div className="space-y-5">
      {/* Top Hero Analytics Card (Dens-UI style) */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8 rounded-[24px] border-[var(--border)] bg-[var(--card)] shadow-panel">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-[var(--muted-foreground)]">
                  Aktivitas & Performa Tryout UTBK
                </p>
                <div className="mt-1 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                    {data.stats.sessions.graded}
                  </span>
                  <span className="text-sm text-[var(--muted-foreground)]">sesi dinilai</span>
                  <DensBadge variant="soft">
                    <DensStatusDot tone="success" />
                    Rata-rata {data.stats.sessions.avgScore}
                  </DensBadge>
                  {data.stats.sessions.live > 0 && (
                    <DensBadge variant="highlight">
                      {data.stats.sessions.live} sedang ujian
                    </DensBadge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full bg-[var(--brand)]" />
                  Skor ≥ 70
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full bg-[var(--highlight)]" />
                  Skor &lt; 50
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-2 rounded-full border border-[var(--muted-foreground)]/60" />
                  Kapasitas Soal
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <SubtestDotChart subtests={data.subtestStats} />
          </CardContent>
        </Card>

        {/* Right 2x2 Compact KPI Grid */}
        <div className="grid grid-cols-2 gap-3 xl:col-span-4">
          <Card className="rounded-[22px] border-[var(--border)] bg-[var(--card)] shadow-panel">
            <CardContent className="flex h-full flex-col justify-between p-4">
              <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                <span className="text-xs font-medium">Pengguna</span>
                <Users className="size-4" />
              </div>
              <div className="my-2 text-2xl font-bold tabular-nums">{data.stats.users.total}</div>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                {data.stats.users.students} siswa · {data.stats.users.admins} admin
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[22px] border-[var(--border)] bg-[var(--card)] shadow-panel">
            <CardContent className="flex h-full flex-col justify-between p-4">
              <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                <span className="text-xs font-medium">Bank Soal</span>
                <BookOpen className="size-4" />
              </div>
              <div className="my-2 text-2xl font-bold tabular-nums">
                {data.stats.packages.totalQuestions}
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Soal aktif tersimpan
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[22px] border-[var(--border)] bg-[var(--card)] shadow-panel">
            <CardContent className="flex h-full flex-col justify-between p-4">
              <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                <span className="text-xs font-medium">Paket Tryout</span>
                <Layers className="size-4" />
              </div>
              <div className="my-2 text-2xl font-bold tabular-nums">
                {data.stats.packages.published}/{data.stats.packages.total}
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                {draftPackages > 0 ? `${draftPackages} masih draft` : "Semua terpublikasi"}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[22px] border-[var(--border)] bg-[var(--card)] shadow-panel">
            <CardContent className="flex h-full flex-col justify-between p-4">
              <div className="flex items-center justify-between text-[var(--muted-foreground)]">
                <span className="text-xs font-medium">Langganan</span>
                <Activity className="size-4 text-[var(--brand)]" />
              </div>
              <div className="my-2 text-2xl font-bold tabular-nums text-[var(--brand)]">
                {data.stats.users.activeSubscribers}
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)]">
                Peserta aktif berlangganan
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contextual Action Strip */}
      {(data.stats.sessions.live > 0 || draftPackages > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--highlight)]/40 bg-[var(--card)] px-4 py-3 shadow-panel">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-content-center rounded-full bg-[var(--highlight)]/15 text-[var(--highlight)]">
              <Activity className="size-4" />
            </span>
            <div className="text-xs sm:text-sm">
              <span className="font-semibold">Perhatian: </span>
              {data.stats.sessions.live > 0
                ? `${data.stats.sessions.live} peserta sedang mengerjakan tryout secara live.`
                : `${draftPackages} paket tryout masih berstatus draft dan belum tayang.`}
            </div>
          </div>
          {onNavigateTab && (
            <DensButton
              variant="ink"
              onClick={() =>
                onNavigateTab(data.stats.sessions.live > 0 ? "monitoring" : "packages")
              }
            >
              {data.stats.sessions.live > 0 ? "Pantau Live" : "Kelola Paket"}
              <ArrowRight className="size-3.5" />
            </DensButton>
          )}
        </div>
      )}

      {/* Bottom 2-Column Workspace: Subtest Table & Top Users Queue */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7 rounded-[24px] border-[var(--border)] bg-[var(--card)] shadow-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-semibold">Subtest UTBK</CardTitle>
              <p className="text-xs text-[var(--muted-foreground)]">
                Kapasitas soal, jumlah pengerjaan, dan status rata-rata skor
              </p>
            </div>
            {onNavigateTab && (
              <CardAction>
                <DensButton variant="outline" onClick={() => onNavigateTab("questions")}>
                  Bank Soal
                </DensButton>
              </CardAction>
            )}
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs">Subtest</TableHead>
                  <TableHead className="hidden sm:table-cell text-xs">Sebaran</TableHead>
                  <TableHead className="text-right text-xs">Soal</TableHead>
                  <TableHead className="text-right text-xs">Sesi</TableHead>
                  <TableHead className="text-right text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.subtestStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-xs text-[var(--muted-foreground)]">
                      Belum ada data subtest.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.subtestStats.map((sub) => (
                    <TableRow key={sub.code}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span className="grid size-8 shrink-0 place-content-center rounded-xl bg-[var(--muted)] font-mono text-[11px] font-bold">
                            {sub.code}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold sm:text-sm">{sub.title}</p>
                            <p className="font-mono text-[11px] text-[var(--muted-foreground)]">
                              Avg {sub.avgScore}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <DensRunStrip strip={buildStrip(sub)} />
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {sub.questionCount}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {sub.attemptCount}
                      </TableCell>
                      <TableCell className="text-right">
                        {sub.attemptCount === 0 ? (
                          <DensBadge variant="outline">
                            <DensStatusDot tone="muted" />
                            Belum ada
                          </DensBadge>
                        ) : sub.avgScore < 50 ? (
                          <DensBadge variant="highlight">Perlu review</DensBadge>
                        ) : (
                          <DensBadge variant="soft">
                            <DensStatusDot tone="success" />
                            Optimal
                          </DensBadge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 rounded-[24px] border-[var(--border)] bg-[var(--card)] shadow-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-[var(--highlight)]" />
              <div>
                <CardTitle className="text-base font-semibold">Top 10 Peserta</CardTitle>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Skor rata-rata tertinggi lintas subtest
                </p>
              </div>
            </div>
            {onNavigateTab && (
              <CardAction>
                <DensButton variant="outline" onClick={() => onNavigateTab("monitoring")}>
                  Detail
                </DensButton>
              </CardAction>
            )}
          </CardHeader>
          <CardContent className="space-y-2.5">
            {data.topUsers.length === 0 ? (
              <p className="py-12 text-center text-xs text-[var(--muted-foreground)]">
                Belum ada sesi yang dinilai.
              </p>
            ) : (
              data.topUsers.map((u, i) => (
                <div
                  key={u.username}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-2.5 transition-colors hover:bg-[var(--muted)]/50"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`grid size-7 shrink-0 place-content-center rounded-full font-mono text-xs font-bold tabular-nums ${
                        i === 0
                          ? "bg-[var(--highlight)] text-[var(--highlight-foreground)]"
                          : i < 3
                          ? "bg-brand text-brand-foreground"
                          : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold sm:text-sm">{u.name}</p>
                      <p className="truncate font-mono text-[11px] text-[var(--muted-foreground)]">
                        @{u.username} · {u.attemptCount} subtest
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-mono text-sm font-bold tabular-nums">{u.avgScore}</span>
                    <p className="text-[10px] text-[var(--muted-foreground)]">rata-rata</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import {
  Users,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Trophy,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export function AdminOverviewTab({ data }: { data: AdminOverviewData }) {
  const kpis = [
    {
      title: "Total Pengguna",
      value: data.stats.users.total,
      badge: `${data.stats.users.activeSubscribers} langganan`,
      sub: `${data.stats.users.students} siswa · ${data.stats.users.admins} admin`,
      icon: Users,
    },
    {
      title: "Paket & Bank Soal",
      value: data.stats.packages.totalQuestions,
      badge: `${data.stats.packages.published}/${data.stats.packages.total} aktif`,
      sub: "Total soal tersimpan di database",
      icon: BookOpen,
    },
    {
      title: "Sesi & Penilaian",
      value: data.stats.sessions.graded,
      badge: `${data.stats.sessions.live} sedang ujian`,
      sub: "Total sesi selesai & dinilai",
      icon: ClipboardCheck,
    },
    {
      title: "Rata-rata Skor",
      value: data.stats.sessions.avgScore,
      badge: "Skala 0-100",
      sub: "Rata-rata seluruh pengerjaan",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="@container/card">
              <CardHeader>
                <CardDescription>{item.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {item.value}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline" className="gap-1">
                    <Icon className="size-3.5 stroke-[1.75]" />
                    {item.badge}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="text-xs text-muted-foreground">
                {item.sub}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-muted-foreground stroke-[1.75]" />
              <CardTitle className="text-base">Performa Per Subtest</CardTitle>
            </div>
            <CardDescription>
              Rata-rata skor dan jumlah soal aktif per subtest UTBK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.subtestStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="code" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar
                    dataKey="avgScore"
                    name="Rata-rata Skor"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="size-4 text-muted-foreground stroke-[1.75]" />
              <CardTitle className="text-base">Top 10 Peserta</CardTitle>
            </div>
            <CardDescription>Peserta dengan rata-rata skor tertinggi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.topUsers.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Belum ada sesi yang dinilai.
              </p>
            ) : (
              data.topUsers.map((u, i) => (
                <div
                  key={u.username}
                  className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Badge
                      variant={i < 3 ? "default" : "secondary"}
                      className="h-6 w-6 justify-center p-0 tabular-nums"
                    >
                      {i + 1}
                    </Badge>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        @{u.username}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums">{u.avgScore}</p>
                    <p className="text-[11px] text-muted-foreground tabular-nums">
                      {u.attemptCount} subtest
                    </p>
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

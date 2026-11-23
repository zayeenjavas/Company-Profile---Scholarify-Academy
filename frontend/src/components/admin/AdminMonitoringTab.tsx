"use client";

import { useEffect, useState } from "react";
import { Download, RotateCcw, StopCircle, RefreshCw } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface SessionRow {
  id: string;
  status: string;
  startedAt: string | null;
  expiresAt: string | null;
  user: { id: string; username: string; name: string };
  tryoutPackage: { slug: string; title: string };
  subtest: { code: string; title: string };
  result: {
    totalScore: number;
    correctCount: number;
    wrongCount: number;
    emptyCount: number;
  } | null;
  _count: { answers: number };
}

export function AdminMonitoringTab() {
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const qs = statusFilter ? `?status=${statusFilter}` : "";
      const res = await apiRequest<{ sessions: SessionRow[] }>(`/admin/sessions${qs}`);
      setSessions(res.sessions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleAction = async (id: string, action: "FORCE_FINISH" | "RESET") => {
    const label =
      action === "FORCE_FINISH"
        ? "Paksa selesaikan dan nilai sesi ini sekarang?"
        : "Reset sesi ini agar peserta dapat mengulang dari awal?";
    if (!confirm(label)) return;
    await apiRequest(`/admin/sessions/${id}/action`, {
      method: "POST",
      body: JSON.stringify({ action }),
    });
    await load();
  };

  const exportCsv = () => {
    const headers = [
      "Username",
      "Nama",
      "Paket",
      "Subtest",
      "Status",
      "Benar",
      "Salah",
      "Kosong",
      "Akurasi (%)",
      "Skor UTBK (0-1000)",
    ];
    const rows = sessions.map((s) => {
      const acc = s.result?.totalScore ?? 0;
      const utbk = Math.round(acc * 10);
      return [
        s.user.username,
        `"${s.user.name.replace(/"/g, '""')}"`,
        `"${s.tryoutPackage.title.replace(/"/g, '""')}"`,
        s.subtest.code,
        s.status,
        s.result?.correctCount ?? 0,
        s.result?.wrongCount ?? 0,
        s.result?.emptyCount ?? 0,
        acc,
        utbk,
      ];
    });
    const csv = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-tryout-scholarify-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Monitoring & Hasil Ujian</h2>
          <p className="text-sm text-muted-foreground">
            Pantau sesi berlangsung, aksi darurat (force-finish/reset), dan ekspor rekap nilai.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter || "ALL"}
            onValueChange={(val) => setStatusFilter(val === "ALL" || !val ? "" : val)}
          >
            <SelectTrigger className="w-[170px] h-10">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="BERLANGSUNG">BERLANGSUNG</SelectItem>
              <SelectItem value="DINILAI">DINILAI</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={load} className="gap-1.5">
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <Button onClick={exportCsv} className="gap-1.5">
            <Download className="size-4" />
            Ekspor CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Peserta</TableHead>
                <TableHead>Paket / Subtest</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Terjawab</TableHead>
                <TableHead className="text-right">Skor</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Memuat data sesi...
                  </TableCell>
                </TableRow>
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Belum ada sesi ujian.
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium">{s.user.name}</div>
                      <div className="text-xs text-muted-foreground">@{s.user.username}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="mr-1.5">
                        {s.subtest.code}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{s.tryoutPackage.slug}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={s.status === "BERLANGSUNG" ? "default" : "outline"}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{s._count.answers}</TableCell>
                    <TableCell className="text-right font-bold tabular-nums">
                      {s.result ? Math.round(s.result.totalScore) : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-1">
                        {s.status === "BERLANGSUNG" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(s.id, "FORCE_FINISH")}
                          >
                            <StopCircle className="size-3.5 mr-1" />
                            Force Finish
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(s.id, "RESET")}
                        >
                          <RotateCcw className="size-3.5 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

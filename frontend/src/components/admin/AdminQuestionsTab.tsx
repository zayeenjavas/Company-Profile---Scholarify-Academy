"use client";

import { useEffect, useState } from "react";
import { Copy, FolderInput, Pencil, Plus, Scale, Search, Trash2, X } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { SubtestDto, TryoutPackageDto } from "@/src/api/contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { LatexToolbarEditor } from "@/src/components/admin/LatexToolbarEditor";
import { RichMathText } from "@/src/components/common/RichMathText";

interface QuestionRow {
  id: string;
  orderNo: number;
  stemContent: string;
  weight: number;
  explanation: string | null;
  tryoutPackage: { id: string; slug: string; title: string };
  subtest: { id: string; code: string; title: string };
  choices: Array<{ id: string; label: string; content: string; isCorrect: boolean }>;
}

export function AdminQuestionsTab() {
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [packages, setPackages] = useState<TryoutPackageDto[]>([]);
  const [subtests, setSubtests] = useState<SubtestDto[]>([]);
  const [filterPkg, setFilterPkg] = useState("");
  const [filterSubtest, setFilterSubtest] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [pkgId, setPkgId] = useState("");
  const [subtestId, setSubtestId] = useState("");
  const [stem, setStem] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [optE, setOptE] = useState("");
  const [correctLabel, setCorrectLabel] = useState<"A" | "B" | "C" | "D" | "E">("A");
  const [weight, setWeight] = useState("1");
  const [explanation, setExplanation] = useState("");
  const [saving, setSaving] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkTargetPkg, setBulkTargetPkg] = useState("");
  const [bulkWeight, setBulkWeight] = useState("2");
  const [bulkRunning, setBulkRunning] = useState(false);

  const loadMeta = async () => {
    const [pRes, sRes] = await Promise.all([
      apiRequest<{ packages: TryoutPackageDto[] }>("/packages"),
      apiRequest<{ subtests: SubtestDto[] }>("/subtests"),
    ]);
    setPackages(pRes.packages);
    setSubtests(sRes.subtests);
    if (pRes.packages[0] && !pkgId) setPkgId(pRes.packages[0].id);
    if (sRes.subtests[0] && !subtestId) setSubtestId(sRes.subtests[0].id);
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: "30" });
      if (filterPkg) qs.set("package_id", filterPkg);
      if (filterSubtest) qs.set("subtest_code", filterSubtest);
      if (search.trim()) qs.set("search", search.trim());

      const res = await apiRequest<{ items: QuestionRow[] }>(
        `/admin/questions?${qs.toString()}`
      );
      setQuestions(res.items);
      setSelectedIds([]);
    } finally {
      setLoading(false);
    }
  };

  const allSelected = questions.length > 0 && selectedIds.length === questions.length;

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? questions.map((q) => q.id) : []);
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((x) => x !== id)
    );
  };

  const runBulkAction = async (
    payload:
      | { action: "DELETE"; ids: string[] }
      | { action: "MOVE" | "DUPLICATE"; ids: string[]; targetPackageId?: string }
      | { action: "SET_WEIGHT"; ids: string[]; weight: number }
  ) => {
    if (payload.ids.length === 0) return;
    if (
      payload.action === "DELETE" &&
      !confirm(`Hapus ${payload.ids.length} soal yang dipilih secara permanen?`)
    ) {
      return;
    }
    setBulkRunning(true);
    try {
      await apiRequest("/admin/questions/bulk", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      await loadQuestions();
    } catch (err: any) {
      alert(err.message || "Gagal menjalankan aksi massal");
    } finally {
      setBulkRunning(false);
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [filterPkg, filterSubtest]);

  const resetForm = () => {
    setEditingId(null);
    setStem("");
    setOptA("");
    setOptB("");
    setOptC("");
    setOptD("");
    setOptE("");
    setCorrectLabel("A");
    setWeight("1");
    setExplanation("");
    setShowForm(false);
  };

  const startEdit = (q: QuestionRow) => {
    const byLabel = new Map(q.choices.map((c) => [c.label, c.content]));
    const correct = (q.choices.find((c) => c.isCorrect)?.label || "A") as
      | "A"
      | "B"
      | "C"
      | "D"
      | "E";

    setEditingId(q.id);
    setPkgId(q.tryoutPackage.id);
    setSubtestId(q.subtest.id);
    setStem(q.stemContent);
    setOptA(byLabel.get("A") || "");
    setOptB(byLabel.get("B") || "");
    setOptC(byLabel.get("C") || "");
    setOptD(byLabel.get("D") || "");
    setOptE(byLabel.get("E") || "");
    setCorrectLabel(correct);
    setWeight(String(q.weight || 1));
    setExplanation(q.explanation || "");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsedWeight = Math.max(1, Number(weight) || 1);
      if (editingId) {
        await apiRequest(`/admin/questions/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify({
            stemContent: stem,
            weight: parsedWeight,
            explanation: explanation || null,
            correctLabel,
            choices: { A: optA, B: optB, C: optC, D: optD, E: optE },
          }),
        });
      } else {
        await apiRequest("/admin/questions", {
          method: "POST",
          body: JSON.stringify({
            packageId: pkgId,
            subtestId,
            stemContent: stem,
            weight: parsedWeight,
            explanation: explanation || null,
            correctLabel,
            choices: { A: optA, B: optB, C: optC, D: optD, E: optE },
          }),
        });
      }
      resetForm();
      await loadQuestions();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan soal");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus soal ini?")) return;
    await apiRequest(`/admin/questions/${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    await loadQuestions();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Bank Soal (Support LaTeX)</h2>
          <p className="text-sm text-muted-foreground">
            Kelola butir soal, rumus matematika ($...$ / $$...$$), kunci jawaban, dan pembahasan.
          </p>
        </div>
        <Button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setEditingId(null);
              setShowForm(true);
            }
          }}
          className="gap-1.5 min-h-[44px]"
        >
          {showForm ? <X className="size-4" /> : <Plus className="size-4 stroke-[1.75]" />}
          {showForm ? "Tutup Form" : "Tambah Soal"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {editingId ? "Edit Soal & Pembahasan" : "Tambah Soal Baru"}
            </CardTitle>
            {editingId && (
              <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                Batal Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Paket Tryout</Label>
                <Select
                  value={pkgId}
                  onValueChange={(v) => v && setPkgId(v)}
                  disabled={Boolean(editingId)}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Pilih Paket">
                      {(val: string | null) =>
                        packages.find((p) => p.id === val)?.title ?? "Pilih Paket"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Subtest</Label>
                <Select
                  value={subtestId}
                  onValueChange={(v) => v && setSubtestId(v)}
                  disabled={Boolean(editingId)}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Pilih Subtest">
                      {(val: string | null) => {
                        const s = subtests.find((item) => item.id === val);
                        return s ? `${s.code} — ${s.title}` : "Pilih Subtest";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subtests.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.code} — {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <LatexToolbarEditor
                  label="Pertanyaan (Support Equation / LaTeX)"
                  value={stem}
                  onChange={setStem}
                  placeholder="Contoh: Hitung nilai $\\int_{0}^{2} x^2\\,dx$ ..."
                  rows={4}
                  required
                />
              </div>

              <LatexToolbarEditor
                compact
                label="Opsi A"
                placeholder="Isi opsi A (bisa pakai $...$)"
                value={optA}
                onChange={setOptA}
                required
              />
              <LatexToolbarEditor
                compact
                label="Opsi B"
                placeholder="Isi opsi B (bisa pakai $...$)"
                value={optB}
                onChange={setOptB}
                required
              />
              <LatexToolbarEditor
                compact
                label="Opsi C"
                placeholder="Isi opsi C (bisa pakai $...$)"
                value={optC}
                onChange={setOptC}
                required
              />
              <LatexToolbarEditor
                compact
                label="Opsi D"
                placeholder="Isi opsi D (bisa pakai $...$)"
                value={optD}
                onChange={setOptD}
                required
              />
              <LatexToolbarEditor
                compact
                label="Opsi E"
                placeholder="Isi opsi E (bisa pakai $...$)"
                value={optE}
                onChange={setOptE}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Kunci Jawaban</Label>
                  <Select
                    value={correctLabel}
                    onValueChange={(v) => v && setCorrectLabel(v as "A" | "B" | "C" | "D" | "E")}
                  >
                    <SelectTrigger className="w-full h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D", "E"].map((k) => (
                        <SelectItem key={k} value={k}>
                          Kunci: {k}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Bobot Soal</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-10"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <LatexToolbarEditor
                  label="Pembahasan (Opsional — Support LaTeX)"
                  value={explanation}
                  onChange={setExplanation}
                  placeholder="Ditampilkan ke peserta setelah ujian DINILAI. Contoh: Gunakan rumus $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Batal
                  </Button>
                )}
                <Button type="submit" disabled={saving}>
                  {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Soal"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <Select
          value={filterPkg || "ALL"}
          onValueChange={(v) => setFilterPkg(v === "ALL" || !v ? "" : v)}
        >
          <SelectTrigger className="w-[200px] h-10">
            <SelectValue placeholder="Semua Paket">
              {(val: string | null) =>
                val === "ALL" || !val
                  ? "Semua Paket"
                  : (packages.find((p) => p.id === val)?.title ?? "Semua Paket")
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Paket</SelectItem>
            {packages.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterSubtest || "ALL"}
          onValueChange={(v) => setFilterSubtest(v === "ALL" || !v ? "" : v)}
        >
          <SelectTrigger className="w-[160px] h-10">
            <SelectValue placeholder="Semua Subtest">
              {(val: string | null) =>
                val === "ALL" || !val
                  ? "Semua Subtest"
                  : (subtests.find((s) => s.code === val)?.code ?? val)
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Subtest</SelectItem>
            {subtests.map((s) => (
              <SelectItem key={s.id} value={s.code}>
                {s.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-1 min-w-[200px] gap-2">
          <Input
            placeholder="Cari isi soal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadQuestions()}
          />
          <Button variant="outline" onClick={loadQuestions}>
            <Search className="size-4" />
          </Button>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--brand)]/40 bg-[var(--card)] px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Badge className="bg-[var(--brand)] text-white tabular-nums">
              {selectedIds.length} dipilih
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedIds([])}
              className="h-8 text-xs"
            >
              Batal
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={bulkTargetPkg}
              onValueChange={(val) => val && setBulkTargetPkg(val)}
            >
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="Pilih paket tujuan...">
                  {(val: string | null) => {
                    const p = packages.find((item) => item.id === val);
                    return p ? `${p.slug} — ${p.title}` : "Pilih paket tujuan...";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {packages.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.slug} — {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              variant="outline"
              disabled={bulkRunning || !bulkTargetPkg}
              onClick={() =>
                runBulkAction({
                  action: "MOVE",
                  ids: selectedIds,
                  targetPackageId: bulkTargetPkg,
                })
              }
              className="h-8 gap-1 text-xs"
            >
              <FolderInput className="size-3.5" />
              Pindah
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={bulkRunning}
              onClick={() =>
                runBulkAction({
                  action: "DUPLICATE",
                  ids: selectedIds,
                  targetPackageId: bulkTargetPkg || undefined,
                })
              }
              className="h-8 gap-1 text-xs"
            >
              <Copy className="size-3.5" />
              Duplikat
            </Button>

            <Select value={bulkWeight} onValueChange={(val) => val && setBulkWeight(val)}>
              <SelectTrigger className="h-8 w-24 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Bobot 1</SelectItem>
                <SelectItem value="2">Bobot 2</SelectItem>
                <SelectItem value="3">Bobot 3</SelectItem>
                <SelectItem value="5">Bobot 5</SelectItem>
              </SelectContent>
            </Select>

            <Button
              size="sm"
              variant="outline"
              disabled={bulkRunning}
              onClick={() =>
                runBulkAction({
                  action: "SET_WEIGHT",
                  ids: selectedIds,
                  weight: Number(bulkWeight) || 1,
                })
              }
              className="h-8 gap-1 text-xs"
            >
              <Scale className="size-3.5" />
              Set Bobot
            </Button>

            <Button
              size="sm"
              variant="destructive"
              disabled={bulkRunning}
              onClick={() => runBulkAction({ action: "DELETE", ids: selectedIds })}
              className="h-8 gap-1 text-xs"
            >
              <Trash2 className="size-3.5" />
              Hapus ({selectedIds.length})
            </Button>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(v) => toggleSelectAll(Boolean(v))}
                    aria-label="Pilih semua soal"
                  />
                </TableHead>
                <TableHead>Subtest / Paket</TableHead>
                <TableHead>Pertanyaan</TableHead>
                <TableHead>Kunci / Bobot</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Memuat soal...
                  </TableCell>
                </TableRow>
              ) : questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Tidak ada soal ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((q) => {
                  const correct = q.choices.find((c) => c.isCorrect)?.label || "-";
                  const isChecked = selectedIds.includes(q.id);
                  return (
                    <TableRow
                      key={q.id}
                      className={isChecked ? "bg-muted/50" : undefined}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(v) => toggleSelectOne(q.id, Boolean(v))}
                          aria-label={`Pilih soal ${q.id}`}
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="secondary" className="mr-1.5">
                          {q.subtest.code}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {q.tryoutPackage.slug}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-md text-sm">
                        <div className="line-clamp-2">
                          <RichMathText text={q.stemContent} />
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline" className="mr-1">
                          {correct}
                        </Badge>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          ×{q.weight}
                        </span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Edit Soal"
                          onClick={() => startEdit(q)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          title="Hapus Soal"
                          onClick={() => handleDelete(q.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

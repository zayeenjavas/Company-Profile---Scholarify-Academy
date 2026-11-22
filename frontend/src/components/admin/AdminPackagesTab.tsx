"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, CheckCircle2, Archive, FileEdit } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { TryoutPackageDto } from "@/src/api/contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export function AdminPackagesTab() {
  const [packages, setPackages] = useState<TryoutPackageDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState<"FREE" | "PREMIUM">("PREMIUM");
  const [durationMinutes, setDurationMinutes] = useState(90);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ packages: TryoutPackageDto[] }>("/packages");
      setPackages(res.packages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const now = new Date();
      const close = new Date(now.getTime() + 30 * 86_400_000);
      await apiRequest("/packages", {
        method: "POST",
        body: JSON.stringify({
          slug,
          title,
          description,
          tier,
          status: "DRAFT",
          duration_minutes: Number(durationMinutes),
          open_at: now.toISOString(),
          close_at: close.toISOString(),
        }),
      });
      setSlug("");
      setTitle("");
      setDescription("");
      setShowForm(false);
      await load();
    } catch (err: any) {
      alert(err.message || "Gagal membuat paket");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    try {
      await apiRequest(`/admin/packages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status paket");
    }
  };

  const handleTierToggle = async (pkg: TryoutPackageDto) => {
    const nextTier = pkg.tier === "FREE" ? "PREMIUM" : "FREE";
    try {
      await apiRequest(`/admin/packages/${pkg.id}`, {
        method: "PATCH",
        body: JSON.stringify({ tier: nextTier }),
      });
      await load();
    } catch (err: any) {
      alert(err.message || "Gagal mengubah tier paket");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus paket ini beserta seluruh soal di dalamnya?")) return;
    await apiRequest(`/admin/packages/${id}`, { method: "DELETE" });
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Paket Tryout</h2>
          <p className="text-sm text-muted-foreground">
            Kelola siklus paket (DRAFT → PUBLISHED → ARCHIVED) serta akses Gratis vs Langganan.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)} className="gap-1.5 min-h-[44px]">
          <Plus className="size-4 stroke-[1.75]" />
          {showForm ? "Tutup Form" : "Buat Paket Baru"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Paket Tryout Baru</CardTitle>
            <CardDescription>Paket baru berstatus DRAFT hingga memiliki minimal 1 soal.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Slug / ID Paket</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="mis. batch-5"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Judul Paket</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="TryOut UTBK Batch 5"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tier Akses</Label>
                <Select
                  value={tier}
                  onValueChange={(val) => val && setTier(val as "FREE" | "PREMIUM")}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">FREE (Semua Siswa/Umum)</SelectItem>
                    <SelectItem value="PREMIUM">PREMIUM (Khusus Langganan)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Durasi Total (Menit)</Label>
                <Input
                  type="number"
                  min={5}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>Deskripsi</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi singkat paket tryout"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Paket"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paket</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Soal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Memuat paket...
                  </TableCell>
                </TableRow>
              ) : packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Belum ada paket tryout.
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div className="font-medium">{pkg.title}</div>
                      <div className="text-xs text-muted-foreground">{pkg.slug}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTierToggle(pkg)}
                        className="h-7 text-xs"
                      >
                        {pkg.tier}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          pkg.status === "PUBLISHED"
                            ? "default"
                            : pkg.status === "ARCHIVED"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {pkg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {pkg.question_count}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1">
                        {pkg.status !== "PUBLISHED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(pkg.id, "PUBLISHED")}
                            title="Publikasikan"
                          >
                            <CheckCircle2 className="size-3.5 mr-1" />
                            Publish
                          </Button>
                        )}
                        {pkg.status === "PUBLISHED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(pkg.id, "ARCHIVED")}
                            title="Arsipkan"
                          >
                            <Archive className="size-3.5 mr-1" />
                            Arsip
                          </Button>
                        )}
                        {pkg.status === "DRAFT" && (
                          <Button size="sm" variant="ghost" disabled title="Draft">
                            <FileEdit className="size-3.5" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(pkg.id)}
                          title="Hapus Paket"
                        >
                          <Trash2 className="size-4" />
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

"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Crown, UserCheck, UserX, Upload, Ticket } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { UserDto } from "@/src/api/contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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

interface VoucherRow {
  id: string;
  code: string;
  label: string;
  durationDays: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
}

export function AdminUsersTab() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [vouchers, setVouchers] = useState<VoucherRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showVouchers, setShowVouchers] = useState(false);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<"FREE" | "PREMIUM">("FREE");
  const [saving, setSaving] = useState(false);

  const [csvText, setCsvText] = useState("imbs_siswa1,Budi Santoso,budi@imbs.sch.id,siswa123,PREMIUM");
  const [bulkResult, setBulkResult] = useState<string>("");
  const [bulkSaving, setBulkSaving] = useState(false);

  const [vCode, setVCode] = useState("");
  const [vLabel, setVLabel] = useState("Mitra SMA IMBS");
  const [vDays, setVDays] = useState(30);
  const [vMax, setVMax] = useState(100);
  const [vSaving, setVSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [uRes, vRes] = await Promise.all([
        apiRequest<{ users: UserDto[] }>("/admin/users"),
        apiRequest<{ vouchers: VoucherRow[] }>("/admin/vouchers").catch(() => ({ vouchers: [] })),
      ]);
      setUsers(uRes.users);
      setVouchers(vRes.vouchers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkSaving(true);
    setBulkResult("");
    try {
      const rows = csvText
        .split(/\r?\n/)
        .map((r) => r.trim())
        .filter((r) => r && !r.toLowerCase().startsWith("username,"))
        .map((line) => {
          const [u, n, em, pw, pl] = line.split(",").map((s) => s?.trim() ?? "");
          return {
            username: u,
            name: n || u,
            email: em || "",
            password: pw || "siswa123",
            plan: (pl?.toUpperCase() === "PREMIUM" ? "PREMIUM" : "FREE") as "FREE" | "PREMIUM",
          };
        })
        .filter((x) => x.username.length >= 3);

      const res = await apiRequest<{ created: number; skipped: number; errors: string[] }>(
        "/admin/users/bulk",
        { method: "POST", body: JSON.stringify({ users: rows }) }
      );
      setBulkResult(`Berhasil dibuat: ${res.created}, dilewati (duplikat): ${res.skipped}`);
      await load();
    } catch (err: any) {
      setBulkResult(err.message || "Gagal import CSV");
    } finally {
      setBulkSaving(false);
    }
  };

  const handleCreateVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setVSaving(true);
    try {
      await apiRequest("/admin/vouchers", {
        method: "POST",
        body: JSON.stringify({
          code: vCode.trim().toUpperCase(),
          label: vLabel.trim(),
          durationDays: Number(vDays) || 30,
          maxUses: Number(vMax) || 100,
        }),
      });
      setVCode("");
      await load();
    } catch (err: any) {
      alert(err.message || "Gagal membuat voucher");
    } finally {
      setVSaving(false);
    }
  };

  const toggleVoucher = async (v: VoucherRow) => {
    await apiRequest("/admin/vouchers", {
      method: "PATCH",
      body: JSON.stringify({ id: v.id, isActive: !v.isActive }),
    });
    await load();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/admin/users", {
        method: "POST",
        body: JSON.stringify({ username, name, password, role: "STUDENT", plan }),
      });
      setUsername("");
      setName("");
      setPassword("");
      setShowForm(false);
      await load();
    } catch (err: any) {
      alert(err.message || "Gagal membuat pengguna");
    } finally {
      setSaving(false);
    }
  };

  const toggleSubscription = async (u: UserDto) => {
    const active = u.subscription.is_active;
    await apiRequest(`/admin/users/${u.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        subscriptionPlan: active ? "FREE" : "PREMIUM",
        subscriptionStatus: active ? "NONE" : "ACTIVE",
        durationDays: 90,
      }),
    });
    await load();
  };

  const toggleActive = async (u: UserDto) => {
    await apiRequest(`/admin/users/${u.id}`, {
      method: "PATCH",
      body: JSON.stringify({ isActive: !u.is_active }),
    });
    await load();
  };

  const deleteUser = async (u: UserDto) => {
    if (!confirm(`Hapus pengguna @${u.username}?`)) return;
    try {
      await apiRequest(`/admin/users/${u.id}`, { method: "DELETE" });
      await load();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus pengguna");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Pengguna & Langganan</h2>
          <p className="text-sm text-muted-foreground">
            Kelola akun siswa dan aktifkan/cabut akses langganan Premium.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowBulk((v) => !v)} className="gap-1.5 min-h-[44px]">
            <Upload className="size-4" />
            Import CSV
          </Button>
          <Button variant="outline" onClick={() => setShowVouchers((v) => !v)} className="gap-1.5 min-h-[44px]">
            <Ticket className="size-4" />
            Voucher ({vouchers.length})
          </Button>
          <Button onClick={() => setShowForm((v) => !v)} className="gap-1.5 min-h-[44px]">
            <Plus className="size-4" />
            {showForm ? "Tutup Form" : "Tambah Siswa"}
          </Button>
        </div>
      </div>

      {showBulk && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Import Akun Massal (CSV Sekolah / Mitra)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBulkImport} className="space-y-3">
              <p className="text-xs text-muted-foreground">
                Format per baris: <code>username,nama,email,password,FREE/PREMIUM</code>
              </p>
              <Textarea
                rows={4}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="font-mono text-xs"
              />
              {bulkResult && <p className="text-xs font-semibold text-emerald-600">{bulkResult}</p>}
              <div className="flex justify-end">
                <Button type="submit" disabled={bulkSaving}>
                  {bulkSaving ? "Mengimport..." : "Proses Import"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {showVouchers && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kode Voucher Sekolah / Event</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateVoucher} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <Input
                value={vCode}
                onChange={(e) => setVCode(e.target.value.toUpperCase())}
                placeholder="KODE (mis. IMBS2026)"
                className="font-mono uppercase"
                required
              />
              <Input
                value={vLabel}
                onChange={(e) => setVLabel(e.target.value)}
                placeholder="Label Mitra"
                required
              />
              <Input
                type="number"
                value={vDays}
                onChange={(e) => setVDays(Number(e.target.value))}
                placeholder="Durasi (hari)"
                min={1}
              />
              <Button type="submit" disabled={vSaving}>
                {vSaving ? "Membuat..." : "Buat Voucher"}
              </Button>
            </form>
            {vouchers.length > 0 && (
              <div className="space-y-2">
                {vouchers.map((v) => (
                  <div
                    key={v.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold">{v.code}</span> · {v.label} ·{" "}
                      {v.durationDays} hari · terpakai {v.usedCount}/{v.maxUses}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toggleVoucher(v)}>
                      {v.isActive ? "Nonaktifkan" : "Aktifkan"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tambah Akun Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Username</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label>Nama Lengkap</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <Label>Password (min. 6 karakter)</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Paket Langganan</Label>
                <Select
                  value={plan}
                  onValueChange={(val) => val && setPlan(val as "FREE" | "PREMIUM")}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">FREE (Belum Langganan)</SelectItem>
                    <SelectItem value="PREMIUM">PREMIUM (Aktif 30 Hari)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Pengguna"}
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
                <TableHead>Pengguna</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Langganan</TableHead>
                <TableHead>Status Akun</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Memuat pengguna...
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">@{u.username}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.subscription.is_active ? "default" : "outline"}>
                        {u.subscription.is_active ? "PREMIUM AKTIF" : "FREE"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.is_active ? "outline" : "destructive"}>
                        {u.is_active ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-1">
                        {u.role === "STUDENT" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleSubscription(u)}
                          >
                            <Crown className="size-3.5 mr-1" />
                            {u.subscription.is_active ? "Cabut Premium" : "Aktifkan 90 Hari"}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleActive(u)}
                          title={u.is_active ? "Nonaktifkan" : "Aktifkan"}
                        >
                          {u.is_active ? <UserX className="size-4" /> : <UserCheck className="size-4" />}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => deleteUser(u)}
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

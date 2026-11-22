"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Crown, UserCheck, UserX } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { UserDto } from "@/src/api/contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function AdminUsersTab() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<"FREE" | "PREMIUM">("FREE");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ users: UserDto[] }>("/admin/users");
      setUsers(res.users);
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
        <Button onClick={() => setShowForm((v) => !v)} className="gap-1.5 min-h-[44px]">
          <Plus className="size-4" />
          {showForm ? "Tutup Form" : "Tambah Siswa"}
        </Button>
      </div>

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

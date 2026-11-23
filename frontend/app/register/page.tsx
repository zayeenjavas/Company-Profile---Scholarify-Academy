"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User, UserCheck } from "lucide-react";
import { apiRequest, setStoredToken } from "@/src/api/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DensAuthShell } from "@/components/dens-auth-shell";
import { DensInputGroup } from "@/src/components/admin/dens-ui";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await apiRequest<{ ok: boolean; token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, username, email, password }),
      });
      if (res.token) setStoredToken(res.token);
      router.replace("/tryout");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DensAuthShell>
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.03em]">Daftar Akun</h1>
        <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-[var(--primary)] underline-offset-4 hover:underline">
            Masuk di sini
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-3.5">
          <div className="grid gap-1.5">
            <Label htmlFor="reg-name">Nama Lengkap</Label>
            <DensInputGroup start={<UserCheck />} className="h-11 rounded-xl">
              <input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Aisyah Putri"
                required
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </DensInputGroup>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reg-username">Username</Label>
            <DensInputGroup start={<User />} className="h-11 rounded-xl">
              <input
                id="reg-username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                placeholder="misal: aisyah_putri"
                required
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </DensInputGroup>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reg-email">Email (Opsional)</Label>
            <DensInputGroup start={<Mail />} className="h-11 rounded-xl">
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </DensInputGroup>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reg-password">Password</Label>
            <DensInputGroup
              start={<Lock />}
              className="h-11 rounded-xl"
              end={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="grid size-7 place-content-center rounded-[6px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              }
            >
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                minLength={6}
                required
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </DensInputGroup>
          </div>

          {error && (
            <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3 py-2 text-xs text-[var(--destructive)]">
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-1 h-11 w-full rounded-xl bg-[var(--brand)] text-white hover:bg-[var(--primary)] font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Mendaftarkan...
              </>
            ) : (
              <>
                Daftar Gratis
                <ArrowRight className="ml-1.5 size-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </DensAuthShell>
  );
}

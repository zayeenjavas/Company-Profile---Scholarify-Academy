"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import { apiRequest, setStoredToken } from "@/src/api/client";
import type { LoginResponseDto } from "@/src/api/contracts";
import { toErrorMessage } from "@/src/api/errors";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DensInputGroup } from "@/src/components/admin/dens-ui";

export function LoginForm() {
  const sp = useSearchParams();
  const from = sp.get("from") || "/tryout";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const data = await apiRequest<LoginResponseDto>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      setStoredToken(data.token);

      if (data.user.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = from;
      }
    } catch (error) {
      setErr(toErrorMessage(error, "Username atau password salah"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-[28px] font-bold tracking-[-0.03em]">Masuk</h1>
      <p className="mt-1.5 text-sm text-[var(--muted-foreground)]">
        Baru di Scholarify?{" "}
        <Link href="/register" className="font-semibold text-[var(--primary)] underline-offset-4 hover:underline">
          Daftar akun gratis
        </Link>
      </p>

      <form onSubmit={onSubmit} className="mt-7 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <DensInputGroup start={<User />} className="h-11 rounded-xl">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="mis. nadia_putri"
              autoComplete="username"
              required
              className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
            />
          </DensInputGroup>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a
              href="https://wa.me/6285156540075?text=Halo%20Admin%20Scholarify,%20saya%20lupa%20password%20akun%20TryOut"
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Lupa password?
            </a>
          </div>
          <DensInputGroup
            start={<Lock />}
            className="h-11 rounded-xl"
            end={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                className="grid size-7 place-content-center rounded-[6px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          >
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
            />
          </DensInputGroup>
        </div>

        <div className="flex items-center gap-2.5">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="text-xs font-medium text-[var(--muted-foreground)]">
            Tetap masuk selama sesi aktif (Better Auth)
          </Label>
        </div>

        {err && (
          <div className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-3 py-2 text-xs text-[var(--destructive)]">
            {err}
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
              Memproses...
            </>
          ) : (
            <>
              Masuk
              <ArrowRight className="ml-1.5 size-4" />
            </>
          )}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
        <Separator className="flex-1" /> akses cepat <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link href="/register">
          <Button variant="outline" className="w-full rounded-xl text-xs">
            Daftar Siswa
          </Button>
        </Link>
        <Link href="/tryout">
          <Button variant="outline" className="w-full rounded-xl text-xs">
            Lihat Paket
          </Button>
        </Link>
      </div>
    </div>
  );
}

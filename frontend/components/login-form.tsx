"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import { apiRequest, setStoredToken } from "@/src/api/client";
import type { LoginResponseDto } from "@/src/api/contracts";
import { toErrorMessage } from "@/src/api/errors";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DensInputGroup } from "@/src/components/admin/dens-ui";

export function LoginForm() {
  const sp = useSearchParams();
  const from = sp.get("from") || "/tryout";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberUsername, setRememberUsername] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState<boolean | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("scholarify_saved_username");
    if (saved) setUsername(saved);
    fetch("/api/v1/auth/providers")
      .then((r) => r.json())
      .then((d) => setGoogleEnabled(Boolean(d?.google)))
      .catch(() => setGoogleEnabled(false));
  }, []);

  const onGoogleSignIn = async () => {
    setErr(null);
    setGoogleLoading(true);
    try {
      const res = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google", callbackURL: from }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(
          data?.message ||
            "Google Sign-In belum aktif. Pastikan GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET sudah diisi di Vercel."
        );
      }
      window.location.href = data.url;
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Gagal masuk dengan Google");
      setGoogleLoading(false);
    }
  };

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
      if (rememberUsername) {
        localStorage.setItem("scholarify_saved_username", username);
      } else {
        localStorage.removeItem("scholarify_saved_username");
      }

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
          <Label htmlFor="username" className="text-[var(--foreground)]">Username</Label>
          <DensInputGroup start={<User />} className="h-11 rounded-xl border-[var(--input)] bg-[var(--surface)]">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="mis. nadia_putri"
              autoComplete="username"
              required
              className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:caret-[var(--foreground)] [&:-webkit-autofill]:shadow-[0_0_0_100px_var(--surface)_inset]"
            />
          </DensInputGroup>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[var(--foreground)]">Password</Label>
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
            className="h-11 rounded-xl border-[var(--input)] bg-[var(--surface)]"
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
              className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:caret-[var(--foreground)] [&:-webkit-autofill]:shadow-[0_0_0_100px_var(--surface)_inset]"
            />
          </DensInputGroup>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)]/70 px-3 py-2 text-xs text-[var(--muted-foreground)]">
          <ShieldCheck className="size-4 shrink-0 text-[var(--primary)]" />
          <span>Sesi terenkripsi · Progres tryout &amp; target PTN tersimpan otomatis</span>
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
        <Separator className="flex-1" /> atau lanjutkan dengan <Separator className="flex-1" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onGoogleSignIn}
        disabled={googleLoading || googleEnabled === false}
        title={
          googleEnabled === false
            ? "Tambahkan GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET di Vercel untuk mengaktifkan"
            : undefined
        }
        className="h-11 w-full rounded-xl gap-2.5 border-[var(--input)] bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--muted)]"
      >
        <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
          />
        </svg>
        {googleLoading
          ? "Menghubungkan ke Google..."
          : googleEnabled === false
          ? "Masuk dengan Google (Belum Aktif — Setup Env)"
          : "Masuk dengan Google"}
      </Button>
    </div>
  );
}

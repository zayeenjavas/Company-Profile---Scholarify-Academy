"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User, UserCheck } from "lucide-react";
import { apiRequest, setStoredToken } from "@/src/api/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
  const [googleLoading, setGoogleLoading] = useState(false);

  const onGoogleSignUp = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const res = await fetch("/api/auth/sign-in/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google", callbackURL: "/tryout" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(
          data?.message ||
            "Google Sign-In belum aktif. Pastikan GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET sudah diisi di Vercel."
        );
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar dengan Google");
      setGoogleLoading(false);
    }
  };

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
            <Label htmlFor="reg-name" className="text-[var(--foreground)]">Nama Lengkap</Label>
            <DensInputGroup start={<UserCheck />} className="h-11 rounded-xl border-[var(--input)] bg-[var(--surface)]">
              <input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Aisyah Putri"
                required
                className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:caret-[var(--foreground)] [&:-webkit-autofill]:shadow-[0_0_0_100px_var(--surface)_inset]"
              />
            </DensInputGroup>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reg-username" className="text-[var(--foreground)]">Username</Label>
            <DensInputGroup start={<User />} className="h-11 rounded-xl border-[var(--input)] bg-[var(--surface)]">
              <input
                id="reg-username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                placeholder="misal: aisyah_putri"
                required
                className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:caret-[var(--foreground)] [&:-webkit-autofill]:shadow-[0_0_0_100px_var(--surface)_inset]"
              />
            </DensInputGroup>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reg-email" className="text-[var(--foreground)]">Email (Opsional)</Label>
            <DensInputGroup start={<Mail />} className="h-11 rounded-xl border-[var(--input)] bg-[var(--surface)]">
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:caret-[var(--foreground)] [&:-webkit-autofill]:shadow-[0_0_0_100px_var(--surface)_inset]"
              />
            </DensInputGroup>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reg-password" className="text-[var(--foreground)]">Password</Label>
            <DensInputGroup
              start={<Lock />}
              className="h-11 rounded-xl border-[var(--input)] bg-[var(--surface)]"
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
                className="w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)] [&:-webkit-autofill]:caret-[var(--foreground)] [&:-webkit-autofill]:shadow-[0_0_0_100px_var(--surface)_inset]"
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

        <div className="my-6 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
          <Separator className="flex-1" /> atau daftar dengan <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onGoogleSignUp}
          disabled={googleLoading}
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
          {googleLoading ? "Menghubungkan ke Google..." : "Daftar dengan Google"}
        </Button>
      </div>
    </DensAuthShell>
  );
}

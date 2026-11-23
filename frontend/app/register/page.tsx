"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { apiRequest, setStoredToken } from "@/src/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#061124] p-6 md:p-10 text-white">
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#061124]/80 via-[#061124]/65 to-[#061124]/90" />

      <div className="relative z-10 mb-6 flex w-full max-w-md items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition hover:bg-white/20"
        >
          <ArrowLeft className="size-3.5" />
          Beranda
        </Link>
        <Link
          href="/"
          className="text-2xl tracking-tight text-white"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Scholarify<sup className="text-[11px] font-sans opacity-80">®</sup>
        </Link>
      </div>

      <Card className="relative z-10 w-full max-w-md border-white/20 bg-white/95 text-slate-900 shadow-2xl backdrop-blur-xl dark:bg-card/95 dark:text-foreground">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Daftar Akun TryOut</CardTitle>
          <CardDescription>
            Buat akun siswa gratis untuk mulai simulasi TryOut UTBK-SNBT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="reg-name">Nama Lengkap</Label>
              <Input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Aisyah Putri"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-username">Username</Label>
              <Input
                id="reg-username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                placeholder="misal: aisyah_putri"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-email">Email (Opsional)</Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reg-password">Password</Label>
              <Input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                minLength={6}
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] rounded-xl bg-[#1E34C8] text-white hover:bg-[#17289E] font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 size-4" />
                  Daftar Sekarang
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-semibold text-[#1E34C8] hover:underline">
                Masuk di sini
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiRequest, setStoredToken } from "@/src/api/client";
import type { LoginResponseDto } from "@/src/api/contracts";
import { toErrorMessage } from "@/src/api/errors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
    <div className={cn("flex flex-col gap-5", className)} {...props}>
      <Card className="overflow-hidden rounded-2xl border border-white/20 bg-white/95 dark:bg-card/95 text-foreground shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center pb-2">
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="border-[#2B44FF]/30 bg-[#EBEFFE] text-[#2B44FF] dark:bg-[#2B44FF]/15 dark:text-primary gap-1"
            >
              <Lock className="size-3" />
              Portal TryOut &amp; Admin
            </Badge>
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-foreground">
            Selamat Datang{" "}
            <span className="relative inline-block">
              <em
                className="italic font-normal text-[#2B44FF]"
                style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
              >
                Kembali
              </em>
              <svg
                viewBox="0 0 120 10"
                fill="none"
                className="pointer-events-none absolute -bottom-0.5 left-0 w-full h-2 text-[#FF6B4A]"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8C38 2 82 2 118 8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Masuk dengan akun siswa atau admin Scholarify
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  autoComplete="username"
                  className="min-h-[44px] rounded-xl bg-background"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="min-h-[44px] rounded-xl bg-background pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              {err && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {err}
                </div>
              )}

              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[46px] rounded-full bg-[#2B44FF] text-white hover:bg-[#1E34C8] font-semibold shadow-md shadow-[#2B44FF]/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
                <FieldDescription className="text-center text-xs">
                  Belum punya akun? Hubungi admin Scholarify untuk aktivasi.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs text-white/70">
        Platform Simulasi TryOut UTBK &amp; Belajar Terpadu Scholarify.
      </FieldDescription>
    </div>
  );
}

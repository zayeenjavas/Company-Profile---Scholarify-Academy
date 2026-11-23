"use client";

import { Suspense } from "react";
import { DensAuthShell } from "@/components/dens-auth-shell";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <DensAuthShell>
      <Suspense
        fallback={
          <div className="py-12 text-center text-sm text-[var(--muted-foreground)]">
            Memuat form login...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </DensAuthShell>
  );
}

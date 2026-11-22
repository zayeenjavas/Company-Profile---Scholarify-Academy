"use client";

import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2.5 self-center font-semibold">
          <img
            src="/images/scholarify-logo.png"
            alt="Scholarify"
            className="h-7 w-7 object-contain"
          />
          <span>Scholarify</span>
        </Link>
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-muted-foreground">
              Memuat form login...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

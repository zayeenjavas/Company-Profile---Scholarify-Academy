"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[#061124] p-6 md:p-10 text-white">
      {/* Subtle Looping Hero Video + Navy Overlay (matching LandingHero) */}
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

      {/* Top Left Back to Home Pill */}
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

      <div className="relative z-10 flex w-full max-w-md flex-col gap-6">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-white/15 bg-white/10 py-12 text-center text-sm text-white/80 backdrop-blur-xl">
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

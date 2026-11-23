"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/src/styles/dens-admin.css";

export function DensAuthShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="dens-admin-theme flex min-h-svh flex-col items-center justify-center bg-[var(--background)] p-4 sm:p-6 md:p-10">
      {/* Top Bar */}
      <div className="mb-4 flex w-full max-w-5xl items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] px-3.5 py-1.5 text-xs font-medium text-[var(--foreground)] shadow-sm transition hover:bg-[var(--muted)]"
        >
          <ArrowLeft className="size-3.5" />
          Beranda
        </Link>
        <Link href="/tryout" className="text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
          Portal TryOut →
        </Link>
      </div>

      {/* Main Split Card (dens-ui LoginBlock) */}
      <div
        className={cn(
          "@container w-full max-w-5xl overflow-hidden rounded-[28px] bg-[var(--card)] text-[var(--foreground)] ring-1 ring-[var(--border)] shadow-panel",
          className
        )}
      >
        <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)]">
          {/* Brand Side: 3-pane Palette Sheet on near-black #0c0b0b */}
          <div className="hidden flex-col gap-8 bg-[#0c0b0b] p-8 text-[#fff2df] lg:flex">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-8 place-content-center rounded-[9px] bg-[#008C8D] text-sm font-bold text-white ring-1 ring-white/15">
                S
              </span>
              <span className="text-lg font-bold tracking-[-0.02em]">Scholarify</span>
            </Link>

            <div className="mt-auto w-full max-w-[480px]">
              <div className="relative aspect-[600/620] w-full">
                <svg viewBox="0 0 600 620" className="absolute inset-0 size-full" aria-hidden>
                  {/* Top Mars Green pane */}
                  <rect x="0" y="0" width="600" height="350" rx="28" fill="#008C8D" />
                  {/* Bottom-left Soft Mint pane */}
                  <rect x="0" y="366" width="334" height="254" rx="28" fill="#C0EBD7" />
                  {/* Bottom-right Hermès Orange pane */}
                  <rect x="350" y="366" width="250" height="254" rx="28" fill="#FF8A00" />
                </svg>

                {/* Top Card Copy */}
                <div className="absolute inset-x-7 top-7">
                  <p className="text-[36px] xl:text-[42px] font-bold leading-[1.04] tracking-[-0.035em] text-white">
                    Satu ruang ujian, siap tembus PTN.
                  </p>
                  <p className="mt-4 max-w-[88%] text-[16px] xl:text-[18px] font-medium leading-snug text-[#031414]">
                    TryOut UTBK-SNBT dengan timer server, passing grade PTN, dan pembahasan lengkap.
                  </p>
                </div>

                {/* Bottom-Left Metric */}
                <div className="absolute left-7 top-[394px] w-[280px] text-[#00585a]">
                  <div className="text-[44px] xl:text-[50px] font-bold leading-none tracking-[-0.04em] tabular-nums">
                    7
                  </div>
                  <div className="mt-2 text-[15px] font-semibold leading-tight">
                    subtest resmi UTBK-SNBT terkurasi
                  </div>
                </div>

                {/* Bottom-Right Metric */}
                <div className="absolute left-[374px] top-[394px] w-[200px] text-[#1f1100]">
                  <div className="text-[40px] xl:text-[44px] font-bold leading-none tracking-[-0.04em] tabular-nums">
                    1000
                  </div>
                  <div className="mt-2 text-[15px] font-semibold leading-tight">
                    skala skor &amp; target passing grade
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[12px] text-[#fff2df]/70">
              Scholarify CBT Platform · Dilindungi Better Auth
            </p>
          </div>

          {/* Form Side */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
            <div className="mx-auto w-full max-w-sm">
              <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                <span className="grid size-8 place-content-center rounded-[9px] bg-[#008C8D] text-sm font-bold text-white">
                  S
                </span>
                <span className="text-lg font-bold tracking-[-0.02em]">Scholarify</span>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

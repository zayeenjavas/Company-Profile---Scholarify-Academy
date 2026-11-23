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

            <div className="mt-auto flex w-full flex-col gap-3.5">
              {/* Top Mars Green pane */}
              <div className="rounded-[24px] bg-[#008C8D] p-7">
                <p className="text-[32px] xl:text-[38px] font-bold leading-[1.06] tracking-[-0.03em] text-white">
                  Satu ruang ujian, siap tembus PTN.
                </p>
                <p className="mt-3.5 max-w-[92%] text-[15px] xl:text-[17px] font-medium leading-snug text-[#031414]">
                  TryOut UTBK-SNBT dengan timer server, passing grade PTN, dan pembahasan lengkap.
                </p>
              </div>

              {/* Bottom 2-column panes */}
              <div className="grid grid-cols-[1.25fr_1fr] gap-3.5">
                <div className="flex flex-col justify-between rounded-[24px] bg-[#C0EBD7] p-6 text-[#00585a]">
                  <div className="text-[42px] xl:text-[48px] font-bold leading-none tracking-[-0.04em] tabular-nums">
                    7
                  </div>
                  <div className="mt-4 text-[14px] font-semibold leading-snug">
                    subtest resmi UTBK-SNBT terkurasi
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-[24px] bg-[#FF8A00] p-6 text-[#1f1100]">
                  <div className="text-[36px] xl:text-[42px] font-bold leading-none tracking-[-0.04em] tabular-nums">
                    1000
                  </div>
                  <div className="mt-4 text-[14px] font-semibold leading-snug">
                    skala skor &amp; target PTN
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

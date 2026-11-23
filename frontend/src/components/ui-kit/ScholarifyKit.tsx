"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronsRight } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { UserDto } from "@/src/api/contracts";
import { mapUserDto } from "@/src/api/mappers";
import type { UserProfile } from "@/src/types/domain";
import { Button } from "@/components/ui/button";
import { SmoothScrollProvider } from "@/src/components/common/SmoothScrollProvider";
import { LandingNavbar } from "@/src/components/landing/LandingNavbar";
import { LandingContactFooter } from "@/src/components/landing/LandingContactFooter";

export const SCHOLARIFY_TOKENS = {
  colors: [
    { name: "Deep Navy", hex: "#061124", usage: "Hero & Login dark canvas" },
    { name: "Royal Blue", hex: "#0E2492", usage: "Program & Subpage Hero" },
    { name: "Periwinkle Primary", hex: "#5B6CFF", usage: "Primary CTA & badges" },
    { name: "Lavender Surface", hex: "#EBEFFE", usage: "Packages & Testimonials" },
    { name: "Coral Accent", hex: "#FF6B4A", usage: "Active dots, underline & tier" },
    { name: "Studio Pink", hex: "#F6A5B8", usage: "Portrait & collage backdrop" },
    { name: "Studio Amber", hex: "#FBBF24", usage: "Portrait & collage backdrop" },
    { name: "Sky Blue", hex: "#9BD4FA", usage: "Program cutout backdrop" },
  ],
} as const;

export function SectionEyebrow({
  label,
  dotClassName = "bg-[#5B6CFF]",
  textClassName = "text-slate-600 dark:text-muted-foreground",
}: {
  label: string;
  dotClassName?: string;
  textClassName?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${textClassName}`}
    >
      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${dotClassName}`} />
      {label}
    </div>
  );
}

export function EditorialHeading({
  line1,
  line2Prefix,
  highlight,
  highlightClassName = "text-[#4F6BFF]",
  underlineClassName = "text-[#FF6B4A]",
  className = "text-slate-900 dark:text-foreground",
  as: Tag = "h2",
}: {
  line1: string;
  line2Prefix?: string;
  highlight: string;
  highlightClassName?: string;
  underlineClassName?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Tag
      className={`text-2xl font-extrabold tracking-tight sm:text-4xl leading-[1.15] ${className}`}
    >
      {line1}
      <span className="block">
        {line2Prefix ? `${line2Prefix} ` : ""}
        <span className="relative inline-block">
          <em
            className={`italic font-normal ${highlightClassName}`}
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            {highlight}
          </em>
          <svg
            viewBox="0 0 150 10"
            fill="none"
            className={`pointer-events-none absolute -bottom-1 left-0 w-full h-2 ${underlineClassName}`}
            preserveAspectRatio="none"
          >
            <path
              d="M2 8C48 2 102 2 148 8"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
    </Tag>
  );
}

export function SplitPillButton({
  href,
  label,
  onClick,
  showArrowCircle = true,
  className = "",
}: {
  href?: string;
  label: string;
  onClick?: () => void;
  showArrowCircle?: boolean;
  className?: string;
}) {
  const inner = (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Button
        type={href ? "button" : "submit"}
        onClick={onClick}
        className="min-h-[42px] rounded-full bg-[#5B6CFF] hover:bg-[#4657EB] text-white px-6 text-xs font-semibold shadow-sm"
      >
        {label}
      </Button>
      {showArrowCircle && (
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#5B6CFF] text-white transition hover:bg-[#4657EB]">
          <ChevronsRight className="size-4" />
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function SubpageHero({
  eyebrow,
  titleLine1,
  titleLine2Prefix,
  highlight,
  subtitle,
  actions,
}: {
  eyebrow: string;
  titleLine1: string;
  titleLine2Prefix?: string;
  highlight: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[#0E2492] text-white pt-10 pb-14 lg:pt-28 lg:pb-20">
      {/* Dot & Diagonal Texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.28) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-[140%] w-1/2 -rotate-12 bg-white/[0.04]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionEyebrow
            label={eyebrow}
            dotClassName="bg-amber-400"
            textClassName="text-white/85"
          />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition hover:bg-white/20"
          >
            <ArrowLeft className="size-3.5" />
            Beranda
          </Link>
        </div>

        <EditorialHeading
          as="h1"
          line1={titleLine1}
          line2Prefix={titleLine2Prefix}
          highlight={highlight}
          className="text-white sm:text-5xl"
          highlightClassName="text-[#9BD4FA]"
          underlineClassName="text-white/70"
        />

        <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
          {subtitle}
        </p>

        {actions && <div className="pt-1 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}

export function PageShell({
  children,
  user: initialUser,
  hideContactSection = false,
}: {
  children: React.ReactNode;
  user?: UserProfile | null;
  hideContactSection?: boolean;
}) {
  const [user, setUser] = useState<UserProfile | null>(initialUser ?? null);

  useEffect(() => {
    if (initialUser !== undefined) return;
    apiRequest<{ ok: boolean; user: UserDto }>("/auth/me")
      .then((res) => {
        if (res?.user) setUser(mapUserDto(res.user));
      })
      .catch(() => {});
  }, [initialUser]);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-background text-foreground pb-24 lg:pb-0">
        <LandingNavbar user={user} />
        <main>{children}</main>
        {hideContactSection ? (
          <footer className="border-t bg-background py-8">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <img
                  src="/images/scholarify-logo.png"
                  alt="Scholarify"
                  className="h-6 w-6 object-contain"
                />
                <span>Scholarify</span>
              </div>
              <p>© {new Date().getFullYear()} Scholarify. Platform Simulasi TryOut UTBK &amp; Belajar.</p>
              <div className="flex items-center gap-4">
                <Link href="/ui-kit" className="hover:text-foreground">
                  UI Kit
                </Link>
                <Link href="/tryout" className="hover:text-foreground">
                  TryOut
                </Link>
                <Link href="/login" className="hover:text-foreground">
                  Masuk
                </Link>
              </div>
            </div>
          </footer>
        ) : (
          <LandingContactFooter />
        )}
      </div>
    </SmoothScrollProvider>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Crown } from "lucide-react";
import type { UserProfile } from "@/src/types/domain";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LandingHero({
  user,
}: {
  user: UserProfile | null;
  onSearchPackage?: (q: string) => void;
}) {
  const router = useRouter();
  const isSubscribed = Boolean(user?.subscription.isActive);

  return (
    <>
      <section
        id="beranda"
        className="relative flex min-h-screen min-h-[100dvh] flex-col justify-between overflow-hidden bg-gradient-to-b from-[#DCEBFF] via-[#EEF5FF] to-[#FFFDF8] dark:bg-none dark:bg-[#061124] pt-8 lg:pt-24 text-[#0B1B3B] dark:text-white transition-colors duration-500"
      >
      {/* Daylight Animated Sky & Sunbeams (Light Mode Only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden block dark:hidden"
      >
        {/* Warm Morning Sun Glow */}
        <div
          className="absolute -top-24 right-[8%] h-[420px] w-[420px] rounded-full opacity-80 blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(255,214,138,0.65) 0%, rgba(255,237,194,0.28) 45%, transparent 75%)",
            animationDuration: "7s",
          }}
        />
        {/* Soft Sky Blue Ambient Orb */}
        <div
          className="absolute bottom-[-10%] -left-24 h-[460px] w-[460px] rounded-full opacity-75 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(147,197,253,0.55) 0%, rgba(191,219,254,0.2) 50%, transparent 75%)",
          }}
        />
        {/* Drifting Daylight Clouds SVG */}
        <svg
          className="absolute inset-0 h-full w-full opacity-70"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <g className="animate-[cloudDriftSlow_38s_linear_infinite]">
            <ellipse cx="260" cy="210" rx="220" ry="68" fill="white" fillOpacity="0.65" />
            <ellipse cx="360" cy="195" rx="150" ry="55" fill="white" fillOpacity="0.72" />
            <ellipse cx="1060" cy="170" rx="260" ry="74" fill="white" fillOpacity="0.6" />
            <ellipse cx="1180" cy="185" rx="170" ry="52" fill="white" fillOpacity="0.68" />
          </g>
          <g className="animate-[cloudDriftFast_26s_linear_infinite]">
            <ellipse cx="640" cy="340" rx="240" ry="60" fill="white" fillOpacity="0.5" />
            <ellipse cx="750" cy="330" rx="160" ry="48" fill="white" fillOpacity="0.58" />
            <ellipse cx="180" cy="540" rx="280" ry="70" fill="white" fillOpacity="0.45" />
            <ellipse cx="1220" cy="520" rx="250" ry="68" fill="white" fillOpacity="0.48" />
          </g>
        </svg>
        <style>{`
          @keyframes cloudDriftSlow {
            0% { transform: translateX(-4%); }
            50% { transform: translateX(4%); }
            100% { transform: translateX(-4%); }
          }
          @keyframes cloudDriftFast {
            0% { transform: translateX(5%); }
            50% { transform: translateX(-5%); }
            100% { transform: translateX(5%); }
          }
        `}</style>
      </div>

      {/* Full-bleed Cinematic Looping Video Background (Dark Mode Only) */}
      <video
        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover dark:block"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>
      <div className="pointer-events-none absolute inset-0 hidden dark:block bg-gradient-to-b from-[#061124]/60 via-[#061124]/30 to-[#061124]/70" />

      {/* Mobile Centered Brand Title (since top nav is desktop-only) */}
      <div className="relative z-10 flex justify-center pt-2 lg:hidden">
        <span
          className="text-2xl tracking-tight text-[#0B1B3B] dark:text-white"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Scholarify<sup className="text-[11px] font-sans opacity-80">®</sup>
        </span>
      </div>

      {/* Banner Portal Siswa jika Sudah Langganan */}
      {isSubscribed && user ? (
        <div className="relative z-10 border-b border-[#0B1B3B]/10 dark:border-white/15 bg-white/60 dark:bg-black/30 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Badge className="bg-[#0B1B3B] text-white dark:bg-white dark:text-[#0B1B3B] gap-1">
                <Crown className="size-3" />
                Premium Aktif
              </Badge>
              <span className="font-medium text-[#0B1B3B] dark:text-white">
                Halo, <strong>{user.name}</strong>! Seluruh paket TryOut &amp; pembahasan terbuka untukmu.
              </span>
            </div>
            <Link href="/tryout">
              <Button size="sm" className="bg-[#0B1B3B] text-white hover:bg-[#173063] dark:bg-white dark:text-[#0B1B3B] dark:hover:bg-white/90 gap-1.5 h-8 text-xs">
                Portal TryOut
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div />
      )}

      {/* Centered Hero Content matching scholarify.id */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 py-10 sm:py-16 text-center sm:px-6">
        <h1
          className="text-[2.15rem] leading-[1.1] tracking-tight text-[#0B1B3B] dark:text-white sm:text-6xl md:text-7xl"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Wujudkan Mimpi Masuk
          <br />
          <em className="italic text-[#0B1B3B]/55 dark:text-white/55">Kampus Impian</em> &amp; Pahami
          <br />
          <em className="italic text-[#0B1B3B]/55 dark:text-white/55">Materi Sekolah</em>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#334155] dark:text-white/85 sm:text-base">
          Raih kampus impianmu dengan bimbingan intensif bersama mentor berpengalaman. Scholarify membantu kamu memahami materi sekolah dan kuliah dengan metode belajar yang efektif dan menyenangkan.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/tryout")}
            className="min-h-[48px] rounded-full border border-[#0B1B3B]/15 bg-[#0B1B3B] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#173063] hover:scale-[1.02] dark:border-white/35 dark:bg-white/15 dark:backdrop-blur-md dark:hover:bg-white/25 cursor-pointer"
          >
            {isSubscribed ? "Buka Ruang Tryout" : "Mulai Tryout"}
          </button>
        </div>
      </div>
      </section>

      {/* Strip Fitur Royal Blue (di bawah hero full-screen) */}
      <div className="relative z-10 bg-[#2B44FF] text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-4 text-center text-xs font-semibold sm:grid-cols-4 sm:px-6 sm:text-sm">
          <div>45+ Mentor Berpengalaman</div>
          <div>140+ Bank Soal Terkurasi</div>
          <div>Timer Tersinkron Server</div>
          <div>Pembahasan Lengkap</div>
        </div>
      </div>
    </>
  );
}

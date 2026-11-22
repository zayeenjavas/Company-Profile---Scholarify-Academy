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
    <section
      id="beranda"
      className="relative flex min-h-[82vh] sm:min-h-[90vh] flex-col justify-between overflow-hidden bg-[#061124] pt-8 lg:pt-24 text-white"
    >
      {/* Full-bleed Cinematic Looping Video Background (preserved from scholarify.id) */}
      <video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#061124]/60 via-[#061124]/30 to-[#061124]/70" />

      {/* Mobile Centered Brand Title (since top nav is desktop-only) */}
      <div className="relative z-10 flex justify-center pt-2 lg:hidden">
        <span
          className="text-2xl tracking-tight text-white"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Scholarify<sup className="text-[11px] font-sans opacity-80">®</sup>
        </span>
      </div>

      {/* Banner Portal Siswa jika Sudah Langganan */}
      {isSubscribed && user ? (
        <div className="relative z-10 border-b border-white/15 bg-black/30 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Badge className="bg-white text-[#0B1B3B] gap-1">
                <Crown className="size-3" />
                Premium Aktif
              </Badge>
              <span className="font-medium text-white">
                Halo, <strong>{user.name}</strong>! Seluruh paket TryOut &amp; pembahasan terbuka untukmu.
              </span>
            </div>
            <Link href="/tryout">
              <Button size="sm" className="bg-white text-[#0B1B3B] hover:bg-white/90 gap-1.5 h-8 text-xs">
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
          className="text-[2.15rem] leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl"
          style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
        >
          Wujudkan Mimpi Masuk
          <br />
          <em className="italic text-white/55">Kampus Impian</em> &amp; Pahami
          <br />
          <em className="italic text-white/55">Materi Sekolah</em>
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
          Raih kampus impianmu dengan bimbingan intensif bersama mentor berpengalaman. Scholarify membantu kamu memahami materi sekolah dan kuliah dengan metode belajar yang efektif dan menyenangkan.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/tryout")}
            className="min-h-[48px] rounded-full border border-white/35 bg-white/15 px-8 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/25 hover:scale-[1.02]"
          >
            {isSubscribed ? "Buka Ruang Tryout" : "Mulai Tryout"}
          </button>
        </div>
      </div>

      {/* Strip Fitur Royal Blue */}
      <div className="relative z-10 bg-[#2B44FF]/95 backdrop-blur text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-3.5 text-center text-xs font-semibold sm:grid-cols-4 sm:px-6 sm:text-sm">
          <div>45+ Mentor Berpengalaman</div>
          <div>140+ Bank Soal Terkurasi</div>
          <div>Timer Tersinkron Server</div>
          <div>Pembahasan Lengkap</div>
        </div>
      </div>
    </section>
  );
}

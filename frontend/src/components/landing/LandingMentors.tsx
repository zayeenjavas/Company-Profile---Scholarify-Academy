"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { motion } from "motion/react";
import { Crown, GraduationCap } from "lucide-react";
import type { SanityMentor } from "@/src/api/sanity";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const cardBackdrops = [
  "bg-[#F6A5B8] dark:bg-rose-950/60",
  "bg-[#EEF0F4] dark:bg-slate-800/70",
  "bg-[#FBBF24] dark:bg-amber-900/60",
  "bg-[#F3F4F6] dark:bg-zinc-800/70",
  "bg-[#DBEAFE] dark:bg-blue-950/50",
];

const STUDIO_PORTRAITS: Record<string, string> = {
  aini: "/images/mentors/studio/aini.jpg",
  almas: "/images/mentors/studio/almas.jpg",
  fahreza: "/images/mentors/studio/fahreza.jpg",
  farrel: "/images/mentors/studio/farrel.jpg",
  hanief: "/images/mentors/studio/hanief.jpg",
  maldini: "/images/mentors/studio/maldini.jpg",
  nayla: "/images/mentors/studio/nayla.jpg",
  rara: "/images/mentors/studio/rara.jpg",
  rendi: "/images/mentors/studio/rendi.jpg",
  rifai: "/images/mentors/studio/rifai.jpg",
  salma: "/images/mentors/studio/salma.jpg",
  salwa: "/images/mentors/studio/salwa.jpg",
  tegar: "/images/mentors/studio/tegar.jpg",
  wildan: "/images/mentors/studio/wildan.jpg",
};

const LOCAL_PORTRAITS = new Set([
  "aini",
  "almas",
  "fahreza",
  "farrel",
  "hanief",
  "maldini",
  "nayla",
  "rara",
  "rendi",
  "rifai",
  "salma",
  "salwa",
  "tegar",
  "wildan",
]);

function resolveMentorPhoto(mentor: SanityMentor): { src: string | null; isStudio: boolean } {
  const key = mentor.nama.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  if (STUDIO_PORTRAITS[key]) {
    return { src: STUDIO_PORTRAITS[key], isStudio: true };
  }
  if (mentor.fotoUrl) {
    return { src: mentor.fotoUrl, isStudio: false };
  }
  if (LOCAL_PORTRAITS.has(key)) {
    return { src: `/images/mentors/${key}.jpg`, isStudio: false };
  }
  return { src: null, isStudio: false };
}

function isFounderRole(jabatan?: string): boolean {
  const j = (jabatan || "").toLowerCase();
  return j.includes("founder") && !j.includes("co-founder");
}

function orderFounderFirst(list: SanityMentor[]): SanityMentor[] {
  const idx = list.findIndex((m) => isFounderRole(m.jabatan));
  if (idx <= 0) return list;
  const copy = [...list];
  const [founder] = copy.splice(idx, 1);
  copy.unshift(founder);
  return copy;
}

export function LandingMentors({ mentors }: { mentors: SanityMentor[] }) {
  const [filter, setFilter] = useState<"tim-inti" | "tim-mentor" | "all">("tim-inti");
  const [isHovered, setIsHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hLenisRef = useRef<Lenis | null>(null);

  const filtered = useMemo(() => {
    if (filter === "tim-inti") {
      return orderFounderFirst(mentors.filter((m) => m.kategori === "tim-inti").slice(0, 5));
    }
    if (filter === "tim-mentor") {
      return mentors.filter((m) => m.kategori !== "tim-inti");
    }
    return orderFounderFirst(mentors);
  }, [filter, mentors]);

  // Lenis Horizontal Smooth Scroll pada track kartu
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    wrapper.scrollLeft = 0;

    const hLenis = new Lenis({
      wrapper,
      content,
      orientation: "horizontal",
      gestureOrientation: "horizontal",
      smoothWheel: true,
      duration: 1.1,
      touchMultiplier: 1.4,
    });
    hLenisRef.current = hLenis;

    const tick = (time: number) => {
      hLenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      hLenis.destroy();
      hLenisRef.current = null;
    };
  }, [filter, filtered.length]);

  // GSAP stagger entrance saat filter berubah
  useEffect(() => {
    if (!contentRef.current) return;
    const cards = contentRef.current.querySelectorAll("[data-mentor-card]");
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 16, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform",
      }
    );
  }, [filter]);

  // Auto-glide lembut menggunakan Lenis horizontal scrollTo saat tidak disentuh/hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      const wrapper = wrapperRef.current;
      const hLenis = hLenisRef.current;
      if (!wrapper || !hLenis) return;

      const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
      if (maxScroll <= 8) return;

      const nextTarget =
        wrapper.scrollLeft + 240 >= maxScroll - 8 ? 0 : wrapper.scrollLeft + 240;

      hLenis.scrollTo(nextTarget, { duration: 1.1 });
    }, 3800);

    return () => clearInterval(interval);
  }, [isHovered, filter]);

  return (
    <section
      id="tim"
      className="bg-background py-14 sm:py-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
        {/* Header + Filter Pill (Tanpa Button Geser) */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#2B44FF]">
              Tim Kami
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl leading-snug">
              Kenali Tim Pengajar{" "}
              <span className="block sm:inline">
                Berdedikasi,{" "}
                <em
                  className="italic text-[#2B44FF] underline decoration-[#FF5A4E]/60 decoration-2 underline-offset-4"
                  style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                >
                  Mentor Terbaik
                </em>
              </span>
            </h2>
          </div>

          <div className="inline-flex rounded-full border bg-muted/50 p-1 text-xs">
            {[
              { id: "tim-inti", label: "Tim Inti" },
              { id: "tim-mentor", label: "Tim Mentor" },
              { id: "all", label: "Semua" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id as any)}
                className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                  filter === t.id
                    ? "bg-[#2B44FF] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lenis Smooth Horizontal Scroll Track */}
        <div
          ref={wrapperRef}
          className="w-full max-w-full overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
        >
          <div
            ref={contentRef}
            className={`flex w-max gap-4 px-1 ${
              filter === "tim-inti" ? "lg:w-full lg:grid lg:grid-cols-5 lg:gap-5 lg:px-0" : ""
            }`}
          >
            {filtered.map((m, idx) => {
              const { src, isStudio } = resolveMentorPhoto(m);
              const founder = isFounderRole(m.jabatan);

              return (
                <motion.div
                  key={m._id}
                  data-mentor-card
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className={`flex-none ${
                    filter === "tim-inti"
                      ? "w-[220px] sm:w-[235px] lg:w-auto"
                      : "w-[220px] sm:w-[250px]"
                  }`}
                >
                  <Card
                    className={`group h-full overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md ${
                      founder ? "ring-2 ring-[#2B44FF] shadow-md" : ""
                    }`}
                  >
                    <div
                      className={`relative aspect-[3/4] w-full overflow-hidden flex items-center justify-center ${
                        cardBackdrops[idx % cardBackdrops.length]
                      }`}
                    >
                      {founder && (
                        <Badge className="absolute top-3 left-3 z-20 bg-[#2B44FF] text-white gap-1 shadow-sm">
                          <Crown className="size-3" />
                          Founder
                        </Badge>
                      )}

                      {src ? (
                        isStudio ? (
                          <img
                            src={src}
                            alt={m.nama}
                            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <>
                            <img
                              src={src}
                              alt=""
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover object-center opacity-35 blur-xl"
                            />
                            <img
                              src={src}
                              alt={m.nama}
                              className="relative z-10 h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.03] brightness-105 contrast-105"
                            />
                          </>
                        )
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-foreground/35">
                          {m.nama.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="relative border-t bg-card px-4 pb-5 pt-7 text-center">
                      <div className="absolute left-1/2 -top-4 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-card bg-[#2B44FF] text-white shadow-sm overflow-hidden">
                        {m.logoKampusUrl ? (
                          <img
                            src={m.logoKampusUrl}
                            alt={m.kampus}
                            className="h-5 w-5 rounded-full bg-white object-contain p-0.5"
                          />
                        ) : (
                          <GraduationCap className="size-4" />
                        )}
                      </div>

                      <h3 className="truncate text-sm font-bold text-foreground">{m.nama}</h3>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{m.jabatan}</p>
                      <Badge variant="secondary" className="mt-2 text-[11px] font-medium">
                        {m.kampus}
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

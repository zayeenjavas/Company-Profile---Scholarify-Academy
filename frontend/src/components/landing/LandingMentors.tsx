"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { motion } from "motion/react";
import { Crown, GraduationCap, Plus } from "lucide-react";
import type { SanityMentor } from "@/src/api/sanity";
import { Badge } from "@/components/ui/badge";

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
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-600 dark:text-muted-foreground">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#4F6BFF]" />
              TIM KAMI
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl leading-[1.15]">
              Kenali Tim Pengajar
              <span className="block">
                Berdedikasi,{" "}
                <span className="relative inline-block">
                  <em
                    className="italic font-normal text-[#4F6BFF]"
                    style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
                  >
                    Mentor Terbaik
                  </em>
                  <svg
                    viewBox="0 0 180 12"
                    fill="none"
                    className="pointer-events-none absolute -bottom-1 left-0 w-full h-2.5 text-[#FF6B4A]"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9.5C55 2.5 125 2.5 178 9.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
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
                  <div
                    className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-1.5 shadow-[0_8px_28px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_14px_34px_rgba(79,107,255,0.14)] ${
                      founder ? "ring-2 ring-[#4F6BFF]/85" : ""
                    }`}
                  >
                    <div
                      className={`relative aspect-[4/4.1] w-full overflow-hidden rounded-xl flex items-center justify-center ${
                        cardBackdrops[idx % cardBackdrops.length]
                      }`}
                    >
                      {founder && (
                        <Badge className="absolute top-2.5 left-2.5 z-20 bg-[#2B44FF] text-white gap-1 shadow-sm">
                          <Crown className="size-3" />
                          Founder
                        </Badge>
                      )}

                      {src ? (
                        isStudio ? (
                          <img
                            src={src}
                            alt={m.nama}
                            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
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

                      {/* Smooth Bell-Curve Wave Overlay flush at bottom of portrait */}
                      <svg
                        viewBox="0 0 400 44"
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute -bottom-px left-0 z-10 h-8 w-full text-white dark:text-card fill-current"
                      >
                        <path d="M0,44 L0,38 C115,38 158,6 200,6 C242,6 285,38 400,38 L400,44 Z" />
                      </svg>
                    </div>

                    <div
                      className="relative flex-1 rounded-b-xl bg-white dark:bg-card px-3 pb-3.5 pt-4 text-center"
                      style={{
                        backgroundImage:
                          "radial-gradient(rgba(148, 163, 184, 0.22) 1px, transparent 1px)",
                        backgroundSize: "10px 10px",
                      }}
                    >
                      <div className="absolute left-1/2 -top-6 z-20 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white dark:border-card bg-[#5B6CFF] text-white shadow-sm overflow-hidden">
                        {m.logoKampusUrl ? (
                          <img
                            src={m.logoKampusUrl}
                            alt={m.kampus}
                            className="h-5 w-5 rounded-full bg-white object-contain p-0.5"
                          />
                        ) : (
                          <Plus className="size-4 stroke-[2.5]" />
                        )}
                      </div>

                      <h3 className="truncate text-[15px] font-bold text-slate-900 dark:text-foreground">
                        {m.nama}
                      </h3>
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-muted-foreground">
                        {m.jabatan}
                      </p>
                      <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-muted px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-muted-foreground">
                        <GraduationCap className="size-3 text-[#5B6CFF]" />
                        {m.kampus}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Home,
  Layers,
  Menu,
  MessageSquare,
  ShieldCheck,
  User,
} from "lucide-react";
import type { UserProfile } from "@/src/types/domain";
import { ThemeToggle } from "@/src/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/program", label: "Program" },
  { href: "/tentang", label: "Tentang" },
  { href: "/tim", label: "Tim" },
  { href: "/testimoni", label: "Testimoni" },
  { href: "/berita", label: "Berita" },
  { href: "/kontak", label: "Kontak" },
];

export function LandingNavbar({ user }: { user: UserProfile | null }) {
  const pathname = usePathname();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  return (
    <>
      {/* Top Center Floating ThemeToggle (PWA Mobile Only) */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 lg:hidden [&_button]:h-9 [&_button]:w-9 [&_button]:rounded-full [&_button]:border-white/25 [&_button]:bg-slate-950/60 [&_button]:text-white [&_button]:shadow-lg [&_button]:backdrop-blur-xl [&_button:hover]:bg-slate-950/80">
        <ThemeToggle />
      </div>

      {/* Top Floating Glass Pill Navbar (Desktop Only) */}
      <div className="hidden lg:block fixed top-4 left-0 right-0 z-50 px-4">
        <header className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-3 rounded-full border border-white/20 bg-slate-950/45 px-4 text-white shadow-lg backdrop-blur-xl sm:h-14 sm:px-6">
          {/* Brand Scholarify® */}
          <Link
            href="/"
            className="flex items-center gap-1 text-lg tracking-tight text-white sm:text-xl"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            <span>Scholarify</span>
            <sup className="text-[10px] font-sans opacity-80">®</sup>
          </Link>

          {/* Center Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-white/80">
            {navLinks.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`transition-colors hover:text-white ${
                    active ? "text-white font-semibold underline decoration-[#FF6B4A] decoration-2 underline-offset-4" : ""
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Glass Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="[&_button]:h-8 [&_button]:w-8 sm:[&_button]:h-9 sm:[&_button]:w-9 [&_button]:rounded-full [&_button]:border-white/25 [&_button]:bg-white/10 [&_button]:text-white [&_button:hover]:bg-white/20">
              <ThemeToggle />
            </div>

            {user ? (
              <>
                {user.role === "ADMIN" && (
                  <Link href="/admin" className="hidden sm:inline-flex">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-full border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white gap-1.5 text-xs"
                    >
                      <ShieldCheck className="size-3.5" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/tryout" className="hidden sm:inline-flex">
                  <Button
                    size="sm"
                    className={`h-9 rounded-full bg-[#2B44FF] px-4 text-white hover:bg-[#1E34C8] gap-1.5 text-xs font-semibold shadow-sm ${
                      pathname.startsWith("/tryout") ? "ring-2 ring-white/70" : ""
                    }`}
                  >
                    Portal TryOut
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-full border-white/25 bg-white/10 px-4 text-white hover:bg-white/20 hover:text-white gap-1.5 text-xs"
                  >
                    <User className="size-3.5" />
                    Login
                  </Button>
                </Link>
                <Link href="/tryout" className="hidden sm:inline-flex">
                  <Button
                    size="sm"
                    className={`h-9 rounded-full bg-[#2B44FF] px-4 text-white hover:bg-[#1E34C8] gap-1.5 text-xs font-semibold shadow-sm ${
                      pathname.startsWith("/tryout") ? "ring-2 ring-white/70" : ""
                    }`}
                  >
                    TryOut
                    <ArrowRight className="size-3.5" />
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Drawer for Extra Sections */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-full border-white/25 bg-white/10 text-white hover:bg-white/20"
                    aria-label="Menu"
                  >
                    <Menu className="size-4" />
                  </Button>
                }
              />
              <SheetContent side="right" className="w-72 p-5">
                <SheetHeader className="mb-4 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    Scholarify
                    {user?.subscription.isActive && <Badge>Premium</Badge>}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1.5">
                  {navLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted min-h-[44px] flex items-center"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                    {user?.role === "ADMIN" && (
                      <Link href="/admin">
                        <Button variant="outline" className="w-full min-h-[44px]">
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    {!user && (
                      <Link href="/login">
                        <Button variant="outline" className="w-full min-h-[44px]">
                          Login
                        </Button>
                      </Link>
                    )}
                    <Link href="/tryout">
                      <Button className="w-full min-h-[44px] bg-[#2B44FF] hover:bg-[#1E34C8] text-white">
                        Portal TryOut
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
      </div>

      {/* Floating Bottom Glass Navigation (PWA Mobile Only) */}
      <nav
        aria-label="Navigasi Mobile"
        className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-md lg:hidden pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 items-center gap-1 rounded-full border border-white/25 bg-slate-950/70 p-1.5 text-white shadow-2xl backdrop-blur-xl">
          <Link
            href="/"
            className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors ${
              pathname === "/" ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Home className="size-4 stroke-[1.75]" />
            <span>Beranda</span>
          </Link>
          <Link
            href="/program"
            className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors ${
              pathname.startsWith("/program") ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Layers className="size-4 stroke-[1.75]" />
            <span>Program</span>
          </Link>
          <Link
            href="/tryout"
            className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full bg-[#2B44FF] text-[10px] font-semibold text-white shadow-md transition-transform active:scale-95 ${
              pathname.startsWith("/tryout") ? "ring-2 ring-white/75" : ""
            }`}
          >
            <BookOpen className="size-4 stroke-[1.75]" />
            <span>TryOut</span>
          </Link>
          <Link
            href="/kontak"
            className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors ${
              pathname.startsWith("/kontak") ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <MessageSquare className="size-4 stroke-[1.75]" />
            <span>Kontak</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            aria-label="Menu Lainnya"
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <Menu className="size-4 stroke-[1.75]" />
            <span>Lainnya</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Sheet (accessible via "Lainnya" on PWA Mobile) */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="right" className="w-72 p-5 lg:hidden">
          <SheetHeader className="mb-4 text-left">
            <div className="flex items-center justify-between gap-2 pr-6">
              <SheetTitle className="flex items-center gap-2">
                Scholarify
                {user?.subscription.isActive && <Badge>Premium</Badge>}
              </SheetTitle>
              <ThemeToggle />
            </div>
          </SheetHeader>
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileSheetOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium min-h-[44px] flex items-center transition-colors ${
                    active ? "bg-muted font-semibold text-foreground" : "hover:bg-muted"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="mt-4 flex flex-col gap-2 border-t pt-4">
              {user?.role === "ADMIN" && (
                <Link href="/admin" onClick={() => setMobileSheetOpen(false)}>
                  <Button variant="outline" className="w-full min-h-[44px]">
                    Admin Panel
                  </Button>
                </Link>
              )}
              {user && user.role !== "ADMIN" && (
                <Link href="/dashboard" onClick={() => setMobileSheetOpen(false)}>
                  <Button variant="outline" className="w-full min-h-[44px]">
                    Dashboard Saya
                  </Button>
                </Link>
              )}
              {!user && (
                <>
                  <Link href="/login" onClick={() => setMobileSheetOpen(false)}>
                    <Button variant="outline" className="w-full min-h-[44px]">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileSheetOpen(false)}>
                    <Button variant="outline" className="w-full min-h-[44px]">
                      Daftar Gratis
                    </Button>
                  </Link>
                </>
              )}
              <Link href="/tryout" onClick={() => setMobileSheetOpen(false)}>
                <Button className="w-full min-h-[44px] bg-[#2B44FF] hover:bg-[#1E34C8] text-white">
                  Portal TryOut
                </Button>
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

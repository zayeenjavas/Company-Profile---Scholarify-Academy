"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Home,
  Layers,
  Menu,
  ShieldCheck,
  User,
  Users,
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
  { href: "/tryout", label: "TryOut" },
  { href: "/tim", label: "Tim" },
  { href: "/testimoni", label: "Testimoni" },
  { href: "/berita", label: "Berita" },
  { href: "/kontak", label: "Kontak" },
];

export function LandingNavbar({ user }: { user: UserProfile | null }) {
  const pathname = usePathname();
  return (
    <>
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
                    className="h-9 rounded-full border border-white/30 bg-white/20 text-white hover:bg-white/30 gap-1.5 text-xs font-semibold backdrop-blur-md"
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
                <Link
                  href="/tryout"
                  className="hidden sm:inline-flex px-2 text-xs font-semibold text-white/95 transition-colors hover:text-white"
                >
                  TryOut
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

      {/* Floating Bottom Glass Navigation (Mobile Only) */}
      <nav
        aria-label="Navigasi Mobile"
        className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-md lg:hidden pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 items-center gap-1 rounded-full border border-white/25 bg-slate-950/65 p-1.5 text-white shadow-2xl backdrop-blur-xl">
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
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full bg-[#2B44FF] text-[10px] font-semibold text-white shadow-md transition-transform active:scale-95"
          >
            <BookOpen className="size-4 stroke-[1.75]" />
            <span>TryOut</span>
          </Link>
          <Link
            href="/tim"
            className={`flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-colors ${
              pathname.startsWith("/tim") ? "bg-white/15 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Users className="size-4 stroke-[1.75]" />
            <span>Tim</span>
          </Link>
          <Link
            href={user ? (user.role === "ADMIN" ? "/admin" : "/tryout") : "/login"}
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <User className="size-4 stroke-[1.75]" />
            <span>{user ? (user.role === "ADMIN" ? "Admin" : "Akun") : "Masuk"}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function LandingContactFooter() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <section id="kontak" className="bg-[#EEF1FF] dark:bg-muted/30 py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative flex h-80 items-end justify-center overflow-hidden rounded-3xl border bg-[#DBEAFE] px-6 pt-6 shadow-md">
              <img
                src="/images/ig-models/cutout-male-pointing.png"
                alt="Hubungi Scholarify"
                className="max-h-full w-auto object-contain object-bottom drop-shadow-md"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            <Card>
              <CardContent className="p-6 sm:p-8 space-y-5">
                <div className="space-y-1.5">
                  <Badge variant="outline" className="border-[#2B44FF]/30 text-[#2B44FF] dark:text-primary">
                    Hubungi Kami
                  </Badge>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Ada Pertanyaan Seputar{" "}
                    <span className="text-[#2B44FF]">Program &amp; TryOut?</span>
                  </h2>
                </div>

                {sent ? (
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                    Terima kasih! Pesanmu sudah dicatat. Tim kami akan segera menghubungi kamu.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">Nama Lengkap</Label>
                      <Input id="contact-name" placeholder="Nama kamu" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">Email</Label>
                      <Input id="contact-email" type="email" placeholder="email@contoh.com" required />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="contact-msg">Pesan</Label>
                      <Textarea id="contact-msg" rows={3} placeholder="Tulis pertanyaanmu..." required />
                    </div>
                    <div className="sm:col-span-2">
                      <Button
                        type="submit"
                        className="min-h-[44px] rounded-full bg-[#2B44FF] hover:bg-[#1E34C8] text-white gap-2 px-6"
                      >
                        Kirim Pesan
                        <Send className="size-4" />
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
            <Link href="/tryout" className="hover:text-foreground">
              TryOut
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Masuk
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

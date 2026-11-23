"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function LandingContactFooter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengirim pesan");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim pesan");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section id="kontak" className="bg-background py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12">
          {/* Kiri: Model Scholarify Siap Membantu */}
          <div className="lg:col-span-5">
            <div className="relative flex h-[360px] sm:h-[420px] w-full items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#EBEFFE] via-[#DCE5FF] to-[#C7D2FE] dark:from-[#131C3A] dark:via-[#19254D] dark:to-[#1E2E63] pt-6 px-4 shadow-md">
              <img
                src="/images/ig-models/model-pointing.webp"
                alt="Konsultasi & Belajar Scholarify"
                className="max-h-full w-auto object-contain object-bottom"
              />
            </div>
          </div>

          {/* Kanan: Open Editorial Contact Form (tanpa kotak Card kaku, ala referensi) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#5B6CFF]">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#5B6CFF]" />
                HUBUNGI KAMI
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-foreground sm:text-4xl leading-[1.15]">
                Kami Siap Membantu &amp;
                <span className="block">Mendengarkan Pertanyaanmu</span>
              </h2>
            </div>

            {sent ? (
              <div className="space-y-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-700 dark:text-emerald-300">
                <p>
                  Terima kasih, <strong>{name}</strong>! Pesanmu sudah tersimpan di Inbox Admin Scholarify dan akan segera kami tindak lanjuti.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/6285156540075?text=${encodeURIComponent(
                      `Halo Admin Scholarify, saya ${name} (${email}). Topik: ${subject}. ${message}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Lanjut Chat WhatsApp Admin
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setSubject("");
                      setMessage("");
                    }}
                    className="inline-flex items-center rounded-full border border-emerald-600/30 px-4 py-2 text-xs font-medium hover:bg-emerald-500/10"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="contact-name" className="text-xs font-semibold text-slate-700 dark:text-foreground">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="contact-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap kamu"
                    className="h-11 rounded-lg border-slate-200 dark:border-border bg-white dark:bg-card"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact-email" className="text-xs font-semibold text-slate-700 dark:text-foreground">
                    Email *
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com"
                    className="h-11 rounded-lg border-slate-200 dark:border-border bg-white dark:bg-card"
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="contact-subject" className="text-xs font-semibold text-slate-700 dark:text-foreground">
                    Subjek *
                  </Label>
                  <Input
                    id="contact-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Tulis topik pertanyaanmu (mis. TryOut / Mitra Sekolah / Kelas Intensif)"
                    className="h-11 rounded-lg border-slate-200 dark:border-border bg-white dark:bg-card"
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="contact-msg" className="text-xs font-semibold text-slate-700 dark:text-foreground">
                    Pesan *
                  </Label>
                  <Textarea
                    id="contact-msg"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tulis pesanmu di sini..."
                    className="rounded-lg border-slate-200 dark:border-border bg-white dark:bg-card"
                    required
                  />
                </div>
                {error && (
                  <p className="sm:col-span-2 text-xs font-medium text-destructive">{error}</p>
                )}
                <div className="pt-1 sm:col-span-2 flex items-center gap-1.5">
                  <Button
                    type="submit"
                    disabled={sending}
                    className="min-h-[42px] rounded-full bg-[#5B6CFF] hover:bg-[#4657EB] text-white px-6 text-xs font-semibold"
                  >
                    {sending ? "Mengirim..." : "Kirim Pesan"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={sending}
                    size="icon"
                    aria-label="Kirim"
                    className="h-[42px] w-[42px] rounded-full bg-[#5B6CFF] hover:bg-[#4657EB] text-white"
                  >
                    <ChevronsRight className="size-4" />
                  </Button>
                </div>
              </form>
            )}
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

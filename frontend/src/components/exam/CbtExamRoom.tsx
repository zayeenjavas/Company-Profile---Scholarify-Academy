"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  CloudOff,
  Flag,
  LayoutGrid,
  Loader2,
  Send,
} from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { SubmitSessionResponseDto, UpsertAnswerResponseDto } from "@/src/api/contracts";
import type { ExamQuestion, ExamSessionInfo, StudentAnswerState } from "@/src/types/domain";
import {
  clearAnswerQueue,
  flushAnswerQueue,
  loadQueuedAnswers,
  removeQueuedAnswer,
  saveQueuedAnswer,
} from "@/src/utils/answerQueue";
import { ThemeToggle } from "@/src/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RichMathText } from "@/src/components/common/RichMathText";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type SyncState = "saved" | "saving" | "offline";

interface CbtExamRoomProps {
  batchSlug: string;
  session: ExamSessionInfo;
  questions: ExamQuestion[];
  initialAnswers: StudentAnswerState[];
}

export function CbtExamRoom({
  batchSlug,
  session,
  questions,
  initialAnswers,
}: CbtExamRoomProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { selectedLabel: string | null; isFlagged: boolean }>>(() => {
    const map: Record<string, { selectedLabel: string | null; isFlagged: boolean }> = {};
    for (const a of initialAnswers) {
      map[a.questionId] = { selectedLabel: a.selectedLabel, isFlagged: a.isFlagged };
    }
    const queued = loadQueuedAnswers(session.id);
    for (const q of Object.values(queued)) {
      map[q.questionId] = { selectedLabel: q.selectedLabel, isFlagged: q.isFlagged };
    }
    return map;
  });

  const [syncState, setSyncState] = useState<SyncState>("saved");
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasAutoSubmittedRef = useRef(false);

  // Hitung offset waktu server agar timer tidak bisa dimanipulasi / reset saat refresh
  const serverOffsetMs = useMemo(() => {
    return Date.parse(session.serverNow) - Date.now();
  }, [session.serverNow]);

  const expiresAtMs = useMemo(() => {
    return session.expiresAt ? Date.parse(session.expiresAt) : Date.now() + 30 * 60_000;
  }, [session.expiresAt]);

  const calcSecondsLeft = useCallback(() => {
    const nowServerMs = Date.now() + serverOffsetMs;
    return Math.max(0, Math.floor((expiresAtMs - nowServerMs) / 1000));
  }, [expiresAtMs, serverOffsetMs]);

  const [secondsLeft, setSecondsLeft] = useState<number>(calcSecondsLeft);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await flushAnswerQueue(session.id);
      await apiRequest<SubmitSessionResponseDto>(`/sessions/${session.id}/submit`, {
        method: "POST",
      });
      clearAnswerQueue(session.id);
      router.replace(`/tryout/${batchSlug}/do?submitted=${session.subtestCode}`);
    } catch (error) {
      console.error("Submit failed:", error);
      setIsSubmitting(false);
      hasAutoSubmittedRef.current = false;
      alert("Gagal mengirim ujian. Pastikan koneksi internet aktif lalu coba lagi.");
    }
  }, [batchSlug, isSubmitting, router, session.id, session.subtestCode]);

  // Countdown tersinkron waktu server
  useEffect(() => {
    const interval = setInterval(() => {
      const next = calcSecondsLeft();
      setSecondsLeft(next);
      if (next <= 0 && !hasAutoSubmittedRef.current) {
        hasAutoSubmittedRef.current = true;
        handleSubmit();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [calcSecondsLeft, handleSubmit]);

  // Retry queue otomatis saat koneksi online kembali
  useEffect(() => {
    const onOnline = async () => {
      setSyncState("saving");
      const { remaining } = await flushAnswerQueue(session.id);
      setSyncState(remaining === 0 ? "saved" : "offline");
    };
    window.addEventListener("online", onOnline);
    onOnline();
    return () => window.removeEventListener("online", onOnline);
  }, [session.id]);

  const persistAnswer = useCallback(
    async (questionId: string, selectedLabel: string | null, isFlagged: boolean) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: { selectedLabel, isFlagged },
      }));

      saveQueuedAnswer({
        sessionId: session.id,
        questionId,
        selectedLabel,
        isFlagged,
        updatedAt: Date.now(),
      });

      setSyncState("saving");
      try {
        await apiRequest<UpsertAnswerResponseDto>(
          `/sessions/${session.id}/answers/${questionId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              selected_label: selectedLabel,
              is_flagged: isFlagged,
            }),
          }
        );
        removeQueuedAnswer(session.id, questionId);
        const remaining = Object.keys(loadQueuedAnswers(session.id)).length;
        setSyncState(remaining === 0 ? "saved" : "offline");
      } catch {
        setSyncState("offline");
      }
    },
    [session.id]
  );

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  // Shortcut keyboard A-E & ArrowLeft/ArrowRight
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!currentQuestion || showConfirmModal) return;
      const key = e.key.toUpperCase();
      if (["A", "B", "C", "D", "E"].includes(key)) {
        const exists = currentQuestion.choices.some((c) => c.label === key);
        if (exists) {
          persistAnswer(currentQuestion.id, key, currentAnswer?.isFlagged ?? false);
        }
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentAnswer?.isFlagged, currentQuestion, persistAnswer, questions.length, showConfirmModal]);

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return h > 0 ? `${h.toString().padStart(2, "0")}:${m}:${s}` : `${m}:${s}`;
  };

  const timerTone =
    secondsLeft < 60
      ? "text-destructive border-destructive/40 bg-destructive/10"
      : secondsLeft < 300
      ? "text-amber-600 dark:text-amber-400 border-amber-500/40 bg-amber-500/10"
      : "text-foreground border-border bg-muted/50";

  const answeredCount = Object.values(answers).filter((a) => Boolean(a.selectedLabel)).length;
  const flaggedCount = Object.values(answers).filter((a) => a.isFlagged).length;

  const navigatorGrid = (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const state = answers[q.id];
          const isCurrent = idx === currentIndex;
          const isFlagged = state?.isFlagged;
          const isAnswered = Boolean(state?.selectedLabel);

          let tone = "bg-muted text-muted-foreground border-transparent";
          if (isFlagged) {
            tone = "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50";
          } else if (isAnswered) {
            tone = "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/50";
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setCurrentIndex(idx);
                setShowMobileNav(false);
              }}
              className={`min-h-[44px] rounded-lg border text-xs font-semibold tabular-nums transition-colors ${tone} ${
                isCurrent ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t pt-3 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500/30 border border-emerald-500/50" />
          Terjawab ({answeredCount})
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-500/30 border border-amber-500/50" />
          Ragu ({flaggedCount})
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-muted border" />
          Kosong ({questions.length - answeredCount})
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded ring-2 ring-primary" />
          Aktif
        </div>
      </div>
    </div>
  );

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Sticky Focus Header */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:px-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[11px] sm:text-xs font-medium text-muted-foreground">
                {session.subtestCode} · {currentIndex + 1}/{questions.length}
              </p>
              {/* Compact sync dot/label on mobile */}
              <span
                className="inline-flex sm:hidden items-center gap-1 text-[10px] font-medium"
                title={
                  syncState === "saving"
                    ? "Menyimpan..."
                    : syncState === "offline"
                    ? "Offline - Antre Sync"
                    : "Tersimpan"
                }
              >
                {syncState === "saving" ? (
                  <Loader2 className="size-3 animate-spin text-muted-foreground" />
                ) : syncState === "offline" ? (
                  <CloudOff className="size-3 text-amber-500" />
                ) : (
                  <CheckCircle2 className="size-3 text-emerald-500" />
                )}
              </span>
            </div>
            <h1 className="truncate text-xs font-semibold sm:text-base">
              {session.subtestTitle}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Badge variant="outline" className="hidden sm:inline-flex gap-1.5 py-1">
              {syncState === "saving" ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  Menyimpan...
                </>
              ) : syncState === "offline" ? (
                <>
                  <CloudOff className="size-3 text-amber-500" />
                  Offline - Antre Sync
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  Tersimpan
                </>
              )}
            </Badge>

            <div className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs sm:text-sm font-bold tabular-nums ${timerTone}`}>
              <Clock className="size-3.5 sm:size-4 stroke-[1.75]" />
              {formatTimer(secondsLeft)}
            </div>

            <ThemeToggle />

            <Button
              size="sm"
              onClick={() => setShowConfirmModal(true)}
              disabled={isSubmitting}
              className="h-9 sm:min-h-[40px] px-2.5 sm:px-3 gap-1.5 text-xs"
            >
              <Send className="size-3.5" />
              <span className="hidden sm:inline">Kumpulkan</span>
            </Button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 w-full bg-muted">
          <div
            className="h-full bg-[#5B6CFF] transition-all duration-300"
            style={{ width: `${questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0}%` }}
          />
        </div>
      </header>

      {syncState === "offline" && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-1.5 text-center text-[11px] font-medium text-amber-700 dark:text-amber-300 sm:hidden">
          Koneksi terputus — jawaban disimpan lokal &amp; akan disinkronkan otomatis.
        </div>
      )}

      {/* Body 2-Kolom */}
      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-4 sm:gap-6 px-3 pt-4 pb-24 sm:px-6 sm:py-6 lg:grid-cols-12">
        {/* Area Soal */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Card className="flex-1">
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <Badge variant="secondary" className="tabular-nums text-xs">
                  Nomor {currentIndex + 1} · Bobot {currentQuestion.weight}
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileNav((v) => !v)}
                  className="lg:hidden gap-1.5 h-9 text-xs"
                >
                  <LayoutGrid className="size-3.5" />
                  Nomor ({answeredCount}/{questions.length})
                </Button>
              </div>

              <div className="max-w-prose space-y-4 text-sm leading-relaxed sm:text-base overflow-x-auto">
                <div className="leading-relaxed">
                  <RichMathText text={currentQuestion.stemContent} />
                </div>
                {currentQuestion.imageUrl && (
                  <img
                    src={currentQuestion.imageUrl}
                    alt={`Gambar Soal ${currentIndex + 1}`}
                    className="max-h-72 sm:max-h-96 w-full rounded-lg border object-contain"
                  />
                )}
              </div>

              <div className="space-y-2.5 pt-2">
                {currentQuestion.choices.map((choice) => {
                  const selected = currentAnswer?.selectedLabel === choice.label;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() =>
                        persistAnswer(
                          currentQuestion.id,
                          choice.label,
                          currentAnswer?.isFlagged ?? false
                        )
                      }
                      className={`flex w-full min-h-[48px] items-start gap-3 rounded-xl border p-3.5 text-left text-sm transition-colors active:scale-[0.99] ${
                        selected
                          ? "border-primary bg-primary/10 font-medium text-foreground"
                          : "border-border bg-card hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {choice.label}
                      </span>
                      <span className="pt-0.5 leading-relaxed min-w-0 overflow-x-auto">
                        <RichMathText text={choice.content} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Footer Aksi (Sticky bottom on mobile for thumb reachability) */}
          <div className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 lg:flex lg:justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                className="min-h-[44px] gap-1.5 text-xs sm:text-sm justify-center"
              >
                <ArrowLeft className="size-4 shrink-0" />
                <span className="truncate">Sebelumnya</span>
              </Button>

              <Button
                type="button"
                variant={currentAnswer?.isFlagged ? "default" : "outline"}
                onClick={() =>
                  persistAnswer(
                    currentQuestion.id,
                    currentAnswer?.selectedLabel ?? null,
                    !(currentAnswer?.isFlagged ?? false)
                  )
                }
                className="min-h-[44px] px-3 gap-1.5 text-xs sm:text-sm"
                title={currentAnswer?.isFlagged ? "Ditandai Ragu" : "Ragu-ragu"}
              >
                <Flag className="size-4 shrink-0" />
                <span className="hidden sm:inline">
                  {currentAnswer?.isFlagged ? "Ditandai Ragu" : "Ragu-ragu"}
                </span>
                <span className="sm:hidden">Ragu</span>
              </Button>

              {currentIndex === questions.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setShowConfirmModal(true)}
                  className="min-h-[44px] gap-1.5 text-xs sm:text-sm justify-center"
                >
                  <span>Kumpulkan</span>
                  <Send className="size-4 shrink-0" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                  className="min-h-[44px] gap-1.5 text-xs sm:text-sm justify-center"
                >
                  <span className="truncate">Berikutnya</span>
                  <ArrowRight className="size-4 shrink-0" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Navigator */}
        <aside className="hidden lg:block lg:col-span-4">
          <Card className="sticky top-22">
            <CardContent className="p-4 space-y-3">
              <h2 className="text-sm font-semibold">Navigasi Nomor Soal</h2>
              {navigatorGrid}
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* Mobile Drawer Navigator (shadcn Sheet) */}
      <Sheet open={showMobileNav} onOpenChange={setShowMobileNav}>
        <SheetContent side="bottom" className="max-h-[78vh] overflow-y-auto rounded-t-2xl p-5 lg:hidden">
          <SheetHeader className="mb-4 text-left">
            <SheetTitle>Navigasi Nomor Soal</SheetTitle>
          </SheetHeader>
          {navigatorGrid}
        </SheetContent>
      </Sheet>

      {/* Modal Konfirmasi Kumpulkan (shadcn Dialog) */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
              Konfirmasi Pengumpulan Ujian
            </DialogTitle>
            <DialogDescription>
              Kamu telah menjawab{" "}
              <strong className="text-foreground tabular-nums">
                {answeredCount} dari {questions.length}
              </strong>{" "}
              soal. Setelah dikumpulkan, sesi akan dinilai otomatis dan tidak dapat diubah lagi.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              disabled={isSubmitting}
              className="min-h-[44px]"
            >
              Kembali Mengerjakan
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Menilai...
                </>
              ) : (
                "Ya, Kumpulkan Sekarang"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

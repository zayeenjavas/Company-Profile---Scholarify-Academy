"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { ExamReviewItemDto } from "@/src/api/contracts";
import { mapReviewItemDto } from "@/src/api/mappers";
import { toErrorMessage } from "@/src/api/errors";
import type { ExamReviewItem } from "@/src/types/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RichMathText } from "@/src/components/common/RichMathText";

export default function ExamReviewPage() {
  const params = useParams<{ sessionId: string }>();
  const [items, setItems] = useState<ExamReviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiRequest<{ items: ExamReviewItemDto[] }>(
          `/sessions/${params.sessionId}/review`
        );
        setItems(res.items.map(mapReviewItemDto));
      } catch (err) {
        setError(toErrorMessage(err, "Gagal memuat pembahasan"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.sessionId]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pembahasan & Kunci Jawaban</h1>
            <p className="text-sm text-muted-foreground">
              Review lengkap per nomor soal setelah sesi dinilai.
            </p>
          </div>
          <Link href="/tryout">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="size-4" />
              Kembali
            </Button>
          </Link>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Memuat pembahasan...</p>
        ) : error ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold tabular-nums">
                      Soal #{idx + 1}
                    </CardTitle>
                    {item.isCorrect ? (
                      <Badge className="gap-1">
                        <CheckCircle2 className="size-3.5" />
                        Benar
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="size-3.5" />
                        {item.selectedLabel ? "Salah" : "Kosong"}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="leading-relaxed">
                    <RichMathText text={item.stemContent} />
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {item.choices.map((ch) => {
                      const isCorrect = ch.label === item.correctLabel;
                      const isSelected = ch.label === item.selectedLabel;
                      return (
                        <div
                          key={ch.id}
                          className={`rounded-lg border px-3 py-2 text-xs ${
                            isCorrect
                              ? "border-emerald-500/60 bg-emerald-500/10 font-medium"
                              : isSelected
                              ? "border-destructive/60 bg-destructive/10"
                              : "border-border"
                          }`}
                        >
                          <strong>{ch.label}.</strong> <RichMathText text={ch.content} />
                        </div>
                      );
                    })}
                  </div>
                  {item.explanation && (
                    <div className="rounded-lg border bg-muted/40 p-3 text-xs leading-relaxed">
                      <strong>Pembahasan:</strong> <RichMathText text={item.explanation} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

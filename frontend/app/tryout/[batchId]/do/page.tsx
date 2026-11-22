"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, Lock } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { ExamResultDto, SubtestDto, TryoutPackageDto } from "@/src/api/contracts";
import { mapPackageDto, mapResultDto, mapSubtestDto } from "@/src/api/mappers";
import type { ExamResultSummary, SubtestInfo, TryoutPackage } from "@/src/types/domain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PackageSubtestsPage() {
  const params = useParams<{ batchId: string }>();
  const router = useRouter();
  const batchSlug = params.batchId;

  const [pkg, setPkg] = useState<TryoutPackage | null>(null);
  const [subtests, setSubtests] = useState<SubtestInfo[]>([]);
  const [results, setResults] = useState<ExamResultSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, sRes, rRes] = await Promise.all([
          apiRequest<{ packages: TryoutPackageDto[] }>("/packages"),
          apiRequest<{ subtests: SubtestDto[] }>("/subtests"),
          apiRequest<{ results: ExamResultDto[] }>("/results").catch(() => ({ results: [] })),
        ]);
        const found = pRes.packages
          .map(mapPackageDto)
          .find((p) => p.slug === batchSlug || p.id === batchSlug);

        if (!found) {
          router.replace("/tryout");
          return;
        }
        setPkg(found);
        setSubtests(sRes.subtests.map(mapSubtestDto));
        setResults(rRes.results.map(mapResultDto).filter((r) => r.packageSlug === found.slug));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [batchSlug, router]);

  if (loading || !pkg) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Memuat daftar subtest...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Pilih Subtest</p>
            <h1 className="text-2xl font-bold tracking-tight">{pkg.title}</h1>
          </div>
          <Link href="/tryout">
            <Button variant="outline" size="sm" className="min-h-[40px] gap-1.5">
              <ArrowLeft className="size-4" />
              Kembali ke Daftar
            </Button>
          </Link>
        </div>

        {!pkg.isAccessible ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Lock className="size-8 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Paket Khusus Langganan Premium</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                Silakan masuk dengan akun yang memiliki langganan Premium aktif untuk mengerjakan paket ini.
              </p>
              <Link href="/login">
                <Button className="min-h-[44px]">Masuk / Aktivasi</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subtests.map((st) => {
              const result = results.find((r) => r.subtestCode === st.code);
              return (
                <Card key={st.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{st.code}</Badge>
                      {result ? (
                        <Badge className="gap-1 tabular-nums">
                          <CheckCircle2 className="size-3" />
                          Skor: {Math.round(result.totalScore)}
                        </Badge>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                          <Clock className="size-3.5" />
                          {st.durationMinutes} menit
                        </span>
                      )}
                    </div>
                    <CardTitle className="pt-2 text-base">{st.title}</CardTitle>
                    <CardDescription>{st.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="border-t pt-4">
                    {result ? (
                      <Link href={`/tryout/review/${result.sessionId}`} className="w-full">
                        <Button variant="outline" className="w-full min-h-[44px] gap-1.5">
                          <FileText className="size-4" />
                          Lihat Pembahasan
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/tryout/${pkg.slug}/${st.code.toLowerCase()}`} className="w-full">
                        <Button className="w-full min-h-[44px] gap-1.5">
                          Mulai Subtest
                          <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

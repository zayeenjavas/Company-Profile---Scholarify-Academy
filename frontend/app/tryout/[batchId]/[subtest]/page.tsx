"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type {
  StartSessionResponseDto,
  SubtestDto,
  TryoutPackageDto,
} from "@/src/api/contracts";
import { toErrorMessage } from "@/src/api/errors";
import { mapAnswerDto, mapQuestionDto, mapSessionDto } from "@/src/api/mappers";
import type { ExamQuestion, ExamSessionInfo, StudentAnswerState } from "@/src/types/domain";
import { CbtExamRoom } from "@/src/components/exam/CbtExamRoom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ExamRunnerPage() {
  const params = useParams<{ batchId: string; subtest: string }>();
  const router = useRouter();

  const [session, setSession] = useState<ExamSessionInfo | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [answers, setAnswers] = useState<StudentAnswerState[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startExam = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          apiRequest<{ packages: TryoutPackageDto[] }>("/packages"),
          apiRequest<{ subtests: SubtestDto[] }>("/subtests"),
        ]);

        const pkg = pRes.packages.find(
          (p) => p.slug === params.batchId || p.id === params.batchId
        );
        const sub = sRes.subtests.find(
          (s) => s.code.toLowerCase() === params.subtest.toLowerCase() || s.id === params.subtest
        );

        if (!pkg || !sub) {
          setErrorMsg("Paket atau subtest tidak ditemukan.");
          return;
        }

        const started = await apiRequest<StartSessionResponseDto>("/sessions/start", {
          method: "POST",
          body: JSON.stringify({
            package_id: pkg.id,
            subtest_id: sub.id,
          }),
        });

        setSession(mapSessionDto(started.session));
        setQuestions(started.questions.map(mapQuestionDto));
        setAnswers(started.answers.map(mapAnswerDto));
      } catch (err: any) {
        if (err?.status === 401) {
          router.replace(`/login?from=/tryout/${params.batchId}/${params.subtest}`);
          return;
        }
        setErrorMsg(toErrorMessage(err, "Gagal memulai sesi ujian"));
      } finally {
        setLoading(false);
      }
    };

    startExam();
  }, [params.batchId, params.subtest, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Menyiapkan ruang ujian...
      </div>
    );
  }

  if (errorMsg || !session || questions.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <h1 className="text-lg font-bold">Tidak Dapat Memulai Subtest</h1>
            <p className="text-sm text-muted-foreground">
              {errorMsg || "Belum ada soal pada subtest ini."}
            </p>
            <Link href={`/tryout/${params.batchId}/do`}>
              <Button className="min-h-[44px]">Kembali ke Daftar Subtest</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <CbtExamRoom
      batchSlug={params.batchId}
      session={session}
      questions={questions}
      initialAnswers={answers}
    />
  );
}

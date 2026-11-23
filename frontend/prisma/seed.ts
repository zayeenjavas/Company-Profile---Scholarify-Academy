import { ExamSessionStatus, PackageStatus, PrismaClient, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { BANK_SOAL_BY_SUBTEST } from "./seed-bank-soal";

const prisma = new PrismaClient();
const LABELS = ["A", "B", "C", "D", "E"] as const;
const SUBTEST_CODES = ["PU", "PPU", "PBM", "PK", "LBI", "LBE", "PM"] as const;

interface StudentSeedSpec {
  username: string;
  name: string;
  email: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  daysOffset?: number;
}

const EXTRA_STUDENTS: StudentSeedSpec[] = [
  { username: "nadia_putri", name: "Nadia Putri Maharani", email: "nadia@scholarify.id", plan: "PREMIUM", status: "ACTIVE", daysOffset: 120 },
  { username: "raihan_pratama", name: "Raihan Pratama", email: "raihan@scholarify.id", plan: "PREMIUM", status: "ACTIVE", daysOffset: 60 },
  { username: "aisyah_zahra", name: "Aisyah Zahra", email: "aisyah@scholarify.id", plan: "PREMIUM", status: "ACTIVE", daysOffset: 45 },
  { username: "bima_kusuma", name: "Bima Kusuma Wijaya", email: "bima@scholarify.id", plan: "FREE", status: "NONE" },
  { username: "clara_wijaya", name: "Clara Wijaya", email: "clara@scholarify.id", plan: "PREMIUM", status: "ACTIVE", daysOffset: 90 },
  { username: "dimas_aditya", name: "Dimas Aditya", email: "dimas@scholarify.id", plan: "PREMIUM", status: "EXPIRED", daysOffset: -10 },
  { username: "fiona_hartono", name: "Fiona Hartono", email: "fiona@scholarify.id", plan: "FREE", status: "NONE" },
  { username: "gilang_ramadhan", name: "Gilang Ramadhan", email: "gilang@scholarify.id", plan: "PREMIUM", status: "ACTIVE", daysOffset: 30 },
  { username: "hana_lestari", name: "Hana Lestari", email: "hana@scholarify.id", plan: "FREE", status: "NONE" },
  { username: "iqbal_maulana", name: "Iqbal Maulana", email: "iqbal@scholarify.id", plan: "PREMIUM", status: "ACTIVE", daysOffset: 75 },
];

interface PackageSeedSpec {
  slug: string;
  title: string;
  description: string;
  tier: SubscriptionPlan;
  status: PackageStatus;
  durationMinutes: number;
  openAt: Date;
  closeAt: Date;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  allowReview: boolean;
  questionsPerSubtest: number;
}

const NOW = Date.now();
const DAY_MS = 86400000;

const PACKAGES_SEED: PackageSeedSpec[] = [
  {
    slug: "batch-1",
    title: "TryOut SNBT Batch 1 (Gratis)",
    description: "Simulasi UTBK-SNBT gratis terbuka untuk mengukur kesiapan awal di seluruh subtes TPS & Literasi.",
    tier: "FREE",
    status: "PUBLISHED",
    durationMinutes: 90,
    openAt: new Date(NOW - 30 * DAY_MS),
    closeAt: new Date("2027-12-31T23:59:59Z"),
    shuffleQuestions: false,
    shuffleChoices: false,
    allowReview: true,
    questionsPerSubtest: 5,
  },
  {
    slug: "batch-2",
    title: "TryOut SNBT Batch 2 — Intensif TPS & Literasi",
    description: "Paket tryout berstandar HOTS UTBK dengan pembahasan lengkap di setiap nomor.",
    tier: "PREMIUM",
    status: "PUBLISHED",
    durationMinutes: 195,
    openAt: new Date(NOW - 14 * DAY_MS),
    closeAt: new Date("2027-12-31T23:59:59Z"),
    shuffleQuestions: true,
    shuffleChoices: true,
    allowReview: true,
    questionsPerSubtest: 5,
  },
  {
    slug: "batch-3",
    title: "TryOut SNBT Batch 3 — Simulasi Nasional UTBK",
    description: "Simulasi nasional dengan komposisi soal terbaru dan bobot penilaian terkalibrasi.",
    tier: "PREMIUM",
    status: "PUBLISHED",
    durationMinutes: 195,
    openAt: new Date(NOW - 7 * DAY_MS),
    closeAt: new Date("2027-12-31T23:59:59Z"),
    shuffleQuestions: true,
    shuffleChoices: true,
    allowReview: true,
    questionsPerSubtest: 5,
  },
  {
    slug: "batch-4",
    title: "TryOut SNBT Batch 4 — Final Tryout Akbar",
    description: "Pemantapan akhir menjelang UTBK-SNBT untuk menguji kecepatan dan ketepatan pengerjaan.",
    tier: "PREMIUM",
    status: "PUBLISHED",
    durationMinutes: 195,
    openAt: new Date(NOW - 2 * DAY_MS),
    closeAt: new Date("2027-12-31T23:59:59Z"),
    shuffleQuestions: true,
    shuffleChoices: true,
    allowReview: true,
    questionsPerSubtest: 5,
  },
  {
    slug: "paket-mini-gratis",
    title: "Mini TryOut Diagnostik TPS Gratis",
    description: "Tryout singkat 45 menit untuk pemetaan cepat kekuatan dan kelemahan tiap subtes.",
    tier: "FREE",
    status: "PUBLISHED",
    durationMinutes: 45,
    openAt: new Date(NOW - 10 * DAY_MS),
    closeAt: new Date("2027-12-31T23:59:59Z"),
    shuffleQuestions: false,
    shuffleChoices: true,
    allowReview: true,
    questionsPerSubtest: 3,
  },
  {
    slug: "batch-5-draft",
    title: "TryOut SNBT Batch 5 — Persiapan Khusus (Draft)",
    description: "Paket lanjutan yang sedang disiapkan tim kurikulum Scholarify.",
    tier: "PREMIUM",
    status: "DRAFT",
    durationMinutes: 195,
    openAt: new Date(NOW + 14 * DAY_MS),
    closeAt: new Date("2027-12-31T23:59:59Z"),
    shuffleQuestions: true,
    shuffleChoices: true,
    allowReview: true,
    questionsPerSubtest: 2,
  },
  {
    slug: "tryout-arsip-2025",
    title: "TryOut Evaluasi Awal 2025",
    description: "Arsip paket evaluasi awal gelombang sebelumnya untuk referensi latihan.",
    tier: "FREE",
    status: "ARCHIVED",
    durationMinutes: 90,
    openAt: new Date("2025-01-01T00:00:00Z"),
    closeAt: new Date("2025-12-31T23:59:59Z"),
    shuffleQuestions: false,
    shuffleChoices: false,
    allowReview: true,
    questionsPerSubtest: 2,
  },
];

async function main() {
  const defaultAdminPassword = await bcrypt.hash("ScholarifyBarokah!", 10);
  const defaultStudentPassword = await bcrypt.hash("siswa123", 10);

  // 1. Seed default Admin & Demo Accounts (Free vs Premium) + 10 Mahasiswa/Siswa Aktif
  await prisma.user.upsert({
    where: { username: "admin_scholarify" },
    update: { passwordHash: defaultAdminPassword, role: "ADMIN", isActive: true },
    create: {
      username: "admin_scholarify",
      name: "Admin Scholarify",
      email: "admin@scholarify.id",
      passwordHash: defaultAdminPassword,
      role: "ADMIN",
      isActive: true,
      subscription: { create: { plan: "PREMIUM", status: "ACTIVE" } },
    },
  });

  await prisma.user.upsert({
    where: { username: "siswa_free" },
    update: {},
    create: {
      username: "siswa_free",
      name: "Siswa Gratis",
      email: "free@scholarify.id",
      passwordHash: defaultStudentPassword,
      role: "STUDENT",
      isActive: true,
      subscription: { create: { plan: "FREE", status: "NONE" } },
    },
  });

  await prisma.user.upsert({
    where: { username: "siswa_premium" },
    update: {},
    create: {
      username: "siswa_premium",
      name: "Siswa Langganan",
      email: "premium@scholarify.id",
      passwordHash: defaultStudentPassword,
      role: "STUDENT",
      isActive: true,
      subscription: {
        create: {
          plan: "PREMIUM",
          status: "ACTIVE",
          expiresAt: new Date(NOW + 90 * DAY_MS),
        },
      },
    },
  });

  for (const s of EXTRA_STUDENTS) {
    await prisma.user.upsert({
      where: { username: s.username },
      update: {},
      create: {
        username: s.username,
        name: s.name,
        email: s.email,
        passwordHash: defaultStudentPassword,
        role: "STUDENT",
        isActive: true,
        subscription: {
          create: {
            plan: s.plan,
            status: s.status,
            expiresAt: typeof s.daysOffset === "number" ? new Date(NOW + s.daysOffset * DAY_MS) : null,
          },
        },
      },
    });
  }

  // 2. Seed 7 Subtest UTBK Standar
  const subtestsSeed = [
    { code: "PU", title: "Penalaran Umum", description: "Kemampuan logis, analitis, dan kuantitatif dasar", durationMinutes: 30, questionCount: 30 },
    { code: "PPU", title: "Pengetahuan & Pemahaman Umum", description: "Wawasan umum dan pemahaman sosial-budaya", durationMinutes: 15, questionCount: 20 },
    { code: "PBM", title: "Pemahaman Bacaan & Menulis", description: "Pemahaman teks dan penulisan efektif", durationMinutes: 25, questionCount: 20 },
    { code: "PK", title: "Pengetahuan Kuantitatif", description: "Kemampuan numerik dan hitungan dasar", durationMinutes: 20, questionCount: 20 },
    { code: "LBI", title: "Literasi Bahasa Indonesia", description: "Literasi dan pemahaman teks bahasa Indonesia", durationMinutes: 42.5, questionCount: 30 },
    { code: "LBE", title: "Literasi Bahasa Inggris", description: "Pemahaman teks akademik bahasa Inggris", durationMinutes: 30, questionCount: 20 },
    { code: "PM", title: "Penalaran Matematika", description: "Penalaran dan pemecahan masalah matematis", durationMinutes: 42.5, questionCount: 20 },
  ];

  const subtestByCode = new Map<string, string>();
  for (const st of subtestsSeed) {
    const saved = await prisma.subtest.upsert({
      where: { code: st.code },
      update: {
        title: st.title,
        description: st.description,
        durationMinutes: st.durationMinutes,
        questionCount: st.questionCount,
      },
      create: st,
    });
    subtestByCode.set(st.code, saved.id);
  }

  // 3. Upsert Tryout Packages (lengkap FREE, PREMIUM, PUBLISHED, DRAFT, ARCHIVED)
  const packageBySlug = new Map<string, { id: string; spec: PackageSeedSpec }>();
  for (const spec of PACKAGES_SEED) {
    const saved = await prisma.tryoutPackage.upsert({
      where: { slug: spec.slug },
      update: {
        title: spec.title,
        description: spec.description,
        tier: spec.tier,
        status: spec.status,
        durationMinutes: spec.durationMinutes,
        openAt: spec.openAt,
        closeAt: spec.closeAt,
        shuffleQuestions: spec.shuffleQuestions,
        shuffleChoices: spec.shuffleChoices,
        allowReview: spec.allowReview,
      },
      create: {
        slug: spec.slug,
        title: spec.title,
        description: spec.description,
        tier: spec.tier,
        status: spec.status,
        durationMinutes: spec.durationMinutes,
        openAt: spec.openAt,
        closeAt: spec.closeAt,
        shuffleQuestions: spec.shuffleQuestions,
        shuffleChoices: spec.shuffleChoices,
        allowReview: spec.allowReview,
      },
    });
    packageBySlug.set(spec.slug, { id: saved.id, spec });
  }

  // 4. Import legacy quiz_data_utf8.json ke batch-1 jika batch-1 masih kosong
  const batch1 = packageBySlug.get("batch-1")!;
  const batch1QuestionCount = await prisma.question.count({ where: { packageId: batch1.id } });
  const legacyQuizPath = path.resolve(process.cwd(), "..", "backend", "quiz_data_utf8.json");
  if (batch1QuestionCount === 0 && fs.existsSync(legacyQuizPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(legacyQuizPath, "utf-8")) as Array<{
        model: string;
        pk: number;
        fields: Record<string, unknown>;
      }>;
      const legacySubtestPkToCode = new Map<number, string>();
      for (const item of raw) {
        if (item.model === "quiz.subtest") {
          legacySubtestPkToCode.set(item.pk, String(item.fields.code).toUpperCase());
        }
      }
      let orderCounter = 1;
      for (const item of raw) {
        if (item.model === "quiz.soal") {
          const code = legacySubtestPkToCode.get(Number(item.fields.subtest)) || "PU";
          const subtestId = subtestByCode.get(code);
          if (!subtestId) continue;
          const correct = String(item.fields.correct_answer || "A").toUpperCase();
          const imageUrl = item.fields.soal_image ? `/media/${item.fields.soal_image}` : null;
          await prisma.question.create({
            data: {
              packageId: batch1.id,
              subtestId,
              orderNo: orderCounter++,
              stemContent: String(item.fields.soal_text || ""),
              imageUrl,
              questionType: "PG",
              weight: 1,
              choices: {
                create: [
                  { label: "A", content: String(item.fields.option_a || "-"), isCorrect: correct === "A" },
                  { label: "B", content: String(item.fields.option_b || "-"), isCorrect: correct === "B" },
                  { label: "C", content: String(item.fields.option_c || "-"), isCorrect: correct === "C" },
                  { label: "D", content: String(item.fields.option_d || "-"), isCorrect: correct === "D" },
                  { label: "E", content: String(item.fields.option_e || "-"), isCorrect: correct === "E" },
                ],
              },
            },
          });
        }
      }
    } catch (err) {
      console.warn("Legacy import skipped due to error:", err);
    }
  }

  // 5. Generate Bank Soal lengkap untuk setiap paket yang belum memiliki soal
  let createdQuestionsCount = 0;
  for (const [slug, { id: packageId, spec }] of packageBySlug.entries()) {
    const existingCount = await prisma.question.count({ where: { packageId } });
    if (existingCount > 0) continue;

    let orderCounter = 1;
    for (const code of SUBTEST_CODES) {
      const subtestId = subtestByCode.get(code);
      if (!subtestId) continue;

      const templates = BANK_SOAL_BY_SUBTEST[code];
      const countToCreate = Math.min(spec.questionsPerSubtest, templates.length);
      for (let i = 0; i < countToCreate; i++) {
        const tpl = templates[i];
        await prisma.question.create({
          data: {
            packageId,
            subtestId,
            orderNo: orderCounter++,
            stemContent: `[${slug.toUpperCase()} • ${code} #${i + 1}] ${tpl.stemContent}`,
            questionType: "PG",
            weight: tpl.weight,
            explanation: tpl.explanation,
            choices: {
              create: LABELS.map((label, idx) => ({
                label,
                content: tpl.choices[idx],
                isCorrect: tpl.correctLabel === label,
              })),
            },
          },
        });
        createdQuestionsCount++;
      }
    }
  }

  // 6. Generate ExamSession, StudentAnswer, dan ExamResult realistis
  const allStudents = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { username: "asc" },
  });

  const sessionPlans: Array<{
    username: string;
    slug: string;
    subtestCode: (typeof SUBTEST_CODES)[number];
    status: ExamSessionStatus;
    targetAccuracy: number; // 0.0 - 1.0
    hoursAgo: number;
  }> = [
    { username: "siswa_premium", slug: "batch-1", subtestCode: "PU", status: "DINILAI", targetAccuracy: 0.85, hoursAgo: 72 },
    { username: "siswa_premium", slug: "batch-1", subtestCode: "PK", status: "DINILAI", targetAccuracy: 0.78, hoursAgo: 68 },
    { username: "siswa_premium", slug: "batch-2", subtestCode: "PU", status: "DINILAI", targetAccuracy: 0.8, hoursAgo: 24 },
    { username: "siswa_premium", slug: "batch-2", subtestCode: "LBE", status: "BERLANGSUNG", targetAccuracy: 0.6, hoursAgo: 0.2 },
    { username: "siswa_free", slug: "batch-1", subtestCode: "PU", status: "DINILAI", targetAccuracy: 0.65, hoursAgo: 48 },
    { username: "siswa_free", slug: "paket-mini-gratis", subtestCode: "PU", status: "DINILAI", targetAccuracy: 0.72, hoursAgo: 12 },
    { username: "nadia_putri", slug: "batch-2", subtestCode: "PU", status: "DINILAI", targetAccuracy: 0.92, hoursAgo: 36 },
    { username: "nadia_putri", slug: "batch-2", subtestCode: "PM", status: "DINILAI", targetAccuracy: 0.88, hoursAgo: 30 },
    { username: "nadia_putri", slug: "batch-3", subtestCode: "LBI", status: "DINILAI", targetAccuracy: 0.9, hoursAgo: 10 },
    { username: "raihan_pratama", slug: "batch-2", subtestCode: "PK", status: "DINILAI", targetAccuracy: 0.82, hoursAgo: 40 },
    { username: "raihan_pratama", slug: "batch-3", subtestCode: "PU", status: "SELESAI", targetAccuracy: 0.75, hoursAgo: 6 },
    { username: "aisyah_zahra", slug: "batch-1", subtestCode: "LBE", status: "DINILAI", targetAccuracy: 0.88, hoursAgo: 50 },
    { username: "aisyah_zahra", slug: "batch-3", subtestCode: "PM", status: "BERLANGSUNG", targetAccuracy: 0.5, hoursAgo: 0.1 },
    { username: "bima_kusuma", slug: "paket-mini-gratis", subtestCode: "PU", status: "DINILAI", targetAccuracy: 0.67, hoursAgo: 20 },
    { username: "clara_wijaya", slug: "batch-4", subtestCode: "PU", status: "TERDAFTAR", targetAccuracy: 0, hoursAgo: 1 },
    { username: "dimas_aditya", slug: "batch-1", subtestCode: "PU", status: "WAKTU_HABIS", targetAccuracy: 0.55, hoursAgo: 96 },
    { username: "gilang_ramadhan", slug: "batch-2", subtestCode: "PBM", status: "DINILAI", targetAccuracy: 0.76, hoursAgo: 18 },
    { username: "iqbal_maulana", slug: "batch-3", subtestCode: "PPU", status: "DINILAI", targetAccuracy: 0.84, hoursAgo: 14 },
  ];

  const userByUsername = new Map(allStudents.map((u) => [u.username, u]));
  let createdSessionsCount = 0;

  for (const plan of sessionPlans) {
    const user = userByUsername.get(plan.username);
    const pkg = packageBySlug.get(plan.slug);
    const subtestId = subtestByCode.get(plan.subtestCode);
    if (!user || !pkg || !subtestId) continue;

    const existing = await prisma.examSession.findUnique({
      where: {
        userId_packageId_subtestId: {
          userId: user.id,
          packageId: pkg.id,
          subtestId,
        },
      },
    });
    if (existing) continue;

    const questions = await prisma.question.findMany({
      where: { packageId: pkg.id, subtestId },
      include: { choices: true },
      orderBy: { orderNo: "asc" },
    });
    if (questions.length === 0) continue;

    const startedAt = new Date(NOW - plan.hoursAgo * 3600000);
    const expiresAt = new Date(startedAt.getTime() + 30 * 60000);
    const isCompleted = plan.status === "DINILAI" || plan.status === "SELESAI" || plan.status === "WAKTU_HABIS";
    const submittedAt = isCompleted ? new Date(startedAt.getTime() + 18 * 60000) : null;

    const session = await prisma.examSession.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        subtestId,
        status: plan.status,
        startedAt: plan.status === "TERDAFTAR" ? null : startedAt,
        expiresAt: plan.status === "TERDAFTAR" ? null : expiresAt,
        submittedAt,
      },
    });
    createdSessionsCount++;

    if (plan.status === "TERDAFTAR") continue;

    const answerLimit = plan.status === "BERLANGSUNG" ? Math.max(1, Math.floor(questions.length * 0.6)) : questions.length;
    let correctCount = 0;
    let wrongCount = 0;
    let emptyCount = 0;
    let earnedWeight = 0;
    let totalWeight = 0;

    for (let idx = 0; idx < questions.length; idx++) {
      const q = questions[idx];
      const weight = q.weight > 0 ? q.weight : 1;
      totalWeight += weight;

      if (idx >= answerLimit) {
        emptyCount++;
        continue;
      }

      const correctChoice = q.choices.find((c) => c.isCorrect);
      const wrongChoice = q.choices.find((c) => !c.isCorrect);
      const shouldAnswerCorrectly = (idx + 1) / answerLimit <= plan.targetAccuracy;
      const chosen = shouldAnswerCorrectly ? correctChoice : wrongChoice;

      if (chosen) {
        await prisma.studentAnswer.create({
          data: {
            sessionId: session.id,
            questionId: q.id,
            selectedLabel: chosen.label,
            isFlagged: idx % 7 === 0,
          },
        });
        if (chosen.isCorrect) {
          correctCount++;
          earnedWeight += weight;
        } else {
          wrongCount++;
        }
      } else {
        emptyCount++;
      }
    }

    if (isCompleted) {
      const totalScore = totalWeight > 0 ? Number(((earnedWeight / totalWeight) * 100).toFixed(2)) : 0;
      await prisma.examResult.create({
        data: {
          sessionId: session.id,
          totalScore,
          correctCount,
          wrongCount,
          emptyCount,
          gradedAt: submittedAt ?? new Date(),
        },
      });
    }
  }

  console.log("Database seed completed:", {
    users: await prisma.user.count(),
    subscriptions: await prisma.subscription.count(),
    subtests: await prisma.subtest.count(),
    packages: await prisma.tryoutPackage.count(),
    questions: await prisma.question.count(),
    choices: await prisma.questionChoice.count(),
    sessions: await prisma.examSession.count(),
    answers: await prisma.studentAnswer.count(),
    results: await prisma.examResult.count(),
    newlyGeneratedQuestions: createdQuestionsCount,
    newlyGeneratedSessions: createdSessionsCount,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

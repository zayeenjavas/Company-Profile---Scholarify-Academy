import type {
  ExamQuestionDto,
  ExamResultDto,
  ExamSessionDto,
  StudentAnswerDto,
  SubtestDto,
  TryoutPackageDto,
  UserDto,
} from "@/src/api/contracts";
import { isSubscriptionActive } from "@/src/server/services/stateMachine";
import type {
  ExamResult,
  ExamSession,
  Question,
  QuestionChoice,
  StudentAnswer,
  Subscription,
  Subtest,
  TryoutPackage,
  User,
} from "@prisma/client";

export function serializeUserDto(
  user: User & { subscription?: Subscription | null }
): UserDto {
  const active = isSubscriptionActive(user.subscription);
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.isActive,
    subscription: {
      plan: user.subscription?.plan ?? "FREE",
      status: active
        ? "ACTIVE"
        : user.subscription?.status === "ACTIVE"
        ? "EXPIRED"
        : user.subscription?.status ?? "NONE",
      expires_at: user.subscription?.expiresAt
        ? user.subscription.expiresAt.toISOString()
        : null,
      is_active: active,
    },
  };
}

export function serializeSubtestDto(subtest: Subtest): SubtestDto {
  return {
    id: subtest.id,
    code: subtest.code,
    title: subtest.title,
    description: subtest.description,
    duration_minutes: subtest.durationMinutes,
    question_count: subtest.questionCount,
  };
}

export function serializePackageDto(
  pkg: TryoutPackage & { _count?: { questions: number } },
  userHasSubscription: boolean
): TryoutPackageDto {
  const isAccessible = pkg.tier === "FREE" || userHasSubscription;
  return {
    id: pkg.id,
    slug: pkg.slug,
    title: pkg.title,
    description: pkg.description,
    tier: pkg.tier,
    status: pkg.status,
    duration_minutes: pkg.durationMinutes,
    open_at: pkg.openAt.toISOString(),
    close_at: pkg.closeAt.toISOString(),
    shuffle_questions: pkg.shuffleQuestions,
    shuffle_choices: pkg.shuffleChoices,
    allow_review: pkg.allowReview,
    question_count: pkg._count?.questions ?? 0,
    is_accessible: isAccessible,
  };
}

export function serializeExamQuestionDto(
  q: Question & { choices: QuestionChoice[] }
): ExamQuestionDto {
  return {
    id: q.id,
    order_no: q.orderNo,
    stem_content: q.stemContent,
    image_url: q.imageUrl,
    question_type: q.questionType,
    weight: q.weight,
    choices: q.choices
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((c) => ({
        id: c.id,
        label: c.label,
        content: c.content,
      })),
  };
}

export function serializeAnswerDto(ans: StudentAnswer): StudentAnswerDto {
  return {
    question_id: ans.questionId,
    selected_label: ans.selectedLabel,
    is_flagged: ans.isFlagged,
  };
}

export function serializeSessionDto(
  session: ExamSession & { subtest: Subtest }
): ExamSessionDto {
  return {
    id: session.id,
    package_id: session.packageId,
    subtest_id: session.subtestId,
    subtest_code: session.subtest.code,
    subtest_title: session.subtest.title,
    status: session.status,
    started_at: session.startedAt ? session.startedAt.toISOString() : null,
    expires_at: session.expiresAt ? session.expiresAt.toISOString() : null,
    server_now: new Date().toISOString(),
    submitted_at: session.submittedAt ? session.submittedAt.toISOString() : null,
  };
}

export function serializeResultDto(
  res: ExamResult & {
    session: ExamSession & { tryoutPackage: TryoutPackage; subtest: Subtest };
  }
): ExamResultDto {
  return {
    session_id: res.sessionId,
    package_slug: res.session.tryoutPackage.slug,
    package_title: res.session.tryoutPackage.title,
    subtest_code: res.session.subtest.code,
    subtest_title: res.session.subtest.title,
    total_score: res.totalScore,
    correct_count: res.correctCount,
    wrong_count: res.wrongCount,
    empty_count: res.emptyCount,
    graded_at: res.gradedAt.toISOString(),
  };
}

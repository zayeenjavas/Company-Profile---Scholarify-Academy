import type {
  ExamQuestionDto,
  ExamResultDto,
  ExamReviewItemDto,
  ExamSessionDto,
  StudentAnswerDto,
  SubtestDto,
  TryoutPackageDto,
  UserDto,
} from "@/src/api/contracts";
import type {
  ExamQuestion,
  ExamResultSummary,
  ExamReviewItem,
  ExamSessionInfo,
  StudentAnswerState,
  SubtestInfo,
  TryoutPackage,
  UserProfile,
} from "@/src/types/domain";

export function mapUserDto(dto: UserDto): UserProfile {
  return {
    id: dto.id,
    username: dto.username,
    name: dto.name,
    email: dto.email,
    role: dto.role,
    isActive: dto.is_active,
    subscription: {
      plan: dto.subscription.plan,
      status: dto.subscription.status,
      expiresAt: dto.subscription.expires_at,
      isActive: dto.subscription.is_active,
    },
  };
}

export function mapSubtestDto(dto: SubtestDto): SubtestInfo {
  return {
    id: dto.id,
    code: dto.code,
    title: dto.title,
    description: dto.description,
    durationMinutes: dto.duration_minutes,
    questionCount: dto.question_count,
  };
}

export function mapPackageDto(dto: TryoutPackageDto): TryoutPackage {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    description: dto.description,
    tier: dto.tier,
    status: dto.status,
    durationMinutes: dto.duration_minutes,
    openAt: dto.open_at,
    closeAt: dto.close_at,
    shuffleQuestions: dto.shuffle_questions,
    shuffleChoices: dto.shuffle_choices,
    allowReview: dto.allow_review,
    questionCount: dto.question_count,
    isAccessible: dto.is_accessible,
  };
}

export function mapQuestionDto(dto: ExamQuestionDto): ExamQuestion {
  return {
    id: dto.id,
    orderNo: dto.order_no,
    stemContent: dto.stem_content,
    imageUrl: dto.image_url,
    questionType: dto.question_type,
    weight: dto.weight,
    choices: dto.choices.map((c) => ({
      id: c.id,
      label: c.label,
      content: c.content,
    })),
  };
}

export function mapAnswerDto(dto: StudentAnswerDto): StudentAnswerState {
  return {
    questionId: dto.question_id,
    selectedLabel: dto.selected_label,
    isFlagged: dto.is_flagged,
  };
}

export function mapSessionDto(dto: ExamSessionDto): ExamSessionInfo {
  return {
    id: dto.id,
    packageId: dto.package_id,
    subtestId: dto.subtest_id,
    subtestCode: dto.subtest_code,
    subtestTitle: dto.subtest_title,
    status: dto.status,
    startedAt: dto.started_at,
    expiresAt: dto.expires_at,
    serverNow: dto.server_now,
    submittedAt: dto.submitted_at,
  };
}

export function mapResultDto(dto: ExamResultDto): ExamResultSummary {
  return {
    sessionId: dto.session_id,
    packageSlug: dto.package_slug,
    packageTitle: dto.package_title,
    subtestCode: dto.subtest_code,
    subtestTitle: dto.subtest_title,
    totalScore: dto.total_score,
    correctCount: dto.correct_count,
    wrongCount: dto.wrong_count,
    emptyCount: dto.empty_count,
    gradedAt: dto.graded_at,
  };
}

export function mapReviewItemDto(dto: ExamReviewItemDto): ExamReviewItem {
  return {
    ...mapQuestionDto(dto),
    selectedLabel: dto.selected_label,
    correctLabel: dto.correct_label,
    isCorrect: dto.is_correct,
    explanation: dto.explanation,
  };
}

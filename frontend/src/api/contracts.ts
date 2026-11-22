import type {
  ExamSessionStatus,
  PackageStatus,
  QuestionType,
  SubscriptionPlan,
  SubscriptionStatus,
  UserRole,
} from "@/src/types/domain";

export interface SubscriptionDto {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expires_at: string | null;
  is_active: boolean;
}

export interface UserDto {
  id: string;
  username: string;
  name: string;
  email: string | null;
  role: UserRole;
  is_active: boolean;
  subscription: SubscriptionDto;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  ok: boolean;
  token: string;
  user: UserDto;
}

export interface SubtestDto {
  id: string;
  code: string;
  title: string;
  description: string;
  duration_minutes: number;
  question_count: number;
}

export interface TryoutPackageDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  tier: SubscriptionPlan;
  status: PackageStatus;
  duration_minutes: number;
  open_at: string;
  close_at: string;
  shuffle_questions: boolean;
  shuffle_choices: boolean;
  allow_review: boolean;
  question_count: number;
  is_accessible: boolean;
}

export interface ExamChoiceDto {
  id: string;
  label: string;
  content: string;
}

/**
 * SECURITY: ExamQuestionDto MUST NEVER expose `is_correct` or `explanation`
 * while an exam session is active (`BERLANGSUNG`).
 */
export interface ExamQuestionDto {
  id: string;
  order_no: number;
  stem_content: string;
  image_url: string | null;
  question_type: QuestionType;
  weight: number;
  choices: ExamChoiceDto[];
}

export interface StudentAnswerDto {
  question_id: string;
  selected_label: string | null;
  is_flagged: boolean;
}

export interface ExamSessionDto {
  id: string;
  package_id: string;
  subtest_id: string;
  subtest_code: string;
  subtest_title: string;
  status: ExamSessionStatus;
  started_at: string | null;
  expires_at: string | null;
  server_now: string;
  submitted_at: string | null;
}

export interface StartSessionRequestDto {
  package_id: string;
  subtest_id: string;
}

export interface StartSessionResponseDto {
  session: ExamSessionDto;
  questions: ExamQuestionDto[];
  answers: StudentAnswerDto[];
}

export interface UpsertAnswerRequestDto {
  selected_label: string | null;
  is_flagged: boolean;
}

export interface UpsertAnswerResponseDto {
  ok: boolean;
  answer: StudentAnswerDto;
  server_now: string;
}

export interface ExamResultDto {
  session_id: string;
  package_slug: string;
  package_title: string;
  subtest_code: string;
  subtest_title: string;
  total_score: number;
  correct_count: number;
  wrong_count: number;
  empty_count: number;
  graded_at: string;
}

export interface SubmitSessionResponseDto {
  session: ExamSessionDto;
  result: ExamResultDto;
}

export interface ExamReviewItemDto extends ExamQuestionDto {
  selected_label: string | null;
  correct_label: string | null;
  is_correct: boolean;
  explanation: string | null;
}

export type UserRole = "ADMIN" | "STUDENT";
export type SubscriptionPlan = "FREE" | "PREMIUM";
export type SubscriptionStatus = "NONE" | "ACTIVE" | "EXPIRED";
export type PackageStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type QuestionType = "PG" | "PG_KOMPLEKS" | "ISIAN";
export type ExamSessionStatus =
  | "TERDAFTAR"
  | "BERLANGSUNG"
  | "SELESAI"
  | "WAKTU_HABIS"
  | "DIBATALKAN"
  | "DINILAI";

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt: string | null;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string | null;
  role: UserRole;
  isActive: boolean;
  subscription: SubscriptionInfo;
}

export interface SubtestInfo {
  id: string;
  code: string;
  title: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
}

export interface TryoutPackage {
  id: string;
  slug: string;
  title: string;
  description: string;
  tier: SubscriptionPlan;
  status: PackageStatus;
  durationMinutes: number;
  openAt: string;
  closeAt: string;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  allowReview: boolean;
  questionCount: number;
  isAccessible: boolean;
}

export interface ExamChoice {
  id: string;
  label: string;
  content: string;
}

export interface ExamQuestion {
  id: string;
  orderNo: number;
  stemContent: string;
  imageUrl: string | null;
  questionType: QuestionType;
  weight: number;
  choices: ExamChoice[];
}

export interface StudentAnswerState {
  questionId: string;
  selectedLabel: string | null;
  isFlagged: boolean;
}

export interface ExamSessionInfo {
  id: string;
  packageId: string;
  subtestId: string;
  subtestCode: string;
  subtestTitle: string;
  status: ExamSessionStatus;
  startedAt: string | null;
  expiresAt: string | null;
  serverNow: string;
  submittedAt: string | null;
}

export interface ExamResultSummary {
  sessionId: string;
  packageSlug: string;
  packageTitle: string;
  subtestCode: string;
  subtestTitle: string;
  totalScore: number;
  correctCount: number;
  wrongCount: number;
  emptyCount: number;
  gradedAt: string;
}

export interface ExamReviewItem extends ExamQuestion {
  selectedLabel: string | null;
  correctLabel: string | null;
  isCorrect: boolean;
  explanation: string | null;
}

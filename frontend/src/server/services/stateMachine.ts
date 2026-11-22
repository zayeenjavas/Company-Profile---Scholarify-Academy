import type { ExamSessionStatus, PackageStatus } from "@/src/types/domain";

const PACKAGE_TRANSITIONS: Record<PackageStatus, PackageStatus[]> = {
  DRAFT: ["PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["ARCHIVED", "DRAFT"],
  ARCHIVED: ["PUBLISHED"],
};

const SESSION_TRANSITIONS: Record<ExamSessionStatus, ExamSessionStatus[]> = {
  TERDAFTAR: ["BERLANGSUNG", "DIBATALKAN"],
  BERLANGSUNG: ["SELESAI", "WAKTU_HABIS", "DIBATALKAN"],
  SELESAI: ["DINILAI"],
  WAKTU_HABIS: ["DINILAI"],
  DIBATALKAN: [],
  DINILAI: [],
};

export function canTransitionPackage(from: PackageStatus, to: PackageStatus): boolean {
  if (from === to) return true;
  return PACKAGE_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canTransitionSession(from: ExamSessionStatus, to: ExamSessionStatus): boolean {
  if (from === to) return true;
  return SESSION_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isSubscriptionActive(sub?: {
  plan: string;
  status: string;
  expiresAt: Date | null;
} | null): boolean {
  if (!sub || sub.plan !== "PREMIUM" || sub.status !== "ACTIVE") {
    return false;
  }
  if (sub.expiresAt && sub.expiresAt.getTime() < Date.now()) {
    return false;
  }
  return true;
}

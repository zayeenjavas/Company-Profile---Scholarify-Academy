import { describe, expect, it } from "vitest";
import {
  mapPackageDto,
  mapQuestionDto,
  mapSessionDto,
  mapUserDto,
} from "@/src/api/mappers";
import type {
  ExamQuestionDto,
  ExamSessionDto,
  TryoutPackageDto,
  UserDto,
} from "@/src/api/contracts";
import {
  canTransitionPackage,
  canTransitionSession,
  isSubscriptionActive,
} from "@/src/server/services/stateMachine";
import { computeScoreMetrics } from "@/src/server/services/scoring.service";

describe("Contract Mappers & Security Smoke Tests", () => {
  it("maps UserDto including subscription status cleanly", () => {
    const dto: UserDto = {
      id: "u1",
      username: "siswa01",
      name: "Siswa Satu",
      email: "siswa@scholarify.id",
      role: "STUDENT",
      is_active: true,
      subscription: {
        plan: "PREMIUM",
        status: "ACTIVE",
        expires_at: "2027-01-01T00:00:00.000Z",
        is_active: true,
      },
    };
    const domain = mapUserDto(dto);
    expect(domain.subscription.isActive).toBe(true);
    expect(domain.subscription.plan).toBe("PREMIUM");
  });

  it("maps TryoutPackageDto and preserves tier accessibility", () => {
    const dto: TryoutPackageDto = {
      id: "pkg1",
      slug: "batch-1",
      title: "TryOut UTBK Batch 1",
      description: "Simulasi UTBK",
      tier: "PREMIUM",
      status: "PUBLISHED",
      duration_minutes: 90,
      open_at: "2026-01-01T00:00:00.000Z",
      close_at: "2027-01-01T00:00:00.000Z",
      shuffle_questions: false,
      shuffle_choices: false,
      allow_review: true,
      question_count: 30,
      is_accessible: false,
    };
    const domain = mapPackageDto(dto);
    expect(domain.isAccessible).toBe(false);
    expect(domain.questionCount).toBe(30);
  });

  it("never exposes correct_answer or explanation in ExamQuestionDto", () => {
    const qDto: ExamQuestionDto = {
      id: "q1",
      order_no: 1,
      stem_content: "Berapakah 2 + 2?",
      image_url: null,
      question_type: "PG",
      weight: 1,
      choices: [
        { id: "c1", label: "A", content: "3" },
        { id: "c2", label: "B", content: "4" },
      ],
    };
    const mapped = mapQuestionDto(qDto) as unknown as Record<string, unknown>;
    expect(mapped.correct_answer).toBeUndefined();
    expect(mapped.is_correct).toBeUndefined();
    expect(mapped.explanation).toBeUndefined();
  });

  it("maps ExamSessionDto with serverNow and expiresAt", () => {
    const sDto: ExamSessionDto = {
      id: "s1",
      package_id: "pkg1",
      subtest_id: "sub1",
      subtest_code: "PU",
      subtest_title: "Penalaran Umum",
      status: "BERLANGSUNG",
      started_at: "2026-11-22T10:00:00.000Z",
      expires_at: "2026-11-22T10:30:00.000Z",
      server_now: "2026-11-22T10:05:00.000Z",
      submitted_at: null,
    };
    const domain = mapSessionDto(sDto);
    expect(domain.status).toBe("BERLANGSUNG");
    expect(domain.serverNow).toBe("2026-11-22T10:05:00.000Z");
  });
});

describe("State Machine & Scoring Rules", () => {
  it("enforces valid package status transitions", () => {
    expect(canTransitionPackage("DRAFT", "PUBLISHED")).toBe(true);
    expect(canTransitionPackage("PUBLISHED", "ARCHIVED")).toBe(true);
    expect(canTransitionPackage("ARCHIVED", "DRAFT")).toBe(false);
  });

  it("enforces valid exam session transitions", () => {
    expect(canTransitionSession("TERDAFTAR", "BERLANGSUNG")).toBe(true);
    expect(canTransitionSession("BERLANGSUNG", "SELESAI")).toBe(true);
    expect(canTransitionSession("DINILAI", "BERLANGSUNG")).toBe(false);
  });

  it("validates subscription expiry accurately", () => {
    expect(
      isSubscriptionActive({
        plan: "PREMIUM",
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + 86_400_000),
      })
    ).toBe(true);
    expect(
      isSubscriptionActive({
        plan: "PREMIUM",
        status: "ACTIVE",
        expiresAt: new Date(Date.now() - 86_400_000),
      })
    ).toBe(false);
    expect(
      isSubscriptionActive({
        plan: "FREE",
        status: "ACTIVE",
        expiresAt: null,
      })
    ).toBe(false);
  });

  it("computes weighted score metrics accurately", () => {
    const metrics = computeScoreMetrics(
      [
        { id: "q1", weight: 2, correctLabel: "A" },
        { id: "q2", weight: 1, correctLabel: "B" },
        { id: "q3", weight: 1, correctLabel: "C" },
      ],
      new Map([
        ["q1", "A"],
        ["q2", "D"],
      ])
    );
    expect(metrics.correctCount).toBe(1);
    expect(metrics.wrongCount).toBe(1);
    expect(metrics.emptyCount).toBe(1);
    expect(metrics.totalScore).toBe(50);
  });
});

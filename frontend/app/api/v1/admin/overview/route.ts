import { NextResponse } from "next/server";
import { prisma } from "@/src/server/db";
import { requireRole } from "@/src/server/auth/guards";
import { isSubscriptionActive } from "@/src/server/services/stateMachine";

export async function GET(req: Request) {
  const { errorResponse } = await requireRole(req, "ADMIN");
  if (errorResponse) return errorResponse;

  try {
    const [
      totalUsers,
      totalStudents,
      totalAdmins,
      usersWithSub,
      totalPackages,
      publishedPackages,
      totalQuestions,
      liveSessions,
      results,
      subtests,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.findMany({
        where: { role: "STUDENT" },
        include: { subscription: true },
      }),
      prisma.tryoutPackage.count(),
      prisma.tryoutPackage.count({ where: { status: "PUBLISHED" } }),
      prisma.question.count(),
      prisma.examSession.count({ where: { status: "BERLANGSUNG" } }),
      prisma.examResult.findMany({
        include: {
          session: {
            include: {
              user: { select: { username: true, name: true } },
              subtest: { select: { code: true } },
            },
          },
        },
      }),
      prisma.subtest.findMany({
        include: { _count: { select: { questions: true } } },
        orderBy: { code: "asc" },
      }),
    ]);

    const activeSubscribers = usersWithSub.filter((u) =>
      isSubscriptionActive(u.subscription)
    ).length;

    const avgScore =
      results.length > 0
        ? Math.round(
            results.reduce((acc, r) => acc + r.totalScore, 0) / results.length
          )
        : 0;

    const subtestStats = subtests.map((st) => {
      const stResults = results.filter((r) => r.session.subtest.code === st.code);
      const stAvg =
        stResults.length > 0
          ? Math.round(
              stResults.reduce((acc, r) => acc + r.totalScore, 0) /
                stResults.length
            )
          : 0;
      return {
        code: st.code,
        title: st.title,
        questionCount: st._count.questions,
        attemptCount: stResults.length,
        avgScore: stAvg,
      };
    });

    const userAgg = new Map<
      string,
      { username: string; name: string; sum: number; count: number }
    >();
    for (const r of results) {
      const u = r.session.user;
      const cur = userAgg.get(u.username) ?? {
        username: u.username,
        name: u.name,
        sum: 0,
        count: 0,
      };
      cur.sum += r.totalScore;
      cur.count += 1;
      userAgg.set(u.username, cur);
    }

    const topUsers = Array.from(userAgg.values())
      .map((u) => ({
        username: u.username,
        name: u.name,
        avgScore: Math.round(u.sum / u.count),
        attemptCount: u.count,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10);

    return NextResponse.json({
      stats: {
        users: {
          total: totalUsers,
          students: totalStudents,
          admins: totalAdmins,
          activeSubscribers,
        },
        packages: {
          total: totalPackages,
          published: publishedPackages,
          totalQuestions,
        },
        sessions: {
          live: liveSessions,
          graded: results.length,
          avgScore,
        },
      },
      subtestStats,
      topUsers,
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/overview] Error:", error);
    return NextResponse.json(
      { error: "Gagal memuat overview admin" },
      { status: 500 }
    );
  }
}

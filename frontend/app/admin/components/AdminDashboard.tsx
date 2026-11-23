"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Layers,
  BookOpen,
  Activity,
  Users,
  Globe,
  ExternalLink,
  LogOut,
  RefreshCw,
  Search,
  Menu,
  X,
  Inbox,
} from "lucide-react";
import { apiRequest, setStoredToken } from "@/src/api/client";
import type { UserProfile } from "@/src/types/domain";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/src/components/common/ThemeToggle";
import { AdminOverviewTab, type AdminOverviewData } from "@/src/components/admin/AdminOverviewTab";
import { AdminPackagesTab } from "@/src/components/admin/AdminPackagesTab";
import { AdminQuestionsTab } from "@/src/components/admin/AdminQuestionsTab";
import { AdminMonitoringTab } from "@/src/components/admin/AdminMonitoringTab";
import { AdminUsersTab } from "@/src/components/admin/AdminUsersTab";
import { AdminCmsTab } from "@/src/components/admin/AdminCmsTab";
import { AdminLeadsTab } from "@/src/components/admin/AdminLeadsTab";
import {
  DensButton,
  DensInputGroup,
  DensKbd,
  DensSidebar,
  DensSidebarCount,
  DensSidebarFooter,
  DensSidebarHeader,
  DensSidebarItem,
  DensSidebarMeter,
  DensSidebarRail,
  DensSidebarRailItem,
  DensSidebarSection,
  DensStatusDot,
} from "@/src/components/admin/dens-ui";
import "@/src/styles/dens-admin.css";

export type TabId = "overview" | "packages" | "questions" | "monitoring" | "users" | "cms" | "inbox";

interface AdminDashboardProps {
  user: UserProfile;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [overviewData, setOverviewData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [navSearch, setNavSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin_active_tab") as TabId | null;
    if (saved && ["overview", "packages", "questions", "monitoring", "users", "cms", "inbox"].includes(saved)) {
      setActiveTab(saved);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    localStorage.setItem("admin_active_tab", tab);
  };

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<AdminOverviewData>("/admin/overview");
      setOverviewData(data);
    } catch (error) {
      console.error("Error loading overview:", error);
      setOverviewData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    if (activeTab === "overview") {
      fetchOverview();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await apiRequest("/auth/logout", { method: "POST" }).catch(() => {});
    setStoredToken(null);
    router.replace("/login");
  };

  const tabs: Array<{
    id: TabId;
    label: string;
    shortLabel: string;
    icon: typeof LayoutDashboard;
    count?: number;
    highlightCount?: boolean;
  }> = [
    { id: "overview", label: "Overview & Analitik", shortLabel: "Overview", icon: LayoutDashboard },
    {
      id: "packages",
      label: "Paket Tryout",
      shortLabel: "Paket",
      icon: Layers,
      count: overviewData?.stats.packages.total,
    },
    {
      id: "questions",
      label: "Bank Soal",
      shortLabel: "Bank Soal",
      icon: BookOpen,
      count: overviewData?.stats.packages.totalQuestions,
    },
    {
      id: "monitoring",
      label: "Monitoring & Hasil",
      shortLabel: "Monitoring",
      icon: Activity,
      count: overviewData?.stats.sessions.live,
      highlightCount: (overviewData?.stats.sessions.live ?? 0) > 0,
    },
    {
      id: "users",
      label: "Pengguna & Langganan",
      shortLabel: "Pengguna",
      icon: Users,
      count: overviewData?.stats.users.total,
    },
    { id: "cms", label: "Konten Landing (CRM)", shortLabel: "Konten", icon: Globe },
    { id: "inbox", label: "Inbox Pesan & Mitra", shortLabel: "Inbox", icon: Inbox },
  ];

  const filteredTabs = navSearch.trim()
    ? tabs.filter((t) => t.label.toLowerCase().includes(navSearch.trim().toLowerCase()))
    : tabs;

  const selectedTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  const meterLevels = overviewData?.subtestStats?.length
    ? overviewData.subtestStats.map((s) => Math.max(s.attemptCount, 1))
    : [3, 6, 4, 8, 12, 9, 14, 10, 7, 11, 15, 13];

  return (
    <TooltipProvider>
      <div className="dens-admin-theme min-h-screen w-full p-2 sm:p-3 lg:p-4">
        <div className="mx-auto max-w-[1640px] rounded-[30px] bg-[var(--background)] p-2 text-[var(--foreground)] ring-1 ring-[var(--border)] sm:rounded-[38px] sm:p-3">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[248px_minmax(0,1fr)] xl:grid-cols-[56px_248px_minmax(0,1fr)]">
            {/* Far-left Icon Rail (XL+) */}
            <div className="hidden flex-col gap-3 xl:flex">
              <DensSidebarRail aria-label="Navigasi Cepat">
                <DensSidebarRailItem
                  label="Scholarify Overview"
                  onClick={() => handleTabChange("overview")}
                  className="bg-brand text-brand-foreground hover:bg-[var(--brand)]/90 hover:text-[var(--brand-foreground)]"
                >
                  <span className="text-[15px] font-bold">S</span>
                </DensSidebarRailItem>
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <DensSidebarRailItem
                      key={tab.id}
                      label={tab.label}
                      active={activeTab === tab.id}
                      dot={tab.id === "monitoring" && (overviewData?.stats.sessions.live ?? 0) > 0}
                      onClick={() => handleTabChange(tab.id)}
                    >
                      <Icon />
                    </DensSidebarRailItem>
                  );
                })}
              </DensSidebarRail>

              <DensSidebarMeter
                label="Sesi"
                total={overviewData?.stats.sessions.graded ?? 0}
                levels={meterLevels}
              />

              <DensSidebarRail aria-label="Aksi" className="mt-auto">
                <DensSidebarRailItem label="Portal Tryout" onClick={() => router.push("/tryout")}>
                  <ExternalLink />
                </DensSidebarRailItem>
                <DensSidebarRailItem label="Logout" onClick={handleLogout}>
                  <LogOut />
                </DensSidebarRailItem>
              </DensSidebarRail>
            </div>

            {/* Structured Sidebar (LG+) */}
            <DensSidebar className="hidden lg:flex">
              <DensSidebarHeader>
                <div className="grid size-9 shrink-0 place-content-center overflow-hidden rounded-xl bg-[var(--foreground)] text-[var(--background)]">
                  <Image
                    src="/images/scholarify-logo.png"
                    alt="Scholarify Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-sm font-semibold">Scholarify</div>
                  <div className="truncate text-xs text-[var(--muted-foreground)]">
                    Admin workspace
                  </div>
                </div>
              </DensSidebarHeader>

              <DensInputGroup start={<Search />} end={<DensKbd>⌘K</DensKbd>}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  placeholder="Cari menu..."
                  aria-label="Cari menu admin"
                  className="w-full bg-transparent text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
                />
              </DensInputGroup>

              <DensSidebarSection label="Manajemen Tryout">
                {filteredTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <DensSidebarItem
                      key={tab.id}
                      icon={<Icon />}
                      active={activeTab === tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      badge={
                        tab.count !== undefined ? (
                          <DensSidebarCount tone={tab.highlightCount ? "highlight" : "neutral"}>
                            {tab.count}
                          </DensSidebarCount>
                        ) : undefined
                      }
                    >
                      {tab.shortLabel}
                    </DensSidebarItem>
                  );
                })}
              </DensSidebarSection>

              <DensSidebarSection label="Status Live">
                <div className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs">
                  <span className="flex items-center gap-2 text-[var(--muted-foreground)]">
                    <DensStatusDot tone={(overviewData?.stats.sessions.live ?? 0) > 0 ? "highlight" : "muted"} />
                    Sedang Ujian
                  </span>
                  <DensSidebarCount tone={(overviewData?.stats.sessions.live ?? 0) > 0 ? "highlight" : "neutral"}>
                    {overviewData?.stats.sessions.live ?? 0}
                  </DensSidebarCount>
                </div>
                <div className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs">
                  <span className="flex items-center gap-2 text-[var(--muted-foreground)]">
                    <DensStatusDot tone="success" />
                    Paket Aktif
                  </span>
                  <DensSidebarCount tone="brand">
                    {overviewData?.stats.packages.published ?? 0}
                  </DensSidebarCount>
                </div>
                <div className="flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs">
                  <span className="flex items-center gap-2 text-[var(--muted-foreground)]">
                    <DensStatusDot tone="muted" />
                    Langganan
                  </span>
                  <DensSidebarCount>
                    {overviewData?.stats.users.activeSubscribers ?? 0}
                  </DensSidebarCount>
                </div>
              </DensSidebarSection>

              <DensSidebarFooter>
                <div className="flex items-center justify-between gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-2.5 py-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="grid size-8 shrink-0 place-content-center rounded-full bg-brand text-xs font-bold text-brand-foreground">
                      {user.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold">{user.name}</p>
                      <p className="truncate font-mono text-[11px] text-[var(--muted-foreground)]">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <DensButton
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Logout"
                    className="size-8 shrink-0 hover:text-[var(--destructive)]"
                  >
                    <LogOut className="size-3.5" />
                  </DensButton>
                </div>
              </DensSidebarFooter>
            </DensSidebar>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-50 flex lg:hidden">
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-xs"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="relative z-10 flex w-72 max-w-[85vw] flex-col gap-4 bg-[var(--sidebar)] p-4 text-[var(--sidebar-foreground)] shadow-raised">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-8 place-content-center rounded-xl bg-brand text-xs font-bold text-brand-foreground">
                        S
                      </div>
                      <span className="text-sm font-semibold">Scholarify Admin</span>
                    </div>
                    <DensButton variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                      <X className="size-4" />
                    </DensButton>
                  </div>
                  <div className="flex flex-col gap-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <DensSidebarItem
                          key={tab.id}
                          icon={<Icon />}
                          active={activeTab === tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          badge={
                            tab.count !== undefined ? (
                              <DensSidebarCount tone={tab.highlightCount ? "highlight" : "neutral"}>
                                {tab.count}
                              </DensSidebarCount>
                            ) : undefined
                          }
                        >
                          {tab.label}
                        </DensSidebarItem>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Main Workspace Canvas */}
            <main className="flex min-w-0 flex-1 flex-col rounded-[26px] bg-surface p-4 ring-1 ring-[var(--border)] shadow-panel sm:rounded-[30px] sm:p-6">
              {/* Top Workspace Header */}
              <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-3">
                  <DensButton
                    variant="outline"
                    size="icon"
                    onClick={() => setMobileMenuOpen(true)}
                    className="lg:hidden"
                    aria-label="Buka menu"
                  >
                    <Menu className="size-4" />
                  </DensButton>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <span>Scholarify</span>
                      <span>/</span>
                      <span className="font-medium text-[var(--foreground)]">Admin Console</span>
                    </div>
                    <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                      {selectedTab.label}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {activeTab === "overview" && (
                    <DensButton variant="outline" onClick={fetchOverview} disabled={loading}>
                      <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
                      <span className="hidden sm:inline">Muat Ulang</span>
                    </DensButton>
                  )}
                  <ThemeToggle />
                  <DensButton variant="outline" onClick={() => router.push("/tryout")}>
                    <ExternalLink className="size-3.5" />
                    <span className="hidden sm:inline">Portal Tryout</span>
                  </DensButton>
                  <DensButton variant="ink" onClick={handleLogout}>
                    <LogOut className="size-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </DensButton>
                </div>
              </header>

              {/* Tab Body */}
              <div className="@container/main flex-1">
                {activeTab === "overview" &&
                  (loading ? (
                    <div className="py-20 text-center text-sm text-[var(--muted-foreground)]">
                      Memuat data dashboard...
                    </div>
                  ) : overviewData ? (
                    <AdminOverviewTab data={overviewData} onNavigateTab={handleTabChange} />
                  ) : (
                    <Card>
                      <CardContent className="py-16 text-center">
                        <p className="mb-4 text-sm text-[var(--muted-foreground)]">
                          Gagal memuat overview admin.
                        </p>
                        <DensButton variant="ink" onClick={fetchOverview}>
                          Coba Lagi
                        </DensButton>
                      </CardContent>
                    </Card>
                  ))}

                {activeTab === "packages" && <AdminPackagesTab />}
                {activeTab === "questions" && <AdminQuestionsTab />}
                {activeTab === "monitoring" && <AdminMonitoringTab />}
                {activeTab === "users" && <AdminUsersTab />}
                {activeTab === "cms" && <AdminCmsTab />}
                {activeTab === "inbox" && <AdminLeadsTab />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

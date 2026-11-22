"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import { apiRequest, setStoredToken } from "@/src/api/client";
import type { UserProfile } from "@/src/types/domain";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/src/components/common/ThemeToggle";
import { AdminOverviewTab, type AdminOverviewData } from "@/src/components/admin/AdminOverviewTab";
import { AdminPackagesTab } from "@/src/components/admin/AdminPackagesTab";
import { AdminQuestionsTab } from "@/src/components/admin/AdminQuestionsTab";
import { AdminMonitoringTab } from "@/src/components/admin/AdminMonitoringTab";
import { AdminUsersTab } from "@/src/components/admin/AdminUsersTab";
import { AdminCmsTab } from "@/src/components/admin/AdminCmsTab";

type TabId = "overview" | "packages" | "questions" | "monitoring" | "users" | "cms";

interface AdminDashboardProps {
  user: UserProfile;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [overviewData, setOverviewData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("admin_active_tab") as TabId | null;
    if (saved && ["overview", "packages", "questions", "monitoring", "users", "cms"].includes(saved)) {
      setActiveTab(saved);
    }
  }, []);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
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
    if (activeTab === "overview") {
      fetchOverview();
    }
  }, [activeTab]);

  const handleLogout = async () => {
    await apiRequest("/auth/logout", { method: "POST" }).catch(() => {});
    setStoredToken(null);
    router.replace("/login");
  };

  const tabs: Array<{ id: TabId; label: string; icon: typeof LayoutDashboard }> = [
    { id: "overview", label: "Overview & Analitik", icon: LayoutDashboard },
    { id: "packages", label: "Paket Tryout", icon: Layers },
    { id: "questions", label: "Bank Soal", icon: BookOpen },
    { id: "monitoring", label: "Monitoring & Hasil", icon: Activity },
    { id: "users", label: "Pengguna & Langganan", icon: Users },
    { id: "cms", label: "Konten Landing (CRM)", icon: Globe },
  ];

  const selectedTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "16rem",
            "--header-height": "3.5rem",
          } as React.CSSProperties
        }
      >
        <Sidebar variant="inset" collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="cursor-default">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted overflow-hidden">
                    <Image
                      src="/images/scholarify-logo.png"
                      alt="Scholarify Logo"
                      width={32}
                      height={32}
                      className="object-contain"
                      priority
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Scholarify</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Admin Console
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Manajemen Tryout</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <SidebarMenuItem key={tab.id}>
                        <SidebarMenuButton
                          isActive={activeTab === tab.id}
                          tooltip={tab.label}
                          onClick={() => handleTabChange(tab.id)}
                          className="min-h-[40px]"
                        >
                          <Icon className="size-4 stroke-[1.75]" />
                          <span>{tab.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
              <SidebarGroupLabel>Navigasi</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Lihat Portal Tryout"
                      onClick={() => router.push("/tryout")}
                    >
                      <ExternalLink className="size-4 stroke-[1.75]" />
                      <span>Portal Tryout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center justify-between gap-2 rounded-lg border bg-card px-2.5 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{user.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    title="Logout"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur lg:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 h-4" />
              <h1 className="text-sm font-semibold">{selectedTab.label}</h1>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "overview" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchOverview}
                  disabled={loading}
                  className="h-9 gap-1.5 text-xs"
                >
                  <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">Muat Ulang</span>
                </Button>
              )}
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/tryout")}
                className="h-9 gap-1.5 text-xs"
              >
                <ExternalLink className="size-3.5" />
                <span className="hidden sm:inline">Lihat Tryout</span>
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleLogout}
                className="h-9 gap-1.5 text-xs"
              >
                <LogOut className="size-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </header>

          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6">
              {activeTab === "overview" &&
                (loading ? (
                  <div className="py-20 text-center text-sm text-muted-foreground">
                    Memuat data dashboard...
                  </div>
                ) : overviewData ? (
                  <AdminOverviewTab data={overviewData} />
                ) : (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <p className="mb-4 text-sm text-muted-foreground">
                        Gagal memuat overview admin.
                      </p>
                      <Button onClick={fetchOverview}>Coba Lagi</Button>
                    </CardContent>
                  </Card>
                ))}

              {activeTab === "packages" && <AdminPackagesTab />}
              {activeTab === "questions" && <AdminQuestionsTab />}
              {activeTab === "monitoring" && <AdminMonitoringTab />}
              {activeTab === "users" && <AdminUsersTab />}
              {activeTab === "cms" && <AdminCmsTab />}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

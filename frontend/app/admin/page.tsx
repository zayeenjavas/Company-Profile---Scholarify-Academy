"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { UserDto } from "@/src/api/contracts";
import { mapUserDto } from "@/src/api/mappers";
import type { UserProfile } from "@/src/types/domain";
import AdminDashboard from "./components/AdminDashboard";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await apiRequest<{ ok: boolean; user: UserDto }>("/auth/me");
        const mapped = mapUserDto(res.user);
        if (mapped.role !== "ADMIN") {
          router.replace("/tryout");
          return;
        }
        setUser(mapped);
      } catch {
        router.replace("/login?from=/admin");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Memeriksa sesi admin...
      </div>
    );
  }

  return <AdminDashboard user={user} />;
}

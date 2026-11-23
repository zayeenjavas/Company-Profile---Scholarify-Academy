"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Mail, MessageSquare, RefreshCw } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContactLead {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "NEW" | "CONTACTED" | "ARCHIVED";
  createdAt: string;
}

export function AdminLeadsTab() {
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ leads: ContactLead[] }>("/admin/leads");
      setLeads(res.leads);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: ContactLead["status"]) => {
    await apiRequest("/admin/leads", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    });
    await load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">Inbox Pesan &amp; Mitra (Get in Touch)</h2>
          <p className="text-xs text-muted-foreground">
            Pesan masuk dari form kontak landing page &amp; calon mitra sekolah.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-1.5">
          <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          Muat Ulang
        </Button>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Memuat pesan masuk...</p>
      ) : leads.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center text-sm text-muted-foreground">
            Belum ada pesan masuk dari form kontak.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="rounded-2xl border-[var(--border)] bg-[var(--card)]">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="size-4 text-[var(--brand)]" />
                      <CardTitle className="text-sm font-semibold">{lead.subject}</CardTitle>
                      <Badge
                        variant={
                          lead.status === "NEW"
                            ? "default"
                            : lead.status === "CONTACTED"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {lead.status === "NEW"
                          ? "Baru"
                          : lead.status === "CONTACTED"
                          ? "Sudah Dihubungi"
                          : "Arsip"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Dari <strong>{lead.name}</strong> ({lead.email}) ·{" "}
                      {new Date(lead.createdAt).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: ${lead.subject}`)}`}
                    >
                      <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                        <Mail className="size-3.5" />
                        Balas Email
                      </Button>
                    </a>
                    {lead.status === "NEW" && (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(lead.id, "CONTACTED")}
                        className="h-8 gap-1 text-xs bg-[var(--brand)] text-white hover:opacity-90"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Tandai Dihubungi
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line rounded-xl bg-[var(--muted)]/40 p-3 text-xs leading-relaxed">
                  {lead.message}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

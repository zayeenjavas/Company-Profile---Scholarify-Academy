"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { apiRequest } from "@/src/api/client";
import type { SanityMentor, SanityNews, SanityTestimonial } from "@/src/api/sanity";
import { LatexToolbarEditor } from "@/src/components/admin/LatexToolbarEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminCmsTab() {
  const [mentors, setMentors] = useState<SanityMentor[]>([]);
  const [testimonials, setTestimonials] = useState<SanityTestimonial[]>([]);
  const [news, setNews] = useState<SanityNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mentor form
  const [mNama, setMNama] = useState("");
  const [mJabatan, setMJabatan] = useState("");
  const [mKampus, setMKampus] = useState("");
  const [mKategori, setMKategori] = useState<"tim-inti" | "tim-mentor">("tim-mentor");
  const [mFotoId, setMFotoId] = useState<string | undefined>();

  // Testimonial form
  const [tNama, setTNama] = useState("");
  const [tKampus, setTKampus] = useState("");
  const [tIsi, setTIsi] = useState("");
  const [tRating, setTRating] = useState("5");

  // News form
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [nJudul, setNJudul] = useState("");
  const [nRingkasan, setNRingkasan] = useState("");
  const [nIsi, setNIsi] = useState("");
  const [nTanggal, setNTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [nGambarId, setNGambarId] = useState<string | undefined>();

  const loadAll = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [mRes, tRes, nRes] = await Promise.all([
        apiRequest<{ mentors: SanityMentor[] }>("/admin/cms/mentors"),
        apiRequest<{ testimonials: SanityTestimonial[] }>("/admin/cms/testimonials"),
        apiRequest<{ news: SanityNews[] }>("/admin/cms/news"),
      ]);
      setMentors(mRes.mentors);
      setTestimonials(tRes.testimonials);
      setNews(nRes.news);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memuat data Sanity CMS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const uploadImage = async (file: File): Promise<string | undefined> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await apiRequest<{ assetId?: string }>("/admin/cms/upload-image", {
      method: "POST",
      body: fd,
    });
    return res.assetId;
  };

  const addMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/admin/cms/mentors", {
        method: "POST",
        body: JSON.stringify({
          nama: mNama,
          jabatan: mJabatan,
          kampus: mKampus,
          kategori: mKategori,
          urutan: mentors.length + 1,
          fotoAssetId: mFotoId,
        }),
      });
      setMNama("");
      setMJabatan("");
      setMKampus("");
      setMFotoId(undefined);
      await loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const addTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/admin/cms/testimonials", {
        method: "POST",
        body: JSON.stringify({
          nama: tNama,
          asalKampus: tKampus,
          isi: tIsi,
          rating: Number(tRating),
        }),
      });
      setTNama("");
      setTKampus("");
      setTIsi("");
      await loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const resetNewsForm = () => {
    setEditingNewsId(null);
    setNJudul("");
    setNRingkasan("");
    setNIsi("");
    setNTanggal(new Date().toISOString().slice(0, 10));
    setNGambarId(undefined);
  };

  const startEditNews = (item: SanityNews) => {
    setEditingNewsId(item._id);
    setNJudul(item.judul || "");
    setNRingkasan(item.ringkasan || "");
    setNTanggal((item.tanggal || new Date().toISOString()).slice(0, 10));
    const plainBody = Array.isArray(item.isiLengkap)
      ? item.isiLengkap
          .map((b) => (b.children || []).map((c) => c.text || "").join(""))
          .filter(Boolean)
          .join("\n\n")
      : "";
    setNIsi(plainBody);
    setNGambarId(undefined);
  };

  const saveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNewsId) {
        await apiRequest(`/admin/cms/news/${encodeURIComponent(editingNewsId)}`, {
          method: "PATCH",
          body: JSON.stringify({
            judul: nJudul,
            ringkasan: nRingkasan,
            isiLengkap: nIsi,
            tanggal: nTanggal,
            ...(nGambarId ? { gambarAssetId: nGambarId } : {}),
          }),
        });
      } else {
        await apiRequest("/admin/cms/news", {
          method: "POST",
          body: JSON.stringify({
            judul: nJudul,
            ringkasan: nRingkasan,
            isiLengkap: nIsi,
            tanggal: nTanggal,
            urutan: news.length + 1,
            gambarAssetId: nGambarId,
          }),
        });
      }
      resetNewsForm();
      await loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteItem = async (type: "mentors" | "testimonials" | "news", id: string) => {
    if (!confirm("Hapus item ini dari Sanity CMS?")) return;
    try {
      await apiRequest(`/admin/cms/${type}/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      await loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Konten Landing Page (Sanity CRM)</h2>
        <p className="text-sm text-muted-foreground">
          Terhubung langsung ke Sanity CMS (`gbwew0c6` / `production`) untuk mengelola Mentor, Testimoni, dan Berita.
        </p>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
          {errorMsg}
        </div>
      )}

      <Tabs defaultValue="mentors">
        <TabsList>
          <TabsTrigger value="mentors">Mentor ({mentors.length})</TabsTrigger>
          <TabsTrigger value="testimonials">Testimoni ({testimonials.length})</TabsTrigger>
          <TabsTrigger value="news">Berita ({news.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="mentors" className="space-y-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tambah Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addMentor} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input placeholder="Nama Lengkap" value={mNama} onChange={(e) => setMNama(e.target.value)} required />
                <Input placeholder="Jabatan (mis. Mentor PU)" value={mJabatan} onChange={(e) => setMJabatan(e.target.value)} required />
                <Input placeholder="Asal Kampus (mis. ITB)" value={mKampus} onChange={(e) => setMKampus(e.target.value)} required />
                <Select value={mKategori} onValueChange={(v) => v && setMKategori(v as any)}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tim-inti">Tim Inti</SelectItem>
                    <SelectItem value="tim-mentor">Tim Mentor</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 md:col-span-2">
                  <Label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-2 text-xs">
                    <Upload className="size-3.5" />
                    {mFotoId ? "Foto Terunggah" : "Upload Foto (Opsional)"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        try {
                          const id = await uploadImage(f);
                          setMFotoId(id);
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }}
                    />
                  </Label>
                  <Button type="submit" className="ml-auto gap-1.5">
                    <Plus className="size-4" />
                    Simpan Mentor
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jabatan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Kampus</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Memuat...</TableCell>
                    </TableRow>
                  ) : (
                    mentors.map((m) => (
                      <TableRow key={m._id}>
                        <TableCell className="font-medium">{m.nama}</TableCell>
                        <TableCell>{m.jabatan}</TableCell>
                        <TableCell><Badge variant="secondary">{m.kategori || "tim-mentor"}</Badge></TableCell>
                        <TableCell>{m.kampus}</TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem("mentors", m._id)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-4 pt-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tambah Testimoni</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addTestimonial} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input placeholder="Nama Alumni/Siswa" value={tNama} onChange={(e) => setTNama(e.target.value)} required />
                <Input placeholder="Asal Kampus (mis. STEI ITB)" value={tKampus} onChange={(e) => setTKampus(e.target.value)} required />
                <Textarea placeholder="Isi testimoni..." value={tIsi} onChange={(e) => setTIsi(e.target.value)} className="md:col-span-2" required />
                <Select value={tRating} onValueChange={(v) => v && setTRating(v)}>
                  <SelectTrigger className="w-full h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["5", "4", "3", "2", "1"].map((r) => (
                      <SelectItem key={r} value={r}>Rating {r} Bintang</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="submit" className="gap-1.5"><Plus className="size-4" />Simpan Testimoni</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kampus</TableHead>
                    <TableHead>Kutipan</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map((t) => (
                    <TableRow key={t._id}>
                      <TableCell className="font-medium">{t.nama}</TableCell>
                      <TableCell>{t.asalKampus}</TableCell>
                      <TableCell className="max-w-md truncate text-xs">{t.isi}</TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem("testimonials", t._id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                {editingNewsId ? "Edit Berita / Artikel (Support LaTeX)" : "Tambah Berita / Artikel (Support LaTeX)"}
              </CardTitle>
              {editingNewsId && (
                <Button type="button" variant="ghost" size="sm" onClick={resetNewsForm} className="gap-1">
                  <X className="size-4" />
                  Batal Edit
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={saveNews} className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input placeholder="Judul Berita" value={nJudul} onChange={(e) => setNJudul(e.target.value)} required />
                <Input type="date" value={nTanggal} onChange={(e) => setNTanggal(e.target.value)} required />
                <div className="md:col-span-2">
                  <LatexToolbarEditor
                    compact
                    label="Ringkasan Singkat (Support LaTeX)"
                    placeholder="Ringkasan singkat artikel..."
                    value={nRingkasan}
                    onChange={setNRingkasan}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <LatexToolbarEditor
                    label="Isi Lengkap Artikel (Support Equation / LaTeX — pisahkan paragraf dengan Enter 2x)"
                    placeholder="Tulis artikel di sini... Bisa menyisipkan rumus seperti $\\frac{a}{b}$ atau blok $$...$$"
                    value={nIsi}
                    onChange={setNIsi}
                    rows={5}
                  />
                </div>
                <div className="flex items-center gap-2 md:col-span-2">
                  <Label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-2 text-xs">
                    <Upload className="size-3.5" />
                    {nGambarId ? "Gambar Terunggah" : "Upload Gambar (Opsional)"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        try {
                          const id = await uploadImage(f);
                          setNGambarId(id);
                        } catch (err: any) {
                          alert(err.message);
                        }
                      }}
                    />
                  </Label>
                  <Button type="submit" className="ml-auto gap-1.5">
                    <Plus className="size-4" />
                    {editingNewsId ? "Simpan Perubahan Berita" : "Publikasikan Berita"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {news.map((n) => (
                    <TableRow key={n._id}>
                      <TableCell className="font-medium">{n.judul}</TableCell>
                      <TableCell className="tabular-nums">{n.tanggal}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button size="icon" variant="ghost" title="Edit Berita" onClick={() => startEditNews(n)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" title="Hapus Berita" onClick={() => deleteItem("news", n._id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

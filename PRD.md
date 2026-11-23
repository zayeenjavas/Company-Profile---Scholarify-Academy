# Product Requirements Document (PRD) — Platform Scholarify (Full TypeScript)

## 1. Ringkasan Produk
**Scholarify** adalah platform pendidikan terpadu yang menyatukan **Landing Page Editorial & Interaktif**, **Portal TryOut UTBK-SNBT CBT**, **Sistem Langganan (`Subscription Gating`)**, **Sanity CMS (Mentor, Testimoni, Berita)**, dan **CRM Admin Dashboard 6-Tab** dalam satu arsitektur **Full TypeScript** (Next.js 16 + React 19 + Tailwind CSS v4 + `shadcn/ui` + Prisma ORM + JWT + Zod + KaTeX + GSAP + Motion + Lenis).

---

## 2. Role & Hak Akses
1. **Pengunjung / Siswa Gratis (`STUDENT`, `subscription.isActive = false`)**
   - Mengakses Landing Page (`/`) dengan video Hero full-screen, Program Unggulan, Tentang Kami, Paket TryOut, Tim & Mentor (Studio Portrait + filter *Tim Inti* / *Tim Mentor* / *Semua* dengan Lenis horizontal smooth scroll), Testimoni, Artikel/Berita (support LaTeX), Banner CTA, dan Kontak.
   - Hanya dapat mengerjakan paket TryOut berstatus `PUBLISHED` dengan tier `FREE` (mis. `batch-1`, `paket-mini-gratis`). Paket `PREMIUM` tampil terkunci dan diblokir di server (`403 SUBSCRIPTION_REQUIRED`).
2. **Siswa Berlangganan (`STUDENT`, `subscription.isActive = true`)**
   - Halaman `/` dan `/tryout` menyesuaikan menjadi Portal Belajar Siswa tanpa banner promo daftar.
   - Mendapat akses penuh ke seluruh paket `PUBLISHED` (`FREE` & `PREMIUM`) serta halaman review pembahasan (`/tryout/review/[sessionId]`) dengan rendering rumus matematika KaTeX.
3. **Admin (`ADMIN`)**
   - Mengakses `/admin` (dilindungi JWT + `requireRole(req, "ADMIN")`) untuk mengelola 6 tab CRM:
     1. **Overview & Analitik:** KPI peserta aktif, sesi selesai, rata-rata skor per subtes, dan grafik tren.
     2. **Paket TryOut:** CRUD paket dengan state machine `DRAFT → PUBLISHED → ARCHIVED`.
     3. **Bank Soal (LaTeX Word-Style Editor):** CRUD soal & pembahasan dengan toolbar **Equation & Format** (`$...$`, `$$...$$`, pecahan, akar, integral, sigma, limit, matriks, simbol cepat) dan **Live Preview KaTeX** pada pertanyaan, opsi A–E, dan pembahasan.
     4. **Monitoring & Hasil:** pantau sesi live (`BERLANGSUNG`, `TERDAFTAR`, `SELESAI`, `WAKTU_HABIS`, `DINILAI`), aksi *Force Finish* / *Reset*, serta ekspor nilai.
     5. **Pengguna & Langganan:** kelola akun siswa/admin, status aktif, dan aktivasi paket `FREE` ↔ `PREMIUM`.
     6. **CMS Landing Page (Sanity CRM):** kelola Mentor, Testimoni, serta CRUD Berita/Artikel lengkap dengan editor LaTeX **Equation & Format** + upload gambar tervalidasi.

---

## 3. Topologi, State Machine & Rendering Matematika

### 3.1. State Machine Paket & Sesi Ujian
- **Paket Tryout:** `DRAFT` → `PUBLISHED` (wajib minimal 1 soal) → `ARCHIVED`.
- **Sesi Ujian:** `TERDAFTAR` → `BERLANGSUNG` (server catat `startedAt` & `expiresAt`) → `SELESAI` / `WAKTU_HABIS` → `DINILAI` (penilaian atomik di server berdasarkan bobot soal).

### 3.2. Dukungan LaTeX End-to-End
- **Input CRM Admin:** [LatexToolbarEditor.tsx](./frontend/src/components/admin/LatexToolbarEditor.tsx) menyediakan toolbar ala Microsoft Word + live preview KaTeX pada Bank Soal dan Berita CMS.
- **Rendering Publik & Siswa:** [RichMathText.tsx](./frontend/src/components/common/RichMathText.tsx) merender sintaks `$...$`, `$$...$$`, `\(...\)`, `\[...\]`, `**bold**`, dan `*italic*` secara aman di ruang ujian CBT, pembahasan soal, ringkasan berita, dan detail artikel.

---

## 4. Keamanan Web & Ketahanan Ujian CBT
1. **Zero Leak Kunci Jawaban:** Endpoint `POST /api/v1/sessions/start` hanya mengembalikan `ExamQuestionDto` tanpa `is_correct` atau `explanation`. Pembahasan hanya dibuka oleh `GET /api/v1/sessions/:id/review` setelah sesi berstatus `DINILAI`.
2. **RBAC Ketat & JWT HttpOnly:** Seluruh endpoint `/api/v1/admin/*` wajib melewati `requireRole(req, "ADMIN")` dan validasi skema `zod`.
3. **Security Headers Produksi (`next.config.js`):** `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`, dan menonaktifkan `X-Powered-By`.
4. **Validasi Upload Media:** Endpoint upload gambar Sanity membatasi MIME type gambar (`JPG`, `PNG`, `WebP`, `GIF`, `AVIF`) dan ukuran maksimal `5 MB`.
5. **Server-Synced Timer & Offline Queue:** Sisa waktu CBT dihitung dari `expiresAt` & `serverNow`; jawaban otomatis disimpan ke `localStorage` dan di-flush ke `PUT /api/v1/sessions/:id/answers/:q_id` saat koneksi kembali.
6. **PWA Network-Only API:** Service Worker (`public/sw.js`) menerapkan aturan **Network-Only** untuk `/api/*` agar soal, jawaban, dan token tidak pernah tersimpan di Cache Storage.

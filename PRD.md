# Product Requirements Document (PRD) — Platform Scholarify (Full TypeScript)

## 1. Ringkasan Produk
**Scholarify** adalah platform terpadu yang menyatukan **Landing Page**, **Portal TryOut UTBK CBT**, **Sistem Langganan (`Subscription Gating`)**, dan **Admin Dashboard** berbasis **Full TypeScript** (Next.js 16 + React 19 + Tailwind CSS v4 + Prisma ORM + JWT + Zod).

---

## 2. Role & Hak Akses
1. **Pengunjung / Siswa Gratis (`STUDENT`, `subscription.isActive = false`)**
   - Melihat Landing Page penuh (`/`) beserta info keunggulan dan CTA berlangganan.
   - Hanya dapat mengerjakan paket TryOut berstatus `PUBLISHED` dengan tier `FREE`. Paket `PREMIUM` tampil terkunci dan diblokir di server (`403 SUBSCRIPTION_REQUIRED`).
2. **Siswa Berlangganan (`STUDENT`, `subscription.isActive = true`)**
   - Halaman `/` dan `/tryout` menyesuaikan menjadi Portal Belajar Siswa tanpa banner promo daftar.
   - Mendapat akses penuh ke seluruh paket `PUBLISHED` (termasuk `PREMIUM`) dan halaman review pembahasan (`/tryout/review/[sessionId]`).
3. **Admin (`ADMIN`)**
   - Mengakses `/admin` (dilindungi JWT + `requireRole("ADMIN")`) untuk mengelola Overview, Paket Tryout, Bank Soal, Monitoring Sesi Live/Hasil, serta Pengguna & Langganan.

---

## 3. Topologi & State Machine

### 3.1. State Machine Paket & Sesi Ujian
- **Paket Tryout:** `DRAFT` → `PUBLISHED` (wajib minimal 1 soal) → `ARCHIVED`.
- **Sesi Ujian:** `TERDAFTAR` → `BERLANGSUNG` (server catat `startedAt` & `expiresAt`) → `SELESAI` / `WAKTU_HABIS` → `DINILAI` (penilaian atomik di server).

### 3.2. Keamanan & Ketahanan Ujian CBT
1. **Zero Leak Kunci Jawaban:** Endpoint `POST /api/v1/sessions/start` hanya mengembalikan `ExamQuestionDto` tanpa `is_correct` atau `explanation`. Pembahasan hanya dibuka oleh `GET /api/v1/sessions/:id/review` setelah sesi berstatus `DINILAI`.
2. **Server-Synced Timer:** Sisa waktu dihitung dari `expiresAt` dan `serverNow` dari server (dengan `tabular-nums`, peringatan visual `< 5 menit` dan `< 1 menit`).
3. **Auto-Save & Offline Queue:** Setiap klik opsi atau tanda *Ragu-ragu* disimpan ke `localStorage` lalu dikirim ke `PUT /api/v1/sessions/:id/answers/:q_id`. Jika koneksi terputus, antrean otomatis di-flush saat online kembali dan sebelum submit.
4. **PWA Network-Only API:** Service Worker (`public/sw.js`) menerapkan aturan **Network-Only** untuk `/api/*` agar soal, jawaban, dan token tidak pernah tersimpan di Cache Storage.

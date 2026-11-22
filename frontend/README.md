# Scholarify TryOut — Frontend

Frontend platform simulasi TryOut UTBK dan Admin Dashboard berbasis **Next.js 16 + React 19 + TypeScript + Tailwind CSS**.

## Halaman Utama

### Untuk Siswa / Umum
- `/login` — Halaman login (autentikasi ke backend Django via `/api/login` dan penyimpanan cookie `session`).
- `/tryout` — Daftar batch tryout yang tersedia (`GET /api/batches/`) serta tabel & grafik riwayat nilai (`HistoryTable`).
- `/tryout/[batchId]` — Halaman instruksi sebelum memulai batch tryout.
- `/tryout/[batchId]/do` — Daftar 7 subtest UTBK (`PU`, `PPU`, `PBM`, `PK`, `LBI`, `LBE`, `PM`) lengkap dengan status pengerjaan & skor dari backend.
- `/tryout/[batchId]/[subtest]` — Halaman pengerjaan soal dengan timer, navigasi soal, dukungan gambar soal, dan submit jawaban ke `POST /api/submit-jawaban/`.

### Untuk Admin
- `/admin` — Admin Dashboard SPA (hanya dapat diakses jika `user.role === "admin"`):
  - **Dashboard:** Statistik user, soal, rata-rata skor per subtest, dan top 10 peserta.
  - **Bank Soal:** CRUD soal, filter batch/subtest, upload gambar, import Excel, dan manajemen Batch TryOut.
  - **Pengguna:** CRUD user, import Excel, toggle aktif/nonaktif, reveal & update password.
  - **Hasil Tryout:** Daftar nilai peserta dan detail jawaban per soal.

## Menjalankan Secara Lokal

1. Pastikan backend Django sudah berjalan di `http://localhost:8000` (lihat [README.md](file:///c:/Users/ThinkPad/Documents/PROJECT/Website%20Scholarify/README.md)).
2. Pastikan file `.env.local` ada di folder `frontend/`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```
3. Install dependencies & jalankan dev server (Node.js `>= 20.9.0`):
   ```powershell
   npm install
   npm run dev
   ```
   *(Script `dev` menjalankan `next dev --webpack`.)*

4. Verifikasi type-check tanpa build:
   ```powershell
   npx tsc --noEmit
   ```

5. Build production:
   ```powershell
   npm run build
   ```

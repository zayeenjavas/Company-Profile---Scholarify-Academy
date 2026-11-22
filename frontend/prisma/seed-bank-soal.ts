export interface SeedQuestionItem {
  subtestCode: "PU" | "PPU" | "PBM" | "PK" | "LBI" | "LBE" | "PM";
  stemContent: string;
  choices: [string, string, string, string, string];
  correctLabel: "A" | "B" | "C" | "D" | "E";
  weight: number;
  explanation: string;
}

export const BANK_SOAL_BY_SUBTEST: Record<SeedQuestionItem["subtestCode"], Omit<SeedQuestionItem, "subtestCode">[]> = {
  PU: [
    {
      stemContent:
        "Semua peserta program intensif UTBK diwajibkan mengikuti simulasi mingguan. Sebagian mahasiswa tingkat akhir adalah peserta program intensif UTBK. Simpulan yang paling tepat adalah...",
      choices: [
        "Semua mahasiswa tingkat akhir wajib mengikuti simulasi mingguan.",
        "Sebagian mahasiswa tingkat akhir wajib mengikuti simulasi mingguan.",
        "Semua peserta simulasi mingguan adalah mahasiswa tingkat akhir.",
        "Tidak ada mahasiswa tingkat akhir yang mengikuti simulasi mingguan.",
        "Sebagian peserta program intensif bukan peserta simulasi.",
      ],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Karena sebagian mahasiswa tingkat akhir termasuk peserta program intensif, dan seluruh peserta program intensif wajib mengikuti simulasi mingguan, maka sebagian mahasiswa tingkat akhir wajib mengikuti simulasi mingguan.",
    },
    {
      stemContent:
        "Jika tingkat literasi digital meningkat, maka masyarakat lebih kritis terhadap informasi hoaks. Saat ini masyarakat tidak lebih kritis terhadap informasi hoaks. Simpulan yang sah adalah...",
      choices: [
        "Tingkat literasi digital meningkat.",
        "Tingkat literasi digital tidak meningkat.",
        "Hoaks semakin berkurang di media sosial.",
        "Masyarakat tidak menggunakan media sosial.",
        "Literasi digital tidak berpengaruh terhadap hoaks.",
      ],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Menggunakan modus tollens: jika P → Q dan ¬Q benar, maka ¬P pasti benar. Jadi tingkat literasi digital tidak meningkat.",
    },
    {
      stemContent:
        "Perhatikan pola barisan bilangan berikut: 3, 7, 15, 31, 63, .... Bilangan selanjutnya yang tepat untuk melengkapi barisan tersebut adalah...",
      choices: ["95", "111", "125", "127", "131"],
      correctLabel: "D",
      weight: 2,
      explanation:
        "Pola selisihnya adalah +4, +8, +16, +32, sehingga selisih berikutnya +64. Maka 63 + 64 = 127 (atau pola 2n + 1).",
    },
    {
      stemContent:
        "Lima siswa—Andi, Budi, Citra, Dina, dan Eka—duduk berjajar. Budi duduk di antara Andi dan Citra. Eka duduk di ujung paling kanan, sedangkan Dina tidak bersebelahan dengan Eka. Siapakah yang duduk tepat di tengah?",
      choices: ["Andi", "Budi", "Citra", "Dina", "Eka"],
      correctLabel: "B",
      weight: 2,
      explanation:
        "Eka di posisi 5. Dina tidak bersebelahan dengan Eka sehingga Dina di posisi 1 (jika A-B-C di 2-3-4). Dengan urutan Dina, Andi, Budi, Citra, Eka, maka yang duduk di tengah (posisi 3) adalah Budi.",
    },
    {
      stemContent:
        "Dalam sebuah survei, 70% responden menyukai belajar melalui video interaktif dan 60% menyukai latihan soal adaptif. Jika setiap responden menyukai minimal satu metode, persentase responden yang menyukai kedua metode tersebut adalah...",
      choices: ["10%", "20%", "30%", "40%", "50%"],
      correctLabel: "C",
      weight: 1,
      explanation:
        "Gunakan prinsip inklusi-eksklusi: 70% + 60% - 100% = 30% responden menyukai keduanya.",
    },
  ],
  PPU: [
    {
      stemContent:
        "Kata 'ekosistem' pada kalimat 'Pemerintah membangun ekosistem riset yang kolaboratif di perguruan tinggi' memiliki makna asosiatif yang paling dekat dengan...",
      choices: [
        "Lingkungan fisik laboratorium",
        "Sistem hubungan timbal balik yang saling mendukung",
        "Anggaran penelitian tahunan",
        "Peraturan akademik mahasiswa",
        "Kumpulan gedung perkuliahan",
      ],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Secara metaforis/asosiatif dalam konteks riset dan inovasi, ekosistem berarti jejaring atau sistem hubungan timbal balik antaraktor yang saling mendukung.",
    },
    {
      stemContent:
        "Manakah kelompok kata berikut yang seluruhnya merupakan kata baku menurut KBBI?",
      choices: [
        "analisis, apotek, jadwal, sistem",
        "analisa, apotik, jadual, sistim",
        "analisis, apotik, jadwal, sistem",
        "analisa, apotek, jadwal, sistem",
        "analisis, apotek, jadual, sistim",
      ],
      correctLabel: "A",
      weight: 1,
      explanation:
        "Bentuk baku menurut KBBI adalah analisis (bukan analisa), apotek (bukan apotik), jadwal (bukan jadual), dan sistem (bukan sistim).",
    },
    {
      stemContent:
        "Kalimat manakah yang mengandung makna denotatif murni tanpa majas?",
      choices: [
        "Berita itu membakar semangat para relawan muda.",
        "Ia menjadi tulang punggung keluarganya sejak lulus kuliah.",
        "Suhu udara di dataran tinggi itu turun hingga 14 derajat Celsius.",
        "Kota pelabuhan tersebut tidak pernah tidur sepanjang malam.",
        "Janji manis kampanye sering kali cepat menguap.",
      ],
      correctLabel: "C",
      weight: 1,
      explanation:
        "Kalimat pada pilihan C menyatakan fakta suhu secara lugas (denotatif), sedangkan pilihan lain menggunakan ungkapan/majas.",
    },
    {
      stemContent:
        "Imbuhan meN-kan pada kalimat 'Dosen itu membacakan ringkasan materi' memiliki fungsi makna yang sama dengan imbuhan meN-kan pada kalimat...",
      choices: [
        "Adik membersihkan meja belajarnya sebelum tidur.",
        "Kakak membelikan ibu sebuah selendang batik.",
        "Petani menanamkan benih padi unggul di sawah.",
        "Angin kencang menumbangkan pohon di tepi jalan.",
        "Teknologi digital memudahkan transaksi lintas negara.",
      ],
      correctLabel: "B",
      weight: 2,
      explanation:
        "Membacakan (untuk orang lain) dan membelikan (untuk orang lain) sama-sama bermakna benefaktif (melakukan perbuatan untuk orang lain).",
    },
    {
      stemContent:
        "Sinonim paling tepat untuk kata 'akselerasi' dalam konteks kebijakan pembangunan adalah...",
      choices: ["perlambatan", "penundaan", "percepatan", "pemerataan", "pembatasan"],
      correctLabel: "C",
      weight: 1,
      explanation:
        "Akselerasi berarti proses mempercepat atau peningkatan laju kecepatan (percepatan).",
    },
  ],
  PBM: [
    {
      stemContent:
        "Penulisan judul karangan ilmiah yang sesuai dengan EYD Edisi V adalah...",
      choices: [
        "Pemanfaatan Energi Surya Untuk Sekolah Di Daerah Terpencil",
        "Pemanfaatan Energi Surya untuk Sekolah di Daerah Terpencil",
        "Pemanfaatan energi surya untuk sekolah di daerah terpencil",
        "Pemanfaatan Energi Surya Untuk Sekolah di Daerah Terpencil",
        "Pemanfaatan Energi Surya untuk Sekolah Di Daerah Terpencil",
      ],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Dalam penulisan judul, setiap kata diawali huruf kapital kecuali kata tugas (preposisi/konjungsi seperti 'untuk' dan 'di') yang tidak berada di awal judul.",
    },
    {
      stemContent:
        "Perbaikan paling efektif untuk kalimat tidak baku 'Bagi para peserta diharapkan segera memasuki ruang ujian' adalah...",
      choices: [
        "Kepada para peserta diharapkan segera memasuki ruang ujian.",
        "Para peserta diharapkan segera memasuki ruang ujian.",
        "Untuk para peserta diharap agar segera memasuki ruang ujian.",
        "Bagi peserta-peserta diharapkan segera masuk ke ruang ujian.",
        "Para peserta-peserta diharapkan segera memasuki ruang ujian.",
      ],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Penggunaan kata depan 'Bagi' di awal kalimat membuat kalimat kehilangan subjek. Menghapus 'Bagi' menjadikan 'Para peserta' sebagai subjek yang jelas.",
    },
    {
      stemContent:
        "Penggunaan tanda koma yang paling tepat terdapat pada kalimat...",
      choices: [
        "Meskipun hujan deras, mereka tetap berangkat mengikuti tryout.",
        "Mereka tetap berangkat mengikuti tryout, meskipun hujan deras.",
        "Ibu membeli buku tulis pensil, dan penggaris di toko.",
        "Karena terlambat bangun ia, tidak sempat sarapan pagi.",
        "Siswa yang rajin belajar itu, meraih nilai tertinggi.",
      ],
      correctLabel: "A",
      weight: 1,
      explanation:
        "Anak kalimat yang mendahului induk kalimat ('Meskipun hujan deras, ...') dipisahkan dengan tanda koma.",
    },
    {
      stemContent:
        "Kata serapan yang penulisannya sudah tepat sesuai kaidah bahasa Indonesia adalah...",
      choices: ["kreatifitas", "aktifitas", "efektivitas", "obyek", "tehnologi"],
      correctLabel: "C",
      weight: 2,
      explanation:
        "Penulisan baku adalah efektivitas (bukan efektifitas), kreativitas, aktivitas, objek, dan teknologi.",
    },
    {
      stemContent:
        "Konjungsi antarkalimat yang menyatakan pertentangan dengan kalimat sebelumnya adalah...",
      choices: [
        "Oleh karena itu,",
        "Selain itu,",
        "Dengan demikian,",
        "Meskipun demikian,",
        "Selanjutnya,",
      ],
      correctLabel: "D",
      weight: 1,
      explanation:
        "'Meskipun demikian,' berfungsi menyatakan pertentangan atau konsesif terhadap gagasan pada kalimat sebelumnya.",
    },
  ],
  PK: [
    {
      stemContent:
        "Jika 3x - 7 = 2x + 5, maka nilai dari x² - 4x adalah...",
      choices: ["64", "72", "84", "96", "108"],
      correctLabel: "D",
      weight: 1,
      explanation:
        "Dari 3x - 7 = 2x + 5 diperoleh x = 12. Maka x² - 4x = 12² - 4(12) = 144 - 48 = 96.",
    },
    {
      stemContent:
        "Rata-rata nilai 8 siswa adalah 75. Jika 2 siswa baru bergabung sehingga rata-rata menjadi 78, berapakah rata-rata nilai kedua siswa baru tersebut?",
      choices: ["84", "86", "88", "90", "92"],
      correctLabel: "D",
      weight: 2,
      explanation:
        "Jumlah nilai 8 siswa = 8 × 75 = 600. Jumlah nilai 10 siswa = 10 × 78 = 780. Selisihnya 180 untuk 2 siswa, sehingga rata-ratanya 180 / 2 = 90.",
    },
    {
      stemContent:
        "Sebuah segitiga siku-siku memiliki panjang sisi miring 13 cm dan salah satu sisi siku-sikunya 5 cm. Luas segitiga tersebut adalah...",
      choices: ["24 cm²", "30 cm²", "32,5 cm²", "60 cm²", "65 cm²"],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Sisi siku-siku lainnya = √(13² - 5²) = √144 = 12 cm. Luas = ½ × 5 × 12 = 30 cm².",
    },
    {
      stemContent:
        "Diketahui fungsi f(x) = 2x + 3 dan g(x) = x - 4. Nilai dari (f ∘ g)(6) adalah...",
      choices: ["5", "7", "9", "11", "13"],
      correctLabel: "B",
      weight: 1,
      explanation: "g(6) = 6 - 4 = 2. Kemudian f(2) = 2(2) + 3 = 7.",
    },
    {
      stemContent:
        "Peluang munculnya jumlah mata dadu sama dengan 9 pada pelemparan dua buah dadu setimbang secara bersamaan adalah...",
      choices: ["1/12", "1/9", "5/36", "1/6", "7/36"],
      correctLabel: "B",
      weight: 2,
      explanation:
        "Pasangan berjumlah 9 ada 4 kejadian: (3,6), (4,5), (5,4), (6,3) dari 36 ruang sampel. Peluang = 4/36 = 1/9.",
    },
  ],
  LBI: [
    {
      stemContent:
        "Bacalah kutipan berikut: 'Peralihan menuju energi terbarukan tidak hanya menuntut kesiapan teknologi, tetapi juga perubahan perilaku konsumsi energi di tingkat rumah tangga. Tanpa kesadaran pengguna, efisiensi alat listrik modern tetap tidak akan menekan beban puncak jaringan.' Gagasan utama paragraf tersebut adalah...",
      choices: [
        "Harga panel surya rumah tangga masih terlalu mahal.",
        "Teknologi energi terbarukan sudah sepenuhnya menggantikan energi fosil.",
        "Transisi energi terbarukan membutuhkan kesiapan teknologi sekaligus perubahan perilaku konsumen.",
        "Beban puncak jaringan listrik hanya terjadi pada malam hari.",
        "Alat listrik modern selalu boros energi.",
      ],
      correctLabel: "C",
      weight: 1,
      explanation:
        "Kalimat pertama merangkum inti paragraf bahwa transisi energi membutuhkan kesiapan teknologi dan perubahan perilaku konsumsi energi.",
    },
    {
      stemContent:
        "Dalam teks laporan penelitian, kalimat 'Peningkatan kadar mikroplastik di perairan pesisir berkorelasi positif dengan kepadatan aktivitas wisata bahari' bermakna...",
      choices: [
        "Wisata bahari tidak memengaruhi ekosistem laut.",
        "Semakin padat aktivitas wisata bahari, semakin tinggi kecenderungan kadar mikroplastik.",
        "Mikroplastik membantu pertumbuhan terumbu karang.",
        "Aktivitas wisata bahari menurunkan kadar mikroplastik secara drastis.",
        "Mikroplastik hanya ditemukan di laut dalam.",
      ],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Korelasi positif berarti kedua variabel bergerak searah: ketika kepadatan wisata bahari meningkat, kadar mikroplastik juga cenderung meningkat.",
    },
    {
      stemContent:
        "Tujuan penulis menyertakan data statistik Kementerian Pendidikan dalam sebuah artikel opini mengenai pemerataan akses internet sekolah adalah...",
      choices: [
        "Memperpanjang jumlah halaman artikel",
        "Menggantikan seluruh argumen pribadi penulis",
        "Memperkuat kredibilitas argumen dengan bukti empiris",
        "Menyalahkan pembaca atas ketimpangan digital",
        "Mempromosikan penyedia layanan internet tertentu",
      ],
      correctLabel: "C",
      weight: 1,
      explanation:
        "Data resmi dari instansi berwenang digunakan dalam teks argumentatif/opini untuk memperkuat landasan fakta dan kredibilitas argumen.",
    },
    {
      stemContent:
        "Pernyataan yang bersifat opini dalam sebuah berita lingkungan adalah...",
      choices: [
        "Curah hujan tercatat sebesar 120 mm dalam enam jam terakhir.",
        "Sebanyak 14 desa terdampak genangan air setinggi 40 cm.",
        "Pemerintah daerah mendirikan tiga posko pengungsian terpadu.",
        "Sistem drainase kota seharusnya dirancang ulang agar lebih adaptif terhadap cuaca ekstrem.",
        "Debit sungai utama naik dua meter sejak pukul 03.00 WIB.",
      ],
      correctLabel: "D",
      weight: 1,
      explanation:
        "Kata 'seharusnya' menunjukkan saran, penilaian, atau pandangan subjektif (opini), bukan fakta terukur.",
    },
    {
      stemContent:
        "Sikap penulis yang tergambar apabila ia mengkritik lambannya pengelolaan sampah plastik sambil menawarkan skema bank sampah berbasis komunitas adalah...",
      choices: [
        "pesimistis dan apatis",
        "kritis sekaligus solutif",
        "netral tanpa keberpihakan",
        "ragu-ragu dan defensif",
        "emosional tanpa dasar",
      ],
      correctLabel: "B",
      weight: 2,
      explanation:
        "Mengidentifikasi kelemahan sistem sekaligus mengajukan alternatif penyelesaian mencerminkan sikap kritis dan solutif.",
    },
  ],
  LBE: [
    {
      stemContent:
        "Read the excerpt: 'Urban vertical farming reduces transportation emissions by growing leafy greens closer to city consumers, though high initial setup costs remain a barrier for small entrepreneurs.' What is the main challenge mentioned in the text?",
      choices: [
        "Lack of consumer interest in leafy greens",
        "Excessive transportation emissions",
        "High upfront investment required to start",
        "Shortage of urban land for skyscrapers",
        "Difficulty in harvesting crops manually",
      ],
      correctLabel: "C",
      weight: 1,
      explanation:
        "The text explicitly states that 'high initial setup costs remain a barrier for small entrepreneurs', which corresponds to high upfront investment.",
    },
    {
      stemContent:
        "In the sentence 'Although the algorithm performed remarkably well in controlled trials, its accuracy declined slightly under noisy real-world conditions,' the word 'declined' is closest in meaning to...",
      choices: ["expanded", "decreased", "stabilized", "accelerated", "multiplied"],
      correctLabel: "B",
      weight: 1,
      explanation:
        "'Declined' in the context of performance/accuracy means dropped or decreased.",
    },
    {
      stemContent:
        "Read the statement: 'Peer-reviewed studies consistently indicate that spaced repetition outperforms last-minute cramming for long-term knowledge retention.' What can be inferred?",
      choices: [
        "Cramming is superior for retaining concepts over several months.",
        "Distributing study sessions over time leads to better long-term memory.",
        "Peer-reviewed studies discourage any form of exam review.",
        "Spaced repetition only works for mathematics.",
        "Students should study only once right before an exam.",
      ],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Spaced repetition means distributing review over intervals, which outperforms cramming for long-term retention.",
    },
    {
      stemContent:
        "Which transition word best completes the sentence? 'Public libraries provide free access to digital archives; ______, they host weekly literacy workshops for local youth.'",
      choices: ["however", "moreover", "nevertheless", "otherwise", "instead"],
      correctLabel: "B",
      weight: 1,
      explanation:
        "'Moreover' adds supporting information consistent with the previous positive point about public libraries.",
    },
    {
      stemContent:
        "If an author writes a review praising a documentary's cinematography while pointing out gaps in its historical timeline, the author's tone is best described as...",
      choices: [
        "wholly dismissive",
        "balanced and analytical",
        "overly enthusiastic",
        "indifferent",
        "sarcastic",
      ],
      correctLabel: "B",
      weight: 2,
      explanation:
        "Acknowledging strengths alongside specific weaknesses reflects a balanced and analytical tone.",
    },
  ],
  PM: [
    {
      stemContent:
        "Sebuah tangki air berbentuk tabung memiliki jari-jari alas 70 cm dan tinggi 100 cm. Jika tangki terisi ¾ bagian, berapa liter air yang ada di dalam tangki? (π = 22/7)",
      choices: ["1.155 liter", "1.250 liter", "1.540 liter", "770 liter", "980 liter"],
      correctLabel: "A",
      weight: 2,
      explanation:
        "r = 7 dm, t = 10 dm. Volume penuh = (22/7) × 7² × 10 = 1.540 dm³ = 1.540 liter. Terisi ¾ bagian = ¾ × 1.540 = 1.155 liter.",
    },
    {
      stemContent:
        "Harga sebuah buku sebelum diskon adalah Rp120.000. Toko memberikan diskon 25%, lalu anggota memperoleh tambahan diskon 10% dari harga setelah diskon pertama. Berapa yang harus dibayar anggota?",
      choices: ["Rp78.000", "Rp81.000", "Rp84.000", "Rp85.500", "Rp90.000"],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Setelah diskon 25%: 75% × 120.000 = Rp90.000. Tambahan diskon 10%: 90% × 90.000 = Rp81.000.",
    },
    {
      stemContent:
        "Sebuah kereta melaju dengan kecepatan rata-rata 80 km/jam menempuh jarak 200 km. Jika berangkat pukul 07.15 dan berhenti istirahat selama 15 menit di tengah perjalanan, pukul berapa kereta tiba di tujuan?",
      choices: ["09.45", "10.00", "10.15", "10.30", "10.45"],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Waktu tempuh = 200 / 80 = 2,5 jam (2 jam 30 menit). Ditambah istirahat 15 menit menjadi 2 jam 45 menit. 07.15 + 2 jam 45 menit = 10.00.",
    },
    {
      stemContent:
        "Dalam sebuah kelas terdapat 36 siswa. Perbandingan jumlah siswa yang memilih ekstrakurikuler Robotik dan Jurnalistik adalah 5 : 4. Jika semua siswa wajib memilih tepat satu dari keduanya, selisih jumlah peserta kedua ekstrakurikuler adalah...",
      choices: ["2 siswa", "4 siswa", "6 siswa", "8 siswa", "10 siswa"],
      correctLabel: "B",
      weight: 1,
      explanation:
        "Total rasio = 5 + 4 = 9. Selisih rasio = 5 - 4 = 1. Selisih siswa = (1/9) × 36 = 4 siswa.",
    },
    {
      stemContent:
        "Sebuah usaha fotokopi mematok tarif Rp300 per lembar untuk 50 lembar pertama, dan Rp200 per lembar untuk setiap lembar berikutnya. Jika Rina membayar Rp23.000, berapa total lembar yang ia fotokopi?",
      choices: ["80 lembar", "85 lembar", "90 lembar", "95 lembar", "100 lembar"],
      correctLabel: "C",
      weight: 2,
      explanation:
        "50 lembar pertama = 50 × 300 = Rp15.000. Sisa biaya = 23.000 - 15.000 = Rp8.000 untuk 8.000 / 200 = 40 lembar. Total = 50 + 40 = 90 lembar.",
    },
  ],
};

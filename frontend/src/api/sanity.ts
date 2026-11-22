export interface SanityMentor {
  _id: string;
  nama: string;
  jabatan: string;
  kampus: string;
  kategori?: "tim-inti" | "tim-mentor" | string;
  urutan?: number;
  fotoUrl?: string;
  logoKampusUrl?: string;
}

export interface SanityTestimonial {
  _id: string;
  nama: string;
  asalKampus: string;
  isi: string;
  rating: number;
  fotoUrl?: string;
}

export interface PortableTextSpan {
  _type?: string;
  _key?: string;
  text?: string;
  marks?: string[];
}

export interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: string;
  children?: PortableTextSpan[];
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
  asset?: { _ref?: string; url?: string };
}

export interface SanityNews {
  _id: string;
  judul: string;
  ringkasan: string;
  isiLengkap?: PortableTextBlock[];
  tanggal: string;
  urutan?: number;
  gambarUrl?: string;
}

const SANITY_PROJECT_ID = "gbwew0c6";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

async function fetchGroq<T>(query: string): Promise<T[]> {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url, { next: { revalidate: 120 } });
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`);
  const json = await res.json();
  return (json?.result ?? []) as T[];
}

export async function fetchLandingCmsData(): Promise<{
  mentors: SanityMentor[];
  testimonials: SanityTestimonial[];
  news: SanityNews[];
}> {
  const fallbackMentors: SanityMentor[] = [
    { _id: "m1", nama: "Tim Akademik PU & PM", jabatan: "Lead Mentor Penalaran", kampus: "ITB", kategori: "tim-inti" },
    { _id: "m2", nama: "Tim Akademik Literasi", jabatan: "Mentor Literasi ID & EN", kampus: "UI", kategori: "tim-inti" },
    { _id: "m3", nama: "Tim Akademik Kuantitatif", jabatan: "Mentor Matematika & PK", kampus: "UGM", kategori: "tim-mentor" },
    { _id: "m4", nama: "Tim Konsultasi PTN", jabatan: "Konselor Strategi SNBT", kampus: "UNAIR", kategori: "tim-mentor" },
  ];

  const fallbackTestimonials: SanityTestimonial[] = [
    {
      _id: "t1",
      nama: "Alya Putri",
      asalKampus: "Diterima di STEI ITB",
      isi: "Simulasi TryOut Scholarify bikin aku terbiasa dengan manajemen waktu per subtest dan pembahasan soalnya sangat jelas.",
      rating: 5,
    },
    {
      _id: "t2",
      nama: "Rafi Pratama",
      asalKampus: "Diterima di Kedokteran UI",
      isi: "Fitur auto-save dan timer yang konsisten sangat membantu saat latihan dari rumah tanpa takut jawaban hilang.",
      rating: 5,
    },
  ];

  const fallbackNews: SanityNews[] = [
    {
      _id: "n1",
      judul: "Strategi Mengatur Waktu 7 Subtest UTBK-SNBT",
      ringkasan: "Pelajari pembagian waktu efektif agar setiap subtest terselesaikan maksimal tanpa panik.",
      tanggal: "2026-11-10",
      gambarUrl: "/images/program-tryout.jpg",
    },
    {
      _id: "n2",
      judul: "Bedah Pola Soal Penalaran Matematika Terbaru",
      ringkasan: "Rangkuman tipe soal kontekstual yang paling sering muncul beserta pendekatan cepatnya.",
      tanggal: "2026-11-05",
      gambarUrl: "/images/program-intensif.jpg",
    },
    {
      _id: "n3",
      judul: "Tips Memilih Program Studi Sesuai Passing Grade",
      ringkasan: "Cara membaca tren skor tryout untuk menentukan pilihan 1 dan 2 SNBT secara realistis.",
      tanggal: "2026-10-28",
      gambarUrl: "/images/program-konsultasi.jpg",
    },
  ];

  try {
    const [mentors, testimonials, news] = await Promise.all([
      fetchGroq<SanityMentor>(
        `*[_type == "mentor"] | order(urutan asc){_id, nama, jabatan, kampus, kategori, urutan, "fotoUrl": foto.asset->url, "logoKampusUrl": logoKampus.asset->url}`
      ),
      fetchGroq<SanityTestimonial>(
        `*[_type == "testimonial"]{_id, nama, asalKampus, isi, rating, "fotoUrl": foto.asset->url}`
      ),
      fetchGroq<SanityNews>(
        `*[_type == "news"] | order(tanggal desc)[0...6]{_id, judul, ringkasan, isiLengkap, tanggal, urutan, "gambarUrl": gambar.asset->url}`
      ),
    ]);

    return {
      mentors: mentors.length > 0 ? mentors : fallbackMentors,
      testimonials: testimonials.length > 0 ? testimonials : fallbackTestimonials,
      news: news.length > 0 ? news : fallbackNews,
    };
  } catch {
    return {
      mentors: fallbackMentors,
      testimonials: fallbackTestimonials,
      news: fallbackNews,
    };
  }
}

export async function fetchNewsById(id: string): Promise<SanityNews | null> {
  try {
    const items = await fetchGroq<SanityNews>(
      `*[_type == "news" && _id == "${id.replace(/"/g, "")}"]{_id, judul, ringkasan, isiLengkap, tanggal, "gambarUrl": gambar.asset->url}`
    );
    return items[0] ?? null;
  } catch {
    return null;
  }
}

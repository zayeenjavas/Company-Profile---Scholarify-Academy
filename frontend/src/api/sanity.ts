import blogspotRaw from "@/src/data/blogspot-news.json";

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

function getBlogspotNews(): SanityNews[] {
  return (blogspotRaw as Array<{ title: string; published: string; image: string; paragraphs: string[] }>).map(
    (item, idx) => ({
      _id: `blogspot-${idx + 1}`,
      judul: item.title,
      ringkasan: item.paragraphs[0]?.slice(0, 180) + (item.paragraphs[0]?.length > 180 ? "…" : "") || item.title,
      tanggal: item.published,
      gambarUrl: item.image,
      isiLengkap: item.paragraphs.map((p, pIdx) => ({
        _type: "block",
        _key: `b-${idx}-${pIdx}`,
        style: "normal",
        children: [{ _type: "span", _key: `s-${idx}-${pIdx}`, text: p }],
      })),
    })
  );
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

  const blogspotItems = getBlogspotNews();
  const fallbackNews: SanityNews[] = blogspotItems;

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

    const existingTitles = new Set(news.map((n) => n.judul.toLowerCase()));
    const mergedNews = [
      ...blogspotItems.filter((b) => !existingTitles.has(b.judul.toLowerCase())),
      ...news,
    ].sort((a, b) => (b.tanggal || "").localeCompare(a.tanggal || ""));

    return {
      mentors: mentors.length > 0 ? mentors : fallbackMentors,
      testimonials: testimonials.length > 0 ? testimonials : fallbackTestimonials,
      news: mergedNews.length > 0 ? mergedNews : fallbackNews,
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
  if (id.startsWith("blogspot-")) {
    return getBlogspotNews().find((b) => b._id === id) ?? null;
  }
  try {
    const items = await fetchGroq<SanityNews>(
      `*[_type == "news" && _id == "${id.replace(/"/g, "")}"]{_id, judul, ringkasan, isiLengkap, tanggal, "gambarUrl": gambar.asset->url}`
    );
    return items[0] ?? null;
  } catch {
    return null;
  }
}

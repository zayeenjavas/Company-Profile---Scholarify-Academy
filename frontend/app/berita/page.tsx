import Link from "next/link";
import { Calendar } from "lucide-react";
import { fetchLandingCmsData } from "@/src/api/sanity";
import { Button } from "@/components/ui/button";
import { RichMathText } from "@/src/components/common/RichMathText";
import {
  EditorialHeading,
  PageShell,
  SectionEyebrow,
  SubpageHero,
} from "@/src/components/ui-kit/ScholarifyKit";

const NEWS_COVERS = [
  "/images/program-intensif.jpg",
  "/images/program-regular.jpg",
  "/images/program-konsultasi.jpg",
  "/images/program-tryout.jpg",
];

export const revalidate = 60;

export default async function BeritaPage() {
  const { news } = await fetchLandingCmsData();

  return (
    <PageShell>
      <SubpageHero
        eyebrow="ARTIKEL & INFORMASI"
        titleLine1="Wawasan & Strategi"
        titleLine2Prefix="Terbaru"
        highlight="UTBK-SNBT"
        subtitle="Kumpulan tips belajar, strategi pengerjaan subtes TPS & Literasi, serta informasi terbaru seputar seleksi masuk perguruan tinggi."
      />

      <section className="bg-[#EBEFFE] dark:bg-muted/30 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
          <div className="space-y-2">
            <SectionEyebrow label="SEMUA ARTIKEL" />
            <EditorialHeading line1="Baca Panduan" highlight="Terbaru" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {news.map((item, idx) => (
              <div
                key={item._id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-3.5 shadow-sm"
              >
                <div>
                  <img
                    src={item.gambarUrl || NEWS_COVERS[idx % NEWS_COVERS.length]}
                    alt={item.judul}
                    className="h-44 w-full rounded-xl object-cover object-center"
                  />
                  <div className="mt-3.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                    <Calendar className="size-3.5 text-[#5B6CFF]" />
                    {item.tanggal}
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug">
                    {item.judul}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    <RichMathText text={item.ringkasan} />
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t">
                  <Link href={`/berita/${encodeURIComponent(item._id)}`} className="block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full text-xs font-semibold"
                    >
                      Baca Selengkapnya
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

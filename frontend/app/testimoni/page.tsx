import { Star } from "lucide-react";
import { fetchLandingCmsData } from "@/src/api/sanity";
import {
  EditorialHeading,
  PageShell,
  SectionEyebrow,
  SplitPillButton,
  SubpageHero,
} from "@/src/components/ui-kit/ScholarifyKit";

export const revalidate = 60;

export default async function TestimoniPage() {
  const { testimonials } = await fetchLandingCmsData();

  return (
    <PageShell>
      <SubpageHero
        eyebrow="TESTIMONI ALUMNI"
        titleLine1="Cerita Sukses Dari"
        titleLine2Prefix="Para Alumni"
        highlight="Scholarify"
        subtitle="Pengalaman nyata siswa yang mempersiapkan UTBK-SNBT bersama TryOut dan mentoring Scholarify hingga lolos PTN impian."
        actions={<SplitPillButton href="/tryout" label="» Coba TryOut Gratis" />}
      />

      <section className="bg-[#EBEFFE] dark:bg-muted/30 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
          <div className="space-y-2">
            <SectionEyebrow label="SEMUA ULASAN" />
            <EditorialHeading line1="Kesan & Prestasi" highlight="Alumni PTN" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-border bg-white dark:bg-card p-6 shadow-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < (t.rating || 5)
                            ? "fill-current"
                            : "text-slate-200 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm italic leading-relaxed text-slate-700 dark:text-foreground/90">
                    &ldquo;{t.isi}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t pt-4">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#EBEFFE] flex items-center justify-center font-bold text-[#5B6CFF]">
                    {t.fotoUrl ? (
                      <img
                        src={t.fotoUrl}
                        alt={t.nama}
                        className={
                          t.nama.toLowerCase().includes("aurelia")
                            ? "h-full w-full object-cover object-[42%_46%] origin-[42%_46%] scale-[2.2]"
                            : "h-full w-full object-cover object-center"
                        }
                      />
                    ) : (
                      t.nama.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.nama}</p>
                    <p className="text-xs text-muted-foreground">{t.asalKampus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

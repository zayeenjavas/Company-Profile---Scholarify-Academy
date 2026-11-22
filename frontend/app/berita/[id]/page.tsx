import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { fetchNewsById, type PortableTextBlock } from "@/src/api/sanity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichMathText } from "@/src/components/common/RichMathText";

function renderBlock(block: PortableTextBlock, idx: number) {
  if (block._type !== "block" || !block.children) {
    return null;
  }
  const text = block.children.map((c) => c.text || "").join("");
  if (!text.trim()) return null;

  if (block.listItem === "bullet") {
    return (
      <li key={block._key || idx} className="ml-5 list-disc leading-relaxed">
        <RichMathText text={text} />
      </li>
    );
  }
  if (block.listItem === "number") {
    return (
      <li key={block._key || idx} className="ml-5 list-decimal leading-relaxed">
        <RichMathText text={text} />
      </li>
    );
  }

  switch (block.style) {
    case "h1":
      return (
        <h1 key={block._key || idx} className="text-2xl font-bold pt-2">
          <RichMathText text={text} />
        </h1>
      );
    case "h2":
      return (
        <h2 key={block._key || idx} className="text-xl font-bold pt-2">
          <RichMathText text={text} />
        </h2>
      );
    case "h3":
    case "h4":
      return (
        <h3 key={block._key || idx} className="text-lg font-semibold pt-2">
          <RichMathText text={text} />
        </h3>
      );
    case "blockquote":
      return (
        <blockquote
          key={block._key || idx}
          className="border-l-4 border-[#2B44FF] pl-4 italic text-muted-foreground"
        >
          <RichMathText text={text} />
        </blockquote>
      );
    default:
      return (
        <p key={block._key || idx} className="leading-relaxed">
          <RichMathText text={text} />
        </p>
      );
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await fetchNewsById(decodeURIComponent(id));

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <h1 className="text-lg font-bold">Artikel Tidak Ditemukan</h1>
            <p className="text-sm text-muted-foreground">
              Berita mungkin sudah dihapus atau ID tidak valid.
            </p>
            <Link href="/">
              <Button className="gap-1.5">
                <ArrowLeft className="size-4" />
                Kembali ke Beranda
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-10 sm:px-6">
        <Link href="/#berita">
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="size-4" />
            Kembali ke Berita
          </Button>
        </Link>

        <article className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
              <Calendar className="size-3.5" />
              {article.tanggal}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {article.judul}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed sm:text-base">
              {article.ringkasan}
            </p>
          </div>

          {article.gambarUrl && (
            <img
              src={article.gambarUrl}
              alt={article.judul}
              className="max-h-96 w-full rounded-2xl border object-cover"
            />
          )}

          <div className="space-y-4 text-sm sm:text-base">
            {article.isiLengkap && article.isiLengkap.length > 0 ? (
              article.isiLengkap.map((block, idx) => renderBlock(block, idx))
            ) : (
              <p className="leading-relaxed text-muted-foreground">
                {article.ringkasan}
              </p>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import rawProducts from "@/src/data/digital-products.json";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditorialHeading, SectionEyebrow } from "@/src/components/ui-kit/ScholarifyKit";

export interface DigitalProduct {
  id: string;
  slug: string;
  title: string;
  category: string;
  group: "modul" | "kelas";
  price: number;
  originalPrice?: number;
  badge?: string;
  schedule: string;
  platform: "lynk" | "loket";
  checkoutUrl: string;
  ctaLabel: string;
  whatsappNumber: string;
  description: string;
  highlights: string[];
}

const DIGITAL_PRODUCTS = rawProducts as DigitalProduct[];

const FILTER_TABS = [
  { id: "all", label: "Semua Produk" },
  { id: "modul", label: "E-Book & Modul" },
  { id: "kelas", label: "Kelas Online & Privat" },
] as const;

function formatRupiah(amount: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID").format(amount)}`;
}

function getProductIcon(product: DigitalProduct) {
  if (product.category === "E-Book") return BookOpen;
  if (product.category === "Modul") return FileText;
  if (product.category === "Kelas Online") return GraduationCap;
  return Users;
}

function buildWhatsappUrl(product: DigitalProduct): string {
  const message = `Halo Admin Scholarify, saya tertarik dengan "${product.title}" (${formatRupiah(product.price)}). Mohon informasi lebih lanjut.`;
  return `https://wa.me/${product.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function LandingDigitalProducts({
  searchQuery = "",
  sectionId = "modul-ebook",
}: {
  searchQuery?: string;
  sectionId?: string;
}) {
  const [activeGroup, setActiveGroup] = useState<"all" | "modul" | "kelas">("all");
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return DIGITAL_PRODUCTS.filter((item) => {
      if (activeGroup !== "all" && item.group !== activeGroup) return false;
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    });
  }, [activeGroup, searchQuery]);

  return (
    <section id={sectionId} className="bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <SectionEyebrow label="MODUL, E-BOOK & KELAS" />
            <EditorialHeading
              line1="Belajar Lebih Terarah dengan"
              line2Prefix="Materi &"
              highlight="Kelas Resmi"
            />
            <p className="max-w-xl pt-1 text-xs sm:text-sm text-muted-foreground">
              Lengkapi persiapan UTBK-SNBT dan materi sekolahmu lewat e-book, modul pembahasan,
              kelas privat, hingga Kelas UTBK Online PK · PM · PU.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter kategori produk"
            className="inline-flex flex-wrap gap-2 rounded-full border border-slate-200/80 dark:border-border bg-slate-50 dark:bg-muted/40 p-1.5 self-start md:self-auto"
          >
            {FILTER_TABS.map((tab) => {
              const active = activeGroup === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveGroup(tab.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-[#5B6CFF] text-white shadow-sm"
                      : "text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-border p-10 text-center text-sm text-muted-foreground">
            Tidak ada modul, e-book, atau kelas yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const Icon = getProductIcon(product);
              const isFeatured = product.id === "kelas-utbk-pk-pm-pu";

              return (
                <article
                  key={product.id}
                  className={`flex h-full flex-col justify-between rounded-2xl border bg-white dark:bg-card p-6 transition-shadow hover:shadow-[0_14px_34px_rgba(79,107,255,0.12)] ${
                    isFeatured
                      ? "border-[#5B6CFF]/60 ring-1 ring-[#5B6CFF]/20 shadow-[0_10px_30px_rgba(91,108,255,0.10)]"
                      : "border-slate-200/80 dark:border-border shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EBEFFE] dark:bg-primary/15 text-[#5B6CFF]">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <span className="rounded-full border border-slate-200 dark:border-border bg-slate-50 dark:bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-foreground">
                          {product.category}
                        </span>
                        {product.badge && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FF6B4A]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF6B4A]">
                            {isFeatured && <Sparkles className="size-3" />}
                            {product.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-foreground">
                        {product.title}
                      </h3>
                      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 text-[#5B6CFF]" />
                        {product.schedule}
                      </p>
                    </div>

                    <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                      {product.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#5B6CFF]" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 space-y-4 border-t border-slate-100 dark:border-border pt-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          {product.originalPrice ? "Harga Early Bird" : "Harga"}
                        </p>
                        <div className="flex items-baseline gap-2 tabular-nums">
                          <span className="text-xl font-extrabold text-slate-900 dark:text-foreground">
                            {formatRupiah(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatRupiah(product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        via {product.platform === "loket" ? "Loket.com" : "Lynk.id"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedProduct(product)}
                        className="h-9 rounded-full px-4 text-xs font-semibold"
                      >
                        Detail
                      </Button>
                      <a
                        href={product.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          className="h-9 w-full rounded-full bg-[#5B6CFF] hover:bg-[#4657EB] text-white text-xs font-semibold gap-1.5"
                        >
                          <span>{product.ctaLabel}</span>
                          <ExternalLink className="size-3.5" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(selectedProduct)}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          {selectedProduct && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 pb-1">
                  <span className="rounded-full bg-[#EBEFFE] dark:bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#5B6CFF]">
                    {selectedProduct.category}
                  </span>
                  {selectedProduct.badge && (
                    <span className="rounded-full bg-[#FF6B4A]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#FF6B4A]">
                      {selectedProduct.badge}
                    </span>
                  )}
                </div>
                <DialogTitle className="text-xl font-bold">
                  {selectedProduct.title}
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  {selectedProduct.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="rounded-xl border border-slate-200/80 dark:border-border bg-slate-50 dark:bg-muted/40 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{selectedProduct.schedule}</p>
                    <div className="flex items-baseline gap-2 tabular-nums mt-0.5">
                      <span className="text-lg font-extrabold text-slate-900 dark:text-foreground">
                        {formatRupiah(selectedProduct.price)}
                      </span>
                      {selectedProduct.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatRupiah(selectedProduct.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    Checkout {selectedProduct.platform === "loket" ? "Loket.com" : "Lynk.id"}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Yang Kamu Dapatkan
                  </p>
                  <ul className="space-y-2 text-sm text-foreground">
                    {selectedProduct.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#5B6CFF]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <a
                    href={selectedProduct.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full rounded-full bg-[#5B6CFF] hover:bg-[#4657EB] text-white gap-1.5">
                      <span>{selectedProduct.ctaLabel}</span>
                      <ExternalLink className="size-4" />
                    </Button>
                  </a>
                  <a
                    href={buildWhatsappUrl(selectedProduct)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="w-full sm:w-auto rounded-full gap-1.5">
                      <MessageCircle className="size-4 text-emerald-600" />
                      <span>Tanya Admin WA</span>
                    </Button>
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

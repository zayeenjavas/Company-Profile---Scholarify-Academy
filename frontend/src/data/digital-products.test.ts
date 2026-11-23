import { describe, expect, it } from "vitest";
import products from "./digital-products.json";

describe("digital-products catalog", () => {
  it("contains all 6 official Lynk.id & Loket.com offerings with valid metadata", () => {
    expect(products).toHaveLength(6);

    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const item of products) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.slug.length).toBeGreaterThan(0);
      expect(ids.has(item.id)).toBe(false);
      expect(slugs.has(item.slug)).toBe(false);
      ids.add(item.id);
      slugs.add(item.slug);

      expect(item.price).toBeGreaterThan(0);
      if ("originalPrice" in item && item.originalPrice !== undefined) {
        expect(item.originalPrice).toBeGreaterThan(item.price);
      }
      expect(["modul", "kelas"]).toContain(item.group);
      expect(["lynk", "loket"]).toContain(item.platform);
      expect(item.checkoutUrl.startsWith("https://")).toBe(true);
      expect(item.highlights.length).toBeGreaterThanOrEqual(3);
    }
  });
});

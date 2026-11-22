const SANITY_PROJECT_ID = "gbwew0c6";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

export function getSanityWriteToken(): string {
  return process.env.SANITY_WRITE_TOKEN || "";
}

export async function sanityFetch<T = unknown>(query: string): Promise<T[]> {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Sanity query failed: ${res.status}`);
  }
  const json = await res.json();
  return (json?.result ?? []) as T[];
}

export async function sanityMutate(mutations: Array<Record<string, unknown>>) {
  const token = getSanityWriteToken();
  if (!token) {
    throw new Error("SANITY_WRITE_TOKEN belum dikonfigurasi di environment");
  }
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.description || err?.message || `Sanity mutate failed: ${res.status}`);
  }
  return res.json();
}

export async function uploadSanityImage(buffer: ArrayBuffer, mimeType: string) {
  const token = getSanityWriteToken();
  if (!token) {
    throw new Error("SANITY_WRITE_TOKEN belum dikonfigurasi di environment");
  }
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/assets/images/${SANITY_DATASET}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": mimeType || "image/jpeg",
    },
    body: buffer,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Sanity image upload failed: ${res.status}`);
  }
  return res.json();
}

export function textToPortableBlocks(input: string | Array<Record<string, unknown>>) {
  if (Array.isArray(input)) return input;
  const paragraphs = String(input || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs.map((p, idx) => ({
    _type: "block",
    _key: `b_${Date.now()}_${idx}`,
    style: "normal",
    children: [
      {
        _type: "span",
        _key: `s_${Date.now()}_${idx}`,
        text: p,
        marks: [],
      },
    ],
    markDefs: [],
  }));
}

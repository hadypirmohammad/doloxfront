export function normalizeTechSpecificEntry(item) {
  if (!item || typeof item !== "object") return null;

  const name = item.Name ?? item.name;
  const measure = item.Measure ?? item.measure;

  if (name == null || name === "" || measure == null || measure === "") {
    return null;
  }

  return {
    name: String(name).trim(),
    measure: String(measure).trim(),
  };
}

export function getTechSpecificItems(ad, limit = 2) {
  const raw = ad?.TechSpecific ?? ad?.techSpecific;
  if (!raw) return [];

  let data = raw;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return [];
    }
  }

  const list = Array.isArray(data) ? data : [data];

  return list.map(normalizeTechSpecificEntry).filter(Boolean).slice(0, limit);
}

export function getBrandBlogUrl(brand) {
  if (!brand || typeof brand !== "string") return null;
  const slug = brand.trim();
  if (!slug) return null;
  return `https://blog.dolox.ir/${encodeURIComponent(slug)}`;
}

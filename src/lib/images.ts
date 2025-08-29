// src/lib/images.ts
export function parseImages(raw: any): string[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw.map(String)
  if (typeof raw === 'string') {
    try {
      const a = JSON.parse(raw)
      if (Array.isArray(a)) return a.map(String)
    } catch {}
    if (raw.includes(',')) return raw.split(',').map(s => s.trim()).filter(Boolean)
    return [raw]
  }
  return []
}

export function toImageUrl(src: string): string {
  if (!src) return '/img/placeholder-property.jpg'
  if (/^https?:\/\//i.test(src)) return src
  // Por defecto tratamos como fileId de Drive
  return `/api/image?id=${encodeURIComponent(src)}`
}

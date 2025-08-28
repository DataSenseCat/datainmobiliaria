import { Link } from 'react-router-dom'
import { Bed as BedIcon, Bath as BathIcon, Ruler, Star, Heart, MapPin } from 'lucide-react'

type Raw = Record<string, any>
export type Property = ReturnType<typeof normalize>

/* ---------- helpers de parseo/normalización ---------- */

function parseImages(s: string): string[] {
  const t = (s || '').trim()
  if (!t) return []
  // JSON ["a","b"] o CSV "a, b" o con |
  try {
    const arr = JSON.parse(t)
    if (Array.isArray(arr)) return arr.map(String)
  } catch {}
  return t.split(/[,\n;|]+/).map(v => v.trim()).filter(Boolean)
}

function truthy(v: any) {
  if (typeof v === 'boolean') return v
  const s = String(v ?? '').toLowerCase()
  return s === 'true' || s === '1' || s === 'sí' || s === 'si' || s === 'x'
}

function toNum(v: any) { const n = Number(v); return Number.isFinite(n) ? n : 0 }

function money(n: number, ccy: 'USD'|'ARS') {
  if (!n) return ''
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: ccy, maximumFractionDigits: 0 }).format(n)
}

/**
 * Convierte una fuente de imagen a URL utilizable en <img>.
 * - http/https: se usa tal cual
 * - drive:<ID> o solo <ID>: se sirve por nuestro endpoint privado /api/image?id=ID
 */
function toImageUrl(src: string) {
  if (!src) return '/img/placeholder-property.jpg'
  const s = String(src).trim()
  if (/^https?:\/\//i.test(s)) return s
  const id = s.startsWith('drive:') ? s.slice(6) : s
  return `/api/image?id=${encodeURIComponent(id)}`
}

/* ---------- normalización usada en tarjetas y detalle ---------- */

export function normalize(p: Raw) {
  const imgs = Array.isArray(p.imagenes)
    ? p.imagenes.map(String)
    : typeof p.imagenes === 'string'
      ? parseImages(p.imagenes)
      : []

  return {
    id: String(p.id ?? p.ID ?? ''),
    title: p.titulo ?? p.title ?? '',
    city: p.ciudad ?? p.city ?? '',
    address: p.direccion ?? p.address ?? '',
    description: p.descripcion ?? '',
    type: p.tipo ?? '',
    operation: p.operacion ?? '',
    featured: truthy(p.destacada),
    active: truthy(p.activa),
    bedrooms: toNum(p.habitaciones),
    bathrooms: toNum(p.banos ?? p['baños']),
    covered_m2: toNum(p.m2_cubiertos ?? p.m2cubiertos),
    total_m2: toNum(p.m2_totales ?? p.m2totales),
    price_usd: toNum(p.precio_usd),
    price_ars: toNum(p.precio_ars),
    cochera: truthy(p.cochera),
    piscina: truthy(p.piscina),
    dpto_servicio: truthy(p.dpto_servicio),
    quincho: truthy(p.quincho),
    parrillero: truthy(p.parrillero),
    images: imgs,
  }
}

/* ---------- tarjeta ---------- */

export default function PropertyCard({ item }: { item: Raw }) {
  const p = normalize(item)
  const cover = toImageUrl(p.images[0] || '')

  const isRent = p.operation?.toLowerCase() === 'alquiler'
  const priceBadge =
    isRent && p.price_ars
      ? `ARS/mes ${money(p.price_ars, 'ARS')}`
      : p.price_usd
        ? `USD ${money(p.price_usd, 'USD')}`
        : 'Precio a consultar'

  return (
    <div className="card overflow-hidden p-0">
      {/* Imagen + badges */}
      <div className="relative">
        <img
          src={cover}
          alt={p.title}
          className="w-full h-48 object-cover"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/img/placeholder-property.jpg' }}
        />

        <div className="absolute top-2 left-2 flex gap-2">
          {p.operation && <span className="chip">{p.operation}</span>}
          {p.featured && <span className="chip"><Star className="w-3 h-3 mr-1" /> Destacada</span>}
        </div>

        <button
          className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm"
          aria-label="favorito"
          type="button"
        >
          <Heart className="w-4 h-4" />
        </button>

        {priceBadge && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {priceBadge}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-3">
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
          <MapPin className="w-3 h-3" /> <span className="truncate">{p.address}</span>
        </div>

        <h3 className="font-semibold leading-snug truncate" title={p.title}>{p.title || 'Propiedad'}</h3>

        {/* badges de resumen */}
        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
          {p.bedrooms ? <span className="chip-badge"><BedIcon className="w-3 h-3" /> {p.bedrooms} dormitorios</span> : null}
          {p.bathrooms ? <span className="chip-badge"><BathIcon className="w-3 h-3" /> {p.bathrooms} baño</span> : null}
          {p.covered_m2 ? <span className="chip-badge"><Ruler className="w-3 h-3" /> {p.covered_m2}m²</span> : null}
          {p.cochera ? <span className="chip-badge">🚗 Cochera</span> : null}
          {p.piscina ? <span className="chip-badge">🏊 Piscina</span> : null}
          {p.dpto_servicio ? <span className="chip-badge">🏢 Dpto. Servicio</span> : null}
          {p.quincho ? <span className="chip-badge">🍖 Quincho</span> : null}
          {p.parrillero ? <span className="chip-badge">🔥 Parrillero</span> : null}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Link to={`/propiedad/${p.id}`} className="btn btn-ghost">Ver Detalles</Link>
          <a
            className="btn btn-primary"
            href={`https://wa.me/543834567890?text=Consulta%20por:%20${encodeURIComponent(p.title)}`}
            target="_blank"
            rel="noreferrer"
          >
            Consultar
          </a>
        </div>
      </div>
    </div>
  )
}

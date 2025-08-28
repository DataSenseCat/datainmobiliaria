import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Bath, BedDouble, Ruler, MapPin, Info, Star } from 'lucide-react'
import PropertyCard, { normalize as normalizeCard } from '../components/PropertyCard'

type Raw = Record<string, any>

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
function parseImages(s: string): string[] {
  const t = (s || '').trim()
  if (!t) return []
  try {
    const arr = JSON.parse(t)
    if (Array.isArray(arr)) return arr.map(String)
  } catch {}
  return t.split(/[,\n;|]+/).map(v => v.trim()).filter(Boolean)
}
function normalize(raw: Raw) {
  const imgs = Array.isArray(raw.imagenes)
    ? raw.imagenes.map(String)
    : typeof raw.imagenes === 'string'
      ? parseImages(raw.imagenes)
      : []

  return {
    id: String(raw.id ?? raw.ID ?? ''),
    title: raw.titulo ?? raw.title ?? 'Propiedad',
    city: raw.ciudad ?? raw.city ?? '',
    address: raw.direccion ?? raw.address ?? '',
    description: raw.descripcion ?? '',
    type: raw.tipo ?? '',
    operation: raw.operacion ?? '',
    featured: truthy(raw.destacada),
    active: truthy(raw.activa),
    bedrooms: toNum(raw.habitaciones),
    bathrooms: toNum(raw.banos ?? raw['baños']),
    covered_m2: toNum(raw.m2_cubiertos ?? raw.m2cubiertos),
    total_m2: toNum(raw.m2_totales ?? raw.m2totales),
    price_usd: toNum(raw.precio_usd),
    price_ars: toNum(raw.precio_ars),
    cochera: truthy(raw.cochera),
    piscina: truthy(raw.piscina),
    dpto_servicio: truthy(raw.dpto_servicio),
    quincho: truthy(raw.quincho),
    parrillero: truthy(raw.parrillero),
    images: imgs,
  }
}

function toImageUrl(src: string) {
  if (!src) return '/img/placeholder-property.jpg'
  if (/^https?:\/\//i.test(src)) return src
  const id = src.startsWith('drive:') ? src.slice(6) : src
  return `/api/image?id=${encodeURIComponent(id)}`
}

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const [items, setItems] = useState<Raw[]>([])
  const [loading, setLoading] = useState(true)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const r = await fetch('/api/properties', { cache: 'no-store' })
        const data = await r.json()
        if (!cancelled) setItems(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const prop = useMemo(() => {
    const raw = items.find(x => String(x.id ?? x.ID) === String(id))
    return raw ? normalize(raw) : null
  }, [items, id])

  const images = useMemo(() => {
    const arr = prop?.images?.length ? prop.images : []
    return (arr.length ? arr : ['/img/placeholder-property.jpg']).map(toImageUrl)
  }, [prop])

  const main = images[idx % images.length]

  if (loading) return <div className="container py-10">Cargando…</div>
  if (!prop) return <div className="container py-10">Propiedad no encontrada. <Link to="/propiedades" className="text-brand-700 underline">Volver</Link></div>

  const isRent = prop.operation?.toLowerCase() === 'alquiler'
  const price =
    isRent && prop.price_ars
      ? `${money(prop.price_ars, 'ARS')} / mes`
      : prop.price_usd
        ? money(prop.price_usd, 'USD')
        : 'A consultar'

  return (
    <div className="container pb-12">
      {/* Galería */}
      <div className="relative mt-4 rounded-xl overflow-hidden bg-black">
        <img
          src={main}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/img/placeholder-property.jpg' }}
          alt={prop.title}
          className="w-full h-[420px] object-cover"
        />
        <div className="absolute bottom-3 left-3 flex gap-2">
          {images.slice(0, 8).map((src, i) => (
            <button
              key={i}
              className={`w-16 h-12 rounded-md overflow-hidden ring-2 ${i===idx ? 'ring-white' : 'ring-transparent'}`}
              onClick={() => setIdx(i)}
              title={`Foto ${i+1}`}
            >
              <img
                src={src}
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/img/placeholder-property.jpg' }}
                alt={`Foto ${i+1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Cabecera */}
      <div className="mt-5 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {prop.operation && <span className="chip">{prop.operation}</span>}
                {prop.type && <span className="chip">{prop.type}</span>}
                {prop.featured && <span className="chip"><Star className="w-3 h-3 mr-1" />Destacada</span>}
              </div>
              <h1 className="text-xl md:text-2xl font-semibold truncate" title={prop.title}>{prop.title}</h1>
              {prop.address && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> <span className="truncate">{prop.address}</span>
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm text-gray-500">{prop.city || ''}</div>
              <div className="text-lg font-semibold">{price}</div>
            </div>
          </div>

          {/* Características */}
          <div className="card p-0 mb-6">
            <div className="grid grid-cols-4 divide-x">
              <Feat icon={<BedDouble className="w-4 h-4" />} label="Ambientes" value={prop.bedrooms || 0} />
              <Feat icon={<Bath className="w-4 h-4" />} label="Baño" value={prop.bathrooms || 0} />
              <Feat icon={<Ruler className="w-4 h-4" />} label="Cubierta" value={`${prop.covered_m2 || 0} m²`} />
              <Feat icon={<Ruler className="w-4 h-4" />} label="Total" value={`${prop.total_m2 || 0} m²`} />
            </div>
          </div>

          {/* Descripción */}
          <section className="card">
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {prop.description || 'Sin descripción.'}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
              {prop.cochera && <span className="chip-badge">🚗 Cochera</span>}
              {prop.piscina && <span className="chip-badge">🏊 Piscina</span>}
              {prop.dpto_servicio && <span className="chip-badge">🏢 Dpto. Servicio</span>}
              {prop.quincho && <span className="chip-badge">🍖 Quincho</span>}
              {prop.parrillero && <span className="chip-badge">🔥 Parrillero</span>}
            </div>
          </section>

          {/* Info adicional */}
          <section className="card mt-6">
            <h3 className="font-semibold mb-2">Información Adicional</h3>
            <ul className="text-sm leading-6">
              <li><strong>Tipo:</strong> {prop.type || '-'}</li>
              <li><strong>Operación:</strong> {prop.operation || '-'}</li>
              <li><strong>Ciudad:</strong> {prop.city || '-'}</li>
              <li><strong>Publicado:</strong> {new Date().toLocaleDateString()}</li>
            </ul>
          </section>
        </div>

        {/* Form lateral */}
        <aside className="card h-max">
          <h3 className="font-semibold mb-2">Contactar por esta propiedad</h3>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              window.open(
                `https://wa.me/543834567890?text=Estoy%20interesado%20en:%20${encodeURIComponent(prop.title)}`,
                '_blank'
              )
            }}
          >
            <input placeholder="Tu nombre completo" />
            <input placeholder="tu@email.com" type="email" />
            <input placeholder="+54 383 4569-7890" />
            <textarea placeholder="Me interesa esta propiedad… ¿Podrían darme más información?" rows={4} />
            <button className="btn btn-primary w-full">Enviar Consulta por WhatsApp</button>
          </form>

          <div className="mt-3 text-xs text-gray-500 flex items-start gap-2">
            <Info className="w-4 h-4" />
            <span>También podés escribirnos por email o llamarnos. Respondemos en 24hs.</span>
          </div>
        </aside>
      </div>

      {/* Similares */}
      {items.length > 1 && (
        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Propiedades similares</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items
              .filter(x => String(x.id ?? x.ID) !== String(prop.id))
              .slice(0, 6)
              .map((it) => (
                <PropertyCard key={String(it.id ?? it.ID)} item={it} />
              ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Feat({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
  return (
    <div className="px-4 py-3 flex flex-col items-center">
      <div className="text-brand-700">{icon}</div>
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Bath, BedDouble, Ruler, MapPin, Info } from 'lucide-react'
import PropertyCard, { normalize } from '../components/PropertyCard'

type Raw = Record<string, any>

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const [items, setItems] = useState<Raw[]>([])
  const [loading, setLoading] = useState(true)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/properties')
        const data = await r.json()
        setItems(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const p = useMemo(() => {
    const raw = items.find(x => String(x.id ?? x.ID) === String(id))
    return raw ? normalize(raw) : null
  }, [items, id])

  const images = p?.images?.length ? p.images : ['/img/placeholder-property.jpg']
  const main = images[idx % images.length]

  if (loading) {
    return <div className="container py-10">Cargando…</div>
  }

  if (!p) {
    return <div className="container py-10">Propiedad no encontrada.</div>
  }

  return (
    <div className="container pb-10">
      {/* Galería */}
      <div className="relative mt-4 rounded-xl overflow-hidden bg-black">
        <img src={main} alt={p.title} className="w-full h-[420px] object-cover" />
        {/* thumbs */}
        <div className="absolute bottom-3 left-3 flex gap-2">
          {images.slice(0, 8).map((src, i) => (
            <button key={i}
              className={`w-16 h-12 rounded-md overflow-hidden ring-2 ${i===idx ? 'ring-white' : 'ring-transparent'}`}
              onClick={() => setIdx(i)}
            >
              <img src={src} alt={`Foto ${i+1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Título + precio */}
      <div className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {p.address}
              </div>
              <h1 className="text-xl md:text-2xl font-semibold">{p.title}</h1>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{p.operation} {p.type ? `• ${p.type}` : ''}</div>
              <div className="text-lg font-semibold">
                {p.operation?.toLowerCase() === 'alquiler' && p.price_ars
                  ? `ARS ${new Intl.NumberFormat('es-AR').format(p.price_ars)} / mes`
                  : p.price_usd
                    ? `USD ${new Intl.NumberFormat('es-AR').format(p.price_usd)}`
                    : 'A consultar'}
              </div>
            </div>
          </div>

          {/* Características resumidas */}
          <div className="card p-0 mb-6">
            <div className="grid grid-cols-4 divide-x">
              <Feature icon={<BedDouble className="w-4 h-4" />} label="Ambientes" value={p.bedrooms || 0} />
              <Feature icon={<Bath className="w-4 h-4" />} label="Baño" value={p.bathrooms || 0} />
              <Feature icon={<Ruler className="w-4 h-4" />} label="Cubierta" value={`${p.covered_m2 || 0} m²`} />
              <Feature icon={<Ruler className="w-4 h-4" />} label="Total" value={`${p.total_m2 || 0} m²`} />
            </div>
          </div>

          {/* Descripción */}
          <section className="card">
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {p.description || 'Sin descripción.'}
            </p>

            {/* Chips de características */}
            <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
              {p.cochera && <span className="chip-badge">🚗 Cochera</span>}
              {p.piscina && <span className="chip-badge">🏊 Piscina</span>}
              {p.dpto_servicio && <span className="chip-badge">🏢 Dpto. Servicio</span>}
              {p.quincho && <span className="chip-badge">🍖 Quincho</span>}
              {p.parrillero && <span className="chip-badge">🔥 Parrillero</span>}
            </div>
          </section>

          {/* Información adicional */}
          <section className="card mt-6">
            <h3 className="font-semibold mb-2">Información Adicional</h3>
            <ul className="text-sm">
              <li><strong>Tipo:</strong> {p.type || '-'}</li>
              <li><strong>Operación:</strong> {p.operation || '-'}</li>
              <li><strong>Ciudad:</strong> {p.city || '-'}</li>
              <li><strong>Publicado:</strong> {new Date().toLocaleDateString()}</li>
            </ul>
          </section>
        </div>

        {/* Contacto lateral */}
        <aside className="card h-max">
          <h3 className="font-semibold mb-2">Contactar por esta propiedad</h3>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); window.open(`https://wa.me/543834567890?text=Estoy%20interesado%20en:%20${encodeURIComponent(p.title)}`,'_blank') }}>
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

      {/* sugerencias / destacadas (opcional) */}
      {items.length > 1 && (
        <section className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Propiedades similares</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.slice(0, 6).filter(x => String(x.id ?? x.ID) !== String(id)).map((it) => (
              <PropertyCard key={String(it.id ?? it.ID)} item={it} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function Feature({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
  return (
    <div className="px-4 py-3 flex flex-col items-center">
      <div className="text-brand-700">{icon}</div>
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}

// src/pages/Detail.tsx
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { parseImages, toImageUrl } from '../lib/images'
import { MapPin, BedDouble, Bath, Ruler } from 'lucide-react'

type Row = Record<string, any>

export default function Detail() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<Row | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/properties/${id}`)
        const d = await r.json()
        setData(d)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <div className="container py-8">Cargando…</div>
  if (!data) return <div className="container py-8">Propiedad no encontrada.</div>

  const imgs = parseImages(data.imagenes)
  const cover = toImageUrl(imgs[0] || '')
  const others = imgs.slice(1)

  const oper = String(data.operacion || '').toLowerCase()
  const precio =
    oper === 'alquiler' && data.precio_ars
      ? `ARS ${Number(data.precio_ars).toLocaleString('es-AR')}/mes`
      : data.precio_usd
        ? `USD ${Number(data.precio_usd).toLocaleString('es-AR')}`
        : 'A consultar'

  return (
    <div className="container py-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">{data.titulo || data.tipo || 'Propiedad'}</h1>
        <div className="text-gray-600 flex items-center gap-1"><MapPin className="w-4 h-4" /> {data.ciudad || ''} — {data.direccion || ''}</div>
      </div>

      {/* Galería */}
      <div className="grid md:grid-cols-3 gap-3 mb-6">
        <div className="md:col-span-2 rounded-xl overflow-hidden border bg-gray-100">
          <img src={cover} className="w-full h-[360px] object-cover"
               onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = '/img/placeholder-property.jpg' }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {others.slice(0,4).map((f, i) => (
            <img key={i} src={toImageUrl(f)} className="rounded-xl border w-full h-[170px] object-cover"
                 onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = '/img/placeholder-property.jpg' }} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="font-semibold mb-2">Descripción</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{data.descripcion || '—'}</p>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="card">
            <div className="text-sm text-gray-500 mb-1 capitalize">{data.operacion || ''}</div>
            <div className="text-2xl font-semibold">{precio}</div>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Características</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              <li className="inline-flex items-center gap-2"><BedDouble className="w-4 h-4" /> {data.habitaciones || '-'} hab.</li>
              <li className="inline-flex items-center gap-2"><Bath className="w-4 h-4" /> {data.banos ?? data['baños'] ?? '-'} baños</li>
              <li className="inline-flex items-center gap-2"><Ruler className="w-4 h-4" /> {data.m2_totales ?? data.m2totales ?? '-'} m² tot.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

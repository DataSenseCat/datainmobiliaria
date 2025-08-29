// src/components/PropertyCard.tsx
import { Link } from 'react-router-dom'
import { BedDouble, Bath, Ruler, MapPin } from 'lucide-react'
import { parseImages, toImageUrl } from '../lib/images'

type Item = Record<string, any>

export default function PropertyCard({ item }: { item: Item }) {
  const id = String(item.id ?? item.ID ?? '')
  const imgs = parseImages(item.imagenes)
  const cover = toImageUrl(imgs[0] || '')

  const oper = String(item.operacion || '').toLowerCase()
  const tipo = String(item.tipo || '')
  const ciudad = String(item.ciudad || '')
  const titulo = String(item.titulo || '')

  const precio =
    oper === 'alquiler' && item.precio_ars
      ? `ARS ${Number(item.precio_ars).toLocaleString('es-AR')}/mes`
      : item.precio_usd
        ? `USD ${Number(item.precio_usd).toLocaleString('es-AR')}`
        : 'A consultar'

  const hab = Number(item.habitaciones || 0)
  const ban = Number(item.banos || item['baños'] || 0)
  const m2t = Number(item.m2_totales || item.m2totales || 0)

  return (
    <article className="rounded-xl overflow-hidden border bg-white hover:shadow-cardHover transition">
      <Link to={id ? `/propiedad/${id}` : '#'} className="block">
        <div className="relative aspect-[4/3] bg-gray-100">
          <img
            src={cover}
            alt={titulo || tipo}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = '/img/placeholder-property.jpg' }}
          />
          {oper && (
            <span className="absolute top-2 left-2 px-2 py-1 text-xs rounded-md bg-white/90 border">
              {oper === 'venta' ? 'Venta' : oper === 'alquiler' ? 'Alquiler' : item.operacion}
            </span>
          )}
          {item.destacada && (
            <span className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-amber-500 text-white">
              Destacada
            </span>
          )}
        </div>

        <div className="p-3">
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {ciudad || 'Catamarca'}
          </div>
          <h3 className="font-semibold text-base mt-1 line-clamp-2">{titulo || tipo}</h3>

          <div className="mt-2 flex items-center gap-4 text-sm text-gray-700">
            <span className="inline-flex items-center gap-1"><BedDouble className="w-4 h-4" /> {hab || '-'} </span>
            <span className="inline-flex items-center gap-1"><Bath className="w-4 h-4" /> {ban || '-'} </span>
            <span className="inline-flex items-center gap-1"><Ruler className="w-4 h-4" /> {m2t ? `${m2t} m²` : '-'}</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold">{precio}</span>
            <span className="text-sm text-gray-500">{tipo || 'Propiedad'}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

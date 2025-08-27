import { Link } from 'react-router-dom'
import type { Property } from '../types'

export default function PropertyCard({p}:{p:Property}){
  const cover = p.images?.find(i => i.is_primary) || p.images?.[0]
  return (
    <div className="card overflow-hidden">
      {cover ? (
        <img src={cover.url} alt={cover.alt||p.title} className="w-full h-48 object-cover" />
      ): (
        <div className="w-full h-48 bg-gray-200"/>
      )}
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">{p.title}</h3>
          {p.price != null && <span className="text-brand-700 font-bold">{p.currency || 'USD'} {Number(p.price).toLocaleString()}</span>}
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description}</p>
        <div className="text-sm text-gray-500 mt-2">{p.city} · {p.province}</div>
        <Link className="btn btn-primary mt-3" to={`/propiedad/${p.id}`}>Ver detalle</Link>
      </div>
    </div>
  )
}

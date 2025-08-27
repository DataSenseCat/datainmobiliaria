import { Link } from 'react-router-dom'
import type { Property } from '../types'
import { BedSingle, Bath, Ruler } from 'lucide-react'

export default function PropertyCard({p}:{p:Property}){
  const cover = p.images?.find(i => i.is_primary) || p.images?.[0]
  const op = (p.operation_type||'').toLowerCase()
  const tipo = (p.property_type||'').toLowerCase()

  return (
    <div className="card overflow-hidden group">
      <div className="relative">
        {cover ? (
          <img src={cover.url} alt={cover.alt||p.title} className="w-full h-44 md:h-48 object-cover transition-transform group-hover:scale-[1.02]"/>
        ) : <div className="w-full h-48 bg-gray-200"/>}

        <div className="absolute top-2 left-2 flex gap-2">
          {op && <span className={`text-xs px-2 py-1 rounded-full text-white ${op==='alquiler'?'bg-emerald-600':'bg-blue-600'}`}>{op[0].toUpperCase()+op.slice(1)}</span>}
          {tipo && <span className="text-xs px-2 py-1 rounded-full bg-white/90">{tipo}</span>}
        </div>
        {p.price!=null && (
          <span className="absolute top-2 right-2 bg-black/70 text-white text-sm rounded-full px-3 py-1">
            {p.currency||'USD'} {Number(p.price).toLocaleString()}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg">{p.title}</h3>
        <div className="text-sm text-gray-600">{p.address} · {p.city}</div>

        <div className="flex items-center gap-4 text-sm text-gray-700 mt-3">
          {p.bedrooms!=null && <span className="flex items-center gap-1"><BedSingle className="w-4 h-4"/>{p.bedrooms}</span>}
          {p.bathrooms!=null && <span className="flex items-center gap-1"><Bath className="w-4 h-4"/>{p.bathrooms}</span>}
          {p.square_meters!=null && <span className="flex items-center gap-1"><Ruler className="w-4 h-4"/>{p.square_meters} m²</span>}
        </div>

        <Link className="btn btn-primary mt-3" to={`/propiedad/${p.id}`}>Ver Detalles</Link>
      </div>
    </div>
  )
}

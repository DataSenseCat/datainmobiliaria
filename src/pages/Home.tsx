import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'

type Raw = Record<string, any>

export default function Home() {
  const [items, setItems] = useState<Raw[]>([])
  const [loading, setLoading] = useState(true)

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

  const featured = useMemo(() => {
    const arr = items.filter((x) => truthy(x.destacada))
    if (arr.length) return arr
    return items.slice(0, 6)
  }, [items])

  return (
    <div className="container py-10">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">Propiedades Destacadas</h1>
        <p className="text-gray-600 mt-2">
          Descubre nuestra selección de propiedades destacadas en las mejores ubicaciones de Catamarca
        </p>
      </header>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : featured.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((raw) => (
            <PropertyCard key={String(raw.id ?? raw.ID)} item={raw} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <div className="mt-10 flex justify-center">
        <Link to="/propiedades" className="btn btn-primary">
          Ver Todas las Propiedades
        </Link>
      </div>
    </div>
  )
}

function truthy(v: any) {
  if (typeof v === 'boolean') return v
  const s = String(v ?? '').toLowerCase()
  return s === 'true' || s === '1' || s === 'sí' || s === 'si' || s === 'x'
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden p-0">
      <div className="w-full h-48 bg-gray-200 animate-pulse" />
      <div className="p-3">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
        <div className="flex gap-2 mb-4">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-5 bg-gray-200 rounded w-16" />
          <div className="h-5 bg-gray-200 rounded w-14" />
        </div>
        <div className="flex justify-between">
          <div className="h-9 bg-gray-200 rounded w-28" />
          <div className="h-9 bg-gray-200 rounded w-28" />
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card text-center py-12">
      <h3 className="text-lg font-semibold">No encontramos propiedades para mostrar</h3>
      <p className="text-gray-600 mt-1">
        Probá nuevamente más tarde o contáctanos para recibir recomendaciones personalizadas.
      </p>
      <div className="mt-4 flex justify-center gap-3">
        <Link to="/contacto" className="btn btn-primary">Contactar Asesor</Link>
        <Link to="/tasaciones" className="btn btn-ghost">Tasación Gratuita</Link>
      </div>
    </div>
  )
}


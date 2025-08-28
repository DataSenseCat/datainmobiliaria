// src/pages/Home.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropertyCard from '../components/PropertyCard'

type Row = Record<string, any>

export default function Home() {
  const [items, setItems] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/properties')
        const data = await r.json()
        setItems(Array.isArray(data) ? data.slice(0, 6) : [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <>
      {/* HERO */}
      <section
        className="relative h-[380px] md:h-[440px] w-full overflow-hidden"
        style={{
          backgroundImage:
            'url(/img/hero-catamarca.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="container relative z-10 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Encuentre su propiedad
          </h1>

          {/* Barra de búsqueda (dummy / no bloquea) */}
          <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg p-3 w-full max-w-3xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <select className="input">
                <option>Tipo propiedad</option>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Local</option>
                <option>Lote</option>
              </select>
              <select className="input">
                <option>Operación</option>
                <option>Venta</option>
                <option>Alquiler</option>
              </select>
              <input className="input" placeholder="Ubicación" />
              <button className="btn btn-primary">Buscar</button>
            </div>
            <div className="text-xs text-white mt-2 text-center">
              <Link to="/propiedades" className="underline text-white/80">Búsqueda avanzada</Link>
            </div>
          </div>
        </div>
      </section>

      {/* DESTACADAS */}
      <section className="container py-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold">Propiedades Destacadas</h2>
          <p className="text-gray-600">Descubre nuestra selección en las mejores ubicaciones de Catamarca</p>
        </div>

        {loading ? (
          <div className="card">Cargando…</div>
        ) : items.length === 0 ? (
          <div className="card">No hay propiedades para mostrar por ahora.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((p) => (
              <PropertyCard key={String(p.id ?? p.ID ?? Math.random())} item={p} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link to="/propiedades" className="btn btn-primary">Ver Todas las Propiedades</Link>
        </div>
      </section>
    </>
  )
}

import { useEffect, useState } from 'react'
import { fetchProperties } from '../lib/api'
import type { Property } from '../types'
import HeroSearch from '../components/HeroSearch'
import PropertyCard from '../components/PropertyCard'
import Filters from '../components/Filters'

export default function Home(){
  const [items, setItems] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const load = async (q:Record<string,string>={})=>{
    setLoading(true)
    const data = await fetchProperties(q)
    setItems(Array.isArray(data)? data : [])
    setLoading(false)
  }
  useEffect(()=>{ load() },[])

  return (
    <div>
      <HeroSearch onSearch={load}/>
      {/* Búsqueda avanzada */}
      <div id="avanzada" className="container -mt-10 relative z-10">
        <div className="text-right mb-2">
          <button className="text-sm underline" onClick={()=>setShowAdvanced(v=>!v)}>
            {showAdvanced? 'Ocultar búsqueda avanzada' : 'Mostrar búsqueda avanzada'}
          </button>
        </div>
        {showAdvanced && <Filters onChange={load}/>}
      </div>

      {/* Destacadas */}
      <section className="container py-10">
        <h2 className="text-2xl font-bold text-center mb-1">Propiedades Destacadas</h2>
        <p className="text-center text-gray-600 mb-6">Descubre nuestra selección de propiedades en las mejores ubicaciones de Catamarca</p>
        {loading ? <p className="text-center">Cargando...</p> : (
          <div className="grid md:grid-cols-3 gap-4">
            {items.slice(0,6).map(p => <PropertyCard key={p.id} p={p} />)}
          </div>
        )}
        <div className="text-center mt-6">
          <a className="btn btn-primary" href="/propiedades">Ver Todas las Propiedades</a>
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="border-t bg-gray-50 py-12">
        <div className="container grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-semibold mb-3">¿Por qué elegir Inmobiliaria Catamarca?</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Más de 15 años de experiencia en el mercado catamarqueño.</li>
              <li>• Atención personalizada en cada etapa.</li>
              <li>• Tasaciones gratuitas y análisis de mercado.</li>
            </ul>
            <a href="/empresa" className="btn mt-4">Conoce Más Sobre Nosotros</a>
          </div>
          <div className="h-56 md:h-72 bg-white card flex items-center justify-center text-gray-400">
            Imagen de la empresa
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-12 text-center">
        <h3 className="text-xl font-semibold mb-2">¿Tenés un proyecto inmobiliario?</h3>
        <p className="text-gray-600 mb-4">Si sos desarrollador o tenés un proyecto, te ayudamos con la comercialización.</p>
        <a href="/contacto" className="btn btn-primary">Contactar para Comercialización</a>
      </section>
    </div>
  )
}

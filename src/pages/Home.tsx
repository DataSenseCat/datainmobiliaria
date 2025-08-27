import { useEffect, useState } from 'react'
import Filters from '../components/Filters'
import PropertyCard from '../components/PropertyCard'
import { fetchProperties } from '../lib/api'
import type { Property } from '../types'

export default function Home(){
  const [items, setItems] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  const load = async (q:Record<string,string>={})=>{
    setLoading(true)
    const data = await fetchProperties(q)
    setItems(data)
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  return (
    <div>
      <section className="text-center py-6">
        <h1 className="text-2xl md:text-3xl font-bold">Propiedades en Venta y Alquiler</h1>
        <p className="text-gray-600">Catamarca y alrededores</p>
      </section>
      <Filters onChange={load}/>
      {loading ? <p>Cargando...</p> : (
        <div className="grid md:grid-cols-3 gap-4">
          {items.map(p => <PropertyCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  )
}

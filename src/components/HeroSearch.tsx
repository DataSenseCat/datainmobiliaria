import { useState } from 'react'

type Props = { onSearch?: (q:Record<string,string>)=>void }

export default function HeroSearch({onSearch}:Props){
  const [type, setType] = useState('')
  const [op, setOp] = useState('')
  const [city, setCity] = useState('')

  const send = (e:React.FormEvent) => {
    e.preventDefault()
    onSearch?.({ property_type: type, operation_type: op, city })
  }

  return (
    <section className="relative h-[360px] md:h-[440px]">
      <img src="/hero-catamarca.jpg" alt="" className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black/45"/>
      <div className="container relative h-full flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold">Encuentre su propiedad</h1>
        <p className="opacity-90 mt-2">Catamarca y alrededores</p>
        <form onSubmit={send} className="mt-6 bg-white rounded-2xl shadow-xl p-3 md:p-4 w-full max-w-3xl grid md:grid-cols-4 gap-2">
          <select value={type} onChange={e=>setType(e.target.value)} className="border rounded-xl px-3 py-2 text-gray-700">
            <option value="">Tipo propiedad</option><option>casa</option><option>departamento</option><option>lote</option><option>local</option>
          </select>
          <select value={op} onChange={e=>setOp(e.target.value)} className="border rounded-xl px-3 py-2 text-gray-700">
            <option value="">Operación</option><option>venta</option><option>alquiler</option>
          </select>
          <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Ubicación" className="border rounded-xl px-3 py-2 text-gray-700"/>
          <button className="bg-gray-900 text-white rounded-xl px-4 py-2">Buscar</button>
        </form>
        <a href="#avanzada" className="underline mt-2 text-sm opacity-90">Búsqueda avanzada</a>
      </div>
    </section>
  )
}

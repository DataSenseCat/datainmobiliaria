import { useState } from 'react'

type Props = {
  onChange: (q: Record<string,string>) => void
}

export default function Filters({onChange}:Props){
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [operation, setOperation] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const apply = () => {
    onChange({ city, property_type: type, operation_type: operation, bedrooms, priceMin, priceMax })
  }

  return (
    <div className="card p-4 mb-4 grid md:grid-cols-6 gap-3">
      <div>
        <label>Ciudad</label>
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Catamarca"/>
      </div>
      <div>
        <label>Tipo</label>
        <select value={type} onChange={e=>setType(e.target.value)}>
          <option value="">Todos</option>
          <option>casa</option>
          <option>departamento</option>
          <option>lote</option>
          <option>local</option>
        </select>
      </div>
      <div>
        <label>Operación</label>
        <select value={operation} onChange={e=>setOperation(e.target.value)}>
          <option value="">Todas</option>
          <option>venta</option>
          <option>alquiler</option>
        </select>
      </div>
      <div>
        <label>Dormitorios</label>
        <input value={bedrooms} onChange={e=>setBedrooms(e.target.value)} placeholder="3" />
      </div>
      <div>
        <label>Precio mín</label>
        <input value={priceMin} onChange={e=>setPriceMin(e.target.value)} placeholder="0" />
      </div>
      <div>
        <label>Precio máx</label>
        <input value={priceMax} onChange={e=>setPriceMax(e.target.value)} placeholder="100000" />
      </div>
      <div className="md:col-span-6 flex gap-2">
        <button className="btn" onClick={()=>{ setCity(''); setType(''); setOperation(''); setBedrooms(''); setPriceMin(''); setPriceMax(''); onChange({}) }}>Reset</button>
        <button className="btn btn-primary" onClick={apply}>Aplicar filtros</button>
      </div>
    </div>
  )
}

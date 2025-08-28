// src/pages/Propiedades.tsx
import { useEffect, useMemo, useState } from 'react'
import PropertyCard from '../components/PropertyCard'

type Row = Record<string, any>

export default function Propiedades() {
  const [items, setItems] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  // filtros simples (client-side)
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('Todos')
  const [op, setOp] = useState('Todas')

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/properties')
        const data = await r.json()
        setItems(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const okQ = q
        ? (String(it.titulo || '').toLowerCase().includes(q.toLowerCase()) ||
           String(it.ciudad || '').toLowerCase().includes(q.toLowerCase()))
        : true
      const okTipo = tipo === 'Todos' ? true : String(it.tipo || '').toLowerCase() === tipo.toLowerCase()
      const okOp   = op === 'Todas' ? true : String(it.operacion || '').toLowerCase() === op.toLowerCase()
      return okQ && okTipo && okOp
    })
  }, [items, q, tipo, op])

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Propiedades</h1>

      <div className="card mb-6">
        <div className="grid md:grid-cols-4 gap-3">
          <input className="input" placeholder="Buscar por título o ciudad…" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="input" value={tipo} onChange={e=>setTipo(e.target.value)}>
            <option>Todos</option><option>Casa</option><option>Departamento</option><option>Local</option><option>Lote</option>
          </select>
          <select className="input" value={op} onChange={e=>setOp(e.target.value)}>
            <option>Todas</option><option>Venta</option><option>Alquiler</option>
          </select>
          <button className="btn btn-primary" onClick={()=>{ /* filtros ya aplican en tiempo real */ }}>Aplicar</button>
        </div>
      </div>

      {loading ? (
        <div className="card">Cargando…</div>
      ) : filtered.length === 0 ? (
        <div className="card">No encontramos propiedades con esos filtros.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <PropertyCard key={String(p.id ?? p.ID ?? Math.random())} item={p} />
          ))}
        </div>
      )}
    </div>
  )
}

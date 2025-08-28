// src/pages/AdminList.tsx
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { isAdmin, authHeader } from '../lib/auth'

type Row = Record<string, any>

export default function AdminList() {
  if (!isAdmin()) return <Navigate to="/login" replace state={{ from: '/admin/propiedades' }} />

  const [items, setItems] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const r = await fetch('/api/properties', { cache: 'no-store' })
      const data = await r.json()
      setItems(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError(e?.message || 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  async function onDelete(id: string) {
    if (!confirm('¿Seguro que deseas borrar esta propiedad?')) return
    const r = await fetch(`/api/properties/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { ...authHeader() }
    })
    if (!r.ok) {
      const t = await r.text().catch(()=> '')
      alert(`No se pudo borrar: ${t}`)
      return
    }
    await load()
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Publicaciones</h1>
        <Link to="/admin/nueva" className="btn btn-primary">Nueva Propiedad</Link>
      </div>

      {loading ? <div>Cargando…</div> :
       error ? <div className="text-red-600">{error}</div> :
       items.length === 0 ? <div className="card">No hay publicaciones.</div> :
       (
        <div className="card p-0 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-3 py-2">Título</th>
                <th className="px-3 py-2">Ciudad</th>
                <th className="px-3 py-2">Operación</th>
                <th className="px-3 py-2">Tipo</th>
                <th className="px-3 py-2">Precio</th>
                <th className="px-3 py-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const id = String(it.id ?? it.ID ?? '')
                const precio = it.operacion?.toLowerCase() === 'alquiler' && it.precio_ars
                  ? `ARS ${Number(it.precio_ars).toLocaleString('es-AR')}/mes`
                  : it.precio_usd
                    ? `USD ${Number(it.precio_usd).toLocaleString('es-AR')}`
                    : 'A consultar'
                return (
                  <tr key={id} className="border-t">
                    <td className="px-3 py-2">{it.titulo || '-'}</td>
                    <td className="px-3 py-2">{it.ciudad || '-'}</td>
                    <td className="px-3 py-2">{it.operacion || '-'}</td>
                    <td className="px-3 py-2">{it.tipo || '-'}</td>
                    <td className="px-3 py-2">{precio}</td>
                    <td className="px-3 py-2 text-right">
                      <Link to={`/admin/editar/${encodeURIComponent(id)}`} className="btn btn-ghost mr-2">Editar</Link>
                      <button className="btn btn-outline" onClick={() => onDelete(id)}>Borrar</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
       )}
    </div>
  )
}

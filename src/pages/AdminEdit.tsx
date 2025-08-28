// src/pages/AdminEdit.tsx
import { useEffect, useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { isAdmin, authHeader } from '../lib/auth'

type Row = Record<string, any>

export default function AdminEdit() {
  if (!isAdmin()) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<Row | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/properties/${id}`)
        const d = await r.json()
        setData(d || null)
      } catch (e: any) {
        setError(e?.message || 'Error al cargar')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    if (!data) return
    setSaving(true); setError(null)
    try {
      const r = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(data),
      })
      if (!r.ok) {
        const t = await r.text().catch(()=> '')
        throw new Error(t || `Error ${r.status}`)
      }
      navigate('/admin/propiedades')
    } catch (e: any) {
      setError(e?.message || 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="container py-8">Cargando…</div>
  if (!data) return <div className="container py-8">Propiedad no encontrada</div>

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Editar Propiedad</h1>
      <form className="card space-y-3" onSubmit={onSave}>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Título</label>
            <input value={data.titulo || ''} onChange={e=>setData({...data, titulo:e.target.value})} />
          </div>
          <div>
            <label className="label">Ciudad</label>
            <input value={data.ciudad || ''} onChange={e=>setData({...data, ciudad:e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Dirección</label>
            <input value={data.direccion || ''} onChange={e=>setData({...data, direccion:e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Descripción</label>
            <textarea rows={4} value={data.descripcion || ''} onChange={e=>setData({...data, descripcion:e.target.value})} />
          </div>
          <div>
            <label className="label">Tipo</label>
            <input value={data.tipo || ''} onChange={e=>setData({...data, tipo:e.target.value})} />
          </div>
          <div>
            <label className="label">Operación</label>
            <input value={data.operacion || ''} onChange={e=>setData({...data, operacion:e.target.value})} />
          </div>
          <div>
            <label className="label">Precio USD</label>
            <input type="number" value={Number(data.precio_usd || 0)} onChange={e=>setData({...data, precio_usd:Number(e.target.value)})} />
          </div>
          <div>
            <label className="label">Precio ARS</label>
            <input type="number" value={Number(data.precio_ars || 0)} onChange={e=>setData({...data, precio_ars:Number(e.target.value)})} />
          </div>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={()=>navigate('/admin/propiedades')}>Cancelar</button>
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
        </div>
      </form>
    </div>
  )
}

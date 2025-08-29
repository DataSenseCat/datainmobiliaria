// src/pages/Admin.tsx
import { useRef, useState } from 'react'
import { upload } from '@vercel/blob/client'
import { ImagePlus, UploadCloud, Trash2, CheckCircle2 } from 'lucide-react'

type Form = {
  titulo: string
  tipo: string
  operacion: string
  ciudad: string
  direccion: string
  descripcion: string
  precio_usd?: number
  precio_ars?: number
  destacada?: boolean
  activa?: boolean
  habitaciones?: number
  banos?: number
  m2_cubiertos?: number
  m2_totales?: number
  cochera?: boolean
  piscina?: boolean
  dpto_servicio?: boolean
  quincho?: boolean
  parrillero?: boolean
}

type BlobRef = { url: string; filename?: string; contentType?: string }

export default function Admin() {
  const [form, setForm] = useState<Form>({
    titulo: '',
    tipo: 'Casa',
    operacion: 'Venta',
    ciudad: 'San Fernando del Valle de Catamarca',
    direccion: '',
    descripcion: '',
    precio_usd: 0,
    precio_ars: 0,
    activa: true
  })

  const [localFiles, setLocalFiles] = useState<File[]>([])
  const [staging, setStaging] = useState<BlobRef[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const pickRef = useRef<HTMLInputElement>(null)

  function upd<K extends keyof Form>(k: K, v: Form[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function doClientUpload() {
    if (!localFiles.length) return
    const up: BlobRef[] = []
    for (const file of localFiles) {
      const put = await upload(file.name, file, {
        access: 'public',               // staging temporal
        handleUploadUrl: '/api/blob/upload',
        // ❌ esta opción NO existe en el cliente: addRandomSuffix
        contentType: file.type || 'application/octet-stream',
      })
      up.push({ url: put.url, filename: file.name, contentType: file.type })
    }
    setStaging(up)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      // 1) Subir a Blob (staging) si todavía no lo hicimos
      if (localFiles.length && staging.length === 0) {
        await doClientUpload()
      }

      // 2) Importar a Drive + guardar en Sheets + borrar Blob
      const resp = await fetch('/api/properties/import-from-blob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property: form, blobs: staging })
      })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || 'Error al crear')

      setMsg({ type: 'ok', text: 'Propiedad creada con imágenes en Drive' })
      setForm({
        titulo: '',
        tipo: 'Casa',
        operacion: 'Venta',
        ciudad: '',
        direccion: '',
        descripcion: '',
        precio_usd: 0,
        precio_ars: 0,
        activa: true
      })
      setLocalFiles([])
      setStaging([])
    } catch (e: any) {
      setMsg({ type: 'err', text: e?.message || 'Error inesperado' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Nueva Propiedad</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Datos básicos */}
        <div className="card">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Título</label>
              <input value={form.titulo} onChange={e => upd('titulo', e.target.value)} required />
            </div>
            <div>
              <label className="label">Ciudad</label>
              <input value={form.ciudad} onChange={e => upd('ciudad', e.target.value)} />
            </div>

            <div>
              <label className="label">Tipo</label>
              <select value={form.tipo} onChange={e => upd('tipo', e.target.value)}>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Local</option>
                <option>Lote</option>
              </select>
            </div>

            <div>
              <label className="label">Operación</label>
              <select value={form.operacion} onChange={e => upd('operacion', e.target.value)}>
                <option>Venta</option>
                <option>Alquiler</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">Dirección</label>
              <input value={form.direccion} onChange={e => upd('direccion', e.target.value)} />
            </div>

            <div className="md:col-span-2">
              <label className="label">Descripción</label>
              <textarea rows={4} value={form.descripcion} onChange={e => upd('descripcion', e.target.value)} />
            </div>

            <div>
              <label className="label">Precio USD</label>
              <input
                type="number"
                value={form.precio_usd || 0}
                onChange={e => upd('precio_usd', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Precio ARS</label>
              <input
                type="number"
                value={form.precio_ars || 0}
                onChange={e => upd('precio_ars', Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Imágenes */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Imágenes</div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => pickRef.current?.click()}
              >
                <ImagePlus className="w-4 h-4 mr-2" /> Agregar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={!localFiles.length}
                onClick={doClientUpload}
              >
                <UploadCloud className="w-4 h-4 mr-2" /> Subir a Blob (staging)
              </button>
            </div>
          </div>

          <input
            ref={pickRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => setLocalFiles(e.target.files ? Array.from(e.target.files) : [])}
          />

          {!!localFiles.length && (
            <>
              <h4 className="text-sm font-medium mb-2">Seleccionadas</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                {localFiles.map((f, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden border">
                    <img src={URL.createObjectURL(f)} className="w-full h-28 object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow"
                      onClick={() => setLocalFiles(prev => prev.filter((_, idx) => idx !== i))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <h4 className="text-sm font-medium mb-2">En staging (Blob)</h4>
          {staging.length ? (
            <ul className="text-sm list-disc pl-5 space-y-1">
              {staging.map((b, i) => (
                <li key={i}>{b.filename}</li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500">Aún no subiste a Blob.</div>
          )}

          <p className="text-xs text-gray-500 mt-4 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Al crear la propiedad, se copian del Blob a <b>Google Drive (privado)</b>, se guardan los
            <code className="mx-1">fileId</code> en la Sheet y se borra el Blob.
          </p>
        </div>

        {msg && (
          <div className={`card ${msg.type === 'ok' ? 'border-emerald-200' : 'border-red-200'}`}>
            <div className={msg.type === 'ok' ? 'text-emerald-700' : 'text-red-700'}>{msg.text}</div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button type="button" className="btn btn-ghost" onClick={() => window.history.back()}>
            Cancelar
          </button>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? 'Creando…' : 'Crear propiedad'}
          </button>
        </div>
      </form>
    </div>
  )
}

import { useRef, useState } from 'react'
import { BedDouble, Bath, Ruler, ImagePlus, UploadCloud, Trash2, Info, CheckCircle2 } from 'lucide-react'

type Tab = 'basic' | 'details' | 'features' | 'pricing' | 'images'

type FormState = {
  titulo: string
  ciudad: string
  direccion: string
  descripcion: string
  tipo: string
  operacion: string
  destacada: boolean
  activa: boolean
  habitaciones: number
  banos: number
  m2_cubiertos: number
  m2_totales: number
  precio_usd: number
  precio_ars: number
  cochera: boolean
  piscina: boolean
  dpto_servicio: boolean
  quincho: boolean
  parrillero: boolean
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>('basic')

  // --------- estado del formulario ----------
  const [form, setForm] = useState<FormState>({
    titulo: '',
    ciudad: 'San Fernando del Valle de Catamarca',
    direccion: '',
    descripcion: '',
    tipo: 'Casa',
    operacion: 'Venta',
    destacada: false,
    activa: true,
    habitaciones: 0,
    banos: 0,
    m2_cubiertos: 0,
    m2_totales: 0,
    precio_usd: 0,
    precio_ars: 0,
    cochera: false,
    piscina: false,
    dpto_servicio: false,
    quincho: false,
    parrillero: false,
  })

  // --------- imágenes (privadas) ----------
  const fileRef = useRef<HTMLInputElement>(null)
  const [localFiles, setLocalFiles] = useState<File[]>([])      // seleccionadas pero aún no subidas
  const [imageIds, setImageIds] = useState<string[]>([])        // IDs de Drive subidas
  const [uploading, setUploading] = useState(false)

  const [creating, setCreating] = useState(false)
  const [msg, setMsg] = useState<{type:'ok'|'err', text:string}|null>(null)

  // ----------------- helpers -----------------
  const onPickImages = () => fileRef.current?.click()

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setLocalFiles(prev => [...prev, ...files])
    e.target.value = '' // permite re-seleccionar los mismos archivos
  }

  async function uploadImages(files: File[]): Promise<string[]> {
    if (!files.length) return []
    setUploading(true)
    try {
      const fd = new FormData()
      files.forEach(f => fd.append('images', f))
      const r = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!r.ok) {
        const t = await safeText(r)
        throw new Error(`Fallo subida (${r.status}): ${t}`)
      }
      const data = await r.json()
      const ids = (data?.ids ?? []).map(String)
      setImageIds(prev => [...prev, ...ids])
      // ya no necesitamos conservar esos archivos locales
      setLocalFiles([])
      return ids
    } finally {
      setUploading(false)
    }
  }

  async function safeText(r: Response) {
    try { return await r.text() } catch { return '' }
  }

  function toImageUrl(id: string) {
    return id ? `/api/image?id=${encodeURIComponent(id)}` : '/img/placeholder-property.jpg'
  }

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function handleCreate() {
    setMsg(null)
    setCreating(true)
    try {
      // Si hay archivos locales sin subir, los subimos primero
      if (localFiles.length) {
        await uploadImages(localFiles)
      }

      const payload = {
        ...form,
        // guardamos como JSON de IDs (privados)
        imagenes: JSON.stringify(imageIds),
      }

      const r = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!r.ok) {
        const t = await safeText(r)
        throw new Error(`No se pudo crear la propiedad: ${t}`)
      }

      setMsg({ type: 'ok', text: 'Propiedad creada correctamente.' })
      // reset mínimos
      setForm(prev => ({ ...prev, titulo: '', direccion: '', descripcion: '' }))
      setLocalFiles([])
      setImageIds([])
      setTab('basic')
    } catch (e: any) {
      setMsg({ type: 'err', text: e?.message || 'Error inesperado' })
    } finally {
      setCreating(false)
    }
  }

  // ---------------- UI ----------------
  return (
    <div className="container py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Nueva Propiedad</h1>
        <p className="text-gray-600">Completa la información de la nueva propiedad</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <TabBtn active={tab==='basic'} onClick={()=>setTab('basic')}>Información Básica</TabBtn>
        <TabBtn active={tab==='details'} onClick={()=>setTab('details')}>Detalles</TabBtn>
        <TabBtn active={tab==='features'} onClick={()=>setTab('features')}>Características</TabBtn>
        <TabBtn active={tab==='pricing'} onClick={()=>setTab('pricing')}>Precios</TabBtn>
        <TabBtn active={tab==='images'} onClick={()=>setTab('images')}>Imágenes</TabBtn>
      </div>

      {/* Panels */}
      {tab === 'basic' && (
        <section className="card">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Título *</label>
              <input value={form.titulo} onChange={e=>update('titulo', e.target.value)} placeholder="Ej: Casa en Barrio Norte" />
            </div>
            <div>
              <label className="label">Ciudad *</label>
              <input value={form.ciudad} onChange={e=>update('ciudad', e.target.value)} placeholder="Ciudad" />
            </div>

            <div className="md:col-span-2">
              <label className="label">Dirección</label>
              <input value={form.direccion} onChange={e=>update('direccion', e.target.value)} placeholder="Dirección completa" />
            </div>

            <div className="md:col-span-2">
              <label className="label">Descripción</label>
              <textarea rows={4} value={form.descripcion} onChange={e=>update('descripcion', e.target.value)} placeholder="Descripción detallada de la propiedad..." />
            </div>

            <div>
              <label className="label">Tipo de Propiedad *</label>
              <select value={form.tipo} onChange={e=>update('tipo', e.target.value)}>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Lote</option>
                <option>Local</option>
                <option>Oficina</option>
                <option>Campo</option>
              </select>
            </div>
            <div>
              <label className="label">Operación *</label>
              <select value={form.operacion} onChange={e=>update('operacion', e.target.value)}>
                <option>Venta</option>
                <option>Alquiler</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input id="activa" type="checkbox" checked={form.activa} onChange={e=>update('activa', e.target.checked)} />
              <label htmlFor="activa">Activa</label>
            </div>
            <div className="flex items-center gap-2">
              <input id="destacada" type="checkbox" checked={form.destacada} onChange={e=>update('destacada', e.target.checked)} />
              <label htmlFor="destacada">Destacada</label>
            </div>
          </div>
        </section>
      )}

      {tab === 'details' && (
        <section className="card">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label flex items-center gap-2"><BedDouble className="w-4 h-4" /> Habitaciones</label>
              <input type="number" min={0} value={form.habitaciones} onChange={e=>update('habitaciones', Number(e.target.value))} placeholder="Número de habitaciones" />
            </div>
            <div>
              <label className="label flex items-center gap-2"><Bath className="w-4 h-4" /> Baños</label>
              <input type="number" min={0} value={form.banos} onChange={e=>update('banos', Number(e.target.value))} placeholder="Número de baños" />
            </div>
            <div>
              <label className="label flex items-center gap-2"><Ruler className="w-4 h-4" /> Superficie Cubierta (m²)</label>
              <input type="number" min={0} value={form.m2_cubiertos} onChange={e=>update('m2_cubiertos', Number(e.target.value))} placeholder="Metros cuadrados cubiertos" />
            </div>
            <div>
              <label className="label flex items-center gap-2"><Ruler className="w-4 h-4" /> Superficie Total (m²)</label>
              <input type="number" min={0} value={form.m2_totales} onChange={e=>update('m2_totales', Number(e.target.value))} placeholder="Metros cuadrados totales" />
            </div>
          </div>
        </section>
      )}

      {tab === 'features' && (
        <section className="card">
          <div className="grid md:grid-cols-2 gap-4">
            <Check label="Cochera" value={form.cochera} onChange={v=>update('cochera', v)} />
            <Check label="Piscina" value={form.piscina} onChange={v=>update('piscina', v)} />
            <Check label="Dpto. de Servicio" value={form.dpto_servicio} onChange={v=>update('dpto_servicio', v)} />
            <Check label="Quincho" value={form.quincho} onChange={v=>update('quincho', v)} />
            <Check label="Parrillero" value={form.parrillero} onChange={v=>update('parrillero', v)} />
          </div>
          <p className="text-xs text-gray-500 mt-3 flex items-start gap-2">
            <Info className="w-4 h-4" />
            Estas características se mostrarán como chips en la tarjeta y en el detalle.
          </p>
        </section>
      )}

      {tab === 'pricing' && (
        <section className="card">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Precio en USD</label>
              <input type="number" min={0} value={form.precio_usd} onChange={e=>update('precio_usd', Number(e.target.value))} placeholder="Precio en dólares" />
            </div>
            <div>
              <label className="label">Precio en ARS</label>
              <input type="number" min={0} value={form.precio_ars} onChange={e=>update('precio_ars', Number(e.target.value))} placeholder="Precio en pesos" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Podés especificar el precio en una o ambas monedas. Si no especificás, se mostrará "A consultar".
          </p>
        </section>
      )}

      {tab === 'images' && (
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Imágenes de la Propiedad</div>
            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost" onClick={onPickImages}>
                <ImagePlus className="w-4 h-4 mr-2" /> Agregar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={uploading || !localFiles.length}
                onClick={() => uploadImages(localFiles)}
                title={!localFiles.length ? 'Seleccioná imágenes primero' : 'Subir imágenes a Drive'}
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                {uploading ? 'Subiendo...' : 'Subir imágenes'}
              </button>
            </div>
          </div>

          {/* selector oculto */}
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />

          {/* previews de imágenes nuevas (locales) */}
          {localFiles.length > 0 && (
            <>
              <h4 className="text-sm font-medium mb-2">Para subir</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                {localFiles.map((f, i) => (
                  <div key={`${f.name}-${i}`} className="relative rounded-lg overflow-hidden border">
                    <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-28 object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow"
                      onClick={() => setLocalFiles(prev => prev.filter((_, idx) => idx !== i))}
                      title="Quitar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* imágenes ya subidas (IDs) */}
          <h4 className="text-sm font-medium mb-2">Subidas</h4>
          {imageIds.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {imageIds.map((id, i) => (
                <div key={`${id}-${i}`} className="relative rounded-lg overflow-hidden border">
                  <img
                    src={toImageUrl(id)}
                    alt={`img-${i}`}
                    className="w-full h-28 object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/img/placeholder-property.jpg' }}
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow"
                    onClick={() => setImageIds(prev => prev.filter((_, idx) => idx !== i))}
                    title="Quitar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Aún no hay imágenes subidas.</div>
          )}

          <p className="text-xs text-gray-500 mt-4 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Las imágenes se almacenan de forma privada en Google Drive (carpeta configurada en <code>DRIVE_FOLDER_ID</code>). En la hoja se guardan sólo los <em>IDs</em>.
          </p>
        </section>
      )}

      {/* Mensajes */}
      {msg && (
        <div className={`mt-4 card ${msg.type==='ok' ? 'border-emerald-200' : 'border-red-200'}`}>
          <div className={`${msg.type==='ok' ? 'text-emerald-700' : 'text-red-700'}`}>{msg.text}</div>
        </div>
      )}

      {/* acciones */}
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn btn-ghost" type="button" onClick={()=>window.history.back()}>Cancelar</button>
        <button className="btn btn-primary" disabled={creating} onClick={handleCreate}>
          {creating ? 'Creando...' : 'Crear Propiedad'}
        </button>
      </div>
    </div>
  )
}

/* -------- componentes auxiliares -------- */

function TabBtn({ active, onClick, children }: { active: boolean, onClick: ()=>void, children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-md text-sm ${
        active ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'bg-white border hover:bg-gray-50'
      }`}
    >
      {children}
    </button>
  )
}

function Check({ label, value, onChange }: { label: string, value: boolean, onChange: (v:boolean)=>void }) {
  const id = `chk-${label.replace(/\s+/g,'-').toLowerCase()}`
  return (
    <label htmlFor={id} className="flex items-center gap-2">
      <input id={id} type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

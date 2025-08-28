// src/pages/Admin.tsx
import { useState, useRef } from 'react'
import {
  ArrowLeft, Check, Home, Bath, Ruler, Car, Waves, CookingPot,
  BadgeDollarSign, ImagePlus, HousePlus, Building2, ChevronDown
} from 'lucide-react'



type Tab = 'basic' | 'details' | 'features' | 'pricing' | 'images'

export default function Admin() {
  const [tab, setTab] = useState<Tab>('basic')
  const fileRef = useRef<HTMLInputElement>(null)

  // --- estado mínimo para inputs (si ya tenés estado propio, mantenelo y solo cambiá las clases) ---
  const [form, setForm] = useState({
    titulo: '', ciudad: 'San Fernando del Valle de Catamarca', direccion: '',
    descripcion: '', tipo: 'Casa', operacion: 'Venta',
    destacada: false, activa: true,
    habitaciones: '', banos: '', m2cubiertos: '', m2totales: '',
    usd: '', ars: '',
    features: {
      cochera: false, piscina: false, dpto: false, quincho: false, parrillero: false,
    },
    imagenes: [] as File[],
  })

  const onPickImages = () => fileRef.current?.click()
  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    setForm((f) => ({ ...f, imagenes: files }))
  }

  // helper de clase para tab
  const tabCls = (active: boolean) =>
    `px-4 py-2 rounded-xl text-sm border transition-all ${active
      ? 'bg-white text-gray-900 border-gray-200 shadow-sm'
      : 'bg-gray-100 text-gray-700 border-transparent hover:bg-gray-50'}`

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container py-6">
        {/* header */}
        <div className="flex items-center gap-3 mb-4">
          <a href="/propiedades" className="btn btn-ghost px-3">
            <ArrowLeft className="w-4 h-4" /> Volver
          </a>
          <div>
            <h1 className="text-2xl font-semibold leading-tight">Nueva Propiedad</h1>
            <p className="text-gray-600">Completa la información de la nueva propiedad</p>
          </div>
        </div>

        {/* tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button className={tabCls(tab === 'basic')} onClick={() => setTab('basic')}>Información Básica</button>
          <button className={tabCls(tab === 'details')} onClick={() => setTab('details')}>Detalles</button>
          <button className={tabCls(tab === 'features')} onClick={() => setTab('features')}>Características</button>
          <button className={tabCls(tab === 'pricing')} onClick={() => setTab('pricing')}>Precios</button>
          <button className={tabCls(tab === 'images')} onClick={() => setTab('images')}>Imágenes</button>
        </div>

        {/* panel */}
        <div className="card p-6">
          {tab === 'basic' && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Información Básica</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título *</label>
                  <input type="text" placeholder="Ej: Casa en Barrio Norte"
                    value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Ciudad *</label>
                  <input type="text" placeholder="San Fernando del Valle de Catamarca"
                    value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Dirección</label>
                  <input type="text" placeholder="Dirección completa"
                    value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea rows={4} placeholder="Descripción detallada de la propiedad..."
                    value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Propiedad *</label>
                  <div className="relative">
                    <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="pr-8">
                      <option>Casa</option>
                      <option>Departamento</option>
                      <option>Lote</option>
                      <option>Local</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Operación *</label>
                  <div className="relative">
                    <select value={form.operacion} onChange={e => setForm({ ...form, operacion: e.target.value })} className="pr-8">
                      <option>Venta</option>
                      <option>Alquiler</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.destacada}
                         onChange={e => setForm({ ...form, destacada: e.target.checked })} />
                  Propiedad Destacada
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.activa}
                         onChange={e => setForm({ ...form, activa: e.target.checked })} />
                  Activa
                </label>
              </div>
            </section>
          )}

          {tab === 'details' && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Detalles de la Propiedad</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field icon={<HousePlus className="w-4 h-4 text-brand-600" />} label="Habitaciones">
                  <input type="number" placeholder="Número de habitaciones"
                         value={form.habitaciones}
                         onChange={e => setForm({ ...form, habitaciones: e.target.value })} />
                </Field>
                <Field icon={<Bath className="w-4 h-4 text-brand-600" />} label="Baños">
                  <input type="number" placeholder="Número de baños"
                         value={form.banos}
                         onChange={e => setForm({ ...form, banos: e.target.value })} />
                </Field>
                <Field icon={<Ruler className="w-4 h-4 text-brand-600" />} label="Superficie Cubierta (m²)">
                  <input type="number" placeholder="Metros cuadrados cubiertos"
                         value={form.m2cubiertos}
                         onChange={e => setForm({ ...form, m2cubiertos: e.target.value })} />
                </Field>
                <Field icon={<Ruler className="w-4 h-4 text-brand-600" />} label="Superficie Total (m²)">
                  <input type="number" placeholder="Metros cuadrados totales"
                         value={form.m2totales}
                         onChange={e => setForm({ ...form, m2totales: e.target.value })} />
                </Field>
              </div>
            </section>
          )}

          {tab === 'features' && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Características Adicionales</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Feature
                  checked={form.features.cochera}
                  onChange={(v) => setForm({ ...form, features: { ...form.features, cochera: v } })}
                  icon={<Car className="w-4 h-4" />} label="Cochera"
                />
                <Feature
                  checked={form.features.piscina}
                  onChange={(v) => setForm({ ...form, features: { ...form.features, piscina: v } })}
                  icon={<Waves className="w-4 h-4" />} label="Piscina"
                />

                <Feature
                  checked={form.features.dpto}
                  onChange={(v) => setForm({ ...form, features: { ...form.features, dpto: v } })}
                  icon={<Building2 className="w-4 h-4" />} label="Dpto. de Servicio"
                />
                <Feature
                  checked={form.features.quincho}
                  onChange={(v) => setForm({ ...form, features: { ...form.features, quincho: v } })}
                  icon={<Home className="w-4 h-4" />} label="Quincho"
                />
                <Feature
                  checked={form.features.parrillero}
                  onChange={(v) => setForm({ ...form, features: { ...form.features, parrillero: v } })}
                  icon={<CookingPot className="w-4 h-4" />} label="Parrillero"
                />
              </div>
              <Note>
                Seleccioná las características que posee la propiedad. Se mostrarán como badges en la tarjeta.
              </Note>
            </section>
          )}

          {tab === 'pricing' && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Precios</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Field icon={<BadgeDollarSign className="w-4 h-4 text-brand-600" />} label="Precio en USD">
                  <input type="number" placeholder="Precio en dólares"
                         value={form.usd} onChange={e => setForm({ ...form, usd: e.target.value })} />
                </Field>
                <Field icon={<BadgeDollarSign className="w-4 h-4 text-brand-600" />} label="Precio en ARS">
                  <input type="number" placeholder="Precio en pesos"
                         value={form.ars} onChange={e => setForm({ ...form, ars: e.target.value })} />
                </Field>
              </div>
              <Note>
                Podés especificar el precio en una o ambas monedas. Si no especificás precio, se mostrará “A consultar”.
              </Note>
            </section>
          )}

          {tab === 'images' && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold">Imágenes de la Propiedad</h2>
              <div
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 min-h-40 flex flex-col items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer"
                onClick={onPickImages}
              >
                <ImagePlus className="w-8 h-8 mb-2" />
                <div><strong>Click para subir</strong> imágenes</div>
                <div className="text-xs text-gray-500 mt-1">PNG, JPG hasta 10MB cada una</div>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onFiles} />
              </div>

              {form.imagenes.length > 0 && (
                <div className="grid md:grid-cols-4 gap-3">
                  {form.imagenes.map((f, i) => (
                    <div key={i} className="border rounded-xl p-3 text-sm">
                      <div className="truncate">{f.name}</div>
                      <div className="text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* acciones */}
        <div className="mt-4 flex items-center justify-end gap-3">
          <a href="/propiedades" className="btn btn-ghost">Cancelar</a>
          <button className="btn btn-primary">
            <Check className="w-4 h-4" /> Crear Propiedad
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------- componentes auxiliares ---------- */

function Field({ icon, label, children }: { icon?: React.ReactNode, label: string, children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <div className={icon ? 'pl-8' : ''}>
          {children}
        </div>
      </div>
    </div>
  )
}

function Feature({
  icon, label, checked, onChange,
}: { icon: React.ReactNode, label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <label className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white cursor-pointer
      ${checked ? 'border-brand-500 ring-2 ring-brand-500/40' : 'border-gray-200 hover:border-gray-300'}`}>
      <input type="checkbox" className="accent-brand-600" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="inline-flex items-center gap-2">
        <span className="text-brand-700">{icon}</span>
        <span>{label}</span>
      </span>
    </label>
  )
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 text-blue-800 text-sm border border-blue-100 rounded-xl px-4 py-3">
      <strong className="mr-1">Nota:</strong> {children}
    </div>
  )
}

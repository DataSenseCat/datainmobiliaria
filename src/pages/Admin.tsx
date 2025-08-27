import { useEffect, useState } from 'react'
import type { Property } from '../types'
import { adminUpsertProperty, adminDeleteProperty, fetchProperties } from '../lib/api'

const empty: Partial<Property> = {
  title: '', city: 'Catamarca', province: 'Catamarca', country: 'Argentina',
  currency:'USD', operation_type:'venta', property_type: 'casa', price: 0
}

export default function Admin(){
  const [items, setItems] = useState<Property[]>([])
  const [form, setForm] = useState<Partial<Property>>(empty)
  const [editingId, setEditingId] = useState<string|undefined>()

  const load = async()=> setItems(await fetchProperties())

  useEffect(()=>{ load() },[])

  const save = async(e:React.FormEvent)=>{
    e.preventDefault()
    await adminUpsertProperty({ ...form, id: editingId })
    setForm(empty); setEditingId(undefined)
    await load()
  }

  const edit = (p: Property)=>{ setForm(p); setEditingId(p.id) }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-4">
        <h2 className="font-semibold mb-3">{editingId? 'Editar' : 'Nueva'} propiedad</h2>
        <form className="grid grid-cols-2 gap-3" onSubmit={save}>
          <input placeholder="Título" value={form.title||''} onChange={e=>setForm({...form, title:e.target.value})} className="col-span-2"/>
          <input placeholder="Ciudad" value={form.city||''} onChange={e=>setForm({...form, city:e.target.value})}/>
          <input placeholder="Dirección" value={form.address||''} onChange={e=>setForm({...form, address:e.target.value})} className="col-span-2"/>
          <input placeholder="Precio" value={form.price||0} onChange={e=>setForm({...form, price:Number(e.target.value)})}/>
          <select value={form.currency||'USD'} onChange={e=>setForm({...form, currency:e.target.value})}>
            <option>USD</option><option>ARS</option>
          </select>
          <select value={form.operation_type||'venta'} onChange={e=>setForm({...form, operation_type:e.target.value})}>
            <option>venta</option><option>alquiler</option>
          </select>
          <select value={form.property_type||'casa'} onChange={e=>setForm({...form, property_type:e.target.value})}>
            <option>casa</option><option>departamento</option><option>lote</option><option>local</option>
          </select>
          <textarea placeholder="Descripción" value={form.description||''} onChange={e=>setForm({...form, description:e.target.value})} className="col-span-2" rows={4}/>
          <button className="btn btn-primary col-span-2" type="submit">{editingId? 'Guardar cambios' : 'Crear'}</button>
        </form>
      </div>
      <div>
        <h2 className="font-semibold mb-3">Propiedades</h2>
        <div className="grid gap-3">
          {items.map(p => (
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-600">{p.city} · {p.province}</div>
              </div>
              <div className="flex gap-2">
                <button className="btn" onClick={()=>edit(p)}>Editar</button>
                <button className="btn" onClick={async()=>{ await adminDeleteProperty(p.id); await load() }}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

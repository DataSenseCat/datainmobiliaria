import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProperty, createLead } from '../lib/api'
import type { Property } from '../types'
import Gallery from '../components/Gallery'
import PropertyMap from '../components/PropertyMap'

export default function Detail(){
  const { id } = useParams()
  const [p, setP] = useState<Property|undefined>()
  const [msg, setMsg] = useState<string>('')

  useEffect(()=>{
    (async ()=>{ if(id){ const data = await fetchProperty(id); setP(data) } })()
  }, [id])

  if(!p) return <p>Cargando...</p>

  const onSubmit = async (e:React.FormEvent)=>{
    e.preventDefault()
    await createLead({ id: '', property_id: p.id, name: (e.target as any).name.value, phone: (e.target as any).phone.value, email: (e.target as any).email.value, message: (e.target as any).message.value, source: 'web' })
    setMsg('¡Gracias! Te contactaremos pronto.')
    ;(e.target as any).reset()
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Gallery images={p.images}/>
        <h1 className="text-2xl font-bold mt-4">{p.title}</h1>
        <div className="text-gray-600">{p.address} · {p.city} · {p.province}</div>
        {p.price!=null && <div className="text-2xl text-brand-700 font-bold mt-2">{p.currency||'USD'} {Number(p.price).toLocaleString()}</div>}
        <div className="mt-4 whitespace-pre-line">{p.description}</div>
        {p.latitude && p.longitude && (
          <div className="mt-6">
            <PropertyMap lat={p.latitude} lng={p.longitude} title={p.title}/>
          </div>
        )}
      </div>
      <aside className="card p-4">
        <h2 className="font-semibold mb-2">Contactar</h2>
        <form className="space-y-3" onSubmit={onSubmit}>
          <div>
            <label>Nombre</label>
            <input name="name" required />
          </div>
          <div>
            <label>Teléfono</label>
            <input name="phone" />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" />
          </div>
          <div>
            <label>Mensaje</label>
            <textarea name="message" rows={4} />
          </div>
          <button className="btn btn-primary w-full" type="submit">Enviar</button>
          {msg && <p className="text-green-600 text-sm">{msg}</p>}
        </form>
      </aside>
    </div>
  )
}

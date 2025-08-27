import { useState } from 'react'

const sample = [
  { id:'1', titulo:'Complejo Residencial Las Palmeras', estado:'En Construcción', precio:'USD 85.000', entrega:'junio de 2025', img:'https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200' },
  { id:'2', titulo:'Torres del Valle', estado:'En Planificación', precio:'USD 90.000', entrega:'diciembre de 2025', img:'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1200' },
  { id:'3', titulo:'Barrio Cerrado El Mirador', estado:'Finalizado', precio:'USD 65.000', entrega:'agosto de 2024', img:'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200' },
]

export default function Emprendimientos(){
  const [tab, setTab] = useState<'Todos'|'En Planificación'|'En Construcción'|'Finalizados'>('Todos')
  const list = sample.filter(s => tab==='Todos' ? true : s.estado===tab)

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Emprendimientos Inmobiliarios</h1>

      <div className="flex gap-2 mb-4">
        {(['Todos','En Planificación','En Construcción','Finalizados'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 rounded-xl border ${tab===t?'bg-brand-600 text-white border-brand-600':'bg-white'}`}>{t}</button>
        ))}
      </div>

      <div className="card border-amber-200 bg-amber-50 p-4 mb-6">
        <strong>Configuración requerida:</strong> si querés administrar esta sección, luego agregamos una pestaña <code>developments</code> en Google Sheets y la conectamos. Por ahora se muestran ejemplos.
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {list.map(it=>(
          <div key={it.id} className="card overflow-hidden">
            <img src={it.img} alt="" className="w-full h-56 object-cover"/>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{it.titulo}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-600 text-white">{it.estado}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">Entrega {it.entrega}</div>
              <div className="mt-3 flex gap-2">
                <a className="btn" href="#">Ver Detalles</a>
                <a className="btn btn-primary" href="/contacto">Consultar</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

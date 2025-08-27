import {
  Phone, MessageCircle, Mail, MapPin, Clock, Building2, ChevronRight, AtSign, Users2
} from 'lucide-react'
import { SITE } from '../shared/SiteConfig'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useMemo } from 'react'

/** Icono default de Leaflet corregido para bundlers */
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export default function Contacto() {
  // puntos simulados alrededor del centro (podés ajustar)
  const center = useMemo(() => ({ lat: -28.468, lng: -65.779 }), [])
  const points = useMemo(() => ([
    { id: 'oficina',  pos: center, label: 'Oficina Central' },
    { id: '1', pos: { lat: center.lat + 0.006, lng: center.lng - 0.008 }, label: 'Sucursal Norte' },
    { id: '2', pos: { lat: center.lat - 0.004, lng: center.lng + 0.007 }, label: 'Sucursal Centro' },
    { id: '3', pos: { lat: center.lat + 0.008, lng: center.lng + 0.004 }, label: 'Punto de atención' },
    { id: '4', pos: { lat: center.lat - 0.007, lng: center.lng - 0.006 }, label: 'Punto de atención' },
  ]), [center])

  return (
    <div className="w-full">
      {/* Encabezado + badges */}
      <section className="container py-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Contactános</h1>
            <p className="text-gray-600">¿Tenés alguna consulta? Elegí el canal que prefieras y te respondemos a la brevedad.</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Badge icon={<Clock className="w-4 h-4" />} text="Respuesta rápida" />
            <Badge icon={<Users2 className="w-4 h-4" />} text="Atención personalizada" />
            <Badge icon={<Building2 className="w-4 h-4" />} text="Asesoramiento gratuito" />
          </div>
        </div>
      </section>

      {/* Formas de contacto (tarjetas) */}
      <section className="container">
        <h2 className="font-semibold mb-3">Formas de Contacto</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <ContactCard icon={<Phone className="w-5 h-5" />} title="Teléfono" desc="Lunes a viernes de 9 a 18h">
            <a href={`tel:${SITE.phone}`} className="btn btn-outline w-full">Llamar</a>
          </ContactCard>
          <ContactCard icon={<MessageCircle className="w-5 h-5" />} title="WhatsApp" desc="Respuesta inmediata">
            <a href={`https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}`} target="_blank" className="btn btn-outline w-full" rel="noreferrer">Chatear</a>
          </ContactCard>
          <ContactCard icon={<Mail className="w-5 h-5" />} title="Email" desc="Respondemos en 24h">
            <a href={`mailto:${SITE.email}`} className="btn btn-outline w-full">Escribir</a>
          </ContactCard>
          <ContactCard icon={<MapPin className="w-5 h-5" />} title="Oficina" desc={SITE.location}>
            <a href="#mapa" className="btn btn-outline w-full">Ver Mapa</a>
          </ContactCard>
        </div>
      </section>

      {/* Form + info oficina */}
      <section className="container py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Formulario */}
          <form className="md:col-span-2 card p-5">
            <h3 className="font-semibold mb-3">Envíanos un Mensaje</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Nombre completo *" required />
              <input placeholder="Email *" type="email" required />
              <input placeholder="Teléfono (opcional)" />
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>¿Cómo preferís que te contactemos?</span>
              </div>
              <div className="col-span-2 flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="pref" defaultChecked /> Teléfono</label>
                <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="pref" /> Email</label>
                <label className="inline-flex items-center gap-2 text-sm"><input type="radio" name="pref" /> WhatsApp</label>
              </div>
              <select className="col-span-2" defaultValue="">
                <option value="" disabled>Seleccionar asunto</option>
                <option>Comprar propiedad</option>
                <option>Vender propiedad</option>
                <option>Alquiler / Administración</option>
                <option>Tasación</option>
                <option>Otro</option>
              </select>
              <textarea className="col-span-2" rows={6} placeholder="Contanos en qué podemos ayudarte..." />
              <button className="btn btn-primary col-span-2">Enviar Mensaje</button>
            </div>
          </form>

          {/* Información oficina + departamentos */}
          <aside className="card p-5">
            <h3 className="font-semibold mb-3">Información de la Oficina</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5"/>{SITE.address}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4"/><a className="underline" href={`tel:${SITE.phone}`}>{SITE.phone}</a></p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4"/><a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
              <div className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5"/> <div>
                <div><strong>Horarios de Atención</strong></div>
                <div>Lun - Vie: 9:00 - 18:00</div>
                <div>Sábados: 9:00 - 13:00</div>
                <div>Domingo: Cerrado</div>
              </div></div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Departamentos</h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <Dept label="Ventas"   email="ventas@inmobiliariacatamarca.com" phone="+54 383 456-7890" />
                <Dept label="Alquileres" email="alquileres@inmobiliariacatamarca.com" phone="+54 383 456-7891" />
                <Dept label="Tasaciones" email="tasaciones@inmobiliariacatamarca.com" phone="+54 383 456-7892" />
                <Dept label="Administración" email="admin@inmobiliariacatamarca.com" phone="+54 383 456-7893" />
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Mapa */}
      <section className="container" id="mapa">
        <h3 className="font-semibold mb-3">Nuestra Ubicación</h3>
        <div className="card overflow-hidden">
          <MapContainer center={center} zoom={14} style={{ height: 420, width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map(p => (
              <Marker key={p.id} position={p.pos} icon={markerIcon}>
                <Popup>{p.label}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-10">
        <h3 className="text-xl font-semibold text-center mb-6">Preguntas Frecuentes</h3>
        <div className="max-w-3xl mx-auto space-y-3">
          <FAQ q="¿Cuál es el horario de atención?" a="Atendemos de lunes a viernes de 9:00 a 18:00 y sábados de 9:00 a 13:00. Por WhatsApp respondemos las 24 horas." />
          <FAQ q="¿Hacen tasaciones gratuitas?" a="Sí, nuestras tasaciones son completamente gratuitas y sin compromiso." />
          <FAQ q="¿Qué zonas operan?" a="Principalmente en San Fernando del Valle de Catamarca y alrededores, pero trabajamos en toda la provincia." />
          <FAQ q="¿Cómo puedo publicar mi propiedad?" a="Podés contactarnos por cualquier medio y prepararíamos una visita para valorar y publicar tu propiedad." />
        </div>
      </section>

      {/* CTA naranja */}
      <section className="bg-orange-600 text-white">
        <div className="container py-8 grid md:grid-cols-2 gap-4 items-center">
          <div>
            <h3 className="text-xl font-semibold">¿Necesitás atención fuera del horario comercial?</h3>
            <p className="opacity-95">Para urgencias o administración, escribinos por WhatsApp. Respondemos 24 hs.</p>
          </div>
          <div className="md:text-right">
            <a
              className="btn bg-white text-orange-600 hover:bg-white/90"
              href={`https://wa.me/${SITE.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
            >
              WhatsApp 24hs <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

/* --------- componentes pequeños con el mismo “feel” que en Tasaciones --------- */

function Badge({ icon, text }:{icon:React.ReactNode,text:string}) {
  return (
    <div className="flex items-center gap-2 text-xs bg-gray-100 rounded-full px-3 py-1">
      <span className="text-brand-700">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  )
}

function ContactCard({ icon, title, desc, children }:{
  icon:React.ReactNode, title:string, desc:string, children:React.ReactNode
}) {
  return (
    <div className="card p-4 hover:border-gray-300">
      <div className="flex items-center gap-2 mb-1 text-gray-800">
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">{icon}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{desc}</p>
      {children}
    </div>
  )
}

function Dept({ label, email, phone }:{label:string,email:string,phone:string}) {
  return (
    <li className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><AtSign className="w-4 h-4"/></div>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-600">
          <a href={`mailto:${email}`} className="underline">{email}</a> · <a href={`tel:${phone}`} className="underline">{phone}</a>
        </div>
      </div>
    </li>
  )
}

function FAQ({ q, a }:{q:string,a:string}) {
  return (
    <details className="card p-4 group">
      <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
        {q}
        <span className="ml-4 text-gray-400 group-open:rotate-45 transition-transform">＋</span>
      </summary>
      <p className="text-gray-700 mt-2">{a}</p>
    </details>
  )
}

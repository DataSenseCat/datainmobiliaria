import {
  Phone, MessageCircle, Mail, MapPin, Clock, Building2, ChevronRight, AtSign, Users2
} from 'lucide-react'
import { SITE } from '../shared/SiteConfig'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useMemo, useRef } from 'react'

/** Icono default Leaflet (evita marker invisible en bundlers) */
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
})

export default function Contacto() {
  const topRef = useRef<HTMLDivElement>(null)

  // puntos simulados alrededor del centro (ajusta si querés)
  const center = useMemo(() => ({ lat: -28.468, lng: -65.779 }), [])
  const points = useMemo(() => ([
    { id: 'oficina',  pos: center, label: 'Oficina Central' },
    { id: '1', pos: { lat: center.lat + 0.006, lng: center.lng - 0.008 }, label: 'Sucursal Norte' },
    { id: '2', pos: { lat: center.lat - 0.004, lng: center.lng + 0.007 }, label: 'Sucursal Centro' },
    { id: '3', pos: { lat: center.lat + 0.008, lng: center.lng + 0.004 }, label: 'Punto de atención' },
    { id: '4', pos: { lat: center.lat - 0.007, lng: center.lng - 0.006 }, label: 'Punto de atención' },
  ]), [center])

  return (
    <div className="w-full" ref={topRef}>
      {/* ===== Encabezado (igual que inmobiliaria1) ===== */}
      <section className="container pt-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">Contactános</h1>
        <p className="text-gray-600 max-w-3xl mx-auto mt-2">
          ¿Tenés alguna consulta? Nos encantaría ayudarte. Contactanos a través de cualquiera de
          nuestros canales de comunicación y te responderemos a la brevedad.
        </p>

        {/* Chips de color */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Chip className="bg-green-100 text-green-700">
            <Clock className="w-4 h-4" /> Respuesta rápida
          </Chip>
          <Chip className="bg-blue-100 text-blue-700">
            <Users2 className="w-4 h-4" /> Atención personalizada
          </Chip>
          <Chip className="bg-violet-100 text-violet-700">
            <Building2 className="w-4 h-4" /> Asesoramiento gratuito
          </Chip>
        </div>
      </section>

      {/* Separador fino como en la referencia */}
      <div className="border-t mt-6" />

      {/* ===== Formas de Contacto (centrado, icono arriba, botón primario) ===== */}
      <section className="container py-6">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">Formas de Contacto</h2>

        <div className="grid md:grid-cols-4 gap-6">
          <ContactTile
            icon={<Phone className="w-6 h-6 text-emerald-600" />}
            title="Teléfono"
            line1={SITE.phone}
            line2="Lunes a Viernes de 9 a 18hs"
            href={`tel:${SITE.phone}`}
            cta="Llamar"
          />
          <ContactTile
            icon={<MessageCircle className="w-6 h-6 text-emerald-600" />}
            title="WhatsApp"
            line1={SITE.whatsapp}
            line2="Respuesta inmediata"
            href={`https://wa.me/${SITE.whatsapp.replace(/\D/g, '')}`}
            cta="Chatear"
            targetBlank
          />
          <ContactTile
            icon={<Mail className="w-6 h-6 text-blue-600" />}
            title="Email"
            line1={SITE.email}
            line2="Respuesta en 24hs"
            href={`mailto:${SITE.email}`}
            cta="Escribir"
          />
          <ContactTile
            icon={<MapPin className="w-6 h-6 text-violet-600" />}
            title="Oficina"
            line1="Av. República 123"
            line2="San Fernando del Valle de Catamarca"
            href="#mapa"
            cta="Ver Mapa"
          />
        </div>
      </section>

      {/* ===== Formulario + Información Oficina ===== */}
      <section className="container py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Formulario */}
          <form className="md:col-span-2 card p-5">
            <h3 className="font-semibold mb-3">Envíanos un Mensaje</h3>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Nombre completo *" required />
              <input placeholder="Email *" type="email" required />
              <input placeholder="Teléfono (opcional)" />
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

          {/* Info oficina + departamentos */}
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

      {/* ===== Mapa ===== */}
      <section className="container" id="mapa">
        <h3 className="font-semibold mb-3">Nuestra Ubicación</h3>
        <div className="card overflow-hidden">
          <MapContainer center={center} zoom={14} style={{ height: 420, width: '100%' }}>
            <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {points.map(p => (
              <Marker key={p.id} position={p.pos} icon={markerIcon}>
                <Popup>{p.label}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="container py-10">
        <h3 className="text-xl font-semibold text-center mb-6">Preguntas Frecuentes</h3>
        <div className="max-w-3xl mx-auto space-y-3">
          <FAQ q="¿Cuál es el horario de atención?" a="Lunes a viernes de 9:00 a 18:00 y sábados de 9:00 a 13:00. Por WhatsApp respondemos las 24 hs." />
          <FAQ q="¿Hacen tasaciones gratuitas?" a="Sí, completamente gratuitas y sin compromiso." />
          <FAQ q="¿Qué zonas operan?" a="Principalmente SFV de Catamarca y alrededores, pero trabajamos en toda la provincia." />
          <FAQ q="¿Cómo publico mi propiedad?" a="Contactanos; coordinamos una visita para valorar y publicar la propiedad." />
        </div>
      </section>

      {/* ===== CTA naranja ===== */}
      <section className="bg-orange-600 text-white">
        <div className="container py-8 grid md:grid-cols-2 gap-4 items-center">
          <div>
            <h3 className="text-xl font-semibold">¿Necesitás atención fuera del horario comercial?</h3>
            <p className="opacity-95">Para urgencias y administración, escribinos por WhatsApp. Respondemos 24 hs.</p>
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

/* ------------------- componentes pequeños ------------------- */

function Chip({ className, children }:{className?:string, children:React.ReactNode}) {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${className}`}>{children}</span>
  )
}

function ContactTile({
  icon, title, line1, line2, href, cta, targetBlank
}:{
  icon:React.ReactNode, title:string, line1:string, line2:string, href:string, cta:string, targetBlank?:boolean
}) {
  return (
    <div className="card p-6 text-center hover:border-gray-300">
      <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center bg-gray-50 mb-2">
        {icon}
      </div>
      <div className="font-semibold">{title}</div>
      <div className="text-gray-900 mt-1">{line1}</div>
      <div className="text-gray-500 text-sm">{line2}</div>
      <a
        href={href}
        className="btn btn-primary w-full mt-4"
        {...(targetBlank ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {cta}
      </a>
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

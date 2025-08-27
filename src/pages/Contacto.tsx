import { SITE } from '../shared/SiteConfig'
import PropertyMap from '../components/PropertyMap'

export default function Contacto(){
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-2">Contactános</h1>
      <p className="text-gray-600 mb-6">Elegí el canal que prefieras y te respondemos a la brevedad.</p>

      <div className="grid md:grid-cols-3 gap-6">
        <form className="md:col-span-2 card p-4">
          <h2 className="font-semibold mb-3">Envíanos un Mensaje</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Nombre completo"/><input placeholder="Email" type="email"/>
            <input placeholder="Teléfono"/><select><option>Asunto</option><option>Comprar</option><option>Vender</option><option>Alquilar</option></select>
            <textarea className="col-span-2" rows={6} placeholder="¿En qué podemos ayudarte?"/>
          </div>
          <button className="btn btn-primary mt-3">Enviar Mensaje</button>
        </form>
        <aside className="card p-4">
          <h3 className="font-semibold mb-2">Información de la Oficina</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <div><strong>Dirección:</strong> {SITE.address}</div>
            <div><strong>Teléfono:</strong> <a href={`tel:${SITE.phone}`} className="underline">{SITE.phone}</a></div>
            <div><strong>Email:</strong> <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a></div>
          </div>
        </aside>
      </div>

      <div className="mt-8">
        {/* Punto aproximado del centro - podés ajustar coordenadas */}
        <PropertyMap lat={-28.468} lng={-65.779} title="Inmobiliaria Catamarca" />
      </div>
    </div>
  )
}

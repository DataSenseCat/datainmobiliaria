import { SITE } from '../shared/SiteConfig'

export default function Tasaciones(){
  return (
    <div>
      <section className="bg-brand-600 text-white py-10">
        <div className="container grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold">Tasación Gratuita de tu Propiedad</h1>
            <p className="opacity-90 mt-2">Conocé el valor real de tu propiedad con nuestro informe profesional.</p>
          </div>
          <form className="card p-4 bg-white text-gray-800">
            <h2 className="font-semibold mb-2">Solicitar Tasación</h2>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Nombre completo"/>
              <input placeholder="Email" type="email"/>
              <input placeholder="Teléfono"/>
              <input placeholder="Área (m²)"/>
              <input className="col-span-2" placeholder="Dirección"/>
              <select className="col-span-2"><option>Tipo de propiedad</option><option>casa</option><option>departamento</option><option>lote</option></select>
              <textarea className="col-span-2" rows={4} placeholder="Comentarios adicionales"/>
            </div>
            <button className="btn btn-primary w-full mt-3">Solicitar Tasación Gratuita</button>
            <p className="text-xs text-gray-500 mt-2">Tus datos se mantendrán confidenciales.</p>
          </form>
        </div>
      </section>

      <section className="container py-10 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card p-4">
          <h3 className="font-semibold mb-3">¿Cómo funciona?</h3>
          <ol className="list-decimal ml-6 space-y-2 text-gray-700">
            <li>Contacto inicial</li><li>Visita técnica</li><li>Análisis de mercado</li><li>Informe detallado</li>
          </ol>
        </div>
        <aside className="card p-4">
          <h3 className="font-semibold mb-3">¿Preferís contactarnos directamente?</h3>
          <p>WhatsApp: {SITE.whatsapp}</p>
          <p>Email: <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a></p>
        </aside>
      </section>
    </div>
  )
}

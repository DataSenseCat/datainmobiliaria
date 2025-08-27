import { CheckCircle2, Clock, FileText, MessageCircle, Mail, Phone, Home, Building2, Star } from 'lucide-react'
import { SITE } from '../shared/SiteConfig'

export default function Tasaciones(){
  return (
    <div className="w-full">
      {/* HERO azul */}
      <section className="bg-brand-600 text-white">
        <div className="container py-12">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/15 rounded-full px-3 py-1 mb-3">
            <span className="bg-white text-brand-600 px-2 py-0.5 rounded-full font-semibold">Servicio Gratuito</span>
            <span className="opacity-90">sin costos ocultos</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Tasación Gratuita de tu Propiedad</h1>
          <p className="opacity-90 mt-2 max-w-3xl">
            Conocé el valor real de tu propiedad con nuestra tasación profesional y gratuita. Más de 15 años de experiencia en el mercado inmobiliario catamarqueño.
          </p>

          {/* Badges */}
          <div className="mt-6 grid md:grid-cols-3 gap-3">
            <Badge icon={<CheckCircle2 className="w-5 h-5" />} title="100% Gratuito" desc="sin costos ocultos" />
            <Badge icon={<Clock className="w-5 h-5" />} title="Respuesta en 24hs" desc="contacto inmediato" />
            <Badge icon={<FileText className="w-5 h-5" />} title="Informe Completo" desc="análisis detallado" />
          </div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="container -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* FORM */}
          <div className="md:col-span-2 card p-6 bg-white">
            <h2 className="text-lg font-semibold mb-1">Solicitar Tasación Gratuita</h2>
            <p className="text-sm text-gray-600 mb-4">Completá el formulario y nos contactamos en las próximas 24 horas.</p>

            <form className="grid grid-cols-2 gap-3">
              <input placeholder="Nombre completo *" required />
              <input placeholder="Email *" type="email" required />
              <input placeholder="Teléfono (opcional)" />
              <input placeholder="Área aproximada (m²)" />
              <input className="col-span-2" placeholder="Dirección (ej: Av. Belgrano 1230, Catamarca)" />
              <select className="col-span-2">
                <option>Seleccionar tipo</option>
                <option>Casa</option>
                <option>Departamento</option>
                <option>Lote</option>
                <option>Local</option>
              </select>
              <textarea className="col-span-2" rows={4} placeholder="Comentarios adicionales sobre la propiedad..." />
              <div className="col-span-2">
                <label className="flex items-start gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="mt-1" /> 
                  <span>
                    <strong>¿Qué incluye la tasación?</strong><br/>
                    Evaluación presencial (si aplica), análisis comparativo de mercado, informe orientativo de valor y recomendaciones para mejorar el valor.
                  </span>
                </label>
              </div>
              <button type="submit" className="btn btn-primary col-span-2">Solicitar Tasación Gratuita</button>
              <p className="text-xs text-gray-500 col-span-2">Al enviar este formulario, aceptás que nos contactemos para coordinar la tasación. Tus datos se mantienen confidenciales.</p>
            </form>
          </div>

          {/* SIDEBAR */}
          <aside className="flex flex-col gap-6">
            <div className="card p-6">
              <h3 className="font-semibold mb-3">¿Cómo funciona?</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center mt-0.5">1</span>
                  <div><strong>Contacto Inicial</strong><br/>Nos ponemos en contacto para conocer los detalles de tu propiedad.</div>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center mt-0.5">2</span>
                  <div><strong>Visita Técnica</strong><br/>Realizamos una inspección y tomamos datos relevantes.</div>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center mt-0.5">3</span>
                  <div><strong>Análisis de Mercado</strong><br/>Comparamos con operaciones y ofertas reales de la zona.</div>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center mt-0.5">4</span>
                  <div><strong>Informe Detallado</strong><br/>Te entregamos el valor estimado y recomendaciones para maximizar el precio.</div>
                </li>
              </ol>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold mb-2">¿Preferís contactarnos directamente?</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-emerald-600"/> WhatsApp: {SITE.whatsapp}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-blue-600"/> Email: <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a></p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-700"/> Teléfono: <a href={`tel:${SITE.phone}`} className="underline">{SITE.phone}</a></p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ¿Por qué elegir...? */}
      <section className="container py-12">
        <h3 className="text-xl font-semibold text-center mb-2">¿Por qué elegir nuestra tasación?</h3>
        <p className="text-center text-gray-600 mb-8">Somos líderes en tasaciones en Catamarca con un equipo de profesionales certificados.</p>

        <div className="grid md:grid-cols-4 gap-4">
          <FeatureCard icon={<Building2 className="w-5 h-5"/>} title="Más de 15 años de experiencia" desc="Trayectoria en el mercado inmobiliario catamarqueño." />
          <FeatureCard icon={<Home className="w-5 h-5"/>} title="Análisis de mercado actualizado" desc="Datos reales de operaciones y ofertas comparables." />
          <FeatureCard icon={<CheckCircle2 className="w-5 h-5"/>} title="Servicio completamente gratuito" desc="El informe no tiene costo ni compromiso." />
          <FeatureCard icon={<Clock className="w-5 h-5"/>} title="Respuesta en 24 horas" desc="Coordinamos contacto en menos de 24 hs." />
        </div>
      </section>

      {/* Testimonios */}
      <section className="container pb-10">
        <h3 className="text-xl font-semibold mb-4">Lo que dicen nuestros clientes</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Testimonial text="Excelente servicio, la tasación fue muy profesional y me ayudó a establecer un precio justo para mi casa." author="María González" role="Barrio Norte" />
          <Testimonial text="Muy conforme con el informe. Fue detallado y las recomendaciones me ayudaron mucho en la venta." author="Carlos Rodríguez" role="Centro" />
          <Testimonial text="Profesionales serios y confiables. La tasación fue gratuita como prometieron y muy completa." author="Ana Pérez" role="Villa Cubas" />
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-12">
        <h3 className="text-xl font-semibold text-center mb-6">Preguntas Frecuentes</h3>
        <div className="max-w-3xl mx-auto space-y-3">
          <FAQ q="¿Realmente es gratuita la tasación?" a="Sí, completamente gratuita. No cobramos nada por la visita, evaluación e informe de tasación." />
          <FAQ q="¿Cuánto tiempo demora el proceso?" a="Entre 3 a 5 días hábiles desde la solicitud hasta la entrega del informe." />
          <FAQ q="¿Qué incluye el informe de tasación?" a="Valor estimado, análisis comparativo de mercado, fotos de la propiedad, y recomendaciones para mejorar el valor." />
          <FAQ q="¿Debo estar presente durante la tasación?" a="Preferentemente sí, para mostrar características especiales de la propiedad y resolver dudas." />
          <FAQ q="¿En qué zonas hacen tasaciones?" a="Trabajamos en toda la provincia de Catamarca, priorizando San Fernando del Valle y alrededores." />
        </div>
      </section>

      {/* CTA verde */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="container py-10 text-center">
          <h3 className="text-xl md:text-2xl font-semibold mb-2">¿Estás pensando en vender tu propiedad?</h3>
          <p className="opacity-95 mb-5">Una tasación profesional es el primer paso para una venta exitosa.</p>
          <div className="flex items-center justify-center gap-3">
            <a href="#top" className="btn bg-white text-emerald-700 hover:bg-white/90">Solicitar Tasación Gratuita</a>
            <a href="/contacto" className="btn btn-primary border-white bg-transparent hover:bg-white/10">Contactar Asesor</a>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------- componentes chicos usados arriba ---------- */

function Badge({icon, title, desc}:{icon:React.ReactNode,title:string,desc:string}){
  return (
    <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-xs opacity-85">{desc}</div>
      </div>
    </div>
  )
}

function FeatureCard({icon,title,desc}:{icon:React.ReactNode,title:string,desc:string}){
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-brand-700 mb-2">{icon}<span className="font-semibold">{title}</span></div>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  )
}

function Testimonial({text, author, role}:{text:string, author:string, role:string}){
  return (
    <div className="card p-4">
      <div className="flex items-center gap-1 text-amber-500 mb-2">
        <Star className="w-4 h-4"/><Star className="w-4 h-4"/><Star className="w-4 h-4"/><Star className="w-4 h-4"/><Star className="w-4 h-4"/>
      </div>
      <p className="text-gray-700 italic">“{text}”</p>
      <div className="text-sm text-gray-600 mt-3">
        <strong>{author}</strong> · {role}
      </div>
    </div>
  )
}

function FAQ({q,a}:{q:string,a:string}){
  return (
    <details className="card p-4">
      <summary className="cursor-pointer font-medium">{q}</summary>
      <p className="text-gray-700 mt-2">{a}</p>
    </details>
  )
}

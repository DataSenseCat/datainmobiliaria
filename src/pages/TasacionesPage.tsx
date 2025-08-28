import {
  CheckCircle2, Clock, FileText, MessageCircle, Mail, Phone,
  Building2, Home, Star
} from 'lucide-react'
import { useEffect, useRef } from 'react'
import { SITE } from '../shared/SiteConfig'

export default function TasacionesPage() {
  useEffect(() => { console.log('TASACIONES_PAGE 🟢 render'); }, [])
  const formRef = useRef<HTMLDivElement>(null)
  const goForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="w-full">
      {/* HERO azul centrado (pill + 3 badges + 2 botones) */}
      <section className="bg-brand-600 text-white">
        <div className="container py-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/15 rounded-full px-3 py-1 mb-3">
            <span className="bg-white text-brand-600 px-2 py-0.5 rounded-full font-semibold">Servicio Gratuito</span>
            <span className="opacity-90">sin costos ocultos</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">Tasación Gratuita de tu Propiedad</h1>
          <p className="opacity-90 mt-2 max-w-3xl mx-auto">
            Conocé el valor real de tu propiedad con nuestra tasación profesional y gratuita. Más de 15 años de experiencia en el mercado inmobiliario catamarqueño.
          </p>

          <div className="mt-6 grid md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            <HeroBadge icon={<CheckCircle2 className="w-5 h-5" />} title="100% Gratuito" desc="sin costos ocultos" />
            <HeroBadge icon={<Clock className="w-5 h-5" />} title="Respuesta en 24hs" desc="contacto inmediato" />
            <HeroBadge icon={<FileText className="w-5 h-5" />} title="Informe Completo" desc="análisis detallado" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={goForm} className="btn bg-white text-brand-700 hover:bg-white/90">Solicitar Tasación</button>
            <a href="/contacto" className="btn btn-outline border-white text-white hover:bg-white/10">Contactar asesor</a>
          </div>
        </div>
      </section>

      {/* FORM + SIDEBAR (sobrepuesto) */}
      <section ref={formRef} className="container -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="md:col-span-2 card p-6">
            <h2 className="text-lg font-semibold mb-1">Solicitar Tasación Gratuita</h2>
            <p className="text-sm text-gray-600 mb-4">Completá el formulario y nos contactamos en las próximas 24 horas.</p>

            <form className="grid grid-cols-2 gap-3">
              <input placeholder="Nombre completo *" required />
              <input placeholder="Email *" type="email" required />
              <input placeholder="Teléfono (opcional)" />
              <input placeholder="Área aproximada (m²)" />
              <input className="col-span-2" placeholder="Dirección (ej: Av. Belgrano 1230, Catamarca)" />
              <select className="col-span-2" defaultValue="">
                <option value="" disabled>Seleccionar tipo</option>
                <option>Casa</option><option>Departamento</option><option>Lote</option><option>Local</option>
              </select>
              <textarea className="col-span-2" rows={4} placeholder="Comentarios adicionales sobre la propiedad..." />

              <div className="col-span-2 text-xs text-gray-600 -mt-1">
                <strong>¿Qué incluye la tasación?</strong> Evaluación presencial (si aplica), análisis comparativo de mercado, informe orientativo de valor y recomendaciones para mejorar el valor.
              </div>

              <button type="submit" className="btn btn-primary col-span-2 mt-1">Solicitar Tasación Gratuita</button>
              <p className="text-xs text-gray-500 col-span-2">Al enviar este formulario aceptás que nos contactemos para coordinar la tasación. Tus datos se mantienen confidenciales.</p>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="card p-6">
              <h3 className="font-semibold mb-3">¿Cómo funciona?</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <Step n={1} title="Contacto Inicial" desc="Nos comunicamos para conocer detalles de tu propiedad." />
                <Step n={2} title="Visita Técnica" desc="Inspección, fotos y relevamiento." />
                <Step n={3} title="Análisis de Mercado" desc="Comparativos reales de la zona y operaciones recientes." />
                <Step n={4} title="Informe Detallado" desc="Valor estimado y recomendaciones para maximizar el precio." />
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

      {/* Por qué elegirnos */}
      <section className="container py-12">
        <h3 className="text-xl font-semibold text-center mb-2">¿Por qué elegir nuestra tasación?</h3>
        <p className="text-center text-gray-600 mb-8">Somos líderes en tasaciones en Catamarca con un equipo de profesionales certificados.</p>

        <div className="grid md:grid-cols-4 gap-4">
          <FeatureCard icon={<Building2 className="w-5 h-5"/>} title="15+ años de experiencia" desc="Trayectoria en el mercado local." />
          <FeatureCard icon={<Home className="w-5 h-5"/>} title="Análisis actualizado" desc="Datos reales de operaciones y ofertas comparables." />
          <FeatureCard icon={<CheckCircle2 className="w-5 h-5"/>} title="Servicio gratuito" desc="Informe sin costo ni compromiso." />
          <FeatureCard icon={<Clock className="w-5 h-5"/>} title="Respuesta en 24 hs" desc="Coordinamos el contacto en menos de 24 horas." />
        </div>
      </section>

      {/* Testimonios */}
      <section className="container pb-10">
        <h3 className="text-xl font-semibold mb-4">Lo que dicen nuestros clientes</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Testimonial text="Excelente servicio; la tasación fue muy profesional y me ayudó a establecer un precio justo para mi casa." author="María González" role="Barrio Norte" />
          <Testimonial text="Muy conforme con el informe. Fue detallado y las recomendaciones me ayudaron mucho en la venta." author="Carlos Rodríguez" role="Centro" />
          <Testimonial text="Profesionales serios y confiables. La tasación fue gratuita como prometieron y muy completa." author="Ana Pérez" role="Villa Cubas" />
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-12">
        <h3 className="text-xl font-semibold text-center mb-6">Preguntas Frecuentes</h3>
        <div className="max-w-3xl mx-auto space-y-3">
          <FAQ q="¿Realmente es gratuita la tasación?" a="Sí, completamente gratuita. No cobramos por la visita, evaluación ni informe." />
          <FAQ q="¿Cuánto demora el proceso?" a="Entre 3 a 5 días hábiles desde la solicitud hasta la entrega del informe." />
          <FAQ q="¿Qué incluye el informe?" a="Valor estimado, análisis comparativo, fotos de la propiedad y recomendaciones." />
          <FAQ q="¿Debo estar presente?" a="Preferentemente sí, para mostrar características especiales y responder dudas." />
          <FAQ q="¿En qué zonas trabajan?" a="Toda la provincia de Catamarca, priorizando San Fernando del Valle y alrededores." />
        </div>
      </section>

      {/* CTA verde final */}
      <section className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="container py-10 text-center">
          <h3 className="text-xl md:text-2xl font-semibold mb-2">¿Estás pensando en vender tu propiedad?</h3>
          <p className="opacity-95 mb-5">Una tasación profesional es el primer paso para una venta exitosa.</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={goForm} className="btn bg-white text-emerald-700 hover:bg-white/90">Solicitar Tasación Gratuita</button>
            <a href="/contacto" className="btn btn-outline border-white text-white hover:bg-white/10">Contactar Asesor</a>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------- componentes ---------- */
function HeroBadge({ icon, title, desc }:{icon:React.ReactNode,title:string,desc:string}) {
  return (
    <div className="group flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 transition-all hover:bg-white/15">
      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-xs opacity-85">{desc}</div>
      </div>
    </div>
  )
}
function Step({ n, title, desc }:{n:number,title:string,desc:string}) {
  return (
    <li className="flex gap-3">
      <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center mt-0.5">{n}</span>
      <div><strong>{title}</strong><br/><span className="text-gray-600">{desc}</span></div>
    </li>
  )
}
function FeatureCard({ icon, title, desc }:{icon:React.ReactNode,title:string,desc:string}) {
  return (
    <div className="card p-4 hover:border-gray-300">
      <div className="flex items-center gap-2 text-brand-700 mb-2">{icon}<span className="font-semibold">{title}</span></div>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  )
}
function Testimonial({ text, author, role }:{text:string,author:string,role:string}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-1 text-amber-500 mb-2">
        <Star className="w-4 h-4"/><Star className="w-4 h-4"/><Star className="w-4 h-4"/><Star className="w-4 h-4"/><Star className="w-4 h-4"/>
      </div>
      <p className="text-gray-700 italic">“{text}”</p>
      <div className="text-sm text-gray-600 mt-3"><strong>{author}</strong> · {role}</div>
    </div>
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

import {
  Trophy, ShieldCheck, Sparkles, Building2, Home, Users2, Hammer, Scale, CheckCircle2,
  Quote, Star, BriefcaseBusiness, ClipboardList
} from 'lucide-react'

import { SITE } from '../shared/SiteConfig'

export default function EmpresaPage() {
  
  return (
    <div className="w-full">
      {/* HERO azul centrado (pill + 3 badges + 2 botones) */}
      <section className="bg-brand-600 text-white">
        <div className="container py-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/15 rounded-full px-3 py-1 mb-3">
            <span className="bg-white text-brand-600 px-2 py-0.5 rounded-full font-semibold">Desde 2008</span>
            <span className="opacity-90">más de 15 años de experiencia</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">Inmobiliaria Catamarca</h1>
          <p className="opacity-90 mt-2 max-w-3xl mx-auto">
            Líderes en el mercado inmobiliario catamarqueño: experiencia, cercanía y resultados para conectar personas
            con su próximo hogar o inversión.
          </p>

          <div className="mt-6 grid md:grid-cols-3 gap-3 max-w-4xl mx-auto">
            <HeroBadge icon={<Trophy className="w-5 h-5" />} title="2,500+ operaciones" desc="ventas y alquileres concretados" />
            <HeroBadge icon={<ShieldCheck className="w-5 h-5" />} title="98% satisfacción" desc="de nuestros clientes" />
            <HeroBadge icon={<Sparkles className="w-5 h-5" />} title="Equipo profesional" desc="tasadores y agentes certificados" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <a href="/contacto" className="btn bg-white text-brand-700 hover:bg-white/90">Contactar Ahora</a>
            <a href={`mailto:${SITE.email}`} className="btn btn-outline border-white text-white hover:bg-white/10">Escribir</a>
          </div>
        </div>
      </section>

      {/* Misión / Visión / Valores */}
      <section className="container -mt-6 relative z-10 grid md:grid-cols-3 gap-6">
        <InfoCard title="Nuestra Misión" icon={<Sparkles className="w-5 h-5 text-brand-700" />}>
          Ser el puente que conecta a las personas con sus sueños inmobiliarios, brindando un servicio integral y transparente.
        </InfoCard>
        <InfoCard title="Nuestra Visión" icon={<ShieldCheck className="w-5 h-5 text-brand-700" />}>
          Ser la inmobiliaria líder en Catamarca, expandiendo servicios con innovación y excelencia.
        </InfoCard>
        <InfoCard title="Nuestros Valores" icon={<Trophy className="w-5 h-5 text-brand-700" />}>
          Transparencia, compromiso, cercanía, ética profesional y foco en resultados.
        </InfoCard>
      </section>

      {/* Stats (4) */}
      <section className="container py-8">
        <div className="grid md:grid-cols-4 gap-4">
          <Stat number="15+" label="Años de experiencia" />
          <Stat number="2,500+" label="Propiedades vendidas" />
          <Stat number="5,000+" label="Clientes satisfechos" />
          <Stat number="98%" label="Satisfacción" />
        </div>
      </section>

      {/* Nuestros Servicios (8 pastillas como en la referencia) */}
      <section className="container pb-8">
        <h3 className="text-xl font-semibold mb-4">Nuestros Servicios</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <ServiceCard icon={<Home className="w-5 h-5" />} title="Venta de Propiedades"
            items={['Tasación gratuita','Marketing digital','Visitas organizadas','Tramitación completa']} />
          <ServiceCard icon={<Hammer className="w-5 h-5" />} title="Alquiler y Administración"
            items={['Búsqueda de inquilinos','Contratos & cobranzas','Garantías','Mantenimiento']} />
          <ServiceCard icon={<Scale className="w-5 h-5" />} title="Servicios Legales"
            items={['Revisión de contratos','Regularización','Escrituras','Asesoría legal']} />
          <ServiceCard icon={<Building2 className="w-5 h-5" />} title="Desarrollos Inmobiliarios"
            items={['Comercialización','Estrategia de precios','Lanzamientos','Salas de ventas']} />
          <ServiceCard icon={<CheckCircle2 className="w-5 h-5" />} title="Tasaciones"
            items={['Informe profesional','Análisis de mercado','Recomendaciones','100% gratuito']} />
          <ServiceCard icon={<Users2 className="w-5 h-5" />} title="Asesoramiento de Inversión"
            items={['Zonas en crecimiento','Renta proyectada','Financiamiento','Portafolios']} />
          <ServiceCard icon={<BriefcaseBusiness className="w-5 h-5" />} title="Administración de Propiedades"
            items={['Cobranza','Liquidaciones','Seguimiento de moras','Reportes']} />
          <ServiceCard icon={<ClipboardList className="w-5 h-5" />} title="Comercialización & Marketing"
            items={['Fotos & video','Portales & RRSS','Open house','Landing de proyecto']} />
        </div>
      </section>

      {/* Equipo */}
      <section className="container pb-8">
        <h3 className="text-xl font-semibold mb-4">Nuestro Equipo</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <TeamCard name="Roberto Fernández" role="Martillero Público" desc="Especialista en ventas y negociación." />
          <TeamCard name="María Rodríguez" role="Gerente Comercial" desc="Estrategia comercial y marketing." />
          <TeamCard name="Carlos Gómez" role="Tasador Certificado" desc="Tasaciones y valuaciones." />
          <TeamCard name="Ana González" role="Admin. de Alquileres" desc="Contratos y gestión de inquilinos." />
        </div>
      </section>

      {/* Testimonios (comillas + 5 estrellas) */}
      <section className="container pb-8">
        <h3 className="text-xl font-semibold mb-4">Lo que dicen nuestros clientes</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Testimonial text="Vendieron mi casa en tiempo récord y al precio acordado. Muy profesionales."
            author="Juan Pérez" role="Barrio Norte" />
          <Testimonial text="Me ayudaron a encontrar la inversión perfecta. Atención personalizada."
            author="Laura Martínez" role="Centro" />
          <Testimonial text="Excelentes, me acompañaron en cada paso de la compra."
            author="Miguel Sánchez" role="Villa Cubas" />
        </div>
      </section>

      {/* Certificaciones */}
      <section className="container pb-12">
        <h3 className="text-xl font-semibold mb-4">Certificaciones y Membresías</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Cert label="Colegio de Martilleros de Catamarca" />
          <Cert label="Cámara Inmobiliaria Argentina" />
          <Cert label="Registro Nacional de Administradores" />
          <Cert label="Certificación ISO 9001" />
        </div>
      </section>

      {/* CTA final azul con 2 botones */}
      <section className="bg-brand-700 text-white">
        <div className="container py-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold">¿Listo para tu próxima operación inmobiliaria?</h3>
            <p className="opacity-95 mt-1">Nuestro equipo está preparado para ayudarte a alcanzar tus objetivos.</p>
          </div>
          <div className="flex md:justify-end gap-3">
            <a href="/contacto" className="btn bg-white text-brand-700 hover:bg-white/90">Contactar Ahora</a>
            <a href={`mailto:${SITE.email}`} className="btn btn-outline border-white text-white hover:bg-white/10">Escribir</a>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------- componentes reutilizados ---------- */
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
function InfoCard({ title, icon, children }:{title:string, icon:React.ReactNode, children:React.ReactNode}) {
  return (
    <div className="card p-5 flex items-start gap-3">
      <div className="shrink-0">{icon}</div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{children}</p>
      </div>
    </div>
  )
}
function Stat({ number, label }:{number:string,label:string}) {
  return (
    <div className="card p-5 text-center">
      <div className="text-2xl font-bold text-brand-700">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}
function ServiceCard({ icon, title, items }:{icon:React.ReactNode,title:string,items:string[]}) {
  return (
    <div className="card p-4 hover:border-gray-300">
      <div className="flex items-center gap-2 text-brand-700 mb-2">{icon}<span className="font-semibold">{title}</span></div>
      <ul className="text-sm text-gray-600 space-y-1">
        {items.map(it => <li key={it}>• {it}</li>)}
      </ul>
    </div>
  )
}
function TeamCard({ name, role, desc }:{name:string,role:string,desc:string}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-200" />
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-3">{desc}</p>
    </div>
  )
}
function Testimonial({ text, author, role }:{text:string,author:string,role:string}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-brand-700 mb-2">
        <Quote className="w-5 h-5"/>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="w-4 h-4"/><Star className="w-4 h-4"/><Star className="w-4 h-4"/><Star className="w-4 h-4"/><Star className="w-4 h-4"/>
        </div>
      </div>
      <p className="text-gray-700 italic">“{text}”</p>
      <div className="text-sm text-gray-600 mt-3"><strong>{author}</strong> · {role}</div>
    </div>
  )
}
function Cert({ label }:{label:string}) {
  return (
    <div className="card p-4 flex items-center justify-center text-center text-sm text-gray-700">
      {label}
    </div>
  )
}

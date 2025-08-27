export default function Empresa(){
  return (
    <div className="container py-10">
      <section className="text-center mb-8">
        <h1 className="text-3xl font-bold">Inmobiliaria Catamarca</h1>
        <p className="text-gray-600 mt-2">Líderes en el mercado inmobiliario catamarqueño con más de 15 años.</p>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="card p-5"><h3 className="font-semibold mb-2">Nuestra Misión</h3><p className="text-gray-600">Ser el puente que conecta a las personas con sus sueños inmobiliarios.</p></div>
        <div className="card p-5"><h3 className="font-semibold mb-2">Nuestra Visión</h3><p className="text-gray-600">Ser reconocidos como la inmobiliaria líder en Catamarca.</p></div>
        <div className="card p-5"><h3 className="font-semibold mb-2">Nuestros Valores</h3><p className="text-gray-600">Transparencia, compromiso, excelencia y cercanía.</p></div>
      </section>

      <section className="mt-10">
        <h3 className="font-semibold mb-4">Nuestros Servicios</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {['Venta de Propiedades', 'Alquiler y Administración', 'Asesoramiento de Inversión', 'Servicios Legales', 'Tasaciones', 'Comercialización de Proyectos'].map(s=>(
            <div key={s} className="card p-4">{s}</div>
          ))}
        </div>
      </section>
    </div>
  )
}

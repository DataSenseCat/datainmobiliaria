import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { Building2, Mail, Phone, MapPin, LogIn, LogOut, Search } from 'lucide-react'
import { SITE } from './SiteConfig'
import { useState } from 'react'

export default function Layout(){
  const nav = useNavigate()
  const isAuth = !!localStorage.getItem('ADMIN_TOKEN')
  const [q, setQ] = useState('')

  const logout = () => { localStorage.removeItem('ADMIN_TOKEN'); nav('/') }

  const Active = ({to, children}:{to:string, children:any}) => (
    <NavLink to={to} className={({isActive}) =>
      `px-3 py-2 rounded-lg hover:bg-gray-50 ${isActive ? 'text-brand-700 font-semibold' : 'text-gray-700'}`
    }>{children}</NavLink>
  )

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <div className="hidden md:block border-b text-sm bg-white">
        <div className="container h-10 flex items-center justify-between">
          <div className="flex items-center gap-5 text-gray-600">
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-1 hover:text-gray-800"><Phone className="w-4 h-4"/>{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-1 hover:text-gray-800"><Mail className="w-4 h-4"/>{SITE.email}</a>
          </div>
          <div className="flex items-center gap-5 text-gray-600">
            <div className="hidden sm:flex items-center gap-1"><MapPin className="w-4 h-4"/>{SITE.location}</div>
            {!isAuth ? (
              <Link to="/login" className="flex items-center gap-1 hover:text-gray-800"><LogIn className="w-4 h-4"/> Admin</Link>
            ) : (
              <button onClick={logout} className="flex items-center gap-1 hover:text-gray-800"><LogOut className="w-4 h-4"/> Salir</button>
            )}
          </div>
        </div>
      </div>

      {/* Navbar principal */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
        <div className="container h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 mr-2">
            <Building2 className="text-brand-700" />
            <span className="font-bold text-brand-800">CATAMARCA</span>
            <span className="hidden sm:inline text-gray-500">INMOBILIARIA</span>
          </Link>

          <nav className="hidden md:flex items-center">
            <Active to="/">Inicio</Active>
            <Active to="/propiedades">Propiedades</Active>
            <Active to="/emprendimientos">Emprendimientos</Active>
            <Active to="/tasaciones">Tasaciones</Active>
            <Active to="/empresa">La Empresa</Active>
            <Active to="/contacto">Contacto</Active>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center border rounded-xl px-3 py-2">
              <Search className="w-4 h-4 mr-2 text-gray-500"/>
              <input className="outline-none w-48" value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por código..." />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet/>
      </main>

      {/* Footer completo */}
      <footer className="mt-12 border-t bg-gray-50">
        <div className="container py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="text-brand-700"/><span className="font-bold">CATAMARCA</span>
            </div>
            <p className="text-sm text-gray-600">Más de 15 años conectando personas con sus hogares ideales en el corazón de Argentina.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/propiedades" className="hover:underline">Propiedades</Link></li>
              <li><Link to="/emprendimientos" className="hover:underline">Emprendimientos</Link></li>
              <li><Link to="/tasaciones" className="hover:underline">Tasaciones</Link></li>
              <li><Link to="/empresa" className="whitespace-nowrap">La Empresa</Link></li>
              <li><Link to="/contacto" className="hover:underline">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li>Venta de Propiedades</li><li>Alquiler de Propiedades</li>
              <li>Tasaciones</li><li>Desarrollos Inmobiliarios</li><li>Asesoramiento Legal</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>{SITE.address}</li>
              <li><a className="hover:underline" href={`tel:${SITE.phone}`}>{SITE.phone}</a></li>
              <li><a className="hover:underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t py-4 text-sm text-gray-600">
          <div className="container flex justify-between">
            <span>© {new Date().getFullYear()} Inmobiliaria Catamarca. Todos los derechos reservados.</span>
            <span>Política de Privacidad · Términos de Uso</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Building2, LogIn, LogOut } from 'lucide-react'

export default function Layout(){
  const navigate = useNavigate()
  const isAuth = !!localStorage.getItem('ADMIN_TOKEN')

  const logout=()=>{ localStorage.removeItem('ADMIN_TOKEN'); navigate('/') }

  return (
    <div>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="container h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="text-brand-700" />
            <span className="font-bold text-brand-800">Inmobiliaria Catamarca</span>
          </Link>
          <nav className="flex items-center gap-3">
            {!isAuth ? (
              <Link className="btn" to="/login"><LogIn className="w-4 h-4 mr-1"/> Acceder</Link>
            ): (
              <button className="btn" onClick={logout}><LogOut className="w-4 h-4 mr-1"/>Salir</button>
            )}
          </nav>
        </div>
      </header>
      <main className="container py-6"><Outlet/></main>
      <footer className="mt-8 border-t py-6 text-sm text-gray-600">
        <div className="container flex items-center justify-between">
          <p>© {new Date().getFullYear()} Inmobiliaria Catamarca</p>
          <p>Catamarca, Argentina</p>
        </div>
      </footer>
    </div>
  )
}

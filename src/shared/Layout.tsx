// src/shared/Layout.tsx
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { isAdmin, isLoggedIn, getUser, logout } from '../lib/auth'

function ActiveLink({ to, children, className }: { to: string, children: React.ReactNode, className?: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${className || ''} px-3 py-2 rounded-md ${isActive ? 'text-brand-700 bg-brand-50' : 'text-gray-700 hover:bg-gray-50'}`
      }
    >
      {children}
    </NavLink>
  )
}

export default function Layout() {
  const [admin, setAdmin] = useState(isAdmin())
  const [logged, setLogged] = useState(isLoggedIn())
  const [user, setUser] = useState(getUser())
  const navigate = useNavigate()

  useEffect(() => {
    const onAuth = () => {
      setAdmin(isAdmin())
      setLogged(isLoggedIn())
      setUser(getUser())
    }
    window.addEventListener('auth:changed', onAuth)
    return () => window.removeEventListener('auth:changed', onAuth)
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container h-14 flex items-center justify-between gap-4">
          <Link to="/" className="font-semibold text-lg">Inmobiliaria Catamarca</Link>
          <nav className="flex items-center gap-1">
            <ActiveLink to="/">Inicio</ActiveLink>
            <ActiveLink to="/propiedades">Propiedades</ActiveLink>
            <ActiveLink to="/tasaciones">Tasaciones</ActiveLink>
            <ActiveLink to="/empresa" className="whitespace-nowrap">La Empresa</ActiveLink>
            <ActiveLink to="/contacto">Contacto</ActiveLink>

            {admin && (
              <div className="relative group">
                <button className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                  Admin
                </button>
                <div className="absolute right-0 mt-1 w-52 rounded-xl border bg-white shadow-lg p-2 hidden group-hover:block">
                  <NavLink to="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-50">Dashboard</NavLink>
                  <NavLink to="/admin/propiedades" className="block px-3 py-2 rounded-md hover:bg-gray-50">Publicaciones</NavLink>
                  <NavLink to="/admin/nueva" className="block px-3 py-2 rounded-md hover:bg-gray-50">Nueva Propiedad</NavLink>
                </div>
              </div>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {!logged ? (
              <Link to="/login" className="btn btn-ghost">Iniciar sesión</Link>
            ) : (
              <>
                <span className="text-sm text-gray-600 max-w-[160px] truncate">{user?.name || user?.email}</span>
                <button className="btn btn-outline" onClick={handleLogout}>Cerrar sesión</button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer simple */}
      <footer className="border-t bg-white">
        <div className="container py-6 text-sm text-gray-600">
          © {new Date().getFullYear()} Inmobiliaria Catamarca — Todos los derechos reservados
        </div>
      </footer>
    </div>
  )
}

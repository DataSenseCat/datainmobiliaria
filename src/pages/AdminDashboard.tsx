// src/pages/AdminDashboard.tsx
import { Link, Navigate } from 'react-router-dom'
import { isAdmin } from '../lib/auth'

export default function AdminDashboard() {
  if (!isAdmin()) return <Navigate to="/login" replace state={{ from: '/admin' }} />

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Administración</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/admin/propiedades" className="card hover:shadow-cardHover">
          <div className="font-semibold">Publicaciones</div>
          <div className="text-gray-600 text-sm">Listar, editar y borrar propiedades</div>
        </Link>
        <Link to="/admin/nueva" className="card hover:shadow-cardHover">
          <div className="font-semibold">Nueva Propiedad</div>
          <div className="text-gray-600 text-sm">Crear una publicación</div>
        </Link>
      </div>
    </div>
  )
}

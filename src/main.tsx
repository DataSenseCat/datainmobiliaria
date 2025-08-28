// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './shared/Layout'

// Páginas existentes (ajusta paths si en tu proyecto tienen otros nombres)
import Home from './pages/Home'
import Contacto from './pages/Contacto'
import TasacionesPage from './pages/TasacionesPage'
import EmpresaPage from './pages/EmpresaPage'
import Detail from './pages/Detail'

// Páginas nuevas
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminList from './pages/AdminList'
import Admin from './pages/Admin'          // tu creador de propiedades con subida privada (ya lo tenemos)
import AdminEdit from './pages/AdminEdit'

import './styles/index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'contacto', element: <Contacto /> },
      { path: 'tasaciones', element: <TasacionesPage /> },
      { path: 'empresa', element: <EmpresaPage /> },
      { path: 'propiedad/:id', element: <Detail /> },

      // Auth
      { path: 'login', element: <Login /> },

      // Admin
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'admin/propiedades', element: <AdminList /> },
      { path: 'admin/nueva', element: <Admin /> },
      { path: 'admin/editar/:id', element: <AdminEdit /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

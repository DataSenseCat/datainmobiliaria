// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/index.css'

import Layout from './shared/Layout'
import Home from './pages/Home'
import Contacto from './pages/Contacto'
import TasacionesPage from './pages/TasacionesPage'
import EmpresaPage from './pages/EmpresaPage'
import Detail from './pages/Detail'

// nuevas/ajustadas
import Propiedades from './pages/Propiedades'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminList from './pages/AdminList'
import Admin from './pages/Admin'
import AdminEdit from './pages/AdminEdit'
import Emprendimientos from './pages/Emprendimientos'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'propiedades', element: <Propiedades /> },
      { path: 'propiedad/:id', element: <Detail /> },
      { path: 'emprendimientos', element: <Emprendimientos /> },
      { path: 'tasaciones', element: <TasacionesPage /> },
      { path: 'empresa', element: <EmpresaPage /> },
      { path: 'contacto', element: <Contacto /> },

      // auth/admin
      { path: 'login', element: <Login /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'admin/propiedades', element: <AdminList /> },
      { path: 'admin/nueva', element: <Admin /> },
      { path: 'admin/editar/:id', element: <AdminEdit /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

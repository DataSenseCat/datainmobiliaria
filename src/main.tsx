import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/index.css'
import Layout from './shared/Layout'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Empresa from './pages/Empresa'
import Tasaciones from './pages/Tasaciones'
import Contacto from './pages/Contacto'
import Emprendimientos from './pages/Emprendimientos'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      { index: true, element: <Home/> },
      { path: 'propiedades', element: <Home/> },          // listado reutiliza Home
      { path: 'propiedad/:id', element: <Detail/> },
      { path: 'emprendimientos', element: <Emprendimientos/> },
      { path: 'tasaciones', element: <Tasaciones/> },
     { path: 'empresa', element: <Empresa/> },
      { path: 'contacto', element: <Contacto/> },
      { path: 'admin', element: <Admin/> },
      { path: 'login', element: <Login/> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>,
)

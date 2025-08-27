import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/index.css'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Layout from './shared/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      { index: true, element: <Home/> },
      { path: 'propiedad/:id', element: <Detail/> },
      { path: 'admin', element: <Admin/> },
      { path: 'login', element: <Login/> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

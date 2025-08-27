import axios from 'axios'
import type { Property, Lead } from '../types'

const api = axios.create({ baseURL: import.meta.env.VITE_PUBLIC_API_BASE || '' })

export async function fetchProperties(params: Record<string,string|number|boolean|undefined> = {}): Promise<Property[]>{
  const r = await api.get('/api/properties', { params })
  return r.data
}

export async function fetchProperty(id: string): Promise<Property>{
  const r = await api.get('/api/properties', { params: { id }})
  return r.data
}

export async function createLead(payload: Lead){
  const r = await api.post('/api/leads', payload)
  return r.data
}

export function authHeaders(){
  const token = localStorage.getItem('ADMIN_TOKEN')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function adminUpsertProperty(p: Partial<Property>){
  const r = await api.post('/api/properties', p, { headers: authHeaders() })
  return r.data
}

export async function adminDeleteProperty(id: string){
  const r = await api.delete('/api/properties', { params: { id }, headers: authHeaders() })
  return r.data
}

export async function login(password: string){
  const r = await api.post('/api/login', { password })
  const { token } = r.data
  localStorage.setItem('ADMIN_TOKEN', token)
  return true
}

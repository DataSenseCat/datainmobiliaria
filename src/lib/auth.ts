// src/lib/auth.ts
export type User = {
  id?: string
  email?: string
  name?: string
  role?: string // 'admin' | 'user' | etc.
}

const LS_TOKEN = 'auth:token'
const LS_USER  = 'auth:user'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(LS_TOKEN)
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(LS_USER)
  if (!raw) return null
  try { return JSON.parse(raw) as User } catch { return null }
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export function isAdmin(): boolean {
  const u = getUser()
  return !!u && (u.role === 'admin' || u.role === 'ADMIN')
}

export async function login(email: string, password: string) {
  const r = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, password }),
  })
  if (!r.ok) {
    const msg = await r.text().catch(()=>'')
    throw new Error(msg || `Login failed (${r.status})`)
  }
  const data = await r.json()
  const token = String(data?.token || '')
  const user  = data?.user || null
  if (!token || !user) throw new Error('Respuesta inválida del servidor')

  localStorage.setItem(LS_TOKEN, token)
  localStorage.setItem(LS_USER, JSON.stringify(user))
  window.dispatchEvent(new Event('auth:changed'))
  return { token, user }
}

export function logout() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LS_TOKEN)
  localStorage.removeItem(LS_USER)
  window.dispatchEvent(new Event('auth:changed'))
}

export function authHeader(): HeadersInit {
  const t = getToken()
  return t ? { Authorization: `Bearer ${t}` } : {}
}

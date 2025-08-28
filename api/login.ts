// api/login.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

/** Util: CORS básico */
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

/** Util: detectar base64 simple */
function looksLikeBase64(s: string) {
  return /^[A-Za-z0-9+/=]+$/.test((s || '').trim())
}

/** Credenciales desde ENV (igual que el resto de tu API) */
function resolveCredsFromEnv() {
  let email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
  let key = process.env.GOOGLE_PRIVATE_KEY || ''
  const packed =
    process.env.GOOGLE_CREDENTIALS ||
    process.env.GOOGLE_SERVICE_ACCOUNT ||
    process.env.GCP_SERVICE_ACCOUNT ||
    ''
  if ((!email || !key) && packed) {
    try {
      const asText = looksLikeBase64(packed) ? Buffer.from(packed, 'base64').toString('utf8') : packed
      const obj = JSON.parse(asText)
      email ||= obj.client_email || obj.email || ''
      key ||= obj.private_key || ''
    } catch {}
  }
  if (key.includes('\\n')) key = key.replace(/\\n/g, '\n')
  const sheetId = process.env.SHEET_ID || process.env.GOOGLE_SHEET_ID || ''
  return { email, key, sheetId }
}

/** Cliente Sheets */
function sheetsClient(email: string, key: string) {
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  return google.sheets({ version: 'v4', auth })
}

/** Genera un token simple (placeholder). Si agregas JWT real, reemplaza esto */
function makeToken(payload: Record<string, any>) {
  // Por ahora un token simple; puedes migrar a JWT con jsonwebtoken cuando quieras.
  const base = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `dev.${base}.dev`
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  try {
    const { email, password } = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
    if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' })

    // 1) Intento contra variables de entorno (admin “global”)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        const user = { email: ADMIN_EMAIL, role: 'admin', name: 'Administrador' }
        const token = makeToken({ sub: ADMIN_EMAIL, role: 'admin' })
        return res.status(200).json({ token, user })
      }
      // Si hay admin env y no coincide, seguimos probando con Sheet (puede haber más usuarios)
    }

    // 2) Intento contra hoja `users` (opcional)
    const { email: svcEmail, key, sheetId } = resolveCredsFromEnv()
    if (svcEmail && key && sheetId) {
      try {
        const sheets = sheetsClient(svcEmail, key)
        const range = 'users!A1:ZZ'
        const r = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range })
        const values = r.data.values || []
        if (values.length > 0) {
          const headers = values[0].map((h) => String(h || '').trim().toLowerCase())
          const rows = values.slice(1)
          const idxEmail = headers.indexOf('email')
          const idxPass = headers.indexOf('password')
          const idxRole = headers.indexOf('role')
          const idxName = headers.indexOf('name')

          if (idxEmail >= 0 && idxPass >= 0) {
            const match = rows.find((row) => String(row[idxEmail] || '').toLowerCase() === email.toLowerCase())
            if (match) {
              const passOk = String(match[idxPass] || '') === password // texto plano para simplicidad
              if (!passOk) return res.status(401).json({ error: 'Credenciales inválidas' })

              const role = String(match[idxRole] || 'user').toLowerCase()
              const name = String(match[idxName] || '')
              const user = { email, role, name }
              const token = makeToken({ sub: email, role })
              return res.status(200).json({ token, user })
            }
          }
        }
      } catch (e) {
        // Si falla Sheets, continua y devuelve 401 más abajo
      }
    }

    return res.status(401).json({ error: 'Credenciales inválidas' })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Error interno' })
  }
}

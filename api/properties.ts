// api/properties.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

/**
 * GET  -> lista propiedades (lee Google Sheets)
 * POST -> crea propiedad (agrega fila)
 *
 * Requisitos:
 * - SHEET_ID
 * - GOOGLE_SERVICE_ACCOUNT_EMAIL
 * - GOOGLE_PRIVATE_KEY
 * - La hoja debe tener headers en la primera fila (pestaña "properties")
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const SHEET_ID = process.env.SHEET_ID as string
    const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string
    let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY as string

    if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return res.status(500).json({ error: 'Missing Google Sheets env vars' })
    }
    if (PRIVATE_KEY.includes('\\n')) PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n')

    const auth = new google.auth.JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'], // read+write
    })
    const sheets = google.sheets({ version: 'v4', auth })

    // CORS simple
    setCors(res)
    if (req.method === 'OPTIONS') return res.status(204).end()

    if (req.method === 'GET') {
      const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'properties!A1:Z1000',
        valueRenderOption: 'UNFORMATTED_VALUE',
      })
      const rows = data.values || []
      if (rows.length < 2) return res.status(200).json([])

      const [headers, ...values] = rows
      const items = values.map(row =>
        Object.fromEntries(headers.map((h: any, i: number) => [String(h).trim(), row[i]]))
      )

      const mapped = items.map((it: any) => ({
        id: it.id ?? it.ID ?? null,
        titulo: it.titulo ?? it.title ?? '',
        ciudad: it.ciudad ?? it.city ?? '',
        direccion: it.direccion ?? it.address ?? '',
        descripcion: it.descripcion ?? it.description ?? '',
        tipo: it.tipo ?? '',
        operacion: it.operacion ?? '',
        destacada: truthy(it.destacada),
        activa: truthy(it.activa),
        habitaciones: toNum(it.habitaciones),
        banos: toNum(it.banos ?? it['baños']),
        m2_cubiertos: toNum(it.m2_cubiertos ?? it.m2cubiertos),
        m2_totales: toNum(it.m2_totales ?? it.m2totales),
        precio_usd: toNum(it.precio_usd),
        precio_ars: toNum(it.precio_ars),
        cochera: truthy(it.cochera),
        piscina: truthy(it.piscina),
        dpto_servicio: truthy(it.dpto_servicio),
        quincho: truthy(it.quincho),
        parrillero: truthy(it.parrillero),
        imagenes: it.imagenes ?? '',
        created_at: it.created_at ?? '',
      }))

      return res.status(200).json(mapped)
    }

    if (req.method === 'POST') {
      const body = (typeof req.body === 'string') ? JSON.parse(req.body) : (req.body || {})
      // leo headers actuales para construir el orden de la fila
      const meta = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'properties!A1:1',
      })
      const headers: string[] = (meta.data.values?.[0] || []).map((h: any) => String(h).trim())

      if (!headers.length) {
        return res.status(500).json({ error: 'La hoja "properties" no tiene fila de headers (A1:1).' })
      }

      // valores que vamos a enviar: respetar el orden de headers
      const now = new Date().toISOString()
      const row = headers.map((h) => {
        const k = h // el header tal cual
        // normalizo claves comunes para mayor compat
        switch (k) {
          case 'created_at': return now
          default: return body[k] ?? ''
        }
      })

      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'properties!A1',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      })

      return res.status(201).json({ ok: true })
    }

    // método no soportado
    res.setHeader('Allow', 'GET,POST,OPTIONS')
    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err: any) {
    console.error('GSHEETS_ERROR', err?.message, err)
    setCors(res)
    return res.status(500).json({ error: 'GSHEETS_ERROR', detail: err?.message })
  }
}

/* helpers */
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}
function toNum(v: any) { const n = Number(v); return Number.isFinite(n) ? n : 0 }
function truthy(v: any) {
  if (typeof v === 'boolean') return v
  const s = String(v ?? '').toLowerCase()
  return s === 'true' || s === '1' || s === 'sí' || s === 'si' || s === 'x'
}

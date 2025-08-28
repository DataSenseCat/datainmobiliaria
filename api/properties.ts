// api/properties.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { sheetId, email, key } = resolveCredsFromEnv()

    // Log mínimo de diagnóstico (no muestra los secretos)
    console.log('ENV_DEBUG', {
      hasSheetId: !!sheetId,
      hasEmail: !!email,
      hasKey: !!key,
      method: req.method,
    })

    if (!sheetId || !email || !key) {
      setCors(res)
      return res.status(500).json({ error: 'Missing Google Sheets env vars' })
    }

    const auth = new google.auth.JWT({
      email,
      key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'], // read+write
    })
    const sheets = google.sheets({ version: 'v4', auth })

    setCors(res)
    if (req.method === 'OPTIONS') return res.status(204).end()

    if (req.method === 'GET') {
      const { data } = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'properties!A1:Z1000',
        valueRenderOption: 'UNFORMATTED_VALUE',
      })
      const rows = data.values || []
      if (rows.length < 2) return res.status(200).json([])

      const [headers, ...values] = rows
      const items = values.map((row) =>
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
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {})

      // Tomo headers para respetar el orden de columnas
      const meta = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: 'properties!A1:1',
      })
      const headers: string[] = (meta.data.values?.[0] || []).map((h: any) => String(h).trim())
      if (!headers.length) {
        return res.status(500).json({ error: 'La hoja "properties" no tiene fila de headers (A1:1).' })
      }

      const now = new Date().toISOString()
      const row = headers.map((h) => (h === 'created_at' ? now : (body[h] ?? '')))

      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'properties!A1',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [row] },
      })

      return res.status(201).json({ ok: true })
    }

    res.setHeader('Allow', 'GET,POST,OPTIONS')
    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err: any) {
    console.error('GSHEETS_ERROR', err?.message, err)
    setCors(res)
    return res.status(500).json({ error: 'GSHEETS_ERROR', detail: err?.message })
  }
}

/* ===== helpers ===== */

function resolveCredsFromEnv() {
  // 1) ID de la sheet
  const sheetId =
    process.env.SHEET_ID ||
    process.env.GOOGLE_SHEET_ID ||
    process.env.GSHEET_ID ||
    ''

  // 2) Credenciales separadas
  let email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
  let key = process.env.GOOGLE_PRIVATE_KEY || ''

  // 3) O credenciales empaquetadas (JSON o Base64 de JSON)
  const packed =
    process.env.GOOGLE_CREDENTIALS ||
    process.env.GOOGLE_SERVICE_ACCOUNT ||
    process.env.GCP_SERVICE_ACCOUNT ||
    ''

  if ((!email || !key) && packed) {
    try {
      const asText = looksLikeBase64(packed)
        ? Buffer.from(packed, 'base64').toString('utf8')
        : packed
      const obj = JSON.parse(asText)
      email ||= obj.client_email || obj.email || ''
      key ||= obj.private_key || ''
    } catch (e) {
      console.warn('WARN: No se pudo parsear GOOGLE_CREDENTIALS / SERVICE_ACCOUNT')
    }
  }

  // Fix saltos de línea escapados
  if (key && key.includes('\\n')) key = key.replace(/\\n/g, '\n')

  return { sheetId, email, key }
}

function looksLikeBase64(s: string) {
  // heurística simple (evita parsear JSON si viene en base64)
  return /^[A-Za-z0-9+/=]+$/.test(s.trim())
}

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

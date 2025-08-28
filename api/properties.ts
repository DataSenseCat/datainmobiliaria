// api/properties.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

/* ---------- CORS ---------- */
function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

/* ---------- credenciales desde ENV ---------- */
function looksLikeBase64(s: string) { return /^[A-Za-z0-9+/=]+$/.test((s||'').trim()) }

function resolveCredsFromEnv() {
  let email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
  let key = process.env.GOOGLE_PRIVATE_KEY || ''
  const packed = process.env.GOOGLE_CREDENTIALS || process.env.GOOGLE_SERVICE_ACCOUNT || process.env.GCP_SERVICE_ACCOUNT || ''
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

/* ---------- helpers Sheets ---------- */
function sheetsClient(email: string, key: string) {
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
}

async function readAll(sheets: ReturnType<typeof sheetsClient>, sheetId: string, range = 'properties!A1:ZZZ') {
  const r = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range })
  const values = r.data.values || []
  if (!values.length) return []
  const headers = values[0].map((h) => String(h || '').trim())
  const rows = values.slice(1)
  return rows.map((row) => {
    const obj: Record<string, any> = {}
    headers.forEach((h, i) => { obj[h] = row[i] ?? '' })
    return obj
  })
}

function uid() { return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}` }

async function appendRow(
  sheets: ReturnType<typeof sheetsClient>,
  sheetId: string,
  payload: Record<string, any>,
  sheetName = 'properties'
) {
  // Lee header actual para preservar el orden de columnas
  const headResp = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1:ZZZ1`,
  })
  const headers = (headResp.data.values?.[0] || []).map((h) => String(h || '').trim())

  // Si la hoja estuviera vacía, definimos columnas recomendadas
  const cols = headers.length
    ? headers
    : [
        'id','titulo','ciudad','direccion','descripcion','tipo','operacion',
        'destacada','activa','habitaciones','banos','m2_cubiertos','m2_totales',
        'precio_usd','precio_ars','cochera','piscina','dpto_servicio','quincho','parrillero',
        'imagenes','created_at'
      ]

  // Normaliza payload -> string (para Sheets)
  const row = cols.map((c) => {
    const v = payload[c]
    if (v === undefined || v === null) return ''
    if (typeof v === 'object') return JSON.stringify(v)
    return String(v)
  })

  // Si la hoja estaba vacía, escribimos headers primero
  if (!headers.length) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [cols] },
    })
  }

  // Append de la fila
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A1`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  })

  return { ok: true }
}

/* ---------- handler ---------- */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  const { email, key, sheetId } = resolveCredsFromEnv()
  if (!email || !key || !sheetId) {
    return res.status(500).json({ error: 'Missing Google Sheets env vars' })
  }

  const sheets = sheetsClient(email, key)

  try {
    if (req.method === 'GET') {
      const rows = await readAll(sheets, sheetId, 'properties!A1:ZZZ')
      return res.status(200).json(rows)
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

      // Sanitiza y completa
      const now = new Date().toISOString()
      const rowData: Record<string, any> = {
        id: body.id || uid(),
        titulo: body.titulo || '',
        ciudad: body.ciudad || '',
        direccion: body.direccion || '',
        descripcion: body.descripcion || '',
        tipo: body.tipo || '',
        operacion: body.operacion || '',
        destacada: body.destacada ? 'true' : '',
        activa: body.activa !== false ? 'true' : '',
        habitaciones: body.habitaciones ?? '',
        banos: body.banos ?? body['baños'] ?? '',
        m2_cubiertos: body.m2_cubiertos ?? body.m2cubiertos ?? '',
        m2_totales: body.m2_totales ?? body.m2totales ?? '',
        precio_usd: body.precio_usd ?? '',
        precio_ars: body.precio_ars ?? '',
        cochera: body.cochera ? 'true' : '',
        piscina: body.piscina ? 'true' : '',
        dpto_servicio: body.dpto_servicio ? 'true' : '',
        quincho: body.quincho ? 'true' : '',
        parrillero: body.parrillero ? 'true' : '',
        imagenes: Array.isArray(body.imagenes) ? JSON.stringify(body.imagenes) : String(body.imagenes ?? ''),
        created_at: now,
      }

      await appendRow(sheets, sheetId, rowData, 'properties')
      return res.status(201).json({ ok: true, id: rowData.id })
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err: any) {
    console.error('SHEETS_API_ERROR', err?.message || err)
    return res.status(500).json({ error: err?.message || 'Internal Error' })
  }
}

// api/properties/import-from-blob.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'
import { del as blobDel } from '@vercel/blob'

function fixKey(k = '') { return k.includes('\\n') ? k.replace(/\\n/g, '\n') : k }

function authClients() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
  const key = fixKey(process.env.GOOGLE_PRIVATE_KEY || '')
  // 👇 CORRECTO: sin '~~'
  const sheetId = process.env.GOOGLE_SHEET_ID || process.env.SHEET_ID || ''
  if (!email || !key || !sheetId) throw new Error('Faltan envs de Google (svc account y/o sheet)')

  const auth = new google.auth.JWT({
    email, key,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive'
    ]
  })
  const sheets = google.sheets({ version: 'v4', auth })
  const drive = google.drive({ version: 'v3', auth })
  return { sheets, drive, sheetId }
}

async function copyBlobToDrive(
  drive: any,
  url: string,
  filename?: string,
  contentType?: string,
  folderId?: string
) {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`No se pudo leer el blob: ${r.status}`)
  const mime = contentType || r.headers.get('content-type') || 'application/octet-stream'
  const buf = Buffer.from(await r.arrayBuffer())

  const meta: any = { name: filename || 'imagen.jpg' }
  if (folderId) meta.parents = [folderId]

  const created = await drive.files.create({
    requestBody: meta,
    media: { mimeType: mime, body: buf },
    fields: 'id'
  })
  return created.data.id as string
}

function normalizeProperty(body: Record<string, any>) {
  const b = body || {}
  const num = (v: any) => Number.isFinite(Number(v)) ? Number(v) : ''
  const bool = (v: any) => v ? 'true' : ''
  return {
    id: b.id || `${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`,
    titulo: b.titulo || b.título || '',
    ciudad: b.ciudad || '',
    direccion: b.direccion || b.dirección || '',
    descripcion: b.descripcion || b.descripción || '',
    tipo: b.tipo || '',
    operacion: b.operacion || b.operación || '',
    destacada: bool(b.destacada),
    activa: b.activa === false ? '' : 'true',
    habitaciones: num(b.habitaciones),
    banos: b.banos ?? b['baños'] ?? '',
    m2_cubiertos: num(b.m2_cubiertos ?? b.m2cubiertos),
    m2_totales: num(b.m2_totales ?? b.m2totales),
    precio_usd: num(b.precio_usd),
    precio_ars: num(b.precio_ars),
    cochera: bool(b.cochera),
    piscina: bool(b.piscina),
    dpto_servicio: bool(b.dpto_servicio),
    quincho: bool(b.quincho),
    parrillero: bool(b.parrillero)
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })
  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const property = payload?.property || {}
    const blobs = Array.isArray(payload?.blobs)
      ? payload.blobs as Array<{url:string, filename?:string, contentType?:string}>
      : []
    if (!blobs.length) return res.status(400).json({ error: 'Faltan blobs' })

    const { sheets, drive, sheetId } = authClients()
    const folderId = process.env.DRIVE_FOLDER_ID || undefined

    const fileIds: string[] = []
    for (const b of blobs) {
      const id = await copyBlobToDrive(drive, b.url, b.filename, b.contentType, folderId)
      fileIds.push(id)
    }

    // limpiamos los blobs de staging (best-effort)
    try { await blobDel(blobs.map(b => b.url)) } catch {}

    // cabeceras
    const head = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'properties!A1:ZZ1' })
    const headers = (head.data.values?.[0] || []).map(h => String(h || '').trim())
    const n = normalizeProperty(property)
    const created_at = new Date().toISOString()

    const cols = headers.length ? headers : [
      'id','titulo','ciudad','direccion','descripcion','tipo','operacion',
      'destacada','activa','habitaciones','banos','m2_cubiertos','m2_totales',
      'precio_usd','precio_ars','cochera','piscina','dpto_servicio','quincho','parrillero',
      'imagenes','created_at'
    ]

    const row = cols.map((c) => {
      if (c === 'imagenes') return JSON.stringify(fileIds)
      if (c === 'created_at') return created_at
      const v = (n as any)[c]
      return v === undefined || v === null ? '' : String(v)
    })

    if (!headers.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: 'properties!A1',
        valueInputOption: 'RAW',
        requestBody: { values: [cols] }
      })
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'properties!A1',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] }
    })

    return res.status(200).json({ ok: true, fileIds })
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Error interno' })
  }
}

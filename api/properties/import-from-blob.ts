// api/properties/import-from-blob.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'
import { del as blobDel } from '@vercel/blob'

type UploadItem = {
  url: string
  filename: string
  contentType?: string
}

type Body = {
  property: {
    titulo: string
    ciudad: string
    tipo: string
    operacion: string
    direccion?: string
    descripcion?: string
    usd?: number
    ars?: number
    ambientes?: number
    banos?: number
    m2cubiertos?: number
    m2totales?: number
    cochera?: boolean
    piscina?: boolean
    dptoServicio?: boolean
    quincho?: boolean
    parrillero?: boolean
    destacada?: boolean
    activa?: boolean
  }
  blobs: UploadItem[]
}

function fixKey(k: string) {
  // cuando el PRIVATE KEY viene con \n literales, los restauramos
  return k.includes('\\n') ? k.replace(/\\n/g, '\n') : k
}

function assertEnvs() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || ''
  const key = fixKey(process.env.GOOGLE_PRIVATE_KEY || '')
  // Permitimos ambos nombres para evitar desfasajes
  const sheetId = process.env.GOOGLE_SHEET_ID || process.env.SHEET_ID || ''
  if (!email || !key || !sheetId) {
    throw new Error('Faltan envs de Google (svc account y/o sheet)')
  }
  return { email, key, sheetId }
}

async function authClients() {
  const { email, key, sheetId } = assertEnvs()

  const auth = new google.auth.JWT({
    email,
    key,
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
  drive: ReturnType<typeof google.drive>['files'],
  item: UploadItem,
  folderId?: string
) {
  // Descargamos el blob temporal
  const r = await fetch(item.url)
  if (!r.ok) throw new Error(`No se pudo leer el blob: ${r.status}`)
  const buf = Buffer.from(await r.arrayBuffer())
  const mime = item.contentType || r.headers.get('content-type') || 'application/octet-stream'

  // Subimos a Drive
  const created = await drive.create({
    requestBody: {
      name: item.filename,
      parents: folderId ? [folderId] : undefined
    },
    media: {
      mimeType: mime,
      body: buf
    },
    fields: 'id'
  })

  const fileId = created.data.id as string
  return fileId
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' })
  }

  try {
    const { sheets, drive, sheetId } = await authClients()
    const folderId = process.env.DRIVE_FOLDER_ID || undefined

    const body = req.body as Body
    if (!body || !Array.isArray(body.blobs)) {
      return res.status(400).json({ ok: false, error: 'Body inválido' })
    }

    // 1) Copiar blobs -> Drive
    const fileIds: string[] = []
    for (const item of body.blobs) {
      const id = await copyBlobToDrive(drive.files, item, folderId)
      fileIds.push(id)
    }

    // 2) Guardar fila en Google Sheets (pestaña "properties")
    const p = body.property
    const values = [[
      new Date().toISOString(),
      p.titulo, p.ciudad, p.tipo, p.operacion,
      p.direccion || '',
      p.descripcion || '',
      p.usd ?? '',
      p.ars ?? '',
      p.ambientes ?? '',
      p.banos ?? '',
      p.m2cubiertos ?? '',
      p.m2totales ?? '',
      p.cochera ? 'sí' : 'no',
      p.piscina ? 'sí' : 'no',
      p.dptoServicio ? 'sí' : 'no',
      p.quincho ? 'sí' : 'no',
      p.parrillero ? 'sí' : 'no',
      p.destacada ? 'sí' : 'no',
      p.activa ?? true ? 'sí' : 'no',
      fileIds.join(',') // guardamos los IDs de Drive
    ]]

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'properties!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    })

    // 3) Borrar blobs temporales de Vercel
    for (const item of body.blobs) {
      // la API de delete de Blob acepta el url
      await blobDel(item.url)
    }

    return res.status(200).json({ ok: true, fileIds })
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || 'Server error' })
  }
}

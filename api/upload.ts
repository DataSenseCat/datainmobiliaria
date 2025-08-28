// api/upload.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'
import Busboy from 'busboy'

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

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
  const folder = process.env.DRIVE_FOLDER_ID || ''
  return { email, key, folder }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  const { email, key, folder } = resolveCredsFromEnv()
  if (!email || !key || !folder) return res.status(500).json({ error: 'Missing Google Drive env vars' })

  const auth = new google.auth.JWT({ email, key, scopes: ['https://www.googleapis.com/auth/drive.file'] })
  const drive = google.drive({ version: 'v3', auth })

  const bb = Busboy({ headers: req.headers })
  const buffers: { filename: string; mime: string; data: Buffer }[] = []

  const done = new Promise<void>((resolve, reject) => {
    bb.on('file', (_name, file, info) => {
      const { filename, mimeType } = info
      const chunks: Buffer[] = []
      file.on('data', (d: Buffer) => chunks.push(d))
      file.on('end', () => buffers.push({ filename, mime: mimeType || 'application/octet-stream', data: Buffer.concat(chunks) }))
    })
    bb.on('error', reject)
    bb.on('finish', resolve)
  })

  req.pipe(bb)
  await done

  if (!buffers.length) return res.status(400).json({ error: 'No files' })

  const ids: string[] = []
  for (const f of buffers) {
    const created = await drive.files.create({
      requestBody: {
        name: f.filename,
        parents: [folder],
      },
      media: { mimeType: f.mime, body: BufferToStream(f.data) },
      fields: 'id',
    })
    ids.push(String(created.data.id))
  }

  return res.status(201).json({ ok: true, ids })
}

function BufferToStream(buffer: Buffer) {
  const { Readable } = require('stream')
  const stream = new Readable()
  stream.push(buffer)
  stream.push(null)
  return stream
}

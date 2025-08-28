// api/image.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
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
  return { email, key }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  const id = String((req.query?.id as string) || '')
  if (!id) return res.status(400).send('Missing id')

  const { email, key } = resolveCredsFromEnv()
  if (!email || !key) return res.status(500).send('Missing Google credentials')

  const auth = new google.auth.JWT({ email, key, scopes: ['https://www.googleapis.com/auth/drive.readonly'] })
  const drive = google.drive({ version: 'v3', auth })

  try {
    // Metadata para content-type
    const meta = await drive.files.get({ fileId: id, fields: 'name,mimeType' })
    const mime = meta.data.mimeType || 'application/octet-stream'

    // Stream binario
    const r = await drive.files.get({ fileId: id, alt: 'media' }, { responseType: 'stream' })

    res.setHeader('Content-Type', mime)
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600')
    r.data.on('error', () => res.status(500).end('Error streaming file'))
    r.data.pipe(res)
  } catch (e: any) {
    console.error('DRIVE_STREAM_ERROR', e?.message)
    res.status(404).end('Not found')
  }
}

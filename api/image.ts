// api/image.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

function fixKey(k = '') { return k.includes('\\n') ? k.replace(/\\n/g, '\n') : k }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const fileId = String(req.query.id || '')
    if (!fileId) return res.status(400).send('Falta id')

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: fixKey(process.env.GOOGLE_PRIVATE_KEY || ''),
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    })
    const drive = google.drive({ version: 'v3', auth })

    const r = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })
    res.setHeader('Cache-Control', 'public, max-age=3600')
    r.data.on('error', () => res.status(404).end('File not found'))
    r.data.pipe(res)
  } catch (e: any) {
    res.status(404).send('File not found')
  }
}

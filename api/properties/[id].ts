// api/properties/[id].ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS')
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
  const sheetId = process.env.GOOGLE_SHEET_ID || process.env.SHEET_ID || ''
  return { email, key, sheetId }
}
function sheetsClient(email: string, key: string) {
  const auth = new google.auth.JWT({ email, key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
  return google.sheets({ version: 'v4', auth })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (req.method === 'OPTIONS') return res.status(204).end()

  const { email, key, sheetId } = resolveCredsFromEnv()
  if (!email || !key || !sheetId) return res.status(500).json({ error: 'Missing Google Sheets env vars' })

  const sheets = sheetsClient(email, key)
  const id = String(req.query.id || '')
  if (!id) return res.status(400).json({ error: 'Missing id' })

  try {
    const range = 'properties!A1:ZZZ'
    const resp = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range })
    const values = resp.data.values || []
    if (!values.length) return res.status(404).json({ error: 'Sheet vacía' })

    const headers = values[0].map((h) => String(h || '').trim())
    const rows = values.slice(1)
    const idx = rows.findIndex(r => String(r[headers.indexOf('id')] || r[headers.indexOf('ID')] || '') === id)
    if (idx === -1) return res.status(404).json({ error: 'No encontrado' })

    const rowNumber = idx + 2

    if (req.method === 'GET') {
      const row = rows[idx] || []
      const obj: Record<string, any> = {}
      headers.forEach((h, i) => { obj[h] = row[i] ?? '' })
      return res.status(200).json(obj)
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {})
      const updated = headers.map((h) => {
        const v = body[h]
        if (v === undefined || v === null) return ''
        if (typeof v === 'object') return JSON.stringify(v)
        return String(v)
      })
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `properties!A${rowNumber}:ZZZ${rowNumber}`,
        valueInputOption: 'RAW',
        requestBody: { values: [updated] },
      })
      return res.status(200).json({ ok: true })
    }

    if (req.method === 'DELETE') {
      const doc = await sheets.spreadsheets.get({
        spreadsheetId: sheetId,
        fields: 'sheets(properties(sheetId,title))'
      })
      const meta = doc.data.sheets || []
      const sheetMeta = meta.find(s => s.properties?.title === 'properties')
      const gid = sheetMeta?.properties?.sheetId
      if (gid === undefined) return res.status(500).json({ error: 'No se pudo resolver sheetId' })

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: gid,
                dimension: 'ROWS',
                startIndex: rowNumber - 1,
                endIndex: rowNumber
              }
            }
          }]
        }
      })
      return res.status(200).json({ ok: true })
    }

    res.setHeader('Allow', 'GET,PUT,DELETE,OPTIONS')
    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (e: any) {
    console.error('SHEETS_ID_ERROR', e?.message || e)
    return res.status(500).json({ error: e?.message || 'Internal Error' })
  }
}

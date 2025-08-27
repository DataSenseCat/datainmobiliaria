import type { VercelRequest, VercelResponse } from '@vercel/node'
import { appendRow } from './_sheets'
import { randomUUID } from 'crypto'

export default async function handler(req: VercelRequest, res: VercelResponse){
  if(req.method !== 'POST') return res.status(405).send('Method not allowed')
  const body = req.body || {}
  const now = new Date().toISOString()
  const obj = {
    id: body.id || randomUUID(),
    property_id: body.property_id || '',
    development_id: body.development_id || '',
    name: body.name || '',
    phone: body.phone || '',
    email: body.email || '',
    message: body.message || '',
    source: body.source || 'web',
    status: body.status || 'new',
    created_at: now,
    updated_at: now
  }
  await appendRow('leads', obj)
  res.status(200).json({ ok: true })
}

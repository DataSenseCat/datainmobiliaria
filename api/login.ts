import type { VercelRequest, VercelResponse } from '@vercel/node'
import crypto from 'crypto'

export default async function handler(req: VercelRequest, res: VercelResponse){
  if(req.method !== 'POST') return res.status(405).send('Method not allowed')
  const { password } = req.body || {}
  const adminPass = process.env.ADMIN_PASSWORD
  if(!adminPass) return res.status(500).json({ error: 'ADMIN_PASSWORD missing' })
  if(password !== adminPass) return res.status(401).json({ error: 'Invalid credentials' })
  const token = crypto.createHmac('sha256', adminPass).update('static').digest('hex')
  res.status(200).json({ token })
}

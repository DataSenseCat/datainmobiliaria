import type { VercelRequest } from '@vercel/node'
import crypto from 'crypto'
export function isAuthorized(req: VercelRequest){
  const token = (req.headers['authorization']||'').toString().replace('Bearer ','').trim()
  if(!token) return false
  const adminPass = process.env.ADMIN_PASSWORD || ''
  const valid = crypto.createHmac('sha256', adminPass).update('static').digest('hex')
  return token === valid
}

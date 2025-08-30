import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(req: VercelRequest, res: VercelResponse) {
  const required = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'SHEET_ID'
  ]

  const env = process.env
  const report = {
    ok: required.every(k => !!env[k]),
    missing: required.filter(k => !env[k]),
    nodeEnv: env.NODE_ENV,
    vercelEnv: env.VERCEL_ENV
  }

  res.status( report.ok ? 200 : 500 ).json(report)
}

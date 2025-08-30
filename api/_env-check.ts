// api/_env-check.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const {
    GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    SHEET_ID,
    GOOGLE_SHEET_ID,
    DRIVE_FOLDER_ID,
    VERCEL_ENV,
    NODE_ENV
  } = process.env

  const hasEmail = !!GOOGLE_SERVICE_ACCOUNT_EMAIL
  const hasKey = !!GOOGLE_PRIVATE_KEY
  const sheetId = GOOGLE_SHEET_ID || SHEET_ID || ''
  const hasSheetId = !!sheetId

  return res.status(200).json({
    ok: true,
    hasEmail,
    hasKey,
    hasSheetId,
    keyLen: GOOGLE_PRIVATE_KEY?.length ?? 0,
    driveFolderSet: !!DRIVE_FOLDER_ID,
    vercelEnv: VERCEL_ENV || 'unknown',
    nodeEnv: NODE_ENV || 'unknown'
  })
}

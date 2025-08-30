import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const email   = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
  const key     = process.env.GOOGLE_PRIVATE_KEY || '';
  const sheetId = process.env.GOOGLE_SHEET_ID || process.env.SHEET_ID || '';
  const folder  = process.env.GOOGLE_DRIVE_FOLDER_ID || '';

  res.status(200).json({
    ok: true,
    vercelEnv: process.env.VERCEL_ENV,     // production | preview | development
    nodeEnv:   process.env.NODE_ENV,
    hasEmail:  !!email,
    hasKey:    !!key,
    hasSheetId:!!sheetId,
    hasFolder: !!folder,
    keyLen:    key.length,
    sheetIdLen: sheetId.length,
  });
}

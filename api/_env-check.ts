// api/_env-check.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

const has = (v?: string) => !!v && v.trim().length > 0;

export default function handler(req: VercelRequest, res: VercelResponse) {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? '';
  const key = (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');
  const sheet = process.env.GOOGLE_SHEET_ID ?? '';

  res.status(200).json({
    ok: true,
    hasEmail: has(email),
    hasKey: has(key),
    hasSheetId: has(sheet),
    keyLen: key.length,
    vercelEnv: process.env.VERCEL_ENV ?? 'unknown',
    nodeEnv: process.env.NODE_ENV ?? 'unknown',
  });
}

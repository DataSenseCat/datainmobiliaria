// api/blob/upload.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as HandleUploadBody

    const json = await handleUpload({
      body,
      request: new Request('https://dummy', {
        method: 'POST',
        headers: new Headers(req.headers as any),
      }),
      // Aquí podrías chequear rol admin antes de permitir token
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
        addRandomSuffix: true
      }),
      onUploadCompleted: async () => { /* opcional */ },
    })

    res.status(200).json(json)
  } catch (e: any) {
    res.status(400).json({ error: e?.message || 'Upload token error' })
  }
}

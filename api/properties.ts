// api/properties.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { google } from 'googleapis'

/**
 * Lee la hoja "properties" de Google Sheets y devuelve un array de objetos.
 * - Usa la primera fila como headers.
 * - Normaliza algunos campos típicos que usa el front.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // -------- 1) ENV VARS --------
    const SHEET_ID = process.env.SHEET_ID as string
    const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string
    let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY as string

    if (!SHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return res.status(500).json({ error: 'Missing Google Sheets env vars' })
    }

    // Si la clave se guardó con "\n", restaurar saltos reales
    if (PRIVATE_KEY.includes('\\n')) {
      PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n')
    }

    // -------- 2) AUTH (constructor por opciones para evitar errores TS) --------
    const auth = new google.auth.JWT({
      email: CLIENT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    // -------- 3) LECTURA --------
    // Cambiá el nombre de la pestaña/rango si tu hoja no se llama "properties"
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'properties!A1:Z1000',
      valueRenderOption: 'UNFORMATTED_VALUE',
    })

    const rows = data.values || []
    if (rows.length < 2) {
      // Sin datos: devolvemos array vacío
      setCors(res)
      return res.status(200).json([])
    }

    // Primera fila como headers
    const [headers, ...values] = rows
    const items = values.map((row) =>
      Object.fromEntries(headers.map((h: any, i: number) => [String(h).trim(), row[i]]))
    )

    // -------- 4) Normalización para el front --------
    const mapped = items.map((it: any) => ({
      id: it.id ?? it.ID ?? it.Id ?? null,
      titulo: it.titulo ?? it.title ?? it.Titulo ?? '',
      tipo: it.tipo ?? it.type ?? '',
      operacion: it.operacion ?? it.operation ?? '',
      ciudad: it.ciudad ?? it.city ?? '',
      precio: num(it.precio),
      dormitorios: num(it.dormitorios),
      banos: num(it.banos ?? it.baños),
      metros: num(it.m2 ?? it.metros ?? it.superficie),
      destacado: it.destacado === 'TRUE' || it.destacado === true || it.destacado === 1,
      imagen: it.imagen ?? it.image ?? '',
      imagen2: it.imagen2 ?? '',
      direccion: it.direccion ?? it.address ?? '',
      coords: it.coords ?? it.ubicacion ?? null,
      descripcion: it.descripcion ?? it.description ?? '',
      // agrega aquí cualquier otro campo que tengas en la sheet
    }))

    // -------- 5) CORS + respuesta --------
    setCors(res)
    if (req.method === 'OPTIONS') return res.status(204).end()
    return res.status(200).json(mapped)
  } catch (err: any) {
    console.error('GSHEETS_ERROR', err?.message, err?.stack)
    setCors(res)
    return res.status(500).json({ error: 'GSHEETS_ERROR', detail: err?.message })
  }
}

/* ========== helpers ========== */

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

function num(v: any) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

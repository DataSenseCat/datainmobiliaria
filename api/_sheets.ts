import { google } from 'googleapis'

const scopes = ['https://www.googleapis.com/auth/spreadsheets']

function getAuth(){
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL as string
  const key = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g,'\n')
  if(!email || !key) throw new Error('Google SA envs missing')
  return new google.auth.JWT(email, undefined, key, scopes)
}

export async function getSheets(){
  const auth = getAuth()
  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID as string
  if(!spreadsheetId) throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID missing')
  return { sheets, spreadsheetId }
}

export async function readSheet(sheetName: string){
  const { sheets, spreadsheetId } = await getSheets()
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${sheetName}!A:ZZ` })
  const rows = res.data.values || []
  if(rows.length === 0) return []
  const headers = rows[0]
  return rows.slice(1).filter(r=>r.some(c=>c && c.trim()!=='')).map(r => {
    const obj:any = {}
    headers.forEach((h, idx)=> obj[h] = r[idx] ?? '')
    return obj
  })
}

export async function appendRow(sheetName: string, obj: Record<string, any>){
  const { sheets, spreadsheetId } = await getSheets()
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${sheetName}!1:1` })
  const headers = (res.data.values?.[0] || []) as string[]
  const row = headers.map(h => obj[h] ?? '')
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:ZZ`,
    valueInputOption: 'RAW',
    requestBody: { values: [row] }
  })
}

export async function updateRowById(sheetName: string, id: string, obj: Record<string, any>){
  const { sheets, spreadsheetId } = await getSheets()
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: `${sheetName}!A:ZZ` })
  const rows = res.data.values || []
  if(rows.length === 0) throw new Error('Sheet empty')
  const headers = rows[0]
  const idCol = headers.indexOf('id')
  if(idCol === -1) throw new Error('No id column')
  let targetIndex = -1
  for(let i=1;i<rows.length;i++){
    if((rows[i][idCol]||'') === id){ targetIndex = i; break }
  }
  if(targetIndex === -1) throw new Error('Row not found')
  const existing:any = {}
  headers.forEach((h, idx)=> existing[h] = rows[targetIndex][idx] ?? '')
  const merged: any = { ...existing, ...obj }
  const newRow = headers.map(h => merged[h] ?? '')
  const range = `${sheetName}!A${targetIndex+1}:ZZ${targetIndex+1}`
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    requestBody: { values: [newRow] }
  })
}

export async function softDeleteById(sheetName: string, id: string){
  await updateRowById(sheetName, id, { active: 'false', updated_at: new Date().toISOString() })
}

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readSheet, appendRow, updateRowById, softDeleteById } from './_sheets'
import { isAuthorized } from './_auth'
import { randomUUID } from 'crypto'

function matches(p:any, q:any){
  const num = (v:any)=> v==null || v==='' ? null : Number(v)
  const within = (v:number|null, min?:number|null, max?:number|null)=> (v==null) ? true : (min!=null && v<min) ? false : (max!=null && v>max) ? false : true
  if(q.city && (p.city||'').toLowerCase().indexOf(String(q.city).toLowerCase()) === -1) return false
  if(q.property_type && (p.property_type||'') !== q.property_type) return false
  if(q.operation_type && (p.operation_type||'') !== q.operation_type) return false
  if(q.bedrooms && Number(p.bedrooms||0) < Number(q.bedrooms)) return false
  const v = num(p.price); const min = num(q.priceMin); const max = num(q.priceMax)
  if(!within(v, min, max)) return false
  if(q.id && p.id !== q.id) return false
  if(String(p.active||'true').toLowerCase()==='false') return false
  return true
}

function toBool(v:any){ return typeof v === 'boolean' ? v : String(v).toLowerCase()==='true' }
function toNum(v:any){ return v==='' || v==null ? undefined : Number(v) }

export default async function handler(req: VercelRequest, res: VercelResponse){
  try{
    if(req.method === 'GET'){
      const props = await readSheet('properties')
      const imgs = await readSheet('images')
      const result = props.filter(p=>matches(p, req.query)).map(p=>{
        const images = imgs.filter((i:any)=> i.property_id === p.id).map((i:any)=>({ ...i, is_primary: toBool(i.is_primary), order_index: toNum(i.order_index) }))
        return { ...p,
          price: toNum(p.price), bedrooms: toNum(p.bedrooms), bathrooms: toNum(p.bathrooms),
          latitude: toNum(p.latitude), longitude: toNum(p.longitude),
          images
        }
      })
      if(req.query.id) return res.status(200).json(result[0] || null)
      return res.status(200).json(result)
    }
    if(req.method === 'POST'){
      if(!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const body = req.body || {}
      const id = body.id || randomUUID()
      const now = new Date().toISOString()
      const obj = { id, created_at: now, updated_at: now, active: 'true', ...body }
      const all = await readSheet('properties')
      const exists = all.find((r:any)=> r.id === id)
      if(exists) await updateRowById('properties', id, obj)
      else await appendRow('properties', obj)
      return res.status(200).json({ id })
    }
    if(req.method === 'DELETE'){
      if(!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' })
      const id = (req.query.id||'').toString()
      await softDeleteById('properties', id)
      return res.status(200).json({ ok: true })
    }
    return res.status(405).send('Method not allowed')
  }catch(e:any){
    return res.status(500).json({ error: e.message })
  }
}

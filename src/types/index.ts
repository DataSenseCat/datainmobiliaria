export type Property = {
  id: string
  title: string
  description?: string
  property_type?: string
  operation_type?: string
  price?: number
  currency?: string
  address?: string
  city?: string
  province?: string
  country?: string
  bedrooms?: number
  bathrooms?: number
  square_meters?: number
  covered_area?: number
  land_area?: number
  latitude?: number
  longitude?: number
  created_at?: string
  updated_at?: string
  active?: boolean
  price_usd?: number
  price_ars?: number
  rooms?: number
  area_covered?: number
  area_total?: number
  service_room?: boolean
  quincho?: boolean
  grill?: boolean
  agent_id?: string
  images?: Image[]
}

export type Image = {
  id: string
  property_id: string
  url: string
  alt?: string
  order_index?: number
  is_primary?: boolean
  created_at?: string
}

export type Lead = {
  id: string
  property_id?: string
  development_id?: string
  name: string
  phone?: string
  email?: string
  message?: string
  source?: string
  status?: string
  created_at?: string
  updated_at?: string
}

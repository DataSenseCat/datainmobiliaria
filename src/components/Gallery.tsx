import type { Image } from '../types'

export default function Gallery({images}:{images:Image[]|undefined}){
  if(!images?.length) return null
  const primary = images.find(i=>i.is_primary) || images[0]
  const rest = images.filter(i=>i.id!==primary.id)
  return (
    <div className="grid grid-cols-3 gap-2">
      <img src={primary.url} alt={primary.alt||''} className="col-span-3 md:col-span-2 w-full h-72 object-cover rounded-xl"/>
      <div className="grid grid-cols-2 gap-2">
        {rest.slice(0,4).map(img => (
          <img key={img.id} src={img.url} alt={img.alt||''} className="w-full h-36 object-cover rounded-xl"/>
        ))}
      </div>
    </div>
  )
}

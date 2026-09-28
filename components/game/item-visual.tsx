import type { KitItem } from '@/lib/game-items'
import { cn } from '@/lib/utils'

type ItemVisualProps = {
  item: KitItem
  rotated: boolean
  className?: string
}

export function ItemVisual({ item, rotated, className }: ItemVisualProps) {
  const innerStyle = rotated
    ? {
        width: `${(item.w / item.h) * 100}%`,
        height: `${(item.h / item.w) * 100}%`,
        transform: 'translate(-50%, -50%) rotate(90deg)',
      }
    : { width: '100%', height: '100%', transform: 'translate(-50%, -50%)' }

  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-md bg-white shadow-md ring-1 ring-black/20',
        className,
      )}
    >
      <div className="absolute top-1/2 left-1/2 p-0.5" style={innerStyle}>
        <img
          src={item.src || '/placeholder.svg'}
          alt=""
          draggable={false}
          className="pointer-events-none h-full w-full object-contain select-none"
        />
      </div>
    </div>
  )
}

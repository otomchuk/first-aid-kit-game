import type { PointerEvent } from 'react'
import { KIT_ITEMS, footprint, type Placement } from '@/lib/game-items'
import { cn } from '@/lib/utils'
import { ItemVisual } from './item-visual'

type ItemTrayProps = {
  round: number
  placements: Record<string, Placement>
  trayRotation: Record<string, boolean>
  draggingId: string | null
  shakeId: string | null
  onItemPointerDown: (id: string, event: PointerEvent<HTMLElement>) => void
}

const TRAY_CELL = 38

export function ItemTray({
  round,
  placements,
  trayRotation,
  draggingId,
  shakeId,
  onItemPointerDown,
}: ItemTrayProps) {
  const remaining = KIT_ITEMS.filter((item) => !placements[item.id])

  return (
    <section
      aria-labelledby="tray-title"
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-4"
    >
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 id="tray-title" className="font-display text-lg tracking-wide uppercase">
          Спорядження
        </h3>
        <span className="text-sm text-muted-foreground">
          {remaining.length > 0 ? `Залишилось: ${remaining.length}` : 'Усе спаковано'}
        </span>
      </div>

      {remaining.length === 0 ? (
        <p className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Усе спорядження вже в аптечці.
        </p>
      ) : (
        <ul key={round} className="flex flex-wrap items-end gap-3">
          {remaining.map((item, index) => {
            const rotated = trayRotation[item.id] ?? false
            const size = footprint(item, rotated)
            return (
              <li
                key={item.id}
                className="animate-drop-in flex flex-col items-center gap-1.5"
                style={{ animationDelay: `${index * 90}ms` }}
              >
                <button
                  type="button"
                  aria-label={`${item.name}, розмір ${size.w} на ${size.h}. Торкніться, щоб повернути, або перетягніть в аптечку.`}
                  onPointerDown={(e) => onItemPointerDown(item.id, e)}
                  className={cn(
                    'cursor-grab touch-none rounded-md outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring',
                    draggingId === item.id && 'opacity-25',
                    shakeId === item.id && 'animate-shake',
                  )}
                  style={{ width: size.w * TRAY_CELL, height: size.h * TRAY_CELL }}
                >
                  <ItemVisual item={item} rotated={rotated} />
                </button>
                <span className="max-w-28 text-center text-xs leading-tight text-muted-foreground">
                  {item.name}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

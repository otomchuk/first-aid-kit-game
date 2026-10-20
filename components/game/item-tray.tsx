import type { PointerEvent } from 'react'
import { footprint, getKitItems, type Placement } from '@/lib/game-items'
import { COPY, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { ItemVisual } from './item-visual'

type ItemTrayProps = {
  round: number
  locale: Locale
  placements: Record<string, Placement>
  trayRotation: Record<string, boolean>
  draggingId: string | null
  shakeId: string | null
  onItemPointerDown: (id: string, event: PointerEvent<HTMLElement>) => void
}

const TRAY_CELL = 38

export function ItemTray({
  round,
  locale,
  placements,
  trayRotation,
  draggingId,
  shakeId,
  onItemPointerDown,
}: ItemTrayProps) {
  const copy = COPY[locale]
  const remaining = getKitItems(locale).filter((item) => !placements[item.id])

  return (
    <section
      aria-labelledby="tray-title"
      className={cn(
        'flex h-full flex-col rounded-2xl border border-border bg-card p-4',
        'sticky bottom-2 z-20 mx-auto w-full max-w-full bg-card/95 backdrop-blur-sm shadow-sm',
        'lg:static lg:bg-card lg:shadow-none lg:backdrop-blur-none',
      )}
    >
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 id="tray-title" className="font-display text-lg tracking-wide uppercase">
          {copy.game.equipment}
        </h3>
        <span className="text-sm text-muted-foreground">
          {remaining.length > 0
            ? copy.game.remaining.replace('{count}', String(remaining.length))
            : copy.game.allPacked}
        </span>
      </div>

      {remaining.length === 0 ? (
        <p className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {copy.game.allInKit}
        </p>
      ) : (
        <ul
          key={round}
          className="flex w-max max-w-full items-end gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
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
                  aria-label={copy.game.itemAria
                    .replace('{name}', item.name)
                    .replace('{width}', String(size.w))
                    .replace('{height}', String(size.h))}
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

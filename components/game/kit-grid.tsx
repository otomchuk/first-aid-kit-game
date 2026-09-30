import { forwardRef, type PointerEvent } from 'react'
import {
  GRID_COLS,
  GRID_ROWS,
  ITEMS_BY_ID,
  footprint,
  type Placement,
} from '@/lib/game-items'
import { cn } from '@/lib/utils'
import { ItemVisual } from './item-visual'

export type DropPreview = Placement & { id: string; valid: boolean }

type KitGridProps = {
  placements: Record<string, Placement>
  draggingId: string | null
  preview: DropPreview | null
  shakeId: string | null
  complete: boolean
  onItemPointerDown: (id: string, event: PointerEvent<HTMLElement>) => void
}

function boxStyle(p: Placement, w: number, h: number) {
  return {
    left: `${(p.x / GRID_COLS) * 100}%`,
    top: `${(p.y / GRID_ROWS) * 100}%`,
    width: `${(w / GRID_COLS) * 100}%`,
    height: `${(h / GRID_ROWS) * 100}%`,
  }
}

export const KitGrid = forwardRef<HTMLDivElement, KitGridProps>(function KitGrid(
  { placements, draggingId, preview, shakeId, complete, onItemPointerDown },
  ref,
) {
  const previewItem = preview ? ITEMS_BY_ID[preview.id] : null
  const previewSize = previewItem && preview ? footprint(previewItem, preview.rotated) : null

  return (
    <div className="relative mx-auto w-full max-w-[min(100%,22rem)] sm:max-w-[min(100%,26rem)] lg:max-w-[min(100%,calc(68svh*0.75))]">
      <div
        aria-hidden="true"
        className="mx-auto h-5 w-28 rounded-t-2xl border-4 border-b-0 border-primary"
      />
      <div
        className={cn(
          'rounded-2xl border-2 border-border bg-secondary p-2.5 shadow-2xl transition-shadow sm:p-3',
          complete && 'ring-4 ring-success/70',
        )}
      >
        <div className="mb-2 flex items-center justify-between px-1 font-display text-xs tracking-widest text-muted-foreground uppercase">
          <span>IFAK · Контур аптечки</span>
          <span className="flex size-5 items-center justify-center rounded-sm bg-primary text-sm font-bold text-primary-foreground">
            +
          </span>
        </div>
        <div
          ref={ref}
          role="grid"
          aria-label={`Аптечка ${GRID_COLS} на ${GRID_ROWS} клітинок`}
          className="relative aspect-[3/4] w-full rounded-lg border-2 border-dashed border-accent/60 bg-background/60"
          style={{
            backgroundImage:
              'linear-gradient(to right, color-mix(in oklch, var(--accent) 14%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--accent) 14%, transparent) 1px, transparent 1px)',
            backgroundSize: `calc(100% / ${GRID_COLS}) calc(100% / ${GRID_ROWS})`,
          }}
        >
          {previewSize && preview && (
            <div
              aria-hidden="true"
              className={cn(
                'absolute rounded-md border-2 transition-all duration-75',
                preview.valid
                  ? 'border-success bg-success/25'
                  : 'border-primary bg-primary/25',
              )}
              style={boxStyle(preview, previewSize.w, previewSize.h)}
            />
          )}

          {Object.entries(placements).map(([id, p]) => {
            const item = ITEMS_BY_ID[id]
            const size = footprint(item, p.rotated)
            return (
              <button
                key={id}
                type="button"
                aria-label={`${item.name} — у аптечці. Торкніться, щоб повернути, або перетягніть.`}
                onPointerDown={(e) => onItemPointerDown(id, e)}
                className={cn(
                  'absolute cursor-grab touch-none p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  draggingId === id && 'opacity-25',
                  shakeId === id && 'animate-shake',
                )}
                style={boxStyle(p, size.w, size.h)}
              >
                <ItemVisual item={item} rotated={p.rotated} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
})

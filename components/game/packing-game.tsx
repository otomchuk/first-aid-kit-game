'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { Move, RotateCcw, RotateCw, Timer, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDuration, parseChallenge } from '@/lib/challenge'
import {
  GRID_COLS,
  ITEMS_BY_ID,
  KIT_ITEMS,
  canPlace,
  footprint,
  type Placement,
} from '@/lib/game-items'
import { formatTime } from './format-time'
import { ItemTray } from './item-tray'
import { ItemVisual } from './item-visual'
import { KitGrid, type DropPreview } from './kit-grid'
import { WinDialog } from './win-dialog'

type DragState = {
  id: string
  rotated: boolean
  fx: number
  fy: number
  px: number
  py: number
  startX: number
  startY: number
  cell: number
  moved: boolean
  origin: Placement | null
  target: (DropPreview & { inside: boolean }) | null
}

const ROTATE_KEYS = new Set(['r', 'R', 'к', 'К', ' '])

export function PackingGame() {
  const gridRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const placementsRef = useRef<Record<string, Placement>>({})

  const [placements, setPlacements] = useState<Record<string, Placement>>({})
  const [trayRotation, setTrayRotation] = useState<Record<string, boolean>>({})
  const [drag, setDrag] = useState<DragState | null>(null)
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [moves, setMoves] = useState(0)
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [round, setRound] = useState(0)
  const [dialogDismissed, setDialogDismissed] = useState(false)
  const [challenge, setChallenge] = useState<number | null>(null)
  const [challengeDismissed, setChallengeDismissed] = useState(false)

  useEffect(() => {
    setChallenge(parseChallenge(window.location.search))
  }, [])

  const placedCount = Object.keys(placements).length
  const complete = placedCount === KIT_ITEMS.length

  useEffect(() => {
    placementsRef.current = placements
  }, [placements])

  useEffect(() => {
    if (!startedAt || complete) return
    const timer = setInterval(() => setElapsed(Date.now() - startedAt), 250)
    return () => clearInterval(timer)
  }, [startedAt, complete])

  const shake = useCallback((id: string) => {
    setShakeId(id)
    setTimeout(() => setShakeId((current) => (current === id ? null : current)), 400)
  }, [])

  const withTarget = useCallback((d: DragState): DragState => {
    const grid = gridRef.current
    if (!grid) return { ...d, target: null }
    const rect = grid.getBoundingClientRect()
    const cell = rect.width / GRID_COLS
    const item = ITEMS_BY_ID[d.id]
    const size = footprint(item, d.rotated)
    const left = d.px - d.fx * size.w * d.cell
    const top = d.py - d.fy * size.h * d.cell
    const x = Math.round((left - rect.left) / cell)
    const y = Math.round((top - rect.top) / cell)
    const margin = cell * 0.5
    const inside =
      d.px >= rect.left - margin &&
      d.px <= rect.right + margin &&
      d.py >= rect.top - margin &&
      d.py <= rect.bottom + margin
    const valid = canPlace(item, { x, y, rotated: d.rotated }, placementsRef.current)
    return { ...d, target: { id: d.id, x, y, rotated: d.rotated, valid, inside } }
  }, [])

  const commitDrag = useCallback((next: DragState | null) => {
    dragRef.current = next
    setDrag(next)
  }, [])

  const handleTap = useCallback(
    (id: string, origin: Placement | null) => {
      if (!origin) {
        setTrayRotation((r) => ({ ...r, [id]: !r[id] }))
        return
      }
      const rotatedPlacement = { ...origin, rotated: !origin.rotated }
      if (canPlace(ITEMS_BY_ID[id], rotatedPlacement, placementsRef.current)) {
        setPlacements((p) => ({ ...p, [id]: rotatedPlacement }))
      } else {
        shake(id)
      }
    },
    [shake],
  )

  const finishDrag = useCallback(() => {
    const d = dragRef.current
    if (!d) return
    commitDrag(null)

    if (!d.moved) {
      handleTap(d.id, d.origin)
      return
    }

    const t = d.target
    if (t?.inside && t.valid) {
      setPlacements((p) => ({ ...p, [d.id]: { x: t.x, y: t.y, rotated: t.rotated } }))
      setMoves((m) => m + 1)
      setStartedAt((s) => s ?? Date.now())
      const willComplete =
        !placementsRef.current[d.id] &&
        Object.keys(placementsRef.current).length + 1 === KIT_ITEMS.length
      if (willComplete && startedAt) setElapsed(Date.now() - startedAt)
      return
    }

    if (t?.inside) {
      shake(d.id)
      return
    }

    setTrayRotation((r) => ({ ...r, [d.id]: d.rotated }))
    if (d.origin) {
      setPlacements((p) => {
        const { [d.id]: _removed, ...rest } = p
        return rest
      })
    }
  }, [commitDrag, handleTap, shake, startedAt])

  const rotateDrag = useCallback(() => {
    const d = dragRef.current
    if (!d) return
    commitDrag(withTarget({ ...d, rotated: !d.rotated, fx: 1 - d.fy, fy: d.fx, moved: true }))
  }, [commitDrag, withTarget])

  const isDragging = drag !== null

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: globalThis.PointerEvent) => {
      const d = dragRef.current
      if (!d) return
      const moved =
        d.moved || Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 6
      commitDrag(withTarget({ ...d, px: e.clientX, py: e.clientY, moved }))
    }
    const onKey = (e: KeyboardEvent) => {
      if (ROTATE_KEYS.has(e.key)) {
        e.preventDefault()
        rotateDrag()
      } else if (e.key === 'Escape') {
        commitDrag(null)
      }
    }
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      rotateDrag()
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', finishDrag)
    window.addEventListener('pointercancel', finishDrag)
    window.addEventListener('keydown', onKey)
    window.addEventListener('contextmenu', onContextMenu)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', finishDrag)
      window.removeEventListener('pointercancel', finishDrag)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('contextmenu', onContextMenu)
    }
  }, [isDragging, commitDrag, withTarget, finishDrag, rotateDrag])

  const startDrag = useCallback(
    (id: string, e: PointerEvent<HTMLElement>) => {
      if (e.button !== 0 || dragRef.current) return
      e.preventDefault()
      const grid = gridRef.current
      if (!grid) return
      const rect = e.currentTarget.getBoundingClientRect()
      const origin = placementsRef.current[id] ?? null
      commitDrag({
        id,
        rotated: origin ? origin.rotated : (trayRotation[id] ?? false),
        fx: (e.clientX - rect.left) / rect.width,
        fy: (e.clientY - rect.top) / rect.height,
        px: e.clientX,
        py: e.clientY,
        startX: e.clientX,
        startY: e.clientY,
        cell: grid.getBoundingClientRect().width / GRID_COLS,
        moved: false,
        origin,
        target: null,
      })
    },
    [commitDrag, trayRotation],
  )

  function reset() {
    commitDrag(null)
    setPlacements({})
    setTrayRotation({})
    setMoves(0)
    setStartedAt(null)
    setElapsed(0)
    setDialogDismissed(false)
    setRound((r) => r + 1)
  }

  const floating = drag?.moved ? drag : null
  const floatingItem = floating ? ITEMS_BY_ID[floating.id] : null
  const floatingSize = floatingItem && floating ? footprint(floatingItem, floating.rotated) : null
  const preview = drag?.moved && drag.target?.inside ? drag.target : null

  return (
    <div className={isDragging ? 'cursor-grabbing select-none' : undefined}>
      {challenge !== null && !challengeDismissed && (
        <div className="animate-drop-in relative mb-4 rounded-2xl border border-accent/50 bg-accent/10 p-4 pr-12">
          <p className="font-display text-xl tracking-wide uppercase">Тобі кинули виклик 👀</p>
          <p className="mt-1 text-muted-foreground">
            Аптечку зібрали за{' '}
            <strong className="text-foreground">{formatDuration(challenge)}</strong>. Поб’єш
            результат?
          </p>
          <button
            type="button"
            onClick={() => setChallengeDismissed(true)}
            aria-label="Сховати виклик"
            className="absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <dl className="flex flex-wrap gap-2 text-sm">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <dt className="sr-only">Спаковано</dt>
            <dd className="font-display text-base tabular-nums">
              {placedCount}/{KIT_ITEMS.length}
            </dd>
            <span className="text-muted-foreground">в аптечці</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <Timer className="size-4 text-muted-foreground" aria-hidden="true" />
            <dt className="sr-only">Час</dt>
            <dd className="font-display text-base tabular-nums">{formatTime(elapsed)}</dd>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
            <Move className="size-4 text-muted-foreground" aria-hidden="true" />
            <dt className="sr-only">Ходи</dt>
            <dd className="font-display text-base tabular-nums">{moves}</dd>
          </div>
        </dl>
        <Button variant="outline" size="lg" onClick={reset}>
          <RotateCcw />
          Почати знову
        </Button>
      </div>

      <div
        className="mb-4 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Прогрес пакування"
        aria-valuemin={0}
        aria-valuemax={KIT_ITEMS.length}
        aria-valuenow={placedCount}
      >
        <div
          className="h-full rounded-full bg-success transition-all duration-500"
          style={{ width: `${(placedCount / KIT_ITEMS.length) * 100}%` }}
        />
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:items-start lg:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <KitGrid
          ref={gridRef}
          placements={placements}
          draggingId={drag?.moved ? drag.id : null}
          preview={preview}
          shakeId={shakeId}
          complete={complete}
          onItemPointerDown={startDrag}
        />

        <div className="flex flex-col gap-4 lg:flex">
          <ItemTray
            round={round}
            placements={placements}
            trayRotation={trayRotation}
            draggingId={drag?.moved ? drag.id : null}
            shakeId={shakeId}
            onItemPointerDown={startDrag}
          />
          <ul className="grid gap-2 rounded-2xl border border-border bg-card/60 p-4 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <Move className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              Перетягни предмет в аптечку — зелений контур означає, що місця достатньо.
              Усі предмети заповнюють аптечку повністю, без жодної порожньої клітинки.
            </li>
            <li className="flex gap-2">
              <RotateCw className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              Торкнись предмета, щоб повернути його. Під час перетягування — клавіша R або
              права кнопка миші.
            </li>
            <li className="flex gap-2">
              <RotateCcw className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              Щоб дістати предмет, перетягни його за межі аптечки.
            </li>
          </ul>
        </div>
      </div>

      {floating && floatingItem && floatingSize && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-40 rotate-2 opacity-95 drop-shadow-2xl"
          style={{
            left: floating.px - floating.fx * floatingSize.w * floating.cell,
            top: floating.py - floating.fy * floatingSize.h * floating.cell,
            width: floatingSize.w * floating.cell,
            height: floatingSize.h * floating.cell,
          }}
        >
          <ItemVisual item={floatingItem} rotated={floating.rotated} />
        </div>
      )}

      {complete && !dialogDismissed && (
        <WinDialog
          timeMs={elapsed}
          moves={moves}
          challengeSeconds={challenge}
          onReplay={reset}
          onClose={() => setDialogDismissed(true)}
        />
      )}
    </div>
  )
}

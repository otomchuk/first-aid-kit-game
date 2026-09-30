'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Heart, RotateCcw, Share2, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { CAMPAIGN } from '@/lib/campaign'
import { challengeUrl, plural } from '@/lib/challenge'
import { cn } from '@/lib/utils'
import { formatTime } from './format-time'

type WinDialogProps = {
  timeMs: number
  moves: number
  challengeSeconds: number | null
  onReplay: () => void
  onClose: () => void
}

export function WinDialog({ timeMs, moves, challengeSeconds, onReplay, onClose }: WinDialogProps) {
  const donateRef = useRef<HTMLAnchorElement>(null)
  const shareRef = useRef<HTMLDivElement>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const seconds = Math.max(1, Math.floor(timeMs / 1000))
  const movesLabel = plural(moves, 'хід', 'ходи', 'ходів')
  const beatChallenge = challengeSeconds !== null && seconds < challengeSeconds

  useEffect(() => {
    donateRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (popoverOpen) setPopoverOpen(false)
      else onClose()
    }
    const onPointerDown = (e: globalThis.PointerEvent) => {
      if (popoverOpen && !shareRef.current?.contains(e.target as Node)) setPopoverOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [onClose, popoverOpen])

  function share() {
    setCopied(false)
    setPopoverOpen((open) => !open)
  }

  async function copyLink() {
    const value = challengeUrl(seconds)
    setCopied(false)

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value)
        setCopied(true)
        return
      }

      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()

      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(success)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="win-title"
        className="animate-drop-in my-auto max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          className="absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-success text-2xl font-bold text-background">
          +
        </div>
        <h2 id="win-title" className="font-display text-3xl tracking-wide uppercase">
          Аптечку зібрано!
        </h2>
        {challengeSeconds !== null && (
          <p className={cn('mt-2 text-sm font-semibold', beatChallenge ? 'text-success' : 'text-accent')}>
            {beatChallenge
              ? `Виклик прийнято і побито: ${formatTime(seconds * 1000)} проти ${formatTime(challengeSeconds * 1000)}!`
              : `До виклику не вистачило: треба було швидше за ${formatTime(challengeSeconds * 1000)}.`}
          </p>
        )}
        <p className="mt-2 text-pretty text-muted-foreground">
          Ти впорався за <strong className="text-foreground">{formatTime(timeMs)}</strong> і{' '}
          <strong className="text-foreground">{moves}</strong> {movesLabel}. На фронті справжня
          аптечка рятує життя за лічені хвилини — допоможи, щоб вона була в кожного бійця.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <a
            ref={donateRef}
            href={CAMPAIGN.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'lg' }), 'h-12 text-base font-semibold')}
          >
            <Heart className="size-5" />
            Задонатити на аптечку
          </a>
          <div ref={shareRef} className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                size="lg"
                className="h-11 w-full"
                aria-expanded={popoverOpen}
                aria-controls="share-popover"
                onClick={share}
              >
                <Share2 />
                Поділитися
              </Button>
              <Button variant="outline" size="lg" className="h-11" onClick={onReplay}>
                <RotateCcw />
                Ще раз
              </Button>
            </div>
            {popoverOpen && (
              <div
                id="share-popover"
                className="rounded-lg border border-border bg-muted/50 p-4 text-popover-foreground"
              >
                <p className="font-display text-lg tracking-wide uppercase">Кинь виклик друзям</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Я зібрав(ла) аптечку за {formatTime(seconds * 1000)}. Зможеш швидше?
                </p>
                <Button variant="secondary" size="lg" className="mt-3 h-10 w-full" onClick={copyLink}>
                  {copied ? <Check /> : <Copy />}
                  {copied ? 'Посилання скопійовано' : 'Копіювати'}
                </Button>
                <span className="sr-only" aria-live="polite">
                  {copied ? 'Посилання скопійовано' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

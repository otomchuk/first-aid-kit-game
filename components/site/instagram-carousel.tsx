'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { InstagramPost } from '@/lib/instagram'
import { asset } from '@/lib/utils'

const dateFormatter = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long' })

export function InstagramCarousel({ posts }: { posts: InstagramPost[] }) {
  const trackRef = useRef<HTMLUListElement>(null)

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 16 : track.clientWidth
    track.scrollBy({ left: step * direction, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        aria-label="Останні публікації в Instagram"
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <li key={post.id} className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-[calc((100%-3rem)/4)]">
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={post.imageUrl || asset('/placeholder.svg')}
                  alt={post.caption ? post.caption.slice(0, 120) : 'Публікація TacMed Help в Instagram'}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {post.mediaType !== 'IMAGE' && (
                  <span className="absolute top-2 right-2 rounded-md bg-black/60 p-1 text-white">
                    {post.mediaType === 'VIDEO' ? <Play className="size-4" /> : <Layers className="size-4" />}
                    <span className="sr-only">{post.mediaType === 'VIDEO' ? 'Відео' : 'Кілька фото'}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3">
                <time dateTime={post.timestamp} className="text-xs text-muted-foreground">
                  {dateFormatter.format(new Date(post.timestamp))}
                </time>
                {post.caption && <p className="line-clamp-3 text-sm text-pretty">{post.caption}</p>}
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex justify-end gap-2">
        <Button variant="outline" size="icon" onClick={() => scrollByCard(-1)} aria-label="Попередні публікації">
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" onClick={() => scrollByCard(1)} aria-label="Наступні публікації">
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

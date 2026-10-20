'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Play, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { InstagramPost } from '@/lib/instagram'
import { COPY, type Locale } from '@/lib/i18n'
import { asset } from '@/lib/utils'

export function InstagramCarousel({ posts, locale }: { posts: InstagramPost[]; locale: Locale }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const copy = COPY[locale]
  const dateFormatter = new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-US', {
    day: 'numeric',
    month: 'long',
  })

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
        aria-label={copy.instagramPosts}
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
                  alt={post.caption ? post.caption.slice(0, 120) : copy.instagramPostAlt}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {post.mediaType !== 'IMAGE' && (
                  <span className="absolute top-2 right-2 rounded-md bg-black/60 p-1 text-white">
                    {post.mediaType === 'VIDEO' ? <Play className="size-4" /> : <Layers className="size-4" />}
                    <span className="sr-only">{post.mediaType === 'VIDEO' ? copy.video : copy.multiplePhotos}</span>
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
        <Button variant="outline" size="icon" onClick={() => scrollByCard(-1)} aria-label={copy.previousPosts}>
          <ChevronLeft />
        </Button>
        <Button variant="outline" size="icon" onClick={() => scrollByCard(1)} aria-label={copy.nextPosts}>
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}

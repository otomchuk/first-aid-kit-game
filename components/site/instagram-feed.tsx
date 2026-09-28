import { buttonVariants } from '@/components/ui/button'
import { CAMPAIGN } from '@/lib/campaign'
import { getLatestInstagramPosts } from '@/lib/instagram'
import { cn } from '@/lib/utils'
import { InstagramCarousel } from './instagram-carousel'
import { InstagramIcon } from './instagram-icon'

export async function InstagramFeed() {
  const posts = await getLatestInstagramPosts()
  const { organizer } = CAMPAIGN

  return (
    <section aria-labelledby="instagram-title" className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="instagram-title"
              className="mb-2 font-display text-3xl font-semibold tracking-tight uppercase md:text-4xl"
            >
              Новини збору
            </h2>
            <p className="max-w-xl text-pretty text-muted-foreground">
              Звіти, передачі аптечок на фронт та свіжі оновлення від організатора — {organizer.name}.
            </p>
          </div>
          <a
            href={organizer.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'self-start sm:self-auto')}
          >
            <InstagramIcon className="size-4" />@{organizer.handle}
          </a>
        </div>

        {posts && posts.length > 0 ? (
          <InstagramCarousel posts={posts} />
        ) : (
          <a
            href={organizer.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/60 px-6 py-10 text-center transition-colors hover:border-primary"
          >
            <InstagramIcon className="size-10 text-primary" />
            <span className="font-display text-xl uppercase">Слідкуй за збором в Instagram</span>
            <span className="max-w-md text-sm text-pretty text-muted-foreground">
              Усі звіти та фото з передач публікуємо на сторінці @{organizer.handle}.
            </span>
          </a>
        )}
      </div>
    </section>
  )
}

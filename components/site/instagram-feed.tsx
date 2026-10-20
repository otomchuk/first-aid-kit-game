import { buttonVariants } from '@/components/ui/button'
import { CAMPAIGN } from '@/lib/campaign'
import { COPY, type Locale } from '@/lib/i18n'
import { getLatestInstagramPosts } from '@/lib/instagram'
import { cn } from '@/lib/utils'
import { InstagramCarousel } from './instagram-carousel'
import { InstagramIcon } from './instagram-icon'

export async function InstagramFeed({ locale }: { locale: Locale }) {
  const posts = await getLatestInstagramPosts()
  const { organizer } = CAMPAIGN
  const copy = COPY[locale]

  return (
    <section aria-labelledby="instagram-title" className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="instagram-title"
              className="mb-2 font-display text-3xl font-semibold tracking-tight uppercase md:text-4xl"
            >
              {copy.campaignNews}
            </h2>
            <p className="max-w-xl text-pretty text-muted-foreground">
              {copy.campaignNewsDescription.replace('{name}', organizer.name)}
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
          <InstagramCarousel posts={posts} locale={locale} />
        ) : (
          <a
            href={organizer.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/60 px-6 py-10 text-center transition-colors hover:border-primary"
          >
            <InstagramIcon className="size-10 text-primary" />
            <span className="font-display text-xl uppercase">{copy.followInstagram}</span>
            <span className="max-w-md text-sm text-pretty text-muted-foreground">
              {copy.instagramDescription.replace('{handle}', organizer.handle)}
            </span>
          </a>
        )}
      </div>
    </section>
  )
}

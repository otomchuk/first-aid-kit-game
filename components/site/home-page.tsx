import Image from 'next/image'
import { Heart } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { PackingGame } from '@/components/game/packing-game'
import { Hero } from '@/components/site/hero'
import { KitContents } from '@/components/site/kit-contents'
import { InstagramFeed } from '@/components/site/instagram-feed'
import { InstagramIcon } from '@/components/site/instagram-icon'
import { Organizers } from '@/components/site/organizers'
import { CAMPAIGN } from '@/lib/campaign'
import { COPY, type Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function HomePage({ locale }: { locale: Locale }) {
  const copy = COPY[locale]
  const languageHref = locale === 'uk' ? '/en/' : '/'

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <a href="#" className="flex items-center gap-2 text-foreground">
            <Image
              src="/TACMEDHELP_logo.png"
              alt="TACMEDHELP"
              width={120}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
            <span className="font-display text-base font-semibold uppercase tracking-[0.12em] text-foreground">
              {copy.brand}
            </span>
          </a>
          <nav aria-label={locale === 'uk' ? 'Мова та донат' : 'Language and donations'} className="flex items-center gap-2">
            <a
              href={languageHref}
              lang={locale === 'uk' ? 'en' : 'uk'}
              className="rounded-md px-2 py-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {copy.language}
            </a>
            <a
              href={CAMPAIGN.donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              <Heart className="animate-heart-pulse" />
              {copy.donate}
            </a>
          </nav>
        </div>
      </header>

      <main>
        <Hero locale={locale} />

        <section
          id="game"
          aria-labelledby="game-title"
          className="scroll-mt-16 border-y border-border bg-card/40 py-12"
        >
          <div className="mx-auto max-w-6xl px-4">
            <h2
              id="game-title"
              className="mb-2 font-display text-3xl font-semibold tracking-tight uppercase md:text-4xl"
            >
              {copy.gameTitle}
            </h2>
            <p className="mb-6 max-w-2xl text-pretty text-muted-foreground">{copy.gameDescription}</p>
            <PackingGame locale={locale} />
          </div>
        </section>

        <KitContents locale={locale} />
        <Organizers locale={locale} />
        <InstagramFeed locale={locale} />
      </main>

      <footer className="border-t border-border py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p>
            {copy.organizer}{' '}
            <a
              href={CAMPAIGN.organizer.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              <InstagramIcon className="size-4" />
              <span>@{CAMPAIGN.organizer.handle}</span>
            </a>
          </p>
          <p>{copy.footer}</p>
        </div>
      </footer>
    </>
  )
}

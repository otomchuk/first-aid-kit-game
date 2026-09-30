import { Heart } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { PackingGame } from '@/components/game/packing-game'
import { Hero } from '@/components/site/hero'
import { KitContents } from '@/components/site/kit-contents'
import { InstagramFeed } from '@/components/site/instagram-feed'
import { InstagramIcon } from '@/components/site/instagram-icon'
import { Organizers } from '@/components/site/organizers'
import { CAMPAIGN } from '@/lib/campaign'
import { cn } from '@/lib/utils'

export default function Page() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <a href="#" className="flex items-center gap-2 text-foreground">
            <span
              aria-hidden="true"
              className="relative flex size-8 items-center justify-center rounded-full bg-foreground text-background shadow-sm ring-1 ring-border"
            >
              <span className="absolute h-4 w-1 rounded-full bg-background" />
              <span className="absolute h-1 w-4 rounded-full bg-background" />
            </span>
            <span className="font-display text-base font-semibold uppercase tracking-[0.12em] text-foreground">
              збери аптечку
            </span>
          </a>
          <a
            href={CAMPAIGN.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: 'lg' }))}
          >
            <Heart />
            Донат
          </a>
        </div>
      </header>

      <main>
        <Hero />

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
              Спакуй аптечку
            </h2>
            <p className="mb-6 max-w-2xl text-pretty text-muted-foreground">
              Розмісти все спорядження в контурі аптечки так, щоб нічого не перекривалося.
              Встигни якнайшвидше — на полі бою рахунок іде на секунди.
            </p>
            <PackingGame />
          </div>
        </section>

        <KitContents />
        <Organizers />
        <InstagramFeed />
      </main>

      <footer className="border-t border-border py-8 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <p>
            Організатор:{' '}
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
          <p>Разом до перемоги. Кожна аптечка має значення.</p>
        </div>
      </footer>
    </>
  )
}

import { Heart } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { CAMPAIGN } from '@/lib/campaign'
import { getKitItems } from '@/lib/game-items'
import { COPY, type Locale } from '@/lib/i18n'
import { asset, cn } from '@/lib/utils'

export function KitContents({ locale }: { locale: Locale }) {
  const copy = COPY[locale]
  const items = getKitItems(locale)

  return (
    <section aria-labelledby="contents-title" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 max-w-2xl">
        <h2
          id="contents-title"
          className="font-display text-3xl font-semibold tracking-tight uppercase md:text-4xl"
        >
          {copy.contentsTitle}
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          {copy.contentsDescription}
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white">
              <img
                src={asset(item.src || '/placeholder.svg')}
                alt={item.name}
                className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] object-contain"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{item.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.purpose}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl border border-primary/40 bg-primary/10 p-6 md:flex-row md:items-center md:p-8">
        <div>
          <h2 className="font-display text-2xl font-semibold uppercase">
            {copy.oneKitTitle}
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            {copy.oneKitDescription}
          </p>
        </div>
        <a
          href={CAMPAIGN.donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ size: 'lg' }), 'h-12 shrink-0 px-6 text-base')}
        >
          <Heart className="size-5" />
          {copy.supportCampaign}
        </a>
      </div>
    </section>
  )
}

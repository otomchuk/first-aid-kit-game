import { Heart, Play } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { CAMPAIGN } from '@/lib/campaign'
import { COPY, type Locale } from '@/lib/i18n'
import { asset, cn } from '@/lib/utils'

export function Hero({ locale }: { locale: Locale }) {
  const copy = COPY[locale]

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 pb-12 md:grid-cols-2 md:pt-14">
      <div>
        <h1 className="font-display text-5xl leading-[1.05] font-semibold tracking-tight text-balance uppercase md:text-6xl">
          {copy.heroTitle} <span className="text-primary">{copy.heroHighlight}</span>
        </h1>
        <p className="mt-5 max-w-lg text-lg text-pretty text-muted-foreground">{copy.heroDescription}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#game" className={cn(buttonVariants({ size: 'lg' }), 'h-12 px-5 text-base')}>
            <Play className="size-5" />
            {copy.play}
          </a>
          <a
            href={CAMPAIGN.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-12 px-5 text-base')}
          >
            <Heart className="size-5 animate-heart-pulse" />
            {copy.donateToCampaign}
          </a>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-sm md:max-w-md">
        <div
          aria-hidden="true"
          className="absolute inset-8 rounded-full bg-primary/20 blur-3xl"
        />
        <img
          src={asset('/ifak-pouch.png')}
          alt={locale === 'uk' ? 'Тактична аптечка IFAK у камуфляжі з червоною ручкою та нашивкою з хрестом' : 'Camouflage IFAK pouch with a red handle and cross patch'}
          className="relative w-full rounded-3xl"
        />
      </div>
    </section>
  )
}

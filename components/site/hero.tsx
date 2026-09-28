import { Heart, Play } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { CAMPAIGN } from '@/lib/campaign'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 pb-12 md:grid-cols-2 md:pt-14">
      <div>
        <h1 className="font-display text-5xl leading-[1.05] font-semibold tracking-tight text-balance uppercase md:text-6xl">
          Збери аптечку. <span className="text-primary">Врятуй життя.</span>
        </h1>
        <p className="mt-5 max-w-lg text-lg text-pretty text-muted-foreground">
          Оголошуємо збір на 700 000 гривень для закупівлі 200 IFAK для наших захисників.
          Спакуй тактичну аптечку, а потім допоможи зібрати справжні IFAK для наших
          захисників.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#game" className={cn(buttonVariants({ size: 'lg' }), 'h-12 px-5 text-base')}>
            <Play className="size-5" />
            Грати
          </a>
          <a
            href={CAMPAIGN.donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-12 px-5 text-base')}
          >
            <Heart className="size-5" />
            Задонатити
          </a>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-sm md:max-w-md">
        <div
          aria-hidden="true"
          className="absolute inset-8 rounded-full bg-primary/20 blur-3xl"
        />
        <img
          src="/ifak-pouch.jpg"
          alt="Тактична аптечка IFAK у камуфляжі з червоною ручкою та нашивкою з хрестом"
          className="relative w-full rounded-3xl"
        />
      </div>
    </section>
  )
}

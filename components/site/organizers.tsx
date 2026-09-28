import { CAMPAIGN } from '@/lib/campaign'
import { InstagramIcon } from './instagram-icon'

export function Organizers() {
  const { organizer, delivered } = CAMPAIGN

  return (
    <section
      id="organizers"
      aria-labelledby="organizers-title"
      className="scroll-mt-16 border-t border-border py-16"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 max-w-2xl">
          <h2
            id="organizers-title"
            className="font-display text-3xl font-semibold tracking-tight uppercase md:text-4xl"
          >
            Організатори
          </h2>
          <p className="mt-4 whitespace-pre-line text-pretty text-lg text-muted-foreground">
            {organizer.description.join('\n')}
          </p>
          <a
            href={organizer.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            <InstagramIcon className="size-4" />@{organizer.handle}
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <h3 className="pt-8 pb-2 text-center font-display text-3xl font-semibold tracking-wide text-primary md:text-4xl">
            передано
          </h3>
          <ul className="divide-y divide-border md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
            {delivered.map((item) => (
              <li
                key={item.label}
                className="grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-8 md:grid-cols-1 md:justify-items-center md:text-center"
              >
                <div>
                  <p className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
                    {item.value}
                  </p>
                  <p className="mt-1 text-lg text-muted-foreground">{item.label}</p>
                </div>
                <img
                  src={item.image}
                  alt={item.alt}
                  className="h-28 w-36 object-contain mix-blend-lighten md:h-40 md:w-48"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

const MAX_CHALLENGE_SECONDS = 60 * 60

export function parseChallenge(search: string) {
  const raw = new URLSearchParams(search).get('challenge')
  if (!raw || !/^\d+$/.test(raw)) return null
  const seconds = Number(raw)
  return seconds > 0 && seconds <= MAX_CHALLENGE_SECONDS ? seconds : null
}

export function challengeUrl(seconds: number) {
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('challenge', String(seconds))
  url.hash = 'game'
  return url.toString()
}

export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds} ${plural(seconds, 'секунду', 'секунди', 'секунд')}`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

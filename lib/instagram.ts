export type InstagramPost = {
  id: string
  caption?: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  imageUrl: string
  permalink: string
  timestamp: string
}

type GraphMedia = {
  id: string
  caption?: string
  media_type: InstagramPost['mediaType']
  media_url?: string
  thumbnail_url?: string
  permalink: string
  timestamp: string
}

const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'

export async function getLatestInstagramPosts(limit = 10): Promise<InstagramPost[] | null> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  if (!token) return null

  const url = new URL('https://graph.instagram.com/me/media')
  url.searchParams.set('fields', FIELDS)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('access_token', token)

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } })
    if (!res.ok) {
      console.error('[instagram] media request failed', res.status)
      return null
    }
    const json = (await res.json()) as { data?: GraphMedia[] }
    return (json.data ?? [])
      .map((m) => ({
        id: m.id,
        caption: m.caption,
        mediaType: m.media_type,
        imageUrl: (m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url) ?? '',
        permalink: m.permalink,
        timestamp: m.timestamp,
      }))
      .filter((p) => p.imageUrl)
  } catch (error) {
    console.error('[instagram] media request error', error)
    return null
  }
}

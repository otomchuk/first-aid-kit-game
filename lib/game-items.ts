export const GRID_COLS = 6
export const GRID_ROWS = 8

export type KitItem = {
  id: string
  name: string
  purpose: string
  src: string
  w: number
  h: number
}

export type Placement = {
  x: number
  y: number
  rotated: boolean
}

export const KIT_ITEMS: KitItem[] = [
  {
    id: 'tourniquet',
    name: 'Турнікет CAT',
    purpose: 'Зупинка масивної кровотечі з кінцівок.',
    src: '/items/tourniquet.png',
    w: 4,
    h: 1,
  },
  {
    id: 'hemostatic',
    name: 'Гемостатик «Кровоспас»',
    purpose: 'Тампонування глибоких кровоточивих ран.',
    src: '/items/hemostatic.png',
    w: 2,
    h: 2,
  },
  {
    id: 'scissors',
    name: 'Ножиці для одягу',
    purpose: 'Швидкий доступ до рани крізь форму.',
    src: '/items/scissors.png',
    w: 1,
    h: 3,
  },
  {
    id: 'bandage',
    name: 'Компресійний бандаж',
    purpose: 'Тиснуча пов’язка для зупинки кровотечі.',
    src: '/items/bandage.png',
    w: 4,
    h: 2,
  },
  {
    id: 'chest-seal',
    name: 'Оклюзійна наліпка',
    purpose: 'Герметизація проникних поранень грудної клітки.',
    src: '/items/chest-seal.png',
    w: 2,
    h: 2,
  },
  {
    id: 'blanket',
    name: 'Термоковдра',
    purpose: 'Захист пораненого від переохолодження.',
    src: '/items/blanket.png',
    w: 3,
    h: 2,
  },
  {
    id: 'npa',
    name: 'Назофарингеальна трубка',
    purpose: 'Підтримка прохідності дихальних шляхів.',
    src: '/items/npa.png',
    w: 1,
    h: 3,
  },
  {
    id: 'splint',
    name: 'Шина',
    purpose: 'Іммобілізація переломів і вивихів.',
    src: '/items/splint.png',
    w: 2,
    h: 3,
  },
  {
    id: 'dressings',
    name: 'Набір пов’язок',
    purpose: 'Перев’язка ран та опіків, антисептика.',
    src: '/items/dressings.png',
    w: 3,
    h: 2,
  },
  {
    id: 'gloves',
    name: 'Рукавички',
    purpose: 'Захист рятувальника і пораненого.',
    src: '/items/gloves.png',
    w: 2,
    h: 1,
  },
  {
    id: 'needle',
    name: 'Голка для декомпресії',
    purpose: 'Декомпресія напруженого пневмотораксу.',
    src: '/items/needle.png',
    w: 1,
    h: 2,
  },
]

export const ITEMS_BY_ID: Record<string, KitItem> = Object.fromEntries(
  KIT_ITEMS.map((item) => [item.id, item]),
)

export function footprint(item: KitItem, rotated: boolean) {
  return rotated ? { w: item.h, h: item.w } : { w: item.w, h: item.h }
}

export function canPlace(
  item: KitItem,
  placement: Placement,
  placements: Record<string, Placement>,
) {
  const { w, h } = footprint(item, placement.rotated)
  const { x, y } = placement
  if (x < 0 || y < 0 || x + w > GRID_COLS || y + h > GRID_ROWS) return false

  return Object.entries(placements).every(([otherId, other]) => {
    if (otherId === item.id) return true
    const o = footprint(ITEMS_BY_ID[otherId], other.rotated)
    return (
      x + w <= other.x ||
      other.x + o.w <= x ||
      y + h <= other.y ||
      other.y + o.h <= y
    )
  })
}

export type LocationType = 'main' | 'sub'

export interface Location {
  id: string
  name: string
  slug: string

  type: LocationType
  parentId: string | null

  latitude: number
  longitude: number

  region: string
  state?: string
  country: string

  shortDescription: string
  description?: string

  heroImage?: string

  timelineOrder?: number

  featured?: boolean
  active?: boolean

  // Content used by the location detail page.
  introduction?: string
  history?: string

  // Optional content sections.
  highlights?: string[]
  significance?: string

  // Gallery image paths/URLs.
  gallery?: string[]
}
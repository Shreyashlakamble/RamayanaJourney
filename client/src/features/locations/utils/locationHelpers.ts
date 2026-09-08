import type { Location } from '../../../types/location'

export function getMainLocations(locations: Location[]) {
  return locations.filter(
    (location) =>
      location.type === 'main' &&
      location.parentId === null &&
      location.active !== false,
  )
}

export function getSubLocations(
  locations: Location[],
  parentId: string,
) {
  return locations.filter(
    (location) =>
      location.type === 'sub' &&
      location.parentId === parentId &&
      location.active !== false,
  )
}

export function getLocationById(
  locations: Location[],
  id: string,
) {
  return locations.find((location) => location.id === id)
}

export function getParentLocation(
  locations: Location[],
  location: Location,
) {
  if (!location.parentId) {
    return undefined
  }

  return getLocationById(locations, location.parentId)
}
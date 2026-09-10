import type { Location } from '../../types/location'

export interface MapVisibilityOptions {
  zoom: number
  selectedLocationId: string | null
}

export function getVisibleMapLocations(
  locations: Location[],
  {
    zoom,
    selectedLocationId,
  }: MapVisibilityOptions,
) {
  const mainLocations = locations.filter(
    (location) =>
      location.type === 'main' &&
      location.active !== false,
  )

  const selectedLocation = locations.find(
    (location) => location.id === selectedLocationId,
  )

  // National overview.
  if (!selectedLocation && zoom < 7) {
    return mainLocations
  }

  // Main location selected.
  if (selectedLocation?.type === 'main') {
    const subLocations = locations.filter(
      (location) =>
        location.type === 'sub' &&
        location.parentId === selectedLocation.id &&
        location.active !== false,
    )

    return [...mainLocations, ...subLocations]
  }

  // Sublocation selected.
  if (
    selectedLocation?.type === 'sub' &&
    selectedLocation.parentId
  ) {
    const relatedSubLocations = locations.filter(
      (location) =>
        location.type === 'sub' &&
        location.parentId === selectedLocation.parentId &&
        location.active !== false,
    )

    return [...mainLocations, ...relatedSubLocations]
  }

  return mainLocations
}
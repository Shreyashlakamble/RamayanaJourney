import type { Location } from '../../types/location'
import {
  getMainLocations,
  getParentLocation,
} from '../locations/utils/locationHelpers'
export type LocationTypeFilter =
  | 'all'
  | 'main'
  | 'sub'

export interface LocationSearchOptions {
  query: string
  type: LocationTypeFilter
  region: string
  state: string
}

export interface LocationSearchResult {
  location: Location
  parentLocation: Location | undefined
}

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase() ?? ''
}

function matchesQuery(
  location: Location,
  query: string,
) {
  if (!query) {
    return true
  }

  const searchableText = [
    location.name,
    location.region,
    location.state,
    location.country,
  ]
    .filter(Boolean)
    .map((value) =>
      String(value).toLowerCase(),
    )
    .join(' ')

  return searchableText.includes(query)
}

function matchesType(
  location: Location,
  type: LocationTypeFilter,
) {
  if (type === 'all') {
    return true
  }

  return location.type === type
}

function matchesRegion(
  location: Location,
  region: string,
) {
  if (region === 'all') {
    return true
  }

  return normalize(location.region) ===
    normalize(region)
}

function matchesState(
  location: Location,
  state: string,
) {
  if (state === 'all') {
    return true
  }

  return normalize(location.state) ===
    normalize(state)
}

export function searchLocations(
  locations: Location[],
  options: LocationSearchOptions,
): LocationSearchResult[] {
  const query = normalize(options.query)

 

  return locations
    .filter(
      (location) =>
        location.active !== false,
    )
    .filter((location) =>
      matchesQuery(location, query),
    )
    .filter((location) =>
      matchesType(location, options.type),
    )
    .filter((location) =>
      matchesRegion(
        location,
        options.region,
      ),
    )
    .filter((location) =>
      matchesState(
        location,
        options.state,
      ),
    )
    .map((location) => ({
      location,
      parentLocation:
        location.type === 'sub'
          ? getParentLocation(
              locations,
              location,
            )
          : undefined,
    }))
    .sort((a, b) => {
      const aIsMain =
        a.location.type === 'main'

      const bIsMain =
        b.location.type === 'main'

      if (
        aIsMain !== bIsMain
      ) {
        return aIsMain ? -1 : 1
      }

      return (
        a.location.name.localeCompare(
          b.location.name,
        )
      )
    })
}

export function getFilterOptions(
  locations: Location[],
) {
  const activeLocations =
    locations.filter(
      (location) =>
        location.active !== false,
    )

  const regions = Array.from(
    new Set(
      activeLocations
        .map((location) => location.region)
        .filter(Boolean)
        .map((value) =>
          String(value),
        ),
    ),
  ).sort((a, b) =>
    a.localeCompare(b),
  )

  const states = Array.from(
    new Set(
      activeLocations
        .map((location) => location.state)
        .filter(Boolean)
        .map((value) =>
          String(value),
        ),
    ),
  ).sort((a, b) =>
    a.localeCompare(b),
  )

  return {
    regions,
    states,
    mainCount:
      activeLocations.filter(
        (location) =>
          location.type === 'main',
      ).length,
    subCount:
      activeLocations.filter(
        (location) =>
          location.type === 'sub',
      ).length,
  }
}

export function groupSearchResults(
  locations: Location[],
  results: LocationSearchResult[],
) {
  const mainLocations =
    getMainLocations(locations)

  const resultIds = new Set(
    results.map(
      ({ location }) => location.id,
    ),
  )

  return mainLocations
    .map((mainLocation) => {
      const mainMatched =
        resultIds.has(mainLocation.id)

      const children = locations.filter(
        (location) =>
          location.type === 'sub' &&
          location.parentId ===
            mainLocation.id &&
          location.active !== false,
      )

      const matchingChildren =
        children.filter((child) =>
          resultIds.has(child.id),
        )

      if (
        !mainMatched &&
        matchingChildren.length === 0
      ) {
        return null
      }

      return {
        mainLocation,
        subLocations: mainMatched
          ? children
          : matchingChildren,
      }
    })
    .filter(Boolean)
}
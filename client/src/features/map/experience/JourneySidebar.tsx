import {
  ChevronDown,
  Compass,
  Filter,
  Layers,
  List,
  MapPinned,
  RotateCcw,
  Route,
  Search,
  X,
} from 'lucide-react'
import { useMemo } from 'react'

import type { Location } from '../../../types/location'

import {
  getMainLocations,
  getParentLocation,
  getSubLocations,
} from '../../locations/utils/locationHelpers'

export type JourneySidebarTab =
  | 'explore'
  | 'journey'
  | 'locations'
  | 'layers'

export type LocationTypeFilter =
  | 'all'
  | 'main'
  | 'sub'

export interface LocationFiltersState {
  type: LocationTypeFilter
  region: string
  state: string
}

interface JourneySidebarProps {
  locations: Location[]
  selectedLocation: Location | undefined

  searchQuery: string
  searchResults: Location[]

  activeTab: JourneySidebarTab
  showRoute: boolean

  filters: LocationFiltersState
  filterRegions: string[]
  filterStates: string[]
  filteredResultCount: number

  showSearch?: boolean
  showSearchResults?: boolean

  onSearchChange: (value: string) => void
  onSearchFocus?: () => void
  onSelectLocation: (location: Location) => void
  onTabChange: (tab: JourneySidebarTab) => void
  onToggleRoute: () => void
  onReset: () => void
  onFiltersChange: (
    filters: LocationFiltersState,
  ) => void
  onResetFilters: () => void
  onCloseMobile?: () => void

  className?: string
}

interface SearchGroup {
  mainLocation: Location
  subLocations: Location[]
}

function JourneySidebar({
  locations,
  selectedLocation,
  searchQuery,
  searchResults,
  activeTab,
  showRoute,
  filters,
  filterRegions,
  filterStates,
  filteredResultCount,
  showSearch = true,
  showSearchResults = true,
  onSearchChange,
  onSearchFocus,
  onSelectLocation,
  onTabChange,
  onToggleRoute,
  onReset,
  onFiltersChange,
  onResetFilters,
  onCloseMobile,
  className = '',
}: JourneySidebarProps) {
  const mainLocations = useMemo(
    () => getMainLocations(locations),
    [locations],
  )

  const journeyLocations = useMemo(
    () =>
      [...mainLocations].sort(
        (a, b) =>
          (a.timelineOrder ?? 999) -
          (b.timelineOrder ?? 999),
      ),
    [mainLocations],
  )

  /*
   * Determine which main location should be expanded.
   *
   * Main selected:
   *   → expand itself
   *
   * Sublocation selected:
   *   → expand its parent
   */
  const expandedMainLocationId = useMemo(() => {
    if (!selectedLocation) {
      return null
    }

    if (selectedLocation.type === 'main') {
      return selectedLocation.id
    }

    if (selectedLocation.type === 'sub') {
      const parent = getParentLocation(
        locations,
        selectedLocation,
      )

      return parent?.id ?? null
    }

    return null
  }, [locations, selectedLocation])

  /*
   * Hierarchical search results.
   *
   * Main location
   *   ├── matching sublocation
   *   └── matching sublocation
   */
  const searchGroups = useMemo<SearchGroup[]>(
    () => {
      const query = searchQuery
        .trim()
        .toLowerCase()

      if (!query) {
        return []
      }

      const resultIds = new Set(
        searchResults.map(
          (location) => location.id,
        ),
      )

      return mainLocations
        .map((mainLocation) => {
          const mainMatches =
            resultIds.has(mainLocation.id)

          const subLocations = getSubLocations(
            locations,
            mainLocation.id,
          )

          const matchingSubLocations =
            mainMatches
              ? subLocations
              : subLocations.filter(
                  (location) =>
                    resultIds.has(location.id),
                )

          if (
            !mainMatches &&
            matchingSubLocations.length === 0
          ) {
            return null
          }

          return {
            mainLocation,
            subLocations:
              matchingSubLocations,
          }
        })
        .filter(
          (
            group,
          ): group is SearchGroup =>
            group !== null,
        )
    },
    [
      locations,
      mainLocations,
      searchQuery,
      searchResults,
    ],
  )

  const tabs = [
    {
      id: 'explore' as const,
      label: 'Explore',
      icon: Compass,
    },
    {
      id: 'journey' as const,
      label: 'Journey',
      icon: Route,
    },
    {
      id: 'locations' as const,
      label: 'Locations',
      icon: MapPinned,
    },
    {
      id: 'layers' as const,
      label: 'Layers',
      icon: Layers,
    },
  ]

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.region !== 'all' ||
    filters.state !== 'all'

  const updateFilter = <
    K extends keyof LocationFiltersState,
  >(
    key: K,
    value: LocationFiltersState[K],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <aside
      className={`
        flex
        h-full
        w-[360px]
        flex-col
        border-r
        border-[var(--border)]
        bg-[var(--surface)]/95
        text-[var(--text)]
        shadow-2xl
        backdrop-blur-xl
        ${className}
      `}
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[var(--border)]
          px-5
          py-4
        "
      >
        <div>
          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.3em]
              text-[var(--primary)]
            "
          >
            Ramayana Journey
          </p>

          <p
            className="
              mt-1
              text-sm
              text-[var(--text-muted)]
            "
          >
            Interactive exploration
          </p>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              text-[var(--text-muted)]
              transition
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
            "
          >
            <X
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* Search */}
      {showSearch && (
        <div
          className="
            relative
            border-b
            border-[var(--border)]
            p-4
          "
        >
          <div className="relative">
            <Search
              className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-[var(--text-muted)]
              "
              aria-hidden="true"
            />

            <input
              type="search"
              value={searchQuery}
              onFocus={onSearchFocus}
              onChange={(event) =>
                onSearchChange(
                  event.target.value,
                )
              }
              placeholder="Search places, locations..."
              aria-label="Search places and locations"
              className="
                h-12
                w-full
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--background)]
                pl-11
                pr-4
                text-sm
                text-[var(--text)]
                outline-none
                transition
                placeholder:text-[var(--text-muted)]
                focus:border-[var(--primary)]
                focus:ring-2
                focus:ring-[var(--primary)]/10
              "
            />
          </div>

          {/* Search suggestions */}
          {showSearchResults &&
            searchQuery.trim() && (
              <div
                className="
                  absolute
                  left-4
                  right-4
                  top-[74px]
                  z-[1400]
                  max-h-[420px]
                  overflow-y-auto
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--surface)]
                  shadow-2xl
                "
              >
                {searchGroups.length > 0 ? (
                  searchGroups.map((group) => (
                    <div
                      key={
                        group.mainLocation.id
                      }
                      className="
                        border-b
                        border-[var(--border)]
                        last:border-b-0
                      "
                    >
                      {/* Main result */}
                      <button
                        type="button"
                        onClick={() =>
                          onSelectLocation(
                            group.mainLocation,
                          )
                        }
                        className="
                          flex
                          w-full
                          items-start
                          gap-3
                          px-4
                          py-3
                          text-left
                          transition
                          hover:bg-[var(--surface-muted)]
                        "
                      >
                        <span
                          className="
                            mt-1.5
                            h-2.5
                            w-2.5
                            shrink-0
                            rounded-full
                            bg-[#e9c27b]
                          "
                        />

                        <span>
                          <span className="block text-sm font-semibold">
                            {group.mainLocation.name}
                          </span>

                          <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                            Main location
                            {' · '}
                            {group.mainLocation.region}
                          </span>
                        </span>
                      </button>

                      {/* Sublocations */}
                      {group.subLocations.length >
                        0 && (
                        <div
                          className="
                            border-t
                            border-[var(--border)]
                            bg-[var(--background)]/60
                          "
                        >
                          {group.subLocations.map(
                            (subLocation) => (
                              <button
                                key={subLocation.id}
                                type="button"
                                onClick={() =>
                                  onSelectLocation(
                                    subLocation,
                                  )
                                }
                                className="
                                  flex
                                  w-full
                                  items-start
                                  gap-3
                                  border-l
                                  border-[var(--border)]
                                  px-4
                                  py-2.5
                                  pl-8
                                  text-left
                                  transition
                                  hover:bg-[var(--surface-muted)]
                                "
                              >
                                <span
                                  className="
                                    mt-1.5
                                    h-2
                                    w-2
                                    shrink-0
                                    rounded-full
                                    bg-[#c46b30]
                                  "
                                />

                                <span>
                                  <span className="block text-sm font-medium">
                                    {subLocation.name}
                                  </span>

                                  <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                                    Sublocation
                                  </span>
                                </span>
                              </button>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-[var(--text-muted)]">
                    No locations found.
                  </div>
                )}
              </div>
            )}
        </div>
      )}

      {/* Filters */}
      {showSearch && (
        <div
          className="
            border-b
            border-[var(--border)]
            px-4
            py-4
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter
                className="
                  h-4
                  w-4
                  text-[var(--primary)]
                "
                aria-hidden="true"
              />

              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-[var(--text-muted)]
                "
              >
                Filters
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[11px]
                  text-[var(--text-muted)]
                  transition
                  hover:text-[var(--primary)]
                "
              >
                <RotateCcw
                  className="h-3 w-3"
                  aria-hidden="true"
                />

                Reset
              </button>
            )}
          </div>

          {/* Type filter */}
          <div
            className="
              mt-3
              flex
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              p-1
            "
          >
            {(
              [
                ['all', 'All'],
                ['main', 'Main'],
                ['sub', 'Sub'],
              ] as [
                LocationTypeFilter,
                string,
              ][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  updateFilter(
                    'type',
                    value,
                  )
                }
                className={`
                  flex-1
                  rounded-lg
                  px-2
                  py-2
                  text-[11px]
                  font-medium
                  transition
                  ${
                    filters.type === value
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Region/state filters */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <select
              value={filters.region}
              onChange={(event) =>
                updateFilter(
                  'region',
                  event.target.value,
                )
              }
              aria-label="Filter by region"
              className="
                h-10
                min-w-0
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--background)]
                px-3
                text-xs
                text-[var(--text)]
                outline-none
                focus:border-[var(--primary)]
              "
            >
              <option value="all">
                All regions
              </option>

              {filterRegions.map(
                (region) => (
                  <option
                    key={region}
                    value={region}
                  >
                    {region}
                  </option>
                ),
              )}
            </select>

            <select
              value={filters.state}
              onChange={(event) =>
                updateFilter(
                  'state',
                  event.target.value,
                )
              }
              aria-label="Filter by state"
              className="
                h-10
                min-w-0
                rounded-xl
                border
                border-[var(--border)]
                bg-[var(--background)]
                px-3
                text-xs
                text-[var(--text)]
                outline-none
                focus:border-[var(--primary)]
              "
            >
              <option value="all">
                All states
              </option>

              {filterStates.map(
                (state) => (
                  <option
                    key={state}
                    value={state}
                  >
                    {state}
                  </option>
                ),
              )}
            </select>
          </div>

          <p className="mt-3 text-[11px] text-[var(--text-muted)]">
            Showing{' '}
            <span className="font-semibold text-[var(--text)]">
              {filteredResultCount}
            </span>{' '}
            locations
          </p>
        </div>
      )}

      {/* Tabs */}
      <nav
        className="
          grid
          grid-cols-4
          border-b
          border-[var(--border)]
        "
        aria-label="Journey map sections"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive =
            activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                onTabChange(tab.id)
              }
              aria-pressed={isActive}
              className={`
                flex
                flex-col
                items-center
                gap-1.5
                px-2
                py-3
                text-[10px]
                font-medium
                transition
                ${
                  isActive
                    ? 'bg-[var(--surface-muted)] text-[var(--primary)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]'
                }
              `}
            >
              <Icon
                className="h-4 w-4"
                aria-hidden="true"
              />

              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* Sidebar content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Explore */}
        {activeTab === 'explore' && (
          <div className="p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--primary)]">
              Explore
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Follow the story across India.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
              Explore major locations, discover
              regional sublocations, and move through
              the geographical journey of the Ramayana.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="text-2xl font-semibold">
                  {mainLocations.length}
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Main locations
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="text-2xl font-semibold">
                  {locations.length}
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Locations
                </p>
              </div>
            </div>

            {selectedLocation && (
              <div
                className="
                  mt-6
                  rounded-2xl
                  border
                  border-[var(--primary)]/20
                  bg-[var(--accent-soft)]/40
                  p-4
                "
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--primary)]">
                  Currently viewing
                </p>

                <p className="mt-2 text-lg font-semibold">
                  {selectedLocation.name}
                </p>

                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {selectedLocation.type ===
                  'main'
                    ? 'Main location'
                    : 'Sublocation'}
                  {' · '}
                  {selectedLocation.region}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onReset}
              className="
                mt-6
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--background)]
                px-5
                py-3
                text-sm
                font-medium
                transition
                hover:bg-[var(--surface-muted)]
              "
            >
              <RotateCcw
                className="h-4 w-4"
                aria-hidden="true"
              />

              Reset exploration
            </button>
          </div>
        )}

        {/* Journey */}
        {activeTab === 'journey' && (
          <div className="p-4">
            <div className="mb-5 px-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--primary)]">
                Journey sequence
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Move through the major chapters.
              </h2>
            </div>

            <div className="space-y-2">
              {journeyLocations.map(
                (location, index) => {
                  const isSelected =
                    selectedLocation?.id ===
                    location.id

                  const isExpanded =
                    expandedMainLocationId ===
                    location.id

                  const subLocations =
                    isExpanded
                      ? getSubLocations(
                          locations,
                          location.id,
                        )
                      : []

                  return (
                    <div
                      key={location.id}
                      className="overflow-hidden rounded-2xl"
                    >
                      {/* Main location */}
                      <button
                        type="button"
                        onClick={() =>
                          onSelectLocation(
                            location,
                          )
                        }
                        className={`
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-2xl
                          border
                          p-3
                          text-left
                          transition
                          ${
                            isSelected
                              ? 'border-[var(--primary)]/40 bg-[var(--accent-soft)]/40'
                              : 'border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-muted)]'
                          }
                        `}
                      >
                        <span
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[var(--surface-muted)]
                            text-xs
                            font-semibold
                            text-[var(--primary)]
                          "
                        >
                          {index + 1}
                        </span>

                        <span className="min-w-0">
                          <span className="block text-sm font-medium">
                            {location.name}
                          </span>

                          <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                            {location.region}
                          </span>
                        </span>

                        {isExpanded ? (
                          <ChevronDown
                            className="
                              ml-auto
                              h-4
                              w-4
                              shrink-0
                              text-[var(--primary)]
                            "
                            aria-hidden="true"
                          />
                        ) : (
                          <List
                            className="
                              ml-auto
                              h-4
                              w-4
                              shrink-0
                              text-[var(--text-muted)]
                            "
                            aria-hidden="true"
                          />
                        )}
                      </button>

                      {/* Sublocations */}
                      {subLocations.length > 0 && (
                        <div
                          className="
                            ml-4
                            border-l
                            border-[var(--border)]
                            pl-3
                            pt-1
                          "
                        >
                          {subLocations.map(
                            (subLocation) => {
                              const isSubSelected =
                                selectedLocation?.id ===
                                subLocation.id

                              return (
                                <button
                                  key={
                                    subLocation.id
                                  }
                                  type="button"
                                  onClick={() =>
                                    onSelectLocation(
                                      subLocation,
                                    )
                                  }
                                  className={`
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    px-3
                                    py-2.5
                                    text-left
                                    transition
                                    ${
                                      isSubSelected
                                        ? 'border-[var(--primary)]/30 bg-[var(--surface-muted)]'
                                        : 'border-transparent bg-[var(--background)] hover:border-[var(--border)] hover:bg-[var(--surface-muted)]'
                                    }
                                  `}
                                >
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#c46b30]" />

                                  <span className="min-w-0">
                                    <span className="block text-sm font-medium">
                                      {
                                        subLocation.name
                                      }
                                    </span>

                                    <span className="mt-0.5 block text-[11px] text-[var(--text-muted)]">
                                      Sublocation
                                    </span>
                                  </span>
                                </button>
                              )
                            },
                          )}
                        </div>
                      )}
                    </div>
                  )
                },
              )}
            </div>
          </div>
        )}

        {/* Locations */}
        {activeTab === 'locations' && (
          <div className="p-4">
            <div className="mb-5 px-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--primary)]">
                Find a location
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Search the Ramayana landscape.
              </h2>

              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                Search above or use the filters to narrow
                down the complete location archive.
              </p>
            </div>

            {!searchQuery.trim() &&
            !hasActiveFilters ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] p-6 text-center">
                <Search
                  className="mx-auto h-6 w-6 text-[var(--primary)]"
                  aria-hidden="true"
                />

                <p className="mt-3 text-sm font-medium">
                  Start with a place name
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  Search by location, region, state,
                  or country.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <p className="text-sm font-medium">
                  {filteredResultCount} locations match
                  your current search.
                </p>

                <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                  Select a result from the search field
                  above to move directly to it.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Layers */}
        {activeTab === 'layers' && (
          <div className="p-4">
            <div className="mb-5 px-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--primary)]">
                Map layers
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Shape the map experience.
              </h2>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={onToggleRoute}
                aria-pressed={showRoute}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-[var(--border)]
                  bg-[var(--background)]
                  p-4
                  text-left
                "
              >
                <span className="flex items-center gap-3">
                  <span
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-[var(--surface-muted)]
                    "
                  >
                    <Route
                      className="h-4 w-4 text-[var(--primary)]"
                      aria-hidden="true"
                    />
                  </span>

                  <span>
                    <span className="block text-sm font-medium">
                      Journey route
                    </span>

                    <span className="mt-1 block text-xs text-[var(--text-muted)]">
                      Connect major locations
                    </span>
                  </span>
                </span>

                <span
                  className={`
                    relative
                    h-6
                    w-11
                    rounded-full
                    transition
                    ${
                      showRoute
                        ? 'bg-[var(--primary)]'
                        : 'bg-[var(--surface-muted)]'
                    }
                  `}
                >
                  <span
                    className={`
                      absolute
                      top-1
                      h-4
                      w-4
                      rounded-full
                      bg-white
                      shadow-sm
                      transition
                      ${
                        showRoute
                          ? 'left-6'
                          : 'left-1'
                      }
                    `}
                  />
                </span>
              </button>

              <div className="rounded-2xl border border-dashed border-[var(--border)] p-4">
                <p className="text-xs leading-5 text-[var(--text-muted)]">
                  Regional sublocations appear
                  underneath their selected main
                  location. Filters above can narrow the
                  visible map without destroying the
                  parent-child relationship.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Map status
            </p>

            <p className="mt-1 text-xs font-medium">
              Interactive exploration
            </p>
          </div>

          <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-[10px] font-medium text-[var(--primary)]">
            Beta
          </span>
        </div>
      </div>
    </aside>
  )
}

export default JourneySidebar
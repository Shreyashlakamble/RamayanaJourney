import {
  Compass,
  Home,
  Info,
  MapPinned,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react'
import {
  useMemo,
  useState,
} from 'react'
import { Link } from 'react-router-dom'

import type { Location } from '../../../types/location'
import { useTheme } from '../../../contexts/ThemeContext'

import {
  getMainLocations,
  getSubLocations,
} from '../../locations/utils/locationHelpers'

import JourneyMap from '../JourneyMap'

import JourneySidebar, {
  type JourneySidebarTab,
  type LocationFiltersState,
} from './JourneySidebar'

interface JourneyMapShellProps {
  locations: Location[]
}

interface SearchGroup {
  mainLocation: Location
  subLocations: Location[]
}

function JourneyMapShell({
  locations,
}: JourneyMapShellProps) {
  const { theme, toggleTheme } = useTheme()

  /*
   * Currently selected map location.
   */
  const [
    selectedLocationId,
    setSelectedLocationId,
  ] = useState<string | null>(null)

  /*
   * Search field.
   *
   * The selected location name remains here
   * after selection.
   */
  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  /*
   * Controls search suggestion visibility.
   */
  const [
    searchResultsOpen,
    setSearchResultsOpen,
  ] = useState(false)

  /*
   * Active sidebar section.
   */
  const [activeTab, setActiveTab] =
    useState<JourneySidebarTab>(
      'explore',
    )

  /*
   * Journey route visibility.
   */
  const [showRoute, setShowRoute] =
    useState(true)

  /*
   * Mobile navigation drawer.
   */
  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false)

  /*
   * Explicit map filters.
   *
   * Search is NOT part of this state.
   *
   * Search:
   *   → finds a location
   *
   * Filters:
   *   → change visible markers
   */
  const [filters, setFilters] =
    useState<LocationFiltersState>({
      type: 'all',
      region: 'all',
      state: 'all',
    })

  /*
   * Current selected location object.
   */
  const selectedLocation = useMemo(
    () =>
      locations.find(
        (location) =>
          location.id ===
          selectedLocationId,
      ),
    [
      locations,
      selectedLocationId,
    ],
  )

  /*
   * Main locations.
   */
  const mainLocations = useMemo(
    () => getMainLocations(locations),
    [locations],
  )

  /*
   * Filter options: regions.
   *
   * Explicit type guard removes undefined values
   * from the resulting array.
   */
  const filterRegions = useMemo(
    () =>
      Array.from(
        new Set(
          locations
            .filter(
              (location) =>
                location.active !== false,
            )
            .map(
              (location) =>
                location.region,
            )
            .filter(
              (
                value,
              ): value is string =>
                typeof value ===
                  'string' &&
                value.trim().length > 0,
            ),
        ),
      ).sort((a, b) =>
        a.localeCompare(b),
      ),
    [locations],
  )

  /*
   * Filter options: states.
   *
   * Explicit type guard removes undefined values.
   */
  const filterStates = useMemo(
    () =>
      Array.from(
        new Set(
          locations
            .filter(
              (location) =>
                location.active !== false,
            )
            .map(
              (location) =>
                location.state,
            )
            .filter(
              (
                value,
              ): value is string =>
                typeof value ===
                  'string' &&
                value.trim().length > 0,
            ),
        ),
      ).sort((a, b) =>
        a.localeCompare(b),
      ),
    [locations],
  )

  /*
   * Map-visible locations.
   *
   * IMPORTANT:
   *
   * Search text is deliberately excluded.
   *
   * Explicit filters determine visibility.
   */
  const filteredLocations = useMemo(() => {
    return locations
      .filter(
        (location) =>
          location.active !== false,
      )
      .filter((location) => {
        if (filters.type === 'all') {
          return true
        }

        return (
          location.type ===
          filters.type
        )
      })
      .filter((location) => {
        if (filters.region === 'all') {
          return true
        }

        return (
          String(location.region)
            .trim()
            .toLowerCase() ===
          filters.region
            .trim()
            .toLowerCase()
        )
      })
      .filter((location) => {
        if (filters.state === 'all') {
          return true
        }

        return (
          String(location.state)
            .trim()
            .toLowerCase() ===
          filters.state
            .trim()
            .toLowerCase()
        )
      })
  }, [
    locations,
    filters,
  ])

  /*
   * Whether the user has explicitly changed
   * a map filter.
   */
  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.region !== 'all' ||
    filters.state !== 'all'

  /*
   * Search the COMPLETE dataset.
   *
   * Searching does not hide the rest of the map.
   */
  const searchResults = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase()

    if (!query) {
      return []
    }

    return locations
      .filter(
        (location) =>
          location.active !== false,
      )
      .filter((location) => {
        const searchableText = [
          location.name,
          location.region,
          location.state,
          location.country,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchableText.includes(
          query,
        )
      })
      .slice(0, 20)
  }, [
    locations,
    searchQuery,
  ])

  /*
   * Group search results hierarchically:
   *
   * Chitrakoot
   *   ├── Ramghat
   *   └── Gupt Godavari
   *
   * When searching for a main location,
   * show all of its sublocations.
   *
   * When searching for a sublocation,
   * show only the matching child.
   */
  const searchGroups = useMemo<
    SearchGroup[]
  >(() => {
    if (!searchQuery.trim()) {
      return []
    }

    const resultIds = new Set(
      searchResults.map(
        (location) =>
          location.id,
      ),
    )

    return mainLocations
      .map((mainLocation) => {
        const mainMatches =
          resultIds.has(
            mainLocation.id,
          )

        const children =
          getSubLocations(
            locations,
            mainLocation.id,
          ).filter(
            (location) =>
              location.active !== false,
          )

        const matchingChildren =
          mainMatches
            ? children
            : children.filter(
                (child) =>
                  resultIds.has(
                    child.id,
                  ),
              )

        if (
          !mainMatches &&
          matchingChildren.length === 0
        ) {
          return null
        }

        return {
          mainLocation,
          subLocations:
            matchingChildren,
        }
      })
      .filter(
        (
          group,
        ): group is SearchGroup =>
          group !== null,
      )
  }, [
    locations,
    mainLocations,
    searchQuery,
    searchResults,
  ])

  /*
   * Selecting a location:
   *
   * 1. Save it.
   * 2. Keep the name in search.
   * 3. Close suggestions.
   * 4. Open Journey hierarchy.
   * 5. Clear restrictive filters.
   */
  const handleSelectLocation = (
    location: Location,
  ) => {
    setSelectedLocationId(
      location.id,
    )

    /*
     * Keep selected location in the search box.
     */
    setSearchQuery(
      location.name,
    )

    /*
     * Hide the result popup.
     */
    setSearchResultsOpen(false)

    /*
     * Show the parent-child journey hierarchy.
     */
    setActiveTab('journey')

    /*
     * Clear explicit filters so the newly
     * selected location isn't hidden.
     */
    setFilters({
      type: 'all',
      region: 'all',
      state: 'all',
    })

    /*
     * Close the mobile menu.
     */
    setMobileMenuOpen(false)
  }

  /*
   * Search typing.
   */
  const handleSearchChange = (
    value: string,
  ) => {
    setSearchQuery(value)

    setSearchResultsOpen(
      value.trim().length > 0,
    )
  }

  /*
   * Re-open suggestions when the user
   * focuses the populated search field.
   */
  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setSearchResultsOpen(true)
    }
  }

  /*
   * Apply an explicit map filter.
   *
   * Search state is cleared because the user
   * has switched from "find" mode into
   * "filter" mode.
   */
  const handleFiltersChange = (
    nextFilters: LocationFiltersState,
  ) => {
    setFilters(nextFilters)

    setSelectedLocationId(null)

    setSearchQuery('')

    setSearchResultsOpen(false)

    setActiveTab('explore')
  }

  /*
   * Reset only explicit filters.
   */
  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      region: 'all',
      state: 'all',
    })
  }

  /*
   * Reset the whole map exploration state.
   */
  const handleReset = () => {
    setSelectedLocationId(null)

    setSearchQuery('')

    setSearchResultsOpen(false)

    setFilters({
      type: 'all',
      region: 'all',
      state: 'all',
    })

    setActiveTab('explore')

    setMobileMenuOpen(false)
  }

  return (
    <section
      className="
        relative
        h-[72svh]
        min-h-[520px]
        w-full
        overflow-hidden
        bg-[var(--background)]
        md:mt-20
        md:h-[calc(100svh-5rem)]
        md:min-h-[620px]
      "
    >
      {/* Map */}
      <div className="absolute inset-0">
        <JourneyMap
          locations={
            filteredLocations
          }
          selectedLocation={
            selectedLocation
          }
          onSelectLocation={
            handleSelectLocation
          }
          onClosePanel={
            handleReset
          }
          showRoute={showRoute}
          filteredView={
            hasActiveFilters
          }
        />
      </div>

      {/* Desktop sidebar */}
      <JourneySidebar
        locations={locations}
        selectedLocation={
          selectedLocation
        }
        searchQuery={searchQuery}
        searchResults={
          searchResults
        }
        activeTab={activeTab}
        showRoute={showRoute}
        filters={filters}
        filterRegions={
          filterRegions
        }
        filterStates={
          filterStates
        }
        filteredResultCount={
          filteredLocations.length
        }
        showSearch
        showSearchResults={
          searchResultsOpen
        }
        onSearchChange={
          handleSearchChange
        }
        onSearchFocus={
          handleSearchFocus
        }
        onSelectLocation={
          handleSelectLocation
        }
        onTabChange={
          setActiveTab
        }
        onToggleRoute={() =>
          setShowRoute(
            (current) => !current,
          )
        }
        onReset={handleReset}
        onFiltersChange={
          handleFiltersChange
        }
        onResetFilters={
          handleResetFilters
        }
        className="
          absolute
          bottom-0
          left-0
          top-0
          z-[1200]
          hidden
          md:flex
        "
      />

      {/* Mobile search / theme / menu */}
      <div
        className="
          absolute
          left-3
          right-3
          top-3
          z-[1200]
          md:hidden
        "
      >
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative flex-1">
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
              onFocus={
                handleSearchFocus
              }
              onChange={(event) =>
                handleSearchChange(
                  event.target.value,
                )
              }
              placeholder="Search places..."
              aria-label="Search places"
              className="
                h-12
                w-full
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]/95
                pl-11
                pr-4
                text-sm
                text-[var(--text)]
                shadow-xl
                backdrop-blur-xl
                outline-none
                placeholder:text-[var(--text-muted)]
                focus:border-[var(--primary)]
              "
            />

            {/* Mobile search results */}
            {searchResultsOpen &&
              searchQuery.trim() && (
                <div
                  className="
                    absolute
                    left-0
                    right-0
                    top-14
                    z-[1400]
                    max-h-[320px]
                    overflow-y-auto
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]/98
                    shadow-2xl
                    backdrop-blur-xl
                  "
                >
                  {searchGroups.length > 0 ? (
                    searchGroups.map(
                      (group) => (
                        <div
                          key={
                            group
                              .mainLocation
                              .id
                          }
                          className="
                            border-b
                            border-[var(--border)]
                            last:border-b-0
                          "
                        >
                          {/* Main search result */}
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectLocation(
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

                            <span className="min-w-0">
                              <span className="block text-sm font-medium">
                                {
                                  group
                                    .mainLocation
                                    .name
                                }
                              </span>

                              <span className="mt-0.5 block text-xs text-[var(--text-muted)]">
                                Main location
                                {' · '}
                                {
                                  group
                                    .mainLocation
                                    .region
                                }
                              </span>
                            </span>
                          </button>

                          {/* Sublocations */}
                          {group.subLocations
                            .length > 0 && (
                            <div
                              className="
                                border-t
                                border-[var(--border)]
                                bg-[var(--background)]/60
                              "
                            >
                              {group.subLocations.map(
                                (
                                  subLocation,
                                ) => (
                                  <button
                                    key={
                                      subLocation.id
                                    }
                                    type="button"
                                    onClick={() =>
                                      handleSelectLocation(
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

                                    <span className="min-w-0">
                                      <span className="block text-sm font-medium">
                                        {
                                          subLocation.name
                                        }
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
                      ),
                    )
                  ) : (
                    <div className="p-4 text-sm text-[var(--text-muted)]">
                      No locations found.
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'light'
                ? 'Switch to dark mode'
                : 'Switch to light mode'
            }
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              bg-[var(--surface)]/95
              text-[var(--text)]
              shadow-xl
              backdrop-blur-xl
              transition
              hover:scale-105
            "
          >
            {theme === 'light' ? (
              <Moon
                className="h-5 w-5"
                aria-hidden="true"
              />
            ) : (
              <Sun
                className="h-5 w-5"
                aria-hidden="true"
              />
            )}
          </button>

          {/* Mobile menu */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (current) => !current,
              )
            }
            aria-label={
              mobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              bg-[var(--surface)]/95
              text-[var(--text)]
              shadow-xl
              backdrop-blur-xl
              transition
              hover:scale-105
            "
          >
            {mobileMenuOpen ? (
              <X
                className="h-5 w-5"
                aria-hidden="true"
              />
            ) : (
              <Menu
                className="h-5 w-5"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div
          className="
            fixed
            inset-0
            z-[1300]
            md:hidden
          "
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() =>
              setMobileMenuOpen(false)
            }
            className="
              absolute
              inset-0
              bg-black/40
              backdrop-blur-[2px]
            "
          />

          {/* Drawer */}
          <div
            className="
              absolute
              bottom-0
              left-0
              top-0
              flex
              w-[min(92vw,400px)]
              flex-col
              overflow-hidden
              bg-[var(--surface)]
              text-[var(--text)]
              shadow-2xl
            "
          >
            {/* Site navigation */}
            <div className="border-b border-[var(--border)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
                    Site navigation
                  </p>

                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Explore Ramayana Journey
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(
                      false,
                    )
                  }
                  aria-label="Close navigation"
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
                  "
                >
                  <X
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </button>
              </div>

              <nav className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  to="/"
                  onClick={() =>
                    setMobileMenuOpen(
                      false,
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--background)]
                    px-3
                    py-3
                    text-sm
                    font-medium
                  "
                >
                  <Home
                    className="h-4 w-4 text-[var(--primary)]"
                    aria-hidden="true"
                  />

                  Home
                </Link>

                <Link
                  to="/journey"
                  onClick={() =>
                    setMobileMenuOpen(
                      false,
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[var(--primary)]/30
                    bg-[var(--accent-soft)]/30
                    px-3
                    py-3
                    text-sm
                    font-medium
                  "
                >
                  <Compass
                    className="h-4 w-4 text-[var(--primary)]"
                    aria-hidden="true"
                  />

                  Journey
                </Link>

                <Link
                  to="/locations"
                  onClick={() =>
                    setMobileMenuOpen(
                      false,
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--background)]
                    px-3
                    py-3
                    text-sm
                    font-medium
                  "
                >
                  <MapPinned
                    className="h-4 w-4 text-[var(--primary)]"
                    aria-hidden="true"
                  />

                  Locations
                </Link>

                <Link
                  to="/about"
                  onClick={() =>
                    setMobileMenuOpen(
                      false,
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[var(--border)]
                    bg-[var(--background)]
                    px-3
                    py-3
                    text-sm
                    font-medium
                  "
                >
                  <Info
                    className="h-4 w-4 text-[var(--primary)]"
                    aria-hidden="true"
                  />

                  About
                </Link>
              </nav>
            </div>

            {/* Map tools */}
            <div className="min-h-0 flex-1">
              <JourneySidebar
                locations={locations}
                selectedLocation={
                  selectedLocation
                }
                searchQuery={
                  searchQuery
                }
                searchResults={
                  searchResults
                }
                activeTab={
                  activeTab
                }
                showRoute={
                  showRoute
                }
                filters={filters}
                filterRegions={
                  filterRegions
                }
                filterStates={
                  filterStates
                }
                filteredResultCount={
                  filteredLocations.length
                }
                /*
                 * Mobile top bar already owns search,
                 * so don't render duplicate search here.
                 */
                showSearch={false}
                showSearchResults={
                  false
                }
                onSearchChange={
                  handleSearchChange
                }
                onSearchFocus={
                  handleSearchFocus
                }
                onSelectLocation={
                  handleSelectLocation
                }
                onTabChange={
                  setActiveTab
                }
                onToggleRoute={() =>
                  setShowRoute(
                    (current) =>
                      !current,
                  )
                }
                onReset={
                  handleReset
                }
                onFiltersChange={
                  handleFiltersChange
                }
                onResetFilters={
                  handleResetFilters
                }
                onCloseMobile={() =>
                  setMobileMenuOpen(
                    false,
                  )
                }
                className="
                  w-full
                  border-r-0
                  shadow-none
                "
              />
            </div>

            {/* Theme */}
            <div className="border-t border-[var(--border)] p-4">
              <button
                type="button"
                onClick={toggleTheme}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-[var(--border)]
                  bg-[var(--background)]
                  px-4
                  py-3
                  text-sm
                "
              >
                <span className="flex items-center gap-3">
                  {theme === 'light' ? (
                    <Moon
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  ) : (
                    <Sun
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  )}

                  {theme === 'light'
                    ? 'Dark mode'
                    : 'Light mode'}
                </span>

                <span className="text-xs text-[var(--text-muted)]">
                  Toggle
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default JourneyMapShell
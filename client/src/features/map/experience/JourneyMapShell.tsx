import {
  Compass,
  Filter,
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
} from '../../locations/utils/locationHelpers'

import JourneyMap from '../JourneyMap'

import JourneySidebar, {
  type JourneySidebarTab,
  type LocationFiltersState,
} from './JourneySidebar'

import MobileFilterSheet from './MobileFilterSheet'

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

  const [
    selectedLocationId,
    setSelectedLocationId,
  ] = useState<string | null>(null)

  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  const [
    searchResultsOpen,
    setSearchResultsOpen,
  ] = useState(false)

  const [activeTab, setActiveTab] =
    useState<JourneySidebarTab>(
      'explore',
    )

  const [showRoute, setShowRoute] =
    useState(true)

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false)

  const [
    mobileFilterOpen,
    setMobileFilterOpen,
  ] = useState(false)

  const [filters, setFilters] =
    useState<LocationFiltersState>({
      type: 'all',
      region: 'all',
      state: 'all',
    })

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

  const mainLocations = useMemo(
    () =>
      getMainLocations(
        locations,
      ),
    [locations],
  )

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
   * Explicit map filtering.
   *
   * Search query is intentionally excluded.
   */
  const filteredLocations = useMemo(
    () =>
      locations
        .filter(
          (location) =>
            location.active !== false,
        )
        .filter((location) => {
          if (
            filters.type ===
            'all'
          ) {
            return true
          }

          return (
            location.type ===
            filters.type
          )
        })
        .filter((location) => {
          if (
            filters.region ===
            'all'
          ) {
            return true
          }

          return (
            String(
              location.region,
            )
              .trim()
              .toLowerCase() ===
            filters.region
              .trim()
              .toLowerCase()
          )
        })
        .filter((location) => {
          if (
            filters.state ===
            'all'
          ) {
            return true
          }

          return (
            String(
              location.state,
            )
              .trim()
              .toLowerCase() ===
            filters.state
              .trim()
              .toLowerCase()
          )
        }),
    [locations, filters],
  )

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.region !== 'all' ||
    filters.state !== 'all'

  /*
   * Search complete dataset.
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
   * Hierarchical search results.
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

        const children = locations
          .filter(
            (location) =>
              location.type ===
                'sub' &&
              location.parentId ===
                mainLocation.id &&
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
          matchingChildren.length ===
            0
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
   * Select a location.
   */
  const handleSelectLocation = (
    location: Location,
  ) => {
    setSelectedLocationId(
      location.id,
    )

    /*
     * Keep selected location name
     * in search.
     */
    setSearchQuery(
      location.name,
    )

    /*
     * Close suggestions.
     */
    setSearchResultsOpen(false)

    /*
     * Show hierarchy.
     */
    setActiveTab('journey')

    /*
     * Remove filters so the selected
     * location is visible.
     */
    setFilters({
      type: 'all',
      region: 'all',
      state: 'all',
    })

    setMobileMenuOpen(false)
  }

  const handleSearchChange = (
    value: string,
  ) => {
    setSearchQuery(value)

    setSearchResultsOpen(
      value.trim().length > 0,
    )
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setSearchResultsOpen(true)
    }
  }

  /*
   * Apply filters.
   */
  const handleFiltersChange = (
    nextFilters: LocationFiltersState,
  ) => {
    setFilters(nextFilters)

    /*
     * A filter is a new map exploration state.
     */
    setSelectedLocationId(null)

    setSearchQuery('')

    setSearchResultsOpen(false)

    setActiveTab('explore')

    setMobileFilterOpen(false)
  }

  const handleResetFilters = () => {
    setFilters({
      type: 'all',
      region: 'all',
      state: 'all',
    })

    setSelectedLocationId(null)

    setSearchQuery('')

    setSearchResultsOpen(false)
  }

  /*
   * Full reset.
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

    setMobileFilterOpen(false)
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
        searchQuery={
          searchQuery
        }
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
        onReset={
          handleReset
        }
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

      {/* Mobile top controls */}
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
              value={
                searchQuery
              }
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

            {/* Search results */}
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
                  {searchGroups.length >
                  0 ? (
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

                          {group.subLocations
                            .length >
                            0 && (
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

          {/* Mobile filter button */}
          <button
            type="button"
            onClick={() =>
              setMobileFilterOpen(
                true,
              )
            }
            aria-label="Open location filters"
            className={`
              relative
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              bg-[var(--surface)]/95
              text-[var(--text)]
              shadow-xl
              backdrop-blur-xl
              transition
              ${
                hasActiveFilters
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-[var(--border)]'
              }
            `}
          >
            <Filter
              className="h-5 w-5"
              aria-hidden="true"
            />

            {hasActiveFilters && (
              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  flex
                  h-4
                  min-w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-[var(--primary)]
                  px-1
                  text-[9px]
                  font-bold
                  text-white
                "
              >
                1
              </span>
            )}
          </button>

          {/* Theme */}
          <button
            type="button"
            onClick={
              toggleTheme
            }
            aria-label={
              theme ===
              'light'
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

          {/* Menu */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (current) =>
                  !current,
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
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() =>
              setMobileMenuOpen(
                false,
              )
            }
            className="
              absolute
              inset-0
              bg-black/40
              backdrop-blur-[2px]
            "
          />

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
                filters={
                  filters
                }
                filterRegions={
                  filterRegions
                }
                filterStates={
                  filterStates
                }
                filteredResultCount={
                  filteredLocations.length
                }
                showSearch={
                  false
                }
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
                onClick={
                  toggleTheme
                }
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
                  {theme ===
                  'light' ? (
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

                  {theme ===
                  'light'
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

      {/* Mobile filter sheet */}
      <MobileFilterSheet
        open={
          mobileFilterOpen
        }
        filters={
          filters
        }
        regions={
          filterRegions
        }
        states={
          filterStates
        }
        resultCount={
          filteredLocations.length
        }
        onClose={() =>
          setMobileFilterOpen(
            false,
          )
        }
        onApply={
          handleFiltersChange
        }
        onReset={
          handleResetFilters
        }
      />
    </section>
  )
}

export default JourneyMapShell
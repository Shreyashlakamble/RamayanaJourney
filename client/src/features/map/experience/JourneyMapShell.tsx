import {
  Compass,
  Home,
  Info,
  MapPinned,
  Menu,
  Moon,
  Move,
  Search,
  Sun,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
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

  const [
    selectedLocationId,
    setSelectedLocationId,
  ] = useState<string | null>(null)

  /*
   * Keep the selected location name visible
   * in the search input.
   */
  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')

  /*
   * Controls whether search suggestions are visible.
   *
   * Selection:
   *   → keep selected name
   *   → close suggestions
   */
  const [
    searchResultsOpen,
    setSearchResultsOpen,
  ] = useState(false)

  const [activeTab, setActiveTab] =
    useState<JourneySidebarTab>('explore')

  const [showRoute, setShowRoute] =
    useState(true)

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false)

  const [
    mobileMapInteractive,
    setMobileMapInteractive,
  ] = useState(false)

  const selectedLocation = useMemo(
    () =>
      locations.find(
        (location) =>
          location.id === selectedLocationId,
      ),
    [locations, selectedLocationId],
  )

  const mainLocations = useMemo(
    () => getMainLocations(locations),
    [locations],
  )

  const searchResults = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase()

    if (!query) {
      return []
    }

    return locations
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

        return searchableText.includes(query)
      })
      .slice(0, 12)
  }, [locations, searchQuery])

  /*
   * Mobile search groups.
   */
  const searchGroups = useMemo<SearchGroup[]>(
    () => {
      if (!searchQuery.trim()) {
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

  /*
   * Select a location.
   *
   * Important UX:
   *
   * Search box:
   *   Chitrakoot
   *
   * Search popup:
   *   closed
   *
   * Journey list:
   *   Chitrakoot expanded
   */
  const handleSelectLocation = (
    location: Location,
  ) => {
    setSelectedLocationId(location.id)

    /*
     * Keep selected location text in search.
     */
    setSearchQuery(location.name)

    /*
     * Close search suggestions.
     */
    setSearchResultsOpen(false)

    /*
     * Automatically switch the desktop
     * hierarchy to Journey mode.
     *
     * This is what gives:
     *
     * Chitrakoot
     *   ├─ Ramghat
     *   └─ Gupt Godavari
     */
    setActiveTab('journey')

    /*
     * Close mobile map drawer.
     */
    setMobileMenuOpen(false)
  }

  const handleReset = () => {
    setSelectedLocationId(null)
    setSearchQuery('')
    setSearchResultsOpen(false)
    setActiveTab('explore')
    setMobileMenuOpen(false)
  }

  const handleSearchChange = (
    value: string,
  ) => {
    setSearchQuery(value)
    setSearchResultsOpen(true)
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim()) {
      setSearchResultsOpen(true)
    }
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
          locations={locations}
          selectedLocation={selectedLocation}
          onSelectLocation={
            handleSelectLocation
          }
          onClosePanel={handleReset}
          showRoute={showRoute}
          mobileInteractionEnabled={
            mobileMapInteractive
          }
        />
      </div>

      {/* Desktop sidebar */}
      <JourneySidebar
        locations={locations}
        selectedLocation={selectedLocation}
        searchQuery={searchQuery}
        searchResults={searchResults}
        activeTab={activeTab}
        showRoute={showRoute}
        showSearch
        showSearchResults={
          searchResultsOpen
        }
        onSearchChange={handleSearchChange}
        onSearchFocus={handleSearchFocus}
        onSelectLocation={
          handleSelectLocation
        }
        onTabChange={setActiveTab}
        onToggleRoute={() =>
          setShowRoute((current) => !current)
        }
        onReset={handleReset}
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
              value={searchQuery}
              onFocus={handleSearchFocus}
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
                            group.mainLocation.id
                          }
                          className="
                            border-b
                            border-[var(--border)]
                            last:border-b-0
                          "
                        >
                          {/* Main */}
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

                            <span>
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

                                    <span>
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

          {/* Map / site menu */}
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

      {/* Mobile map gesture button */}
      <button
        type="button"
        onClick={() =>
          setMobileMapInteractive(
            (current) => !current,
          )
        }
        aria-pressed={mobileMapInteractive}
        className={`
          absolute
          right-3
          top-20
          z-[1200]
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          px-4
          py-2.5
          text-xs
          font-medium
          shadow-xl
          backdrop-blur-xl
          transition
          md:hidden
          ${
            mobileMapInteractive
              ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
              : 'border-[var(--border)] bg-[var(--surface)]/95 text-[var(--text)]'
          }
        `}
      >
        <Move
          className="h-4 w-4"
          aria-hidden="true"
        />

        {mobileMapInteractive
          ? 'Map gestures on'
          : 'Move map'}
      </button>

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
                    setMobileMenuOpen(false)
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
                    setMobileMenuOpen(false)
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
                    hover:bg-[var(--surface-muted)]
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
                    setMobileMenuOpen(false)
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
                    setMobileMenuOpen(false)
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
                    hover:bg-[var(--surface-muted)]
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
                    setMobileMenuOpen(false)
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
                    hover:bg-[var(--surface-muted)]
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
                searchQuery={searchQuery}
                searchResults={searchResults}
                activeTab={activeTab}
                showRoute={showRoute}
                showSearch={false}
                showSearchResults={false}
                onSearchChange={
                  handleSearchChange
                }
                onSearchFocus={
                  handleSearchFocus
                }
                onSelectLocation={
                  handleSelectLocation
                }
                onTabChange={setActiveTab}
                onToggleRoute={() =>
                  setShowRoute(
                    (current) => !current,
                  )
                }
                onReset={handleReset}
                onCloseMobile={() =>
                  setMobileMenuOpen(false)
                }
                className="
                  w-full
                  border-r-0
                  shadow-none
                "
              />
            </div>

            {/* Mobile drawer footer */}
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
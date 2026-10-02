import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import JourneyMapShell from '../features/map/experience/JourneyMapShell'
import {
  getMainLocations,
  getSubLocations,
} from '../features/locations/utils/locationHelpers'
import { sampleLocations } from '../features/locations/data/sampleLocations'

function JourneyPage() {
  const [mobileSearch, setMobileSearch] =
    useState('')

  const mainLocations = useMemo(
    () =>
      getMainLocations(
        sampleLocations,
      ).sort(
        (a, b) =>
          (a.timelineOrder ?? 999) -
          (b.timelineOrder ?? 999),
      ),
    [],
  )

  const mobileSearchGroups = useMemo(() => {
    const query = mobileSearch
      .trim()
      .toLowerCase()

    if (!query) {
      return []
    }

    return mainLocations
      .map((mainLocation) => {
        const mainSearchText = [
          mainLocation.name,
          mainLocation.region,
          mainLocation.state,
          mainLocation.country,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        const mainMatches =
          mainSearchText.includes(query)

        const subLocations =
          getSubLocations(
            sampleLocations,
            mainLocation.id,
          )

        const matchingSubLocations =
          subLocations.filter(
            (location) => {
              const text = [
                location.name,
                location.region,
                location.state,
                location.country,
              ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

              return text.includes(query)
            },
          )

        if (
          !mainMatches &&
          matchingSubLocations.length === 0
        ) {
          return null
        }

        return {
          mainLocation,
          subLocations: mainMatches
            ? subLocations
            : matchingSubLocations,
        }
      })
      .filter(
        (
          group,
        ): group is {
          mainLocation: typeof mainLocations[number]
          subLocations: typeof mainLocations
        } => group !== null,
      )
  }, [mainLocations, mobileSearch])

  return (
    <div className="bg-[var(--background)]">
      {/* Interactive map */}
      <JourneyMapShell
        locations={sampleLocations}
      />

      {/* Desktop journey explorer */}
      <section
        className="
          hidden
          border-t
          border-[var(--border)]
          bg-[var(--background)]
          px-6
          py-20
          lg:block
          lg:px-8
          lg:py-28
        "
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
              Continue the journey
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text)] md:text-5xl">
              Explore the major chapters.
            </h1>

            <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">
              Move through the important landscapes of
              the Ramayana, then open individual locations
              to discover their stories and photographs.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mainLocations.map(
              (location, index) => (
                <Link
                  key={location.id}
                  to={`/locations/${location.slug}`}
                  className="
                    group
                    rounded-3xl
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-6
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="
                        flex
                        h-9
                        w-9
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
                  </div>

                  <h2 className="mt-6 text-xl font-semibold text-[var(--text)]">
                    {location.name}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {location.region}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">
                    {location.shortDescription}
                  </p>

                  <span className="mt-6 inline-flex text-sm font-medium text-[var(--primary)]">
                    Explore location
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Mobile search-first explorer */}
      <section
        className="
          border-t
          border-[var(--border)]
          bg-[var(--background)]
          px-4
          py-12
          sm:px-6
          md:hidden
        "
      >
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
            Find a place
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)]">
            Continue the journey.
          </h2>

          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            Search the Ramayana landscape instead of
            scrolling through a long list of locations.
          </p>

          {/* Mobile search */}
          <div className="relative mt-6">
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
              value={mobileSearch}
              onChange={(event) =>
                setMobileSearch(
                  event.target.value,
                )
              }
              placeholder="Search locations..."
              aria-label="Search locations"
              className="
                h-12
                w-full
                rounded-full
                border
                border-[var(--border)]
                bg-[var(--surface)]
                pl-11
                pr-4
                text-sm
                text-[var(--text)]
                outline-none
                placeholder:text-[var(--text-muted)]
                focus:border-[var(--primary)]
                focus:ring-2
                focus:ring-[var(--primary)]/10
              "
            />
          </div>

          {/* Search results */}
          {mobileSearch.trim() && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              {mobileSearchGroups.length > 0 ? (
                mobileSearchGroups.map(
                  (group) => (
                    <div
                      key={
                        group.mainLocation.id
                      }
                      className="border-b border-[var(--border)] last:border-b-0"
                    >
                      {/* Main */}
                      <Link
                        to={`/locations/${group.mainLocation.slug}`}
                        className="
                          block
                          px-4
                          py-3.5
                          hover:bg-[var(--surface-muted)]
                        "
                      >
                        <p className="text-sm font-semibold">
                          {group.mainLocation.name}
                        </p>

                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                          Main location
                          {' · '}
                          {group.mainLocation.region}
                        </p>
                      </Link>

                      {/* Sublocations */}
                      {group.subLocations.length >
                        0 && (
                        <div className="border-t border-[var(--border)] bg-[var(--background)]/50">
                          {group.subLocations.map(
                            (
                              subLocation,
                            ) => (
                              <Link
                                key={
                                  subLocation.id
                                }
                                to={`/locations/${subLocation.slug}`}
                                className="
                                  flex
                                  items-center
                                  gap-3
                                  border-b
                                  border-[var(--border)]
                                  px-4
                                  py-3
                                  pl-9
                                  last:border-b-0
                                  hover:bg-[var(--surface-muted)]
                                "
                              >
                                <span className="h-2 w-2 rounded-full bg-[#c46b30]" />

                                <div>
                                  <p className="text-sm font-medium">
                                    {
                                      subLocation.name
                                    }
                                  </p>

                                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                    Sublocation
                                  </p>
                                </div>
                              </Link>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  ),
                )
              ) : (
                <div className="p-5 text-center text-sm text-[var(--text-muted)]">
                  No locations found.
                </div>
              )}
            </div>
          )}

          {!mobileSearch.trim() && (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center">
              <Search
                className="mx-auto h-5 w-5 text-[var(--primary)]"
                aria-hidden="true"
              />

              <p className="mt-3 text-sm font-medium">
                Search for a location
              </p>

              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                Try Chitrakoot, Ramghat, Ayodhya,
                or any future location.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default JourneyPage
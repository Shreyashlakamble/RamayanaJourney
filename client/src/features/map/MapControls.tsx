import { Search, RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import type { Location } from '../../types/location'
import { getMainLocations } from '../locations/utils/locationHelpers'

interface MapControlsProps {
  locations: Location[]
  searchQuery: string
  selectedLocation: Location | undefined
  onSearchChange: (value: string) => void
  onSelectLocation: (location: Location) => void
  onReset: () => void
}

function MapControls({
  locations,
  searchQuery,
  selectedLocation,
  onSearchChange,
  onSelectLocation,
  onReset,
}: MapControlsProps) {
  const mainLocations = useMemo(
    () => getMainLocations(locations),
    [locations],
  )

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

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
      .slice(0, 7)
  }, [locations, searchQuery])

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--primary)]">
          Interactive map
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            {mainLocations.length} main locations
          </p>

          <span className="h-1 w-1 rounded-full bg-[var(--border)]" />

          <p className="text-sm text-[var(--text-muted)]">
            {locations.length} locations in dataset
          </p>

          {selectedLocation && (
            <>
              <span className="h-1 w-1 rounded-full bg-[var(--border)]" />

              <p className="text-sm font-medium text-[var(--text)]">
                Viewing: {selectedLocation.name}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="relative w-full lg:max-w-md">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]"
              aria-hidden="true"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search a location..."
              aria-label="Search locations"
              className="
                h-12 w-full rounded-full
                border border-[var(--border)]
                bg-[var(--surface)]
                pl-11 pr-4
                text-sm text-[var(--text)]
                outline-none
                transition
                placeholder:text-[var(--text-muted)]
                focus:border-[var(--primary)]
                focus:ring-2
                focus:ring-[var(--primary)]/10
              "
            />
          </div>

          <button
            type="button"
            onClick={onReset}
            aria-label="Reset map"
            title="Reset map"
            className="
              flex h-12 w-12 shrink-0 items-center justify-center
              rounded-full
              border border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-muted)]
              transition
              hover:bg-[var(--surface-muted)]
              hover:text-[var(--text)]
            "
          >
            <RotateCcw
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>

        {searchResults.length > 0 && (
          <div
            className="
              absolute left-0 right-14 top-14 z-[1100]
              overflow-hidden rounded-2xl
              border border-[var(--border)]
              bg-[var(--surface)]
              shadow-xl
            "
          >
            {searchResults.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => {
                  onSelectLocation(location)
                  onSearchChange(location.name)
                }}
                className="
                  flex w-full items-start gap-3
                  border-b border-[var(--border)]
                  px-4 py-3 text-left
                  last:border-b-0
                  hover:bg-[var(--surface-muted)]
                "
              >
                <span
                  className={`
                    mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full
                    ${
                      location.type === 'main'
                        ? 'bg-[#e9c27b] ring-2 ring-[#c49345]/30'
                        : 'bg-[#c46b30]'
                    }
                  `}
                />

                <span className="min-w-0">
                  <span className="block text-sm font-medium text-[var(--text)]">
                    {location.name}
                  </span>

                  <span className="mt-0.5 block truncate text-xs text-[var(--text-muted)]">
                    {location.type === 'sub'
                      ? 'Sublocation'
                      : 'Main location'}
                    {' · '}
                    {location.region}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}

        {searchQuery.trim() &&
          searchResults.length === 0 && (
            <div
              className="
                absolute left-0 right-14 top-14 z-[1100]
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--surface)]
                p-4 shadow-xl
              "
            >
              <p className="text-sm text-[var(--text-muted)]">
                No locations found.
              </p>
            </div>
          )}
      </div>
    </div>
  )
}

export default MapControls
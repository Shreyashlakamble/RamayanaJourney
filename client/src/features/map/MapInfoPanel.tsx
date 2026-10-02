import { Link } from 'react-router-dom'
import type { Location } from '../../types/location'

interface MapInfoPanelProps {
  location: Location | undefined
  subLocations: Location[]
  onClose: () => void
}

function MapInfoPanel({
  location,
  subLocations,
  onClose,
}: MapInfoPanelProps) {
  if (!location) {
    return null
  }

  const visibleSubLocations =
    subLocations.slice(0, 4)

  const remainingSubLocations =
    Math.max(
      subLocations.length -
        visibleSubLocations.length,
      0,
    )

  return (
    <aside
      className="
        absolute
        bottom-3
        left-3
        right-3
        z-[1000]
        overflow-hidden
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--surface)]/97
        text-[var(--text)]
        shadow-2xl
        backdrop-blur-xl

        md:bottom-auto
        md:left-auto
        md:right-4
        md:top-4
        md:w-[380px]
        md:max-h-[calc(100%-2rem)]
        md:overflow-y-auto
      "
    >
      {/* Mobile drag handle */}
      <div className="flex justify-center pt-2.5 md:hidden">
        <div
          className="
            h-1
            w-10
            rounded-full
            bg-[var(--border)]
          "
        />
      </div>

      {/* Header */}
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
          border-b
          border-[var(--border)]
          px-4
          py-3.5
          sm:px-5
          sm:py-4
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[var(--primary)]
            "
          >
            {location.type === 'main'
              ? 'Main location'
              : 'Sublocation'}
          </p>

          <h2
            className="
              mt-1
              text-lg
              font-semibold
              sm:text-xl
            "
          >
            {location.name}
          </h2>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-[var(--text-muted)]
              sm:text-sm
            "
          >
            {location.region}
            {location.state
              ? ` · ${location.state}`
              : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close location details"
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            text-[var(--text-muted)]
            transition-colors
            hover:bg-[var(--surface-muted)]
            hover:text-[var(--text)]
          "
        >
          ×
        </button>
      </div>

      {/* Compact content */}
      <div className="px-4 pb-4 pt-3.5 sm:p-5">
        <p
          className="
            text-sm
            leading-5
            text-[var(--text-muted)]
            sm:leading-6
          "
        >
          {location.shortDescription}
        </p>

        {/* Sublocations directly under main location */}
        {location.type === 'main' &&
          visibleSubLocations.length > 0 && (
            <div className="mt-3.5">
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-[var(--text-muted)]
                "
              >
                Explore this region
              </p>

              <div
                className="
                  mt-2.5
                  grid
                  grid-cols-2
                  gap-2
                "
              >
                {visibleSubLocations.map(
                  (subLocation) => (
                    <Link
                      key={subLocation.id}
                      to={`/locations/${subLocation.slug}`}
                      className="
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--background)]
                        px-3
                        py-2.5
                        transition-colors
                        hover:bg-[var(--surface-muted)]
                      "
                    >
                      <span className="block text-sm font-medium">
                        {subLocation.name}
                      </span>

                      <span className="mt-0.5 block text-[11px] text-[var(--text-muted)]">
                        Sublocation
                      </span>
                    </Link>
                  ),
                )}
              </div>

              {remainingSubLocations > 0 && (
                <p className="mt-2 text-[11px] text-[var(--text-muted)]">
                  + {remainingSubLocations}{' '}
                  more places available on the full
                  location page.
                </p>
              )}
            </div>
          )}

        {/* Main action stays immediately accessible */}
        <Link
          to={`/locations/${location.slug}`}
          className="
            mt-3.5
            inline-flex
            w-full
            items-center
            justify-center
            rounded-full
            bg-[var(--primary)]
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition-colors
            hover:bg-[var(--primary-dark)]
          "
        >
          View Location
        </Link>
      </div>
    </aside>
  )
}

export default MapInfoPanel
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

  return (
    <aside
      className="
        absolute
        inset-x-3
        bottom-3
        z-[1000]
        max-h-[58%]
        overflow-y-auto
        rounded-2xl
        border border-[var(--border)]
        bg-[var(--surface)]/95
        text-[var(--text)]
        shadow-2xl
        backdrop-blur-xl

        md:inset-x-auto
        md:bottom-auto
        md:right-4
        md:top-4
        md:w-[360px]
        md:max-h-[calc(100%-2rem)]
      "
    >
      {/* Mobile drag indicator */}
      <div className="flex justify-center pt-3 md:hidden">
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
          p-4
          sm:p-5
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

      {/* Content */}
      <div className="p-4 sm:p-5">
        <p
          className="
            text-sm
            leading-6
            text-[var(--text-muted)]
          "
        >
          {location.shortDescription}
        </p>

        {location.type === 'main' &&
          subLocations.length > 0 && (
            <div className="mt-4 sm:mt-5">
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

              <div className="mt-3 space-y-2">
                {subLocations.map(
                  (subLocation) => (
                    <Link
                      key={subLocation.id}
                      to={`/locations/${subLocation.slug}`}
                      className="
                        block
                        rounded-xl
                        border
                        border-[var(--border)]
                        bg-[var(--background)]
                        px-4
                        py-3
                        transition-colors
                        hover:bg-[var(--surface-muted)]
                      "
                    >
                      <span className="block text-sm font-medium">
                        {subLocation.name}
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          text-xs
                          leading-5
                          text-[var(--text-muted)]
                        "
                      >
                        {subLocation.shortDescription}
                      </span>
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}

        <Link
          to={`/locations/${location.slug}`}
          className="
            mt-4
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
            sm:mt-5
          "
        >
          View Location
        </Link>
      </div>
    </aside>
  )
}

export default MapInfoPanel
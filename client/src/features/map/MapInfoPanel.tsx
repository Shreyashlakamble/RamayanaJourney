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
        absolute right-4 top-4 z-[1000]
        w-[min(360px,calc(100%-2rem))]
        overflow-hidden
        rounded-2xl
        border border-[var(--border)]
        bg-[var(--surface)]
        text-[var(--text)]
        shadow-2xl
      "
    >
      <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--primary)]">
            {location.type === 'main'
              ? 'Main location'
              : 'Sublocation'}
          </p>

          <h2 className="mt-1 text-xl font-semibold">
            {location.name}
          </h2>

          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {location.region}
            {location.state ? ` · ${location.state}` : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close location details"
          className="
            flex h-8 w-8 shrink-0 items-center justify-center
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

      <div className="p-5">
        <p className="text-sm leading-6 text-[var(--text-muted)]">
          {location.shortDescription}
        </p>

        {location.type === 'main' && subLocations.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Explore this region
            </p>

            <div className="mt-3 space-y-2">
              {subLocations.map((subLocation) => (
                <Link
                  key={subLocation.id}
                  to={`/locations/${subLocation.slug}`}
                  className="
                    block rounded-xl
                    border border-[var(--border)]
                    bg-[var(--background)]
                    px-4 py-3
                    transition-colors
                    hover:bg-[var(--surface-muted)]
                  "
                >
                  <span className="text-sm font-medium">
                    {subLocation.name}
                  </span>

                  <span className="mt-1 block text-xs text-[var(--text-muted)]">
                    {subLocation.shortDescription}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          to={`/locations/${location.slug}`}
          className="
            mt-5 inline-flex w-full
            items-center justify-center
            rounded-full
            bg-[var(--primary)]
            px-5 py-3
            text-sm font-medium text-white
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
import Gallery from '../features/gallery/Gallery'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react'

import { sampleLocations } from '../features/locations/data/sampleLocations'
import {
  getParentLocation,
  getSubLocations,
} from '../features/locations/utils/locationHelpers'
import OptimizedImage from '../components/media/OptimizedImage'

function LocationPage() {
  const { slug } = useParams<{ slug: string }>()

  const location = sampleLocations.find(
    (item) => item.slug === slug,
  )

  if (!location) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--primary)]">
            Location not found
          </p>

          <h1 className="mt-4 text-4xl font-semibold text-[var(--text)]">
            We could not find this location.
          </h1>

          <Link
            to="/locations"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-medium text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to locations
          </Link>
        </div>
      </section>
    )
  }

  const parentLocation = getParentLocation(
    sampleLocations,
    location,
  )

  const subLocations =
    location.type === 'main'
      ? getSubLocations(
          sampleLocations,
          location.id,
        )
      : []

  const heroImage = location.heroImage

  return (
    <article className="bg-[var(--background)] text-[var(--text)]">
      {/* Hero */}
      <section className="relative min-h-[75vh] overflow-hidden bg-[var(--surface-muted)]">
        {heroImage ? (
          <OptimizedImage
            src={heroImage}
            alt={location.name}
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            className="
              absolute inset-0
              bg-[radial-gradient(circle_at_50%_30%,rgba(196,147,69,0.22),transparent_32%),linear-gradient(135deg,var(--surface-muted),var(--hero-end))]
            "
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

        <div className="relative mx-auto flex min-h-[75vh] max-w-7xl items-end px-6 pb-16 pt-36 lg:px-8">
          <div className="max-w-4xl text-white">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <Link
                to="/journey"
                className="transition hover:text-white"
              >
                Journey
              </Link>

              <span>/</span>

              {parentLocation && (
                <>
                  <Link
                    to={`/locations/${parentLocation.slug}`}
                    className="transition hover:text-white"
                  >
                    {parentLocation.name}
                  </Link>

                  <span>/</span>
                </>
              )}

              <span>{location.name}</span>
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#e9c27b]">
              {location.type === 'main'
                ? 'Main location'
                : 'Sublocation'}
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] sm:text-6xl md:text-7xl">
              {location.name}
            </h1>

            <div className="mt-5 flex items-center gap-2 text-white/75">
              <MapPin className="h-4 w-4" />

              <span>
                {location.region}
                {location.state
                  ? ` · ${location.state}`
                  : ''}
              </span>
            </div>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80">
              {location.description ??
                location.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
              The place
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              {location.type === 'main'
                ? 'A landscape within the journey.'
                : 'A place within the larger journey.'}
            </h2>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
              {location.introduction ??
                location.shortDescription}
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--text-muted)]">
              Geographic context
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Region
                </p>

                <p className="mt-1 font-medium">
                  {location.region}
                </p>
              </div>

              {location.state && (
                <div>
                  <p className="text-sm text-[var(--text-muted)]">
                    State
                  </p>

                  <p className="mt-1 font-medium">
                    {location.state}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-[var(--text-muted)]">
                  Coordinates
                </p>

                <p className="mt-1 font-medium">
                  {location.latitude.toFixed(4)},{' '}
                  {location.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      {location.history && (
        <section className="border-y border-[var(--border)] bg-[var(--surface)] px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
              History & memory
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Stories that remain in the landscape.
            </h2>

            <p className="mt-7 text-lg leading-9 text-[var(--text-muted)]">
              {location.history}
            </p>
          </div>
        </section>
      )}

      {/* Significance + highlights */}
      {(location.significance ||
        location.highlights?.length) && (
        <section className="px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
            {location.significance && (
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
                  Significance
                </p>

                <p className="mt-5 text-3xl font-medium leading-tight">
                  {location.significance}
                </p>
              </div>
            )}

            {location.highlights &&
              location.highlights.length > 0 && (
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
                    Highlights
                  </p>

                  <div className="mt-6 space-y-3">
                    {location.highlights.map(
                      (highlight) => (
                        <div
                          key={highlight}
                          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4"
                        >
                          <p className="text-sm font-medium">
                            {highlight}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
          </div>
        </section>
      )}

      {/* Sublocations */}
      {subLocations.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface-muted)] px-6 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
                  Explore the region
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                  Places around {location.name}.
                </h2>
              </div>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subLocations.map(
                (subLocation) => (
                  <Link
                    key={subLocation.id}
                    to={`/locations/${subLocation.slug}`}
                    className="
                      group
                      rounded-3xl
                      border border-[var(--border)]
                      bg-[var(--surface)]
                      p-6
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:shadow-lg
                    "
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--primary)]">
                      Sublocation
                    </p>

                    <h3 className="mt-3 text-xl font-semibold">
                      {subLocation.name}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
                      {subLocation.shortDescription}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                      Explore
                      <ArrowRight
                        className="
                          h-4 w-4
                          transition-transform
                          group-hover:translate-x-1
                        "
                      />
                    </span>
                  </Link>
                ),
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery placeholder */}
      {/* Photography archive */}
<section className="px-6 py-20 lg:px-8 lg:py-28">
  <div className="mx-auto max-w-7xl">
    <div className="max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
        Photography archive
      </p>

      <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
        The visual memory of the place.
      </h2>

      <p className="mt-5 text-lg leading-8 text-[var(--text-muted)]">
        Explore photographs documenting the landscape,
        architecture, traditions, and visual character of
        {` ${location.name}`}.
      </p>
    </div>

    <div className="mt-10">
      <Gallery
        images={(location.gallery ?? []).map(
          (image, index) => ({
            id: `${location.id}-image-${index + 1}`,
            src: image,
            alt: `${location.name} photograph ${index + 1}`,
            title: location.name,
            location: location.region,
          }),
        )}
      />
    </div>
  </div>
</section>
    </article>
  )
}

export default LocationPage
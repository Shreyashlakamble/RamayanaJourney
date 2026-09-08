import { useMemo } from 'react'
import JourneyMap from '../features/map/JourneyMap'
import { sampleLocations } from '../features/locations/data/sampleLocations'
import { useLocation } from '../contexts/LocationContext'

function JourneyPage() {
  const {
    selectedLocationId,
    selectLocation,
  } = useLocation()

  const selectedLocation = useMemo(
    () =>
      sampleLocations.find(
        (location) =>
          location.id === selectedLocationId,
      ),
    [selectedLocationId],
  )

  return (
    <section className="bg-[var(--background)] px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[var(--primary)]">
            Interactive journey
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-[var(--text)] md:text-6xl">
            Follow the journey across India.
          </h1>

          <p className="mt-6 text-lg leading-8 text-[var(--text-muted)]">
            Explore the major locations of the Ramayana,
            then move closer to discover the places within
            each region.
          </p>
        </div>

        <div className="mt-12">
          <JourneyMap
            locations={sampleLocations}
            selectedLocation={selectedLocation}
            onSelectLocation={(location) =>
              selectLocation(location.id)
            }
            onClosePanel={() => selectLocation(null)}
          />
        </div>
      </div>
    </section>
  )
}

export default JourneyPage
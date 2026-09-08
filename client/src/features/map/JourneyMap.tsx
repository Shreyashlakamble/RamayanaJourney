import { useEffect, useMemo } from 'react'
import {
  MapContainer,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet'
import type { Location } from '../../types/location'
import {
  getMainLocations,
  getSubLocations,
  getParentLocation,
} from '../locations/utils/locationHelpers'
import MapInfoPanel from './MapInfoPanel'
import MapMarker from './MapMarker'
import { useTheme } from '../../contexts/ThemeContext'

interface JourneyMapProps {
  locations: Location[]
  selectedLocation: Location | undefined
  onSelectLocation: (location: Location) => void
  onClosePanel: () => void
}

interface MapControllerProps {
  selectedLocation: Location | undefined
}

function MapController({
  selectedLocation,
}: MapControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (!selectedLocation) {
      return
    }

    const targetZoom =
      selectedLocation.type === 'main' ? 9 : 13

    map.flyTo(
      [
        selectedLocation.latitude,
        selectedLocation.longitude,
      ],
      targetZoom,
      {
        duration: 1.2,
      },
    )
  }, [map, selectedLocation])

  return null
}

function JourneyMap({
  locations,
  selectedLocation,
  onSelectLocation,
  onClosePanel,
}: JourneyMapProps) {
  const { theme } = useTheme()

  const mainLocations = useMemo(
    () => getMainLocations(locations),
    [locations],
  )

  /*
   * Determine which locations should currently be visible.
   *
   * No selection:
   *   → main locations only
   *
   * Main location selected:
   *   → all main locations + its sublocations
   *
   * Sublocation selected:
   *   → all main locations + the sublocations
   *     belonging to its parent region
   */
  const visibleLocations = useMemo(() => {
    if (!selectedLocation) {
      return mainLocations
    }

    const parentLocation =
      selectedLocation.type === 'sub'
        ? getParentLocation(
            locations,
            selectedLocation,
          )
        : selectedLocation

    if (!parentLocation) {
      return mainLocations
    }

    return [
      ...mainLocations,
      ...getSubLocations(
        locations,
        parentLocation.id,
      ),
    ]
  }, [locations, mainLocations, selectedLocation])

  const routeLocations = useMemo(
    () =>
      [...mainLocations].sort(
        (a, b) =>
          (a.timelineOrder ?? 999) -
          (b.timelineOrder ?? 999),
      ),
    [mainLocations],
  )

  const routeCoordinates = routeLocations.map(
    (location) =>
      [location.latitude, location.longitude] as [
        number,
        number,
      ],
  )

  const selectedSubLocations = useMemo(() => {
    if (!selectedLocation) {
      return []
    }

    const parentLocation =
      selectedLocation.type === 'sub'
        ? getParentLocation(
            locations,
            selectedLocation,
          )
        : selectedLocation

    if (!parentLocation) {
      return []
    }

    return getSubLocations(
      locations,
      parentLocation.id,
    )
  }, [locations, selectedLocation])

  return (
    <div
      className={`journey-map ${
        theme === 'dark'
          ? 'journey-map--dark'
          : 'journey-map--light'
      } relative h-[700px] overflow-hidden rounded-3xl border border-[var(--border)]`}
    >
      <MapContainer
        center={[22.8, 79.5]}
        zoom={5}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        <MapController
          selectedLocation={selectedLocation}
        />

        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color:
                theme === 'dark'
                  ? '#e9c27b'
                  : '#a85422',
              weight: 3,
              opacity:
                theme === 'dark' ? 0.85 : 0.65,
              dashArray: '8 8',
            }}
          />
        )}

        {visibleLocations.map((location) => (
          <MapMarker
            key={location.id}
            location={location}
            selected={
              selectedLocation?.id === location.id
            }
            onSelect={onSelectLocation}
          />
        ))}
      </MapContainer>

      <MapInfoPanel
        location={selectedLocation}
        subLocations={selectedSubLocations}
        onClose={onClosePanel}
      />
    </div>
  )
}

export default JourneyMap
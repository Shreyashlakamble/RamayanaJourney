import { useEffect, useMemo, useState } from 'react'
import {
  MapContainer,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet'

import type { Location } from '../../types/location'
import { useTheme } from '../../contexts/ThemeContext'

import {
  getMainLocations,
  getSubLocations,
  getParentLocation,
} from '../locations/utils/locationHelpers'

import { getVisibleMapLocations } from './mapVisibility'
import MapInfoPanel from './MapInfoPanel'
import MapMarker from './MapMarker'

interface JourneyMapProps {
  locations: Location[]
  selectedLocation: Location | undefined
  onSelectLocation: (location: Location) => void
  onClosePanel: () => void
}

interface MapControllerProps {
  selectedLocation: Location | undefined
}

/**
 * Controls automatic map movement when a location is selected.
 *
 * Main location:
 *   → zoom to regional level
 *
 * Sublocation:
 *   → zoom closer to the selected place
 *
 * No selection:
 *   → return to India overview
 */
function MapController({
  selectedLocation,
}: MapControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (!selectedLocation) {
      map.flyTo([22.8, 79.5], 5, {
        duration: 1,
      })

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

/**
 * Watches the Leaflet map zoom level and gives
 * the current zoom value back to React.
 */
function MapZoomListener({
  onZoomChange,
}: {
  onZoomChange: (zoom: number) => void
}) {
  const map = useMap()

  useEffect(() => {
    const handleZoom = () => {
      onZoomChange(map.getZoom())
    }

    map.on('zoomend', handleZoom)

    return () => {
      map.off('zoomend', handleZoom)
    }
  }, [map, onZoomChange])

  return null
}

function JourneyMap({
  locations,
  selectedLocation,
  onSelectLocation,
  onClosePanel,
}: JourneyMapProps) {
  const { theme } = useTheme()

  /**
   * React state for the current Leaflet zoom.
   *
   * Initial India overview = zoom 5.
   */
  const [zoom, setZoom] = useState(5)

  /**
   * Get all active main locations.
   */
  const mainLocations = useMemo(
    () => getMainLocations(locations),
    [locations],
  )

  /**
   * Determine which markers should currently
   * be displayed.
   *
   * Example:
   *
   * No selection
   * → main locations
   *
   * Chitrakoot selected
   * → main locations + Chitrakoot children
   *
   * Gupt Godavari selected
   * → main locations + Chitrakoot children
   */
  const visibleLocations = useMemo(
    () =>
      getVisibleMapLocations(locations, {
        zoom,
        selectedLocationId:
          selectedLocation?.id ?? null,
      }),
    [locations, zoom, selectedLocation],
  )

  /**
   * Main locations sorted according to the
   * narrative journey order.
   */
  const routeLocations = useMemo(
    () =>
      [...mainLocations].sort(
        (a, b) =>
          (a.timelineOrder ?? 999) -
          (b.timelineOrder ?? 999),
      ),
    [mainLocations],
  )

  /**
   * Coordinates used to draw the journey route.
   */
  const routeCoordinates = routeLocations.map(
    (location) =>
      [location.latitude, location.longitude] as [
        number,
        number,
      ],
  )

  /**
   * When a main location or one of its sublocations
   * is selected, keep the entire regional sibling
   * context available.
   */
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
      className={`
        journey-map
        ${
          theme === 'dark'
            ? 'journey-map--dark'
            : 'journey-map--light'
        }
        relative h-[560px] sm:h-[620px] lg:h-[700px]
        overflow-hidden
        rounded-3xl
        border border-[var(--border)]
      `}
    >
      <MapContainer
        center={[22.8, 79.5]}
        zoom={5}
        scrollWheelZoom
        className="h-full w-full"
      >
        {/* Track Leaflet zoom changes */}
        <MapZoomListener onZoomChange={setZoom} />

        {/* Move map when location selection changes */}
        <MapController
          selectedLocation={selectedLocation}
        />

        {/* OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Main journey route */}
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

        {/* Location markers */}
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

      {/* Selected location panel */}
      <MapInfoPanel
        location={selectedLocation}
        subLocations={selectedSubLocations}
        onClose={onClosePanel}
      />

      {/* Map legend */}
      <div
        className="
          absolute
          bottom-4
          left-4
          z-[1000]
          flex
          items-center
          gap-4
          rounded-full
          border border-[var(--border)]
          bg-[var(--surface)]/90
          px-4
          py-2.5
          text-xs
          text-[var(--text-muted)]
          shadow-lg
          backdrop-blur-md
        "
      >
        <span className="flex items-center gap-2">
          <span
            className="
              h-3 w-3 rounded-full
              bg-[#e9c27b]
              ring-2 ring-[#c49345]/30
            "
          />
          Main
        </span>

        <span className="flex items-center gap-2">
          <span
            className="
              h-2.5 w-2.5 rounded-full
              bg-[#c46b30]
            "
          />
          Sublocation
        </span>
      </div>

      {/* Development zoom indicator */}
      <div
        className="
          absolute
          bottom-4
          right-4
          z-[1000]
          rounded-full
          border border-[var(--border)]
          bg-[var(--surface)]/90
          px-4
          py-2
          text-xs
          text-[var(--text-muted)]
          shadow-lg
          backdrop-blur-md
        "
      >
        Zoom {zoom}
      </div>
    </div>
  )
}

export default JourneyMap
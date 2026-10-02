import { useEffect, useMemo, useState } from 'react'
import {
  Lock,
  Unlock,
} from 'lucide-react'

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
  showRoute?: boolean
  filteredView?: boolean
}

interface MapControllerProps {
  selectedLocation: Location | undefined
}

/**
 * Moves the map when a location is selected.
 *
 * Main location:
 *   → regional zoom
 *
 * Sublocation:
 *   → detailed zoom
 *
 * No selection:
 *   → India overview
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
      selectedLocation.type === 'main'
        ? 9
        : 13

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
 * Watches Leaflet's zoom level.
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

    onZoomChange(map.getZoom())

    map.on('zoomend', handleZoom)

    return () => {
      map.off('zoomend', handleZoom)
    }
  }, [map, onZoomChange])

  return null
}

/**
 * Explicit map interaction control.
 *
 * Locked:
 *   → page can scroll normally
 *   → mouse wheel does not zoom map
 *   → dragging disabled
 *   → touch map gestures disabled
 *
 * Unlocked:
 *   → dragging enabled
 *   → mouse wheel zoom enabled
 *   → touch zoom enabled
 *   → double click zoom enabled
 */
function MapInteractionController({
  enabled,
}: {
  enabled: boolean
}) {
  const map = useMap()

  useEffect(() => {
    if (enabled) {
      map.dragging.enable()
      map.scrollWheelZoom.enable()
      map.touchZoom.enable()
      map.doubleClickZoom.enable()
      map.boxZoom.enable()
      map.keyboard.enable()
    } else {
      map.dragging.disable()
      map.scrollWheelZoom.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.boxZoom.disable()
      map.keyboard.disable()
    }

    return () => {
      map.dragging.disable()
      map.scrollWheelZoom.disable()
      map.touchZoom.disable()
      map.doubleClickZoom.disable()
      map.boxZoom.disable()
      map.keyboard.disable()
    }
  }, [map, enabled])

  return null
}

function JourneyMap({
  locations,
  selectedLocation,
  onSelectLocation,
  onClosePanel,
  showRoute = true,
  filteredView = false,
}: JourneyMapProps) {
  const { theme } = useTheme()

  /**
   * Map starts locked.
   *
   * This is intentional:
   * scrolling over the map should scroll
   * the page instead of zooming the map.
   */
  const [
    mapInteractionEnabled,
    setMapInteractionEnabled,
  ] = useState(false)

  const [zoom, setZoom] = useState(5)

  /**
   * Full main-location collection.
   *
   * When filteredView is false this drives the
   * normal narrative route.
   *
   * When filteredView is true it reflects the
   * filtered dataset.
   */
  const mainLocations = useMemo(
    () => getMainLocations(locations),
    [locations],
  )

  /**
   * Marker visibility.
   *
   * IMPORTANT:
   *
   * When a filter is explicitly selected, the
   * filter takes priority over zoom visibility.
   *
   * Example:
   *
   * Sub filter + zoom 5
   * → sublocations still appear
   *
   * No filter + zoom 5
   * → normal main-location visibility
   */
  const visibleLocations = useMemo(() => {
    if (filteredView) {
      return locations
    }

    return getVisibleMapLocations(
      locations,
      {
        zoom,
        selectedLocationId:
          selectedLocation?.id ?? null,
      },
    )
  }, [
    locations,
    zoom,
    selectedLocation,
    filteredView,
  ])

  /**
   * Main locations are ordered according to the
   * narrative journey.
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

  const routeCoordinates =
    routeLocations.map(
      (location) =>
        [
          location.latitude,
          location.longitude,
        ] as [number, number],
    )

  /**
   * Regional sibling context.
   *
   * Main selected:
   *   → all children of that main location
   *
   * Sublocation selected:
   *   → all children of its parent
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
  }, [
    locations,
    selectedLocation,
  ])

  const toggleMapInteraction = () => {
    setMapInteractionEnabled(
      (current) => !current,
    )
  }

  return (
    <div
      className={`
        journey-map
        ${
          theme === 'dark'
            ? 'journey-map--dark'
            : 'journey-map--light'
        }
        relative
        h-full
        w-full
        overflow-hidden
        bg-[var(--background)]
      `}
    >
      <MapContainer
        center={[22.8, 79.5]}
        zoom={5}
        /*
         * Always start disabled.
         * MapInteractionController manages the
         * real interaction state.
         */
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <MapZoomListener
          onZoomChange={setZoom}
        />

        <MapInteractionController
          enabled={
            mapInteractionEnabled
          }
        />

        <MapController
          selectedLocation={
            selectedLocation
          }
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Journey route */}
        {showRoute &&
          routeCoordinates.length > 1 && (
            <Polyline
              positions={routeCoordinates}
              pathOptions={{
                color:
                  theme === 'dark'
                    ? '#e9c27b'
                    : '#a85422',
                weight: 3,
                opacity:
                  theme === 'dark'
                    ? 0.85
                    : 0.65,
                dashArray: '8 8',
              }}
            />
          )}

        {/* Location markers */}
        {visibleLocations.map(
          (location) => (
            <MapMarker
              key={location.id}
              location={location}
              selected={
                selectedLocation?.id ===
                location.id
              }
              onSelect={
                onSelectLocation
              }
            />
          ),
        )}
      </MapContainer>

      {/* Desktop map interaction */}
      <button
        type="button"
        onClick={
          toggleMapInteraction
        }
        aria-pressed={
          mapInteractionEnabled
        }
        aria-label={
          mapInteractionEnabled
            ? 'Lock map interactions'
            : 'Enable map interactions'
        }
        className="
          absolute
          bottom-4
          right-4
          z-[1100]
          hidden
          items-center
          gap-2
          rounded-full
          border
          border-[var(--border)]
          bg-[var(--surface)]/95
          px-4
          py-2.5
          text-xs
          font-medium
          text-[var(--text)]
          shadow-xl
          backdrop-blur-xl
          transition
          hover:scale-[1.02]
          md:flex
        "
      >
        {mapInteractionEnabled ? (
          <Unlock
            className="h-4 w-4 text-[var(--primary)]"
            aria-hidden="true"
          />
        ) : (
          <Lock
            className="h-4 w-4 text-[var(--primary)]"
            aria-hidden="true"
          />
        )}

        {mapInteractionEnabled
          ? 'Lock map'
          : 'Move map'}
      </button>

      {/* Mobile map interaction */}
      <button
        type="button"
        onClick={
          toggleMapInteraction
        }
        aria-pressed={
          mapInteractionEnabled
        }
        aria-label={
          mapInteractionEnabled
            ? 'Lock map interactions'
            : 'Enable map interactions'
        }
        className="
          absolute
          right-3
          top-20
          z-[1200]
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-[var(--border)]
          bg-[var(--surface)]/95
          px-4
          py-2.5
          text-xs
          font-medium
          text-[var(--text)]
          shadow-xl
          backdrop-blur-xl
          transition
          hover:scale-[1.02]
          md:hidden
        "
      >
        {mapInteractionEnabled ? (
          <Unlock
            className="h-4 w-4 text-[var(--primary)]"
            aria-hidden="true"
          />
        ) : (
          <Lock
            className="h-4 w-4 text-[var(--primary)]"
            aria-hidden="true"
          />
        )}

        {mapInteractionEnabled
          ? 'Lock map'
          : 'Move map'}
      </button>

      {/* Selected location panel */}
      <MapInfoPanel
        location={selectedLocation}
        subLocations={
          selectedSubLocations
        }
        onClose={onClosePanel}
      />

      {/* Legend */}
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
          border
          border-[var(--border)]
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
              h-3
              w-3
              rounded-full
              bg-[#e9c27b]
              ring-2
              ring-[#c49345]/30
            "
          />

          Main
        </span>

        <span className="flex items-center gap-2">
          <span
            className="
              h-2.5
              w-2.5
              rounded-full
              bg-[#c46b30]
            "
          />

          Sublocation
        </span>
      </div>

      {/* Zoom indicator */}
      <div
        className="
          absolute
          bottom-[4.25rem]
          right-4
          z-[1000]
          hidden
          rounded-full
          border
          border-[var(--border)]
          bg-[var(--surface)]/90
          px-4
          py-2
          text-xs
          text-[var(--text-muted)]
          shadow-lg
          backdrop-blur-md
          md:block
        "
      >
        Zoom {zoom}
      </div>
    </div>
  )
}

export default JourneyMap
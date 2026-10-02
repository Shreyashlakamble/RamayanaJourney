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
  showRoute?: boolean
  mobileInteractionEnabled?: boolean
}

interface MapControllerProps {
  selectedLocation: Location | undefined
}

/**
 * Automatically moves the map when a location
 * is selected.
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
 * Tracks the Leaflet zoom level.
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

/**
 * Controls touch interaction on mobile.
 *
 * By default on mobile:
 * - page scrolling remains natural
 * - map dragging is disabled
 * - touch zoom is disabled
 *
 * The user can enable map gestures with the
 * mobile "Enable map gestures" control.
 */
function MapInteractionController({
  mobileInteractionEnabled,
}: {
  mobileInteractionEnabled: boolean
}) {
  const map = useMap()

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(max-width: 767px)',
    )

    const updateInteraction = () => {
      const isMobile = mediaQuery.matches

      const shouldEnable =
        !isMobile || mobileInteractionEnabled

      if (shouldEnable) {
        map.dragging.enable()
        map.touchZoom.enable()
        map.scrollWheelZoom.enable()
        map.doubleClickZoom.enable()
      } else {
        map.dragging.disable()
        map.touchZoom.disable()
        map.scrollWheelZoom.disable()
        map.doubleClickZoom.disable()
      }
    }

    updateInteraction()

    mediaQuery.addEventListener(
      'change',
      updateInteraction,
    )

    return () => {
      mediaQuery.removeEventListener(
        'change',
        updateInteraction,
      )
    }
  }, [map, mobileInteractionEnabled])

  return null
}

function JourneyMap({
  locations,
  selectedLocation,
  onSelectLocation,
  onClosePanel,
  showRoute = true,
  mobileInteractionEnabled = false,
}: JourneyMapProps) {
  const { theme } = useTheme()

  const [zoom, setZoom] = useState(5)

  /**
   * Main locations.
   */
  const mainLocations = useMemo(
    () => getMainLocations(locations),
    [locations],
  )

  /**
   * Determine which locations should be visible.
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
   * Main journey sequence.
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
   * Journey route coordinates.
   */
  const routeCoordinates = routeLocations.map(
    (location) =>
      [
        location.latitude,
        location.longitude,
      ] as [number, number],
  )

  /**
   * Regional sublocations for the selected location.
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
        scrollWheelZoom
        className="h-full w-full"
      >
        <MapZoomListener
          onZoomChange={setZoom}
        />

        <MapController
          selectedLocation={selectedLocation}
        />

        <MapInteractionController
          mobileInteractionEnabled={
            mobileInteractionEnabled
          }
        />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

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
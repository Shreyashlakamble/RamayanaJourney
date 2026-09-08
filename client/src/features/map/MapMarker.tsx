import { CircleMarker, Tooltip } from 'react-leaflet'
import type { Location } from '../../types/location'

interface MapMarkerProps {
  location: Location
  selected: boolean
  onSelect: (location: Location) => void
}

function MapMarker({
  location,
  selected,
  onSelect,
}: MapMarkerProps) {
  const isMainLocation = location.type === 'main'

  const baseRadius = isMainLocation ? 8 : 5

  return (
    <CircleMarker
      center={[location.latitude, location.longitude]}
      radius={
        selected
          ? isMainLocation
            ? 12
            : 9
          : baseRadius
      }
      pathOptions={{
        color: isMainLocation
          ? '#c49345'
          : '#a85422',

        fillColor: isMainLocation
          ? '#e9c27b'
          : '#c46b30',

        fillOpacity: selected ? 1 : 0.88,

        weight: selected
          ? 3
          : isMainLocation
            ? 2
            : 1.5,
      }}
      eventHandlers={{
        click: () => onSelect(location),
      }}
    >
      <Tooltip
        direction="top"
        offset={[0, -8]}
        opacity={1}
      >
        <span className="font-medium">
          {location.name}
        </span>
      </Tooltip>
    </CircleMarker>
  )
}

export default MapMarker
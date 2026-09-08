import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface LocationContextValue {
  selectedLocationId: string | null
  selectLocation: (locationId: string | null) => void
}

const LocationContext = createContext<
  LocationContextValue | undefined
>(undefined)

interface LocationProviderProps {
  children: ReactNode
}

export function LocationProvider({
  children,
}: LocationProviderProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<
    string | null
  >(null)

  const value = useMemo(
    () => ({
      selectedLocationId,
      selectLocation: setSelectedLocationId,
    }),
    [selectedLocationId],
  )

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)

  if (!context) {
    throw new Error(
      'useLocation must be used inside LocationProvider',
    )
  }

  return context
}
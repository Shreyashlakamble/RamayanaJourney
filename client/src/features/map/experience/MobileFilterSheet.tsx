import {
  Check,
  Filter,
  RotateCcw,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import type {
  LocationFiltersState,
  LocationTypeFilter,
} from './JourneySidebar'

interface MobileFilterSheetProps {
  open: boolean
  filters: LocationFiltersState
  regions: string[]
  states: string[]
  resultCount: number

  onClose: () => void

  onApply: (
    filters: LocationFiltersState,
  ) => void

  onReset: () => void
}

function MobileFilterSheet({
  open,
  filters,
  regions,
  states,
  resultCount,
  onClose,
  onApply,
  onReset,
}: MobileFilterSheetProps) {
  const [
    draftFilters,
    setDraftFilters,
  ] = useState<LocationFiltersState>(
    filters,
  )

  /*
   * Keep the draft synchronized whenever the
   * sheet opens with a different filter state.
   */
  useEffect(() => {
    if (open) {
      setDraftFilters(filters)
    }
  }, [open, filters])

  /*
   * Prevent the page underneath the sheet from
   * scrolling.
   */
  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow =
        previousOverflow
    }
  }, [open])

  if (!open) {
    return null
  }

  const hasChanges =
    draftFilters.type !== 'all' ||
    draftFilters.region !== 'all' ||
    draftFilters.state !== 'all'

  const updateType = (
    type: LocationTypeFilter,
  ) => {
    setDraftFilters((current) => ({
      ...current,
      type,
    }))
  }

  const updateRegion = (
    region: string,
  ) => {
    setDraftFilters((current) => ({
      ...current,
      region,
    }))
  }

  const updateState = (
    state: string,
  ) => {
    setDraftFilters((current) => ({
      ...current,
      state,
    }))
  }

  const handleReset = () => {
    const reset: LocationFiltersState = {
      type: 'all',
      region: 'all',
      state: 'all',
    }

    setDraftFilters(reset)
    onReset()
  }

  const handleApply = () => {
    onApply(draftFilters)
    onClose()
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-[1800]
        flex
        items-end
        justify-center
        md:hidden
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-filter-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-black/45
          backdrop-blur-sm
        "
      />

      {/* Bottom sheet */}
      <div
        className="
          relative
          z-10
          w-full
          max-h-[82svh]
          overflow-y-auto
          rounded-t-[2rem]
          border-t
          border-[var(--border)]
          bg-[var(--surface)]
          px-5
          pb-6
          pt-4
          text-[var(--text)]
          shadow-2xl
        "
      >
        {/* Drag indicator */}
        <div
          className="
            mx-auto
            mb-4
            h-1
            w-10
            rounded-full
            bg-[var(--border)]
          "
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Filter
                className="
                  h-4
                  w-4
                  text-[var(--primary)]
                "
                aria-hidden="true"
              />

              <h2
                id="mobile-filter-title"
                className="
                  text-lg
                  font-semibold
                "
              >
                Filter locations
              </h2>
            </div>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Narrow the map without changing the
              journey hierarchy.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-[var(--border)]
              text-[var(--text-muted)]
            "
          >
            <X
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Type */}
        <div className="mt-6">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Location type
          </p>

          <div
            className="
              grid
              grid-cols-3
              gap-2
            "
          >
            {(
              [
                ['all', 'All'],
                ['main', 'Main'],
                ['sub', 'Sublocations'],
              ] as [
                LocationTypeFilter,
                string,
              ][]
            ).map(([value, label]) => {
              const selected =
                draftFilters.type === value

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    updateType(value)
                  }
                  className={`
                    min-h-11
                    rounded-xl
                    border
                    px-3
                    text-xs
                    font-medium
                    transition
                    ${
                      selected
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                        : 'border-[var(--border)] bg-[var(--background)] text-[var(--text-muted)]'
                    }
                  `}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Region */}
        <div className="mt-6">
          <label
            htmlFor="mobile-filter-region"
            className="
              mb-2
              block
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[var(--text-muted)]
            "
          >
            Region
          </label>

          <select
            id="mobile-filter-region"
            value={draftFilters.region}
            onChange={(event) =>
              updateRegion(
                event.target.value,
              )
            }
            className="
              h-12
              w-full
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              px-4
              text-sm
              text-[var(--text)]
              outline-none
              focus:border-[var(--primary)]
            "
          >
            <option value="all">
              All regions
            </option>

            {regions.map((region) => (
              <option
                key={region}
                value={region}
              >
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div className="mt-5">
          <label
            htmlFor="mobile-filter-state"
            className="
              mb-2
              block
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-[var(--text-muted)]
            "
          >
            State
          </label>

          <select
            id="mobile-filter-state"
            value={draftFilters.state}
            onChange={(event) =>
              updateState(
                event.target.value,
              )
            }
            className="
              h-12
              w-full
              rounded-xl
              border
              border-[var(--border)]
              bg-[var(--background)]
              px-4
              text-sm
              text-[var(--text)]
              outline-none
              focus:border-[var(--primary)]
            "
          >
            <option value="all">
              All states
            </option>

            {states.map((state) => (
              <option
                key={state}
                value={state}
              >
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Result count */}
        <div
          className="
            mt-6
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--background)]
            p-4
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                Locations on map
              </p>

              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Based on the current filters.
              </p>
            </div>

            <span
              className="
                rounded-full
                bg-[var(--accent-soft)]
                px-3
                py-1.5
                text-sm
                font-semibold
                text-[var(--primary)]
              "
            >
              {resultCount}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="
              inline-flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-[var(--border)]
              bg-[var(--background)]
              px-4
              text-sm
              font-medium
              text-[var(--text)]
              transition
              hover:bg-[var(--surface-muted)]
            "
          >
            <RotateCcw
              className="h-4 w-4"
              aria-hidden="true"
            />

            Reset
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="
              inline-flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[var(--primary)]
              px-4
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-90
            "
          >
            <Check
              className="h-4 w-4"
              aria-hidden="true"
            />

            {hasChanges
              ? 'Apply filters'
              : 'Show all'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MobileFilterSheet
import {
  Filter,
  RotateCcw,
} from 'lucide-react'

import type {
  LocationSearchOptions,
  LocationTypeFilter,
} from '../locationSearch'

interface LocationFiltersProps {
  options: LocationSearchOptions
  regions: string[]
  states: string[]
  resultCount: number

  onChange: (
    options: LocationSearchOptions,
  ) => void

  onReset: () => void
}

function LocationFilters({
  options,
  regions,
  states,
  resultCount,
  onChange,
  onReset,
}: LocationFiltersProps) {
  const update = (
    key: keyof LocationSearchOptions,
    value: string,
  ) => {
    onChange({
      ...options,
      [key]: value,
    })
  }

  return (
    <div className="border-b border-[var(--border)] px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter
            className="h-4 w-4 text-[var(--primary)]"
            aria-hidden="true"
          />

          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Filters
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="
            inline-flex
            items-center
            gap-1.5
            text-[11px]
            text-[var(--text-muted)]
            transition
            hover:text-[var(--primary)]
          "
        >
          <RotateCcw
            className="h-3 w-3"
            aria-hidden="true"
          />
          Reset
        </button>
      </div>

      {/* Type */}
      <div className="mt-3">
        <div className="flex rounded-xl border border-[var(--border)] bg-[var(--background)] p-1">
          {(
            [
              ['all', 'All'],
              ['main', 'Main'],
              ['sub', 'Sublocations'],
            ] as [
              LocationTypeFilter,
              string,
            ][]
          ).map(
            ([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  update(
                    'type',
                    value,
                  )
                }
                className={`
                  flex-1
                  rounded-lg
                  px-2
                  py-2
                  text-[11px]
                  font-medium
                  transition
                  ${
                    options.type === value
                      ? 'bg-[var(--primary)] text-white'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }
                `}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Region + state */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <select
          value={options.region}
          onChange={(event) =>
            update(
              'region',
              event.target.value,
            )
          }
          aria-label="Filter by region"
          className="
            h-10
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--background)]
            px-3
            text-xs
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

        <select
          value={options.state}
          onChange={(event) =>
            update(
              'state',
              event.target.value,
            )
          }
          aria-label="Filter by state"
          className="
            h-10
            rounded-xl
            border
            border-[var(--border)]
            bg-[var(--background)]
            px-3
            text-xs
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
      <p className="mt-3 text-[11px] text-[var(--text-muted)]">
        Showing{' '}
        <span className="font-semibold text-[var(--text)]">
          {resultCount}
        </span>{' '}
        locations
      </p>
    </div>
  )
}

export default LocationFilters
'use client'

import { DateRangePicker as UIDateRangePicker } from "@/components/ui/date-range-picker"
import { useStatsFilters } from "@/stores/stats-filters-store"

export function DateRangePicker() {
  const { dateRange, rangeCompare, setDateRange } = useStatsFilters()

  return (
    <UIDateRangePicker
      initialDateFrom={dateRange.from}
      initialDateTo={dateRange.to}
      initialCompareFrom={rangeCompare?.from}
      initialCompareTo={rangeCompare?.to}
      onUpdate={({ range, rangeCompare }) => {
        setDateRange(range, rangeCompare)
      }}
      showCompare={true}
      align="end"
      locale="fr-FR"
    />
  )
} 
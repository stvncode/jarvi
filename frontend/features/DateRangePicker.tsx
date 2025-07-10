'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui"
import { useStatsFilters } from "@/stores/stats-filters-store"

//TODO: Add calendar
export function DateRangePicker() {
  const { dateRange, setDateRange } = useStatsFilters()

  const options = [
    { value: '7d', label: '7 derniers jours' },
    { value: '30d', label: '30 derniers jours' },
    { value: '90d', label: '90 derniers jours' }
  ]

  return (
    <Select 
      value={dateRange} 
      onValueChange={(value) => setDateRange(value as '7d' | '30d' | '90d')}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sélectionner une période" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 
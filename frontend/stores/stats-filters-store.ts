import { create } from 'zustand'
import type { StatsFilters } from '../../shared/src/types'

const USER_ID = '32ca93da-0cf6-4608-91e7-bc6a2dbedcd1' // Correct Quentin Decré id

interface DateRange {
  from: Date
  to: Date | undefined
}

interface StatsFiltersState {
  dateRange: DateRange
  rangeCompare?: DateRange
  projectId?: string
  setDateRange: (range: DateRange, rangeCompare?: DateRange) => void
  setProjectId: (id: string | undefined) => void
  getFilters: () => StatsFilters
}

const getDefaultDateRange = (): DateRange => {
  const to = new Date()
  const from = new Date()
  from.setDate(to.getDate() - 30)
  return { from, to }
}

export const useStatsFiltersStore = create<StatsFiltersState>((set, get) => ({
  dateRange: getDefaultDateRange(),
  rangeCompare: undefined,
  projectId: undefined,
  
  setDateRange: (range, rangeCompare) => set({ dateRange: range, rangeCompare }),
  setProjectId: (id) => set({ projectId: id }),
  
  getFilters: () => {
    const { dateRange, projectId } = get()
    
    return {
      user_id: USER_ID,
      start_date: dateRange.from.toISOString().split('T')[0],
      end_date: (dateRange.to || dateRange.from).toISOString().split('T')[0],
      project_id: projectId
    }
  }
}))

export function useStatsFilters() {
  const { dateRange, rangeCompare, projectId, setDateRange, setProjectId, getFilters } = useStatsFiltersStore()
  
  return {
    filters: getFilters(),
    dateRange,
    rangeCompare,
    setDateRange,
    projectId,
    setProjectId
  }
} 
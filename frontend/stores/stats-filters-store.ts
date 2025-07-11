import { match } from 'ts-pattern'
import { create } from 'zustand'
import type { StatsFilters } from '../../shared/src/types'

const USER_ID = '32ca93da-0cf6-4608-91e7-bc6a2dbedcd1' // Quentin Decré id

interface StatsFiltersState {
  dateRange: '7d' | '30d' | '90d'
  projectId?: string
  setDateRange: (range: '7d' | '30d' | '90d') => void
  setProjectId: (id: string | undefined) => void
  getFilters: () => StatsFilters
}

export const useStatsFiltersStore = create<StatsFiltersState>((set, get) => ({
  dateRange: '30d',
  projectId: undefined,
  
  setDateRange: (range) => set({ dateRange: range }),
  setProjectId: (id) => set({ projectId: id }),
  
  getFilters: () => {
    const { dateRange, projectId } = get()
    const endDate = new Date()
    const startDate = new Date()

    match(dateRange).with('7d', () => {
      startDate.setDate(endDate.getDate() - 7)
    }).with('30d', () => {
      startDate.setDate(endDate.getDate() - 30)
    }).with('90d', () => {
      startDate.setDate(endDate.getDate() - 90)
    }).exhaustive()

    return {
      user_id: USER_ID,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      project_id: projectId
    }
  }
}))

export function useStatsFilters() {
  const { dateRange, projectId, setDateRange, setProjectId, getFilters } = useStatsFiltersStore()
  
  return {
    filters: getFilters(),
    dateRange,
    setDateRange,
    projectId,
    setProjectId
  }
} 
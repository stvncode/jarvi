import { fetchDailyStats, fetchProjects, fetchStats } from '@/lib/api-client'
import { useQuery } from '@tanstack/react-query'
import type { StatsFilters } from '../../shared/src/types'

export function useStats(filters: StatsFilters, includeComparison = false) {
  return useQuery({
    queryKey: ['stats', filters, includeComparison],
    queryFn: () => fetchStats(filters, includeComparison),
    enabled: !!(filters.user_id && filters.start_date && filters.end_date),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useStatsWithComparison(filters: StatsFilters) {
  return useStats(filters, true)
}

export function useBasicStats(filters: StatsFilters) {
  return useStats(filters, false)
}

export function useDailyStats(filters: StatsFilters) {
  return useQuery({
    queryKey: ['daily-stats', filters],
    queryFn: () => fetchDailyStats(filters),
    enabled: !!(filters.user_id && filters.start_date && filters.end_date),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useProjects(userId: string) {
  return useQuery({
    queryKey: ['projects', userId],
    queryFn: () => fetchProjects(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
} 
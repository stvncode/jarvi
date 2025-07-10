import type { StatsFilters, StatsResponse } from '../../shared/src/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function fetchStats(filters: StatsFilters, includeComparison = false): Promise<StatsResponse> {
  const params = new URLSearchParams({
    user_id: filters.user_id,
    start_date: filters.start_date,
    end_date: filters.end_date,
    include_comparison: includeComparison.toString()
  })

  if (filters.project_id) {
    params.append('project_id', filters.project_id)
  }

  const response = await fetch(`${API_BASE_URL}/stats/response-rates?${params}`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stats: ${response.statusText}`)
  }

  const result = await response.json()
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch statistics')
  }

  return result.data
} 
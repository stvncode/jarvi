import { Elysia, t } from 'elysia'
import type { StatsFilters } from '../../../shared/src/types'
import { getCompleteStats } from '../services/stats'

export const statsRoutes = new Elysia({ prefix: '/api/stats' })
  .get(
    '/response-rates',
    async ({ query }) => {
      const filters: StatsFilters = {
        user_id: query.user_id,
        start_date: query.start_date,
        end_date: query.end_date,
        project_id: query.project_id || undefined
      };

      const includeComparison = query.include_comparison === 'true';
      
      try {
        const stats = await getCompleteStats(filters, includeComparison);
        return {
          success: true,
          data: stats
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch statistics'
        };
      }
    },
    {
      query: t.Object({
        user_id: t.String(),
        start_date: t.String(),
        end_date: t.String(),
        project_id: t.Optional(t.String()),
        include_comparison: t.Optional(t.String())
      })
    }
  ) 
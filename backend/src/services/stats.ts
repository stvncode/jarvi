import { and, eq, gte, inArray, isNull, lte, sql } from 'drizzle-orm'
import type { MessageType, MessageTypeStats, PeriodComparison, StatsFilters, StatsResponse } from '../../../shared/src/types'
import { db } from '../db/connection'
import { historyEntries } from '../db/schema'

const MESSAGE_TYPES: MessageType[] = ['EMAIL_SENT', 'LINKEDIN_MESSAGE_SENT', 'LINKEDIN_INMAIL_SENT'];

function adjustEndDate(dateString: string): Date {
  const date = new Date(dateString);
  date.setHours(23, 59, 59, 999);
  return date;
}

export async function getStatsForPeriod(filters: StatsFilters): Promise<MessageTypeStats[]> {
  const { user_id, start_date, end_date, project_id } = filters;

  const whereConditions = [
    eq(historyEntries.userId, user_id),
    gte(historyEntries.createdAt, new Date(start_date)),
    lte(historyEntries.createdAt, adjustEndDate(end_date)),
    inArray(historyEntries.type, MESSAGE_TYPES),
    isNull(historyEntries.deletedAt)
  ];

  if (project_id) {
    whereConditions.push(eq(historyEntries.externalThreadId, project_id));
  }

  const rawStats = await db
    .select({
      type: historyEntries.type,
      totalSent: sql<number>`count(*)`,
      totalReplied: sql<number>`count(case when ${historyEntries.triggerHasBeenRepliedTo} = true then 1 end)`
    })
    .from(historyEntries)
    .where(and(...whereConditions))
    .groupBy(historyEntries.type);

  return rawStats.map(stat => ({
    type: stat.type as MessageType,
    total_sent: Number(stat.totalSent),
    total_replied: Number(stat.totalReplied),
    response_rate: Number(stat.totalSent) > 0 
      ? Number(((Number(stat.totalReplied) / Number(stat.totalSent)) * 100).toFixed(2))
      : 0
  }));
}

export async function getDailyStatsForPeriod(filters: StatsFilters): Promise<Array<{
  date: string,
  stats_by_type: MessageTypeStats[]
}>> {
  const { user_id, start_date, end_date, project_id } = filters;

  const whereConditions = [
    eq(historyEntries.userId, user_id),
    gte(historyEntries.createdAt, new Date(start_date)),
    lte(historyEntries.createdAt, adjustEndDate(end_date)),
    inArray(historyEntries.type, MESSAGE_TYPES),
    isNull(historyEntries.deletedAt)
  ];

  if (project_id) {
    whereConditions.push(eq(historyEntries.externalThreadId, project_id));
  }

  const rawStats = await db
    .select({
      date: sql<string>`DATE(${historyEntries.createdAt})`,
      type: historyEntries.type,
      totalSent: sql<number>`count(*)`,
      totalReplied: sql<number>`count(case when ${historyEntries.triggerHasBeenRepliedTo} = true then 1 end)`
    })
    .from(historyEntries)
    .where(and(...whereConditions))
    .groupBy(sql`DATE(${historyEntries.createdAt})`, historyEntries.type)
    .orderBy(sql`DATE(${historyEntries.createdAt})`);

  const statsByDate: Record<string, MessageTypeStats[]> = {};
  
  rawStats.forEach(stat => {
    const date = stat.date;
    if (!statsByDate[date]) {
      statsByDate[date] = [];
    }
    
    statsByDate[date].push({
      type: stat.type as MessageType,
      total_sent: Number(stat.totalSent),
      total_replied: Number(stat.totalReplied),
      response_rate: Number(stat.totalSent) > 0 
        ? Number(((Number(stat.totalReplied) / Number(stat.totalSent)) * 100).toFixed(2))
        : 0
    });
  });

  return Object.entries(statsByDate).map(([date, stats]) => {
    const completeStats = MESSAGE_TYPES.map(messageType => {
      const existingStat = stats.find(s => s.type === messageType);
      return existingStat || {
        type: messageType,
        total_sent: 0,
        total_replied: 0,
        response_rate: 0
      };
    });

    return {
      date,
      stats_by_type: completeStats
    };
  });
}

export function calculatePreviousPeriod(start_date: string, end_date: string): { start_date: string; end_date: string } {
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);
  const duration = endDate.getTime() - startDate.getTime();

  const previousEnd = new Date(startDate.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - duration);

  return {
    start_date: previousStart.toISOString(),
    end_date: previousEnd.toISOString()
  };
}

export async function getComparison(filters: StatsFilters, currentStats?: MessageTypeStats[]): Promise<PeriodComparison | null> {
  const current = currentStats || await getStatsForPeriod(filters);
  
  const previousPeriod = calculatePreviousPeriod(filters.start_date, filters.end_date);
  const previousStats = await getStatsForPeriod({
    ...filters,
    start_date: previousPeriod.start_date,
    end_date: previousPeriod.end_date
  });

  const currentTotal = current.reduce((sum, stat) => sum + stat.total_sent, 0);
  const currentReplied = current.reduce((sum, stat) => sum + stat.total_replied, 0);
  const currentResponseRate = currentTotal > 0 ? (currentReplied / currentTotal) * 100 : 0;

  const previousTotal = previousStats.reduce((sum, stat) => sum + stat.total_sent, 0);
  const previousReplied = previousStats.reduce((sum, stat) => sum + stat.total_replied, 0);
  const previousResponseRate = previousTotal > 0 ? (previousReplied / previousTotal) * 100 : 0;

  if (previousTotal === 0) {
    return null;
  }

  const changePercentage = ((currentResponseRate - previousResponseRate) / previousResponseRate) * 100;

  return {
    current_response_rate: Number(currentResponseRate.toFixed(2)),
    previous_response_rate: Number(previousResponseRate.toFixed(2)),
    change_percentage: Number(changePercentage.toFixed(2)),
    is_improvement: changePercentage > 0
  };
}

export async function getCompleteStats(filters: StatsFilters, includeComparison = false): Promise<StatsResponse> {
  let statsByType: MessageTypeStats[];
  let comparison: PeriodComparison | undefined;

  if (includeComparison) {
    const previousPeriod = calculatePreviousPeriod(filters.start_date, filters.end_date);
    const previousFilters = {
      ...filters,
      start_date: previousPeriod.start_date,
      end_date: previousPeriod.end_date
    };

    const [currentStats, previousStats] = await Promise.all([
      getStatsForPeriod(filters),
      getStatsForPeriod(previousFilters)
    ]);

    statsByType = currentStats.map(currentStat => {
      const previousStat = previousStats.find(p => p.type === currentStat.type);
      
      if (previousStat && previousStat.total_sent > 0) {
        const changePercentage = ((currentStat.response_rate - previousStat.response_rate) / previousStat.response_rate) * 100;
        
        return {
          ...currentStat,
          comparison: {
            previous_response_rate: previousStat.response_rate,
            change_percentage: Number(changePercentage.toFixed(2)),
            is_improvement: changePercentage > 0
          }
        };
      }
      
      return currentStat;
    });

    const currentTotal = currentStats.reduce((sum, stat) => sum + stat.total_sent, 0);
    const currentReplied = currentStats.reduce((sum, stat) => sum + stat.total_replied, 0);
    const currentResponseRate = currentTotal > 0 ? (currentReplied / currentTotal) * 100 : 0;

    const previousTotal = previousStats.reduce((sum, stat) => sum + stat.total_sent, 0);
    const previousReplied = previousStats.reduce((sum, stat) => sum + stat.total_replied, 0);
    const previousResponseRate = previousTotal > 0 ? (previousReplied / previousTotal) * 100 : 0;

    if (previousTotal > 0) {
      const changePercentage = ((currentResponseRate - previousResponseRate) / previousResponseRate) * 100;
      comparison = {
        current_response_rate: Number(currentResponseRate.toFixed(2)),
        previous_response_rate: Number(previousResponseRate.toFixed(2)),
        change_percentage: Number(changePercentage.toFixed(2)),
        is_improvement: changePercentage > 0
      };
    }
  } else {
    statsByType = await getStatsForPeriod(filters);
  }
  
  const totalMessages = statsByType.reduce((sum, stat) => sum + stat.total_sent, 0);
  const totalReplied = statsByType.reduce((sum, stat) => sum + stat.total_replied, 0);
  const overallResponseRate = totalMessages > 0 ? Number(((totalReplied / totalMessages) * 100).toFixed(2)) : 0;

  return {
    period: {
      start_date: filters.start_date,
      end_date: filters.end_date
    },
    stats_by_type: statsByType,
    comparison,
    total_messages: totalMessages,
    overall_response_rate: overallResponseRate
  };
}

export async function getAvailableProjects(userId: string): Promise<Array<{
  id: string,
  name: string,
  messageCount: number
}>> {
  const result = await db
    .select({
      externalThreadId: historyEntries.externalThreadId,
      count: sql<number>`count(*)`
    })
    .from(historyEntries)
    .where(
      and(
        eq(historyEntries.userId, userId),
        isNull(historyEntries.deletedAt),
        sql`${historyEntries.externalThreadId} IS NOT NULL`,
        inArray(historyEntries.type, MESSAGE_TYPES)
      )
    )
    .groupBy(historyEntries.externalThreadId)
    .orderBy(sql`count(*) DESC`)
    .limit(50);

  return result.map(row => ({
    id: row.externalThreadId!,
    name: `Projet ${row.externalThreadId!.slice(-8)}`,
    messageCount: Number(row.count)
  }));
} 
"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartTooltip
} from "@/components/ui"
import { useDailyStats } from "@/hooks/use-stats"
import { useStatsFilters } from "@/stores/stats-filters-store"

export const description = "Graphique interactif des taux de réponse"

const chartConfig = {
  EMAIL_SENT: {
    label: "Emails",
    color: "hsl(217, 70%, 53%)",
  },
  LINKEDIN_MESSAGE_SENT: {
    label: "Messages LinkedIn",
    color: "hsl(220, 70%, 50%)",
  },
  LINKEDIN_INMAIL_SENT: {
    label: "InMails LinkedIn",
    color: "hsl(260, 70%, 50%)",
  },
} satisfies ChartConfig

const formatDateRange = (from: Date, to?: Date): string => {
  const formatDate = (date: Date) => date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })
  
  if (!to || from.toDateString() === to.toDateString()) {
    return formatDate(from)
  }
  
  return `${formatDate(from)} - ${formatDate(to)}`
}

const formatChartDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
}

const formatTooltipDate = (dateString: string): string => {
  const date = new Date(dateString)

  return date.toLocaleDateString('fr-FR', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  }).charAt(0).toUpperCase() + date.toLocaleDateString('fr-FR', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  }).slice(1)
}

const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const current = new Date(start)
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  
  return dates
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null

  const date = payload[0]?.payload?.date
  if (!date) return null

  return (
    <div className="rounded-lg border bg-background p-3 shadow-lg">
      <div className="text-sm font-bold text-foreground mb-2">
        {formatTooltipDate(date)}
      </div>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => {
          const config = chartConfig[entry.dataKey as keyof typeof chartConfig]
          if (!config) return null
          
          return (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div 
                  className="h-2 w-2 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground font-semibold">
                  {config.label}
                </span>
              </div>
              <span className="text-sm font-semibold">
                {entry.value?.toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ChartAreaInteractive() {
  const { filters, dateRange } = useStatsFilters()
  const { data: dailyStats, isLoading, error } = useDailyStats(filters)

  const chartData = React.useMemo(() => {
    if (!dailyStats || dailyStats.length === 0) return []

    const allDates = generateDateRange(filters.start_date, filters.end_date)
    
    const statsMap = new Map(dailyStats.map(stat => [stat.date, stat]))

    return allDates.map(date => {
      const existingData = statsMap.get(date)
      const dataPoint: any = {
        date,
        dateFormatted: formatChartDate(date)
      }

      if (existingData) {
        existingData.stats_by_type.forEach(stat => {
          dataPoint[stat.type] = stat.response_rate
        })
      } else {
        Object.keys(chartConfig).forEach(messageType => {
          dataPoint[messageType] = 0
        })
      }

      return dataPoint
    })
  }, [dailyStats, filters.start_date, filters.end_date])

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Évolution des taux de réponse</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] bg-gray-100 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-red-600">Erreur</CardTitle>
          <CardDescription>
            Impossible de charger les données du graphique: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!dailyStats || dailyStats.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Évolution des taux de réponse</CardTitle>
          <CardDescription>Aucune donnée disponible pour la période sélectionnée</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Évolution des taux de réponse</CardTitle>
        <CardDescription>
          Taux de réponse par jour et par canal - {formatDateRange(dateRange.from, dateRange.to)}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dateFormatted"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value, index) => {
                const shouldShow = chartData.length <= 7 || index % Math.ceil(chartData.length / 7) === 0
                
                return shouldShow ? value : ''
              }}
            />
            <ChartTooltip
              cursor={{ stroke: "hsl(var(--muted))", strokeWidth: 1 }}
              content={<CustomTooltip />}
            />
            <Area
              dataKey="EMAIL_SENT"
              type="monotone"
              fill="var(--color-EMAIL_SENT)"
              fillOpacity={0.4}
              stroke="var(--color-EMAIL_SENT)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              dataKey="LINKEDIN_MESSAGE_SENT"
              type="monotone"
              fill="var(--color-LINKEDIN_MESSAGE_SENT)"
              fillOpacity={0.4}
              stroke="var(--color-LINKEDIN_MESSAGE_SENT)"
              strokeWidth={2}
              dot={false}
            />
            <Area
              dataKey="LINKEDIN_INMAIL_SENT"
              type="monotone"
              fill="var(--color-LINKEDIN_INMAIL_SENT)"
              fillOpacity={0.4}
              stroke="var(--color-LINKEDIN_INMAIL_SENT)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

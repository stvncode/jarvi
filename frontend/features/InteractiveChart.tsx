"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui"
import { useIsMobile } from "@/hooks/use-mobile"
import { useBasicStats } from "@/hooks/use-stats"
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

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const { filters, dateRange, setDateRange } = useStatsFilters()
  const { data: stats, isLoading, error } = useBasicStats(filters)

  React.useEffect(() => {
    if (isMobile && dateRange !== "7d") {
      setDateRange("7d")
    }
  }, [isMobile, dateRange, setDateRange])

  const chartData = React.useMemo(() => {
    if (!stats) return []

    const getAllTypeStats = () => {
      const types = ['EMAIL_SENT', 'LINKEDIN_MESSAGE_SENT', 'LINKEDIN_INMAIL_SENT'] as const
      return types.reduce((acc, type) => {
        const stat = stats.stats_by_type?.find(s => s.type === type)
        acc[type] = stat?.response_rate || 0
        return acc
      }, {} as Record<string, number>)
    }

    return [{
      period: "Comparaison des taux de réponse",
      ...getAllTypeStats()
    }]
  }, [stats])

  const timeRangeLabels = {
    "7d": "7 derniers jours",
    "30d": "30 derniers jours", 
    "90d": "90 derniers jours"
  }

  if (isLoading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Taux de réponse par type</CardTitle>
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

  if (!stats) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Taux de réponse par type</CardTitle>
          <CardDescription>Aucune donnée disponible pour la période sélectionnée</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Comparaison des canaux de communication</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Taux de réponse par type de message - {timeRangeLabels[dateRange]}
          </span>
          <span className="@[540px]/card:hidden">{timeRangeLabels[dateRange]}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={dateRange}
            onValueChange={(value) => value && setDateRange(value as '7d' | '30d' | '90d')}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">90 jours</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 jours</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 jours</ToggleGroupItem>
          </ToggleGroup>
          <Select value={dateRange} onValueChange={(value) => setDateRange(value as '7d' | '30d' | '90d')}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Sélectionner une période"
            >
              <SelectValue placeholder="30 derniers jours" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                90 derniers jours
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                30 derniers jours
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                7 derniers jours
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
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
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="EMAIL_SENT"
              type="natural"
              fill="var(--color-EMAIL_SENT)"
              fillOpacity={0.4}
              stroke="var(--color-EMAIL_SENT)"
              stackId="a"
            />
            <Area
              dataKey="LINKEDIN_MESSAGE_SENT"
              type="natural"
              fill="var(--color-LINKEDIN_MESSAGE_SENT)"
              fillOpacity={0.4}
              stroke="var(--color-LINKEDIN_MESSAGE_SENT)"
              stackId="a"
            />
            <Area
              dataKey="LINKEDIN_INMAIL_SENT"
              type="natural"
              fill="var(--color-LINKEDIN_INMAIL_SENT)"
              fillOpacity={0.4}
              stroke="var(--color-LINKEDIN_INMAIL_SENT)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

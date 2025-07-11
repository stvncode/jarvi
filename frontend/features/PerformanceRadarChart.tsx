"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip
} from "@/components/ui/chart"
import { useStatsWithComparison } from "@/hooks/use-stats"
import { useStatsFilters } from "@/stores/stats-filters-store"

const chartConfig = {
  emails: {
    label: "Emails",
    color: "var(--chart-1)",
  },
  linkedin: {
    label: "LinkedIn Messages",
    color: "var(--chart-2)",
  },
  inmails: {
    label: "InMails",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function PerformanceRadarChart() {
  const { filters } = useStatsFilters()
  const { data: stats, isLoading, error } = useStatsWithComparison(filters)

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>Performance radar</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Chargement des données...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card>
        <CardHeader className="items-center pb-4">
          <CardTitle>Performance radar</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const emailStat = stats.stats_by_type.find(s => s.type === 'EMAIL_SENT')
  const linkedinStat = stats.stats_by_type.find(s => s.type === 'LINKEDIN_MESSAGE_SENT')
  const inmailStat = stats.stats_by_type.find(s => s.type === 'LINKEDIN_INMAIL_SENT')

  const maxSent = Math.max(
    emailStat?.total_sent || 0,
    linkedinStat?.total_sent || 0,
    inmailStat?.total_sent || 0
  )
  const maxReplied = Math.max(
    emailStat?.total_replied || 0,
    linkedinStat?.total_replied || 0,
    inmailStat?.total_replied || 0
  )

  const normalizeVolume = (value: number) => maxSent > 0 ? (value / maxSent) * 100 : 0
  const normalizeReplies = (value: number) => maxReplied > 0 ? (value / maxReplied) * 100 : 0

  const chartData = [
    {
      metric: "Taux de réponse",
      emails: emailStat?.response_rate || 0,
      linkedin: linkedinStat?.response_rate || 0,
      inmails: inmailStat?.response_rate || 0,
    },
    {
      metric: "Volume envoyé",
      emails: normalizeVolume(emailStat?.total_sent || 0),
      linkedin: normalizeVolume(linkedinStat?.total_sent || 0),
      inmails: normalizeVolume(inmailStat?.total_sent || 0),
    },
    {
      metric: "Volume répondu",
      emails: normalizeReplies(emailStat?.total_replied || 0),
      linkedin: normalizeReplies(linkedinStat?.total_replied || 0),
      inmails: normalizeReplies(inmailStat?.total_replied || 0),
    }
  ]

  const hasData = stats.stats_by_type.some(stat => stat.total_sent > 0)

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Performance radar</CardTitle>
        <CardDescription>
          Comparaison multi-dimensionnelle des canaux
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip 
              cursor={false} 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3">
                      <p className="font-bold">{label}</p>
                      {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
                          {label === "Taux de réponse" ? "%" : ""}
                        </p>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
            <PolarAngleAxis dataKey="metric" />
            <PolarGrid />
            <Radar
              dataKey="emails"
              stroke="var(--chart-1)"
              fill="var(--chart-1)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              dataKey="linkedin"
              stroke="var(--chart-2)"
              fill="var(--chart-2)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Radar
              dataKey="inmails"
              stroke="var(--chart-3)"
              fill="var(--chart-3)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {hasData ? (
          <>
            <div className="flex items-center gap-2 leading-none font-medium">
              Vue comparative des performances <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {new Date(filters.start_date).toLocaleDateString('fr-FR')} - {new Date(filters.end_date).toLocaleDateString('fr-FR')}
            </div>
          </>
        ) : (
          <div className="text-muted-foreground leading-none">
            Aucune donnée disponible pour cette période
          </div>
        )}
      </CardFooter>
    </Card>
  )
} 
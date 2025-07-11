"use client"

import { IconBrandLinkedin, IconMail, IconSend } from "@tabler/icons-react"
import { TrendingUp } from "lucide-react"
import { Cell, Pie, PieChart } from "recharts"

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
    ChartTooltip,
} from "@/components/ui/chart"
import { useStatsWithComparison } from "@/hooks/use-stats"
import { useStatsFilters } from "@/stores/stats-filters-store"
import type { MessageType } from "../../shared/src/types"

const MESSAGE_TYPE_CONFIG: Record<MessageType, { label: string; color: string; icon: React.ComponentType<any> }> = {
  EMAIL_SENT: { 
    label: 'Emails', 
    color: 'var(--chart-1)',
    icon: IconMail
  },
  LINKEDIN_MESSAGE_SENT: { 
    label: 'Messages LinkedIn', 
    color: 'var(--chart-2)',
    icon: IconBrandLinkedin
  },
  LINKEDIN_INMAIL_SENT: { 
    label: 'InMails LinkedIn', 
    color: 'var(--chart-3)',
    icon: IconSend
  }
}

const chartConfig = {
  total_sent: {
    label: "Messages envoyés",
  },
  EMAIL_SENT: {
    label: "Emails",
    color: "var(--chart-1)",
  },
  LINKEDIN_MESSAGE_SENT: {
    label: "Messages LinkedIn", 
    color: "var(--chart-2)",
  },
  LINKEDIN_INMAIL_SENT: {
    label: "InMails LinkedIn",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function MessageDistributionChart() {
  const { filters } = useStatsFilters()
  const { data: stats, isLoading, error } = useStatsWithComparison(filters)

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Répartition des messages</CardTitle>
          <CardDescription>Chargement...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">Chargement des données...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Répartition des messages</CardTitle>
          <CardDescription>Erreur de chargement</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const chartData = stats.stats_by_type
    .filter(stat => stat.total_sent > 0)
    .map(stat => ({
      type: stat.type,
      total_sent: stat.total_sent,
      fill: MESSAGE_TYPE_CONFIG[stat.type].color,
      label: MESSAGE_TYPE_CONFIG[stat.type].label,
      percentage: ((stat.total_sent / stats.total_messages) * 100).toFixed(1)
    }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition des messages</CardTitle>
        <CardDescription>
          {new Date(filters.start_date).toLocaleDateString('fr-FR')} - {new Date(filters.end_date).toLocaleDateString('fr-FR')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-background border rounded-lg shadow-lg p-3">
                      <p className="font-bold">{data.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.total_sent} messages ({data.percentage}%)
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Pie 
              data={chartData} 
              dataKey="total_sent" 
              nameKey="label"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Total: {stats.total_messages} messages <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Répartition par canal de communication
        </div>
      </CardFooter>
    </Card>
  )
} 
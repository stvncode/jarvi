'use client'

import {
  Badge,
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui"
import { useBasicStats } from "@/hooks/use-stats"
import { useStatsFilters } from "@/stores/stats-filters-store"
import { IconBrandLinkedin, IconMail, IconSend } from "@tabler/icons-react"
import type { MessageType } from "../../shared/src/types"

//TODO: Add comparison with previous period with the correct query
const MESSAGE_TYPE_CONFIG: Record<MessageType, { label: string; icon: React.ComponentType<any>; color: string }> = {
  EMAIL_SENT: { 
    label: 'Emails', 
    icon: IconMail, 
    color: 'text-blue-600' 
  },
  LINKEDIN_MESSAGE_SENT: { 
    label: 'Messages LinkedIn', 
    icon: IconBrandLinkedin, 
    color: 'text-blue-500' 
  },
  LINKEDIN_INMAIL_SENT: { 
    label: 'InMails LinkedIn', 
    icon: IconSend, 
    color: 'text-indigo-600' 
  }
}

const ALL_MESSAGE_TYPES: MessageType[] = ['EMAIL_SENT', 'LINKEDIN_MESSAGE_SENT', 'LINKEDIN_INMAIL_SENT']

export function SectionCards() {
  const { filters } = useStatsFilters()
  const { data: stats, isLoading, error } = useBasicStats(filters)

  if (isLoading) {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="@container/card animate-pulse">
            <CardHeader>
              <CardDescription className="h-4 bg-gray-200 rounded w-24"></CardDescription>
              <CardTitle className="h-8 bg-gray-200 rounded w-16 mt-2"></CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
            <CardDescription>
              Impossible de charger les statistiques: {error.message}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const globalCard = (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Taux de réponse global</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {stats.overall_response_rate}%
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            {stats.total_messages} message{stats.total_messages > 1 ? 's' : ''}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Performance globale sur la période
        </div>
        <div className="text-muted-foreground">
          {stats.total_messages} messages envoyés au total
        </div>
      </CardFooter>
    </Card>
  )

  const messageTypeCards = ALL_MESSAGE_TYPES.map((messageType) => {
    const stat = stats.stats_by_type.find(s => s.type === messageType)
    const config = MESSAGE_TYPE_CONFIG[messageType]
    const Icon = config.icon

    const responseRate = stat?.response_rate || 0
    const totalSent = stat?.total_sent || 0
    const totalReplied = stat?.total_replied || 0

    return (
      <Card key={messageType} className="@container/card">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Icon className={`size-4 ${config.color}`} />
            {config.label}
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {responseRate}%
          </CardTitle>
          <CardAction>
            <Badge variant={totalSent > 0 ? "outline" : "secondary"}>
              {totalSent} envoyé{totalSent > 1 ? 's' : ''}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {totalSent > 0 ? (
              `${totalReplied} réponse${totalReplied > 1 ? 's' : ''} reçue${totalReplied > 1 ? 's' : ''}`
            ) : (
              'Aucun message envoyé'
            )}
          </div>
          <div className="text-muted-foreground">
            {totalSent > 0 ? (
              `sur ${totalSent} message${totalSent > 1 ? 's' : ''} envoyé${totalSent > 1 ? 's' : ''}`
            ) : (
              'Pas de données pour cette période'
            )}
          </div>
        </CardFooter>
      </Card>
    )
  })

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {globalCard}
      {messageTypeCards}
    </div>
  )
}

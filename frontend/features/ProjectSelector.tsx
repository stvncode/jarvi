'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProjects } from "@/hooks/use-stats"
import { useStatsFilters } from "@/stores/stats-filters-store"

export function ProjectSelector() {
  const { filters, projectId, setProjectId } = useStatsFilters()
  const { data: projects, isLoading } = useProjects(filters.user_id)

  return (
    <Select 
      value={projectId || "all"} 
      onValueChange={(value) => setProjectId(value === "all" ? undefined : value)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Tous les projets" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px] overflow-y-auto">
        <SelectItem value="all">
          <div className="flex items-center justify-between w-full">
            <span>Tous les projets</span>
          </div>
        </SelectItem>
        
        {isLoading ? (
          <SelectItem value="loading" disabled>
            Chargement...
          </SelectItem>
        ) : projects && projects.length > 0 ? (
          projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center justify-between w-full">
                <span>{project.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {project.messageCount} msg
                </span>
              </div>
            </SelectItem>
          ))
        ) : (
          <SelectItem value="no-projects" disabled>
            Aucun projet trouvé
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  )
} 
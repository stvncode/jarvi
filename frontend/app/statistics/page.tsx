'use client'

import { DateRangePicker } from "@/features/DateRangePicker";
import { ChartAreaInteractive } from "@/features/InteractiveChart";
import { SectionCards } from "@/features/SectionCards";

export default function Statistics() {
  return (
    <>
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Statistiques</h1>
          <p className="text-muted-foreground">
            Analysez vos taux de réponse par type de message
          </p>
        </div>
        <DateRangePicker />
      </div>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
    </>
  );
}
  
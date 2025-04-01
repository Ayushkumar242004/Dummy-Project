import type * as React from "react"

const ChartContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full h-full">{children}</div>
}

const ChartLegend = () => {
  return <div className="text-sm text-muted-foreground"></div>
}

const ChartTooltip = () => {
  return <div className="text-sm text-muted-foreground"></div>
}

const ChartTooltipContent = () => {
  return <div className="text-sm text-muted-foreground"></div>
}

const Chart = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export { Chart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent }


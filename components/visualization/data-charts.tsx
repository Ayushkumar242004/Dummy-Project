"use client"

import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  AlertCircle,
  BarChart3,
  LineChart,
  PieChart,
  Info,
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts"
import { Button } from "@/components/ui/button"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DataChartsProps {
  data: any[]
}

export function DataCharts({ data }: DataChartsProps) {
  const [selectedChartType, setSelectedChartType] = useState("bar")
  const [activeIndex, setActiveIndex] = useState(0)

  const canVisualize = useMemo(() => {
    if (!data || data.length === 0) return false
    const firstRow = data[0]
    return Object.values(firstRow).some((value) => typeof value === "number")
  }, [data])

  const chartData = useMemo(() => {
    if (!canVisualize) return []
    const firstRow = data[0]
    const numericColumns = Object.keys(firstRow).filter(
      (key) => typeof firstRow[key] === "number"
    )
    const labelColumns = Object.keys(firstRow).filter(
      (key) => typeof firstRow[key] === "string"
    )
    const labelColumn =
      labelColumns.length > 0 ? labelColumns[0] : numericColumns[0]
    return data.slice(0, 10).map((row) => {
      const chartRow: any = { name: String(row[labelColumn]) }
      numericColumns.forEach((col) => {
        chartRow[col] = row[col]
      })
      return chartRow
    })
  }, [data, canVisualize])

  const numericColumns = useMemo(() => {
    if (!data || data.length === 0) return []
    const firstRow = data[0]
    return Object.keys(firstRow).filter(
      (key) => typeof firstRow[key] === "number"
    )
  }, [data])

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
  ]

  const canVisualizeSelectedChart = useMemo(() => {
    if (!canVisualize) return false
    if (selectedChartType === "pie" && numericColumns.length === 0) {
      return false
    }
    return true
  }, [canVisualize, selectedChartType, numericColumns])

  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          className="filter drop-shadow-md"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 16}
          fill={fill}
          className="animate-pulse-slow"
        />
        <text
          x={cx}
          y={cy - 10}
          dy={8}
          textAnchor="middle"
          fill="currentColor"
          className="text-sm font-medium"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 10}
          dy={8}
          textAnchor="middle"
          fill="currentColor"
          className="text-xs"
        >
          {`${value} (${(percent * 100).toFixed(0)}%)`}
        </text>
      </g>
    )
  }

  return (
    <TooltipProvider>
      <Card className="shadow-lg border-border">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Data Visualization
              </CardTitle>
              <CardDescription>
                Visual representation of the data using charts
              </CardDescription>
            </div>
            <div>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/50 backdrop-blur-sm border-muted hover:bg-muted/30"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>
                    Select different chart types to visualize your data. Some
                    charts may not be available depending on your data
                    structure.
                  </p>
                </TooltipContent>
              </UITooltip>
            </div>
          </div>
          <TabsList className="grid w-full max-w-md grid-cols-3 mt-4 bg-muted/50 backdrop-blur-sm p-1 rounded-xl">
            <TabsTrigger
              value="bar"
              onClick={() => setSelectedChartType("bar")}
              className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 ease-in-out ${
                selectedChartType === "bar" ? "glow-effect" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Bar
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="line"
              onClick={() => setSelectedChartType("line")}
              className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 ease-in-out ${
                selectedChartType === "line" ? "glow-effect" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Line
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="pie"
              onClick={() => setSelectedChartType("pie")}
              className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 ease-in-out ${
                selectedChartType === "pie" ? "glow-effect" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Pie
              </span>
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent>
          {!canVisualize ? (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Cannot Visualize Data</AlertTitle>
              <AlertDescription>
                The data does not contain numeric values that can be visualized.
              </AlertDescription>
            </Alert>
          ) : !canVisualizeSelectedChart ? (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unsupported Chart</AlertTitle>
              <AlertDescription>
                This chart type cannot be used with your current data.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="w-full h-[400px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                {selectedChartType === "bar" ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {numericColumns.map((col, index) => (
                      <Bar key={col} dataKey={col} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </BarChart>
                ) : selectedChartType === "line" ? (
                  <RechartsLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {numericColumns.map((col, index) => (
                      <Line key={col} type="monotone" dataKey={col} stroke={COLORS[index % COLORS.length]} />
                    ))}
                  </RechartsLineChart>
                ) : (
                  <RechartsPieChart>
                    <Pie
                      data={chartData}
                      dataKey={numericColumns[0]}
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

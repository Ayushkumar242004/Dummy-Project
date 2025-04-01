"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Share2, Info } from "lucide-react"
import { Chart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

export function VisualizationPanel() {
  const [chartType, setChartType] = useState("bar")

  // Sample data
  const data = [
    { name: "North", value: 4000 },
    { name: "South", value: 3000 },
    { name: "East", value: 2000 },
    { name: "West", value: 2780 },
    { name: "Central", value: 1890 },
  ]

  const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"]

  return (
    <Card className="border border-border/50 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales Data by Region (Q1 2023)</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="table">Data Table</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {chartType === "bar" && (
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend />
              <ChartTooltip />
            </Chart>
          )}

          {chartType === "pie" && (
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend />
              <ChartTooltip />
            </Chart>
          )}

          {chartType === "line" && (
            <Chart>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend />
              <ChartTooltip />
            </Chart>
          )}

          {chartType === "table" && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">Region</th>
                    <th className="border p-2 text-left">Sales Value</th>
                    <th className="border p-2 text-left">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => {
                    const total = data.reduce((sum, d) => sum + d.value, 0)
                    const percentage = ((item.value / total) * 100).toFixed(1)

                    return (
                      <tr key={index} className="border-b">
                        <td className="border p-2">{item.name}</td>
                        <td className="border p-2">${item.value.toLocaleString()}</td>
                        <td className="border p-2">{percentage}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-md border border-border/50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">AI Insights</h4>
              <p className="text-sm text-muted-foreground">
                The North region shows the highest sales at $4,000, accounting for 29.2% of total sales. This is 33.3%
                higher than the South region, which is the second-highest performer. The East region has the lowest
                performance and may require additional attention.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info, BarChart3 } from "lucide-react"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export  function DataCharts() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [shouldPromptQuery, setShouldPromptQuery] = useState(false)

  useEffect(() => {
    const rawResponse = localStorage.getItem("rawResponse")

    if (!rawResponse) {
      setShouldPromptQuery(true)
      return
    }

    try {
      const parsedResponse = JSON.parse(rawResponse)
      const data = parsedResponse.data

      if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== "object") {
        setError("Invalid data format.")
        return
      }

      setShouldPromptQuery(false)
      setLoading(true)

      // Call the API with the parsed data
      fetch("http://localhost:3001/generate-chart-code?chartType=bar&chartTitle=Auto Chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ success: true, data }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to generate chart.")
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          setImageUrl(url)
        })
        .catch(async (err) => {
          const text = await err.response?.text?.();
          console.error("Error from backend:", text || err.message);
          setError("Failed to generate chart. Check server logs for details.");
        })        
        .finally(() => setLoading(false))
    } catch (err) {
      console.error("Error parsing rawResponse:", err)
      setError("Error parsing data from localStorage.")
    }
  }, [])

  return (
    <TooltipProvider>
      <Card className="shadow-lg border-border max-w-4xl mx-auto mt-8">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-t-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Chart Visualization
              </CardTitle>
              <CardDescription>
                This is a responsive chart rendered using AI-generated Python code.
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
                  <p>This chart is generated using AI from your raw data.</p>
                </TooltipContent>
              </UITooltip>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 flex justify-center items-center min-h-[300px]">
          {shouldPromptQuery && <p className="text-muted-foreground">Run Query</p>}
          {loading && <p className="text-muted-foreground">Generating chart...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Generated Chart"
              className="w-full h-auto max-h-[500px] object-contain rounded-lg border shadow-md"
            />
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}

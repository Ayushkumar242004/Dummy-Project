import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2, Info } from "lucide-react"
import { Loader } from "@/components/ui/loader";

export function VisualizationPanel() {
  const [rawResponse, setRawResponse] = useState<string | null>(null) // State to store API response
  const [isLoading, setIsLoading] = useState(false) // State to track loading

  const handleRawResponseClick = async () => {
    setIsLoading(true) // Set loading to true
    try {
      const dbConnection = JSON.parse(localStorage.getItem("dbConnection") || "{}")
      const query = localStorage.getItem("Query") || "";
      const body = {
        type: dbConnection.type,
        host: dbConnection.host,
        port: dbConnection.port,
        database: dbConnection.database,
        username: dbConnection.username,
        password: dbConnection.password,
        query,
      }
      console.log("hello", body);
      const response = await fetch("http://localhost:3000/api/database/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
       
      if (!response.ok) {
        throw new Error("Failed to fetch raw response")
      }

      const result = await response.json()
      console.log("Raw Response:", result)
      setRawResponse(JSON.stringify(result, null, 2)) // Store the response in state
    } catch (error) {
      console.error("Error fetching raw response:", error)
      setRawResponse("Failed to fetch raw response. Check console for details.") // Display error message
    } finally {
      setIsLoading(false) // Set loading to false
    }
  }

  return (
    <Card className="border border-border/50 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Raw Data</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="text-purple-500 border-purple-500 hover:bg-purple-100"
            onClick={handleRawResponseClick}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-auto border p-2 bg-gray-900">
        {isLoading ? (
  <div className="flex items-center justify-center h-full">
    <div className="h-6 w-6 animate-spin text-white">
      <Loader /> {/* Loader without className */}
    </div>
  </div>
) : rawResponse ? (
  <pre className="text-sm text-white">{rawResponse}</pre>
) : (
  <p className="text-sm text-gray-500">Click the purple button to fetch raw data.</p>
)}
        </div>
      </CardContent>
    </Card>
  )
}
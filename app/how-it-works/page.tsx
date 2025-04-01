import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Database, LineChart, FileText, BrainCircuit } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      title: "Speak or Upload a Voice File",
      description: "Use the microphone to speak your query or upload an audio file.",
      icon: Mic,
    },
    {
      title: "AI Converts it into an SQL Query",
      description: "Our advanced AI technology converts your voice into a precise SQL query.",
      icon: Database,
    },
    {
      title: "Query Executes & Retrieves Data",
      description: "The system executes the query and retrieves the relevant data from your database.",
      icon: Database,
    },
    {
      title: "AI Generates Graphs & Insights",
      description: "The data is automatically visualized in the most appropriate chart format.",
      icon: LineChart,
    },
    {
      title: "Export Reports & Ask AI for More Insights",
      description: "Export your visualizations as reports and ask the AI for deeper insights.",
      icon: FileText,
    },
  ]

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <main className="p-6 max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4">How It Works</h1>
            <p className="text-muted-foreground text-lg">
              Transform your voice queries into powerful data visualizations in just a few steps
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="border border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                    <step.icon size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      Step {index + 1}: {step.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-4 mb-4">
              <BrainCircuit className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">AI-Powered Technology</h2>
            </div>
            <p className="text-muted-foreground">
              Our platform uses state-of-the-art natural language processing and machine learning algorithms to
              understand your voice queries and convert them into accurate SQL queries. The AI continuously learns from
              your interactions to provide more accurate and relevant visualizations over time.
            </p>
          </div>
        </main>
      </SidebarInset>
    </div>
  )
}


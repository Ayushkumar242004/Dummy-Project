"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { VoiceInput } from "@/components/voice-input"
import { VisualizationPanel } from "@/components/visualization-panel"
import { AIChatAssistant } from "@/components/ai-chat-assistant"
import { SidebarInset } from "@/components/ui/sidebar"
import { DatabaseConnection } from "@/components/database-connection"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [dbConnected, setDbConnected] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }

    // Check if database is connected
    const dbConnection = localStorage.getItem("dbConnection")
    if (dbConnection) {
      setDbConnected(true)
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <main className="p-4">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user?.name || "User"}! Convert your voice to SQL queries and visualize your data.
            </p>
          </motion.div>

          <Tabs defaultValue={dbConnected ? "query" : "connect"} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="connect">Database Connection</TabsTrigger>
              {/* <TabsTrigger value="query" disabled={!dbConnected}> */}
              <TabsTrigger value="query">
                Voice to SQL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="connect">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <DatabaseConnection />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-muted/30 p-6 rounded-lg border border-border/50"
                >
                  <h2 className="text-xl font-semibold mb-4">Why Connect Your Database?</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                        1
                      </span>
                      <span>Securely connect to MySQL, PostgreSQL, or MongoDB databases</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                        2
                      </span>
                      <span>Convert natural language and voice to SQL queries specific to your schema</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                        3
                      </span>
                      <span>Visualize your actual data with charts and graphs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                        4
                      </span>
                      <span>Your credentials are encrypted and stored securely</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="query">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  className="flex-1 flex flex-col gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <VoiceInput />
                </motion.div>
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <VisualizationPanel />
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
      <AIChatAssistant />
    </div>
  )
}


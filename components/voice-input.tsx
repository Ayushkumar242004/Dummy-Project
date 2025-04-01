"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Mic, MicOff, Play, Loader2, FileAudio, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "next-auth/react"

export function VoiceInput() {
  const { data: session } = useSession()
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [query, setQuery] = useState("")
  const [sqlQuery, setSqlQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Request microphone permissions
  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          // Permission granted, but we don't need to keep the stream open until recording
          stream.getTracks().forEach((track) => track.stop())
        })
        .catch((err) => {
          console.error("Microphone permission denied:", err)
          setError("Microphone access denied. Please allow microphone access to use voice input.")
        })
    }
  }, [])

  const handleStartRecording = async () => {
    setError(null)
    setIsRecording(true)
    audioChunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        processAudioData()
      }

      mediaRecorderRef.current.start()
    } catch (err) {
      console.error("Error starting recording:", err)
      setError("Failed to start recording. Please check your microphone permissions.")
      setIsRecording(false)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  const processAudioData = async () => {
    if (audioChunksRef.current.length === 0) {
      setError("No audio recorded. Please try again.")
      return
    }

    setIsProcessing(true)

    try {
      // Create audio blob and form data
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
      const formData = new FormData()
      formData.append("audio", audioBlob, "recording.wav")

      // Send to Google Speech-to-Text API
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Speech-to-text processing failed")
      }

      const data = await response.json()

      if (data.transcription) {
        setQuery(data.transcription)

        // Convert to SQL using OpenAI
        await convertToSQL(data.transcription)
      } else {
        setError("Could not transcribe audio. Please try again or use text input.")
      }
    } catch (err) {
      console.error("Error processing audio:", err)
      setError("Failed to process audio. Please try again or use text input.")
    } finally {
      setIsProcessing(false)
    }
  }

  const convertToSQL = async (text: string) => {
    try {
      const response = await fetch("/api/text-to-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error("Text-to-SQL conversion failed")
      }

      const data = await response.json()

      if (data.sqlQuery) {
        setSqlQuery(data.sqlQuery)
        toast({
          title: "Query generated",
          description: "Your voice has been converted to SQL successfully.",
        })
      } else {
        setError("Could not generate SQL query. Please try again with a clearer request.")
      }
    } catch (err) {
      console.error("Error converting to SQL:", err)
      setError("Failed to convert text to SQL. Please try again.")
    }
  }

  const handleSubmitQuery = async () => {
    if (!query.trim()) {
      setError("Please enter a query first.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      await convertToSQL(query)
    } catch (err) {
      console.error("Error submitting query:", err)
      setError("Failed to process query. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.")
      return
    }

    // Check file type
    if (!["audio/wav", "audio/mp3", "audio/mpeg", "audio/m4a"].includes(file.type)) {
      setError("Unsupported file type. Please upload WAV, MP3, or M4A files.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("audio", file)

      // Send to Google Speech-to-Text API
      const response = await fetch("/api/speech-to-text", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Speech-to-text processing failed")
      }

      const data = await response.json()

      if (data.transcription) {
        setQuery(data.transcription)

        // Convert to SQL using OpenAI
        await convertToSQL(data.transcription)
      } else {
        setError("Could not transcribe audio file. Please try another file or use text input.")
      }
    } catch (err) {
      console.error("Error processing audio file:", err)
      setError("Failed to process audio file. Please try again or use text input.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <CardTitle>Query Your Data</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="voice">Voice Input</TabsTrigger>
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="file">Audio File</TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-8">
              <div className="relative mb-6">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center ${isRecording ? "bg-red-100 dark:bg-red-900/20 animate-pulse" : "bg-primary/10"}`}
                >
                  <Button
                    variant={isRecording ? "destructive" : "default"}
                    size="icon"
                    className="h-20 w-20 rounded-full"
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    disabled={isProcessing || !session}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-10 w-10 animate-spin" />
                    ) : isRecording ? (
                      <MicOff className="h-10 w-10" />
                    ) : (
                      <Mic className="h-10 w-10" />
                    )}
                  </Button>
                </div>
                {isRecording && (
                  <div className="absolute -bottom-2 left-0 right-0 text-center text-sm font-medium text-red-500">
                    Recording...
                  </div>
                )}
              </div>
              <p className="text-center text-muted-foreground mb-2">
                {isProcessing
                  ? "Processing your query..."
                  : isRecording
                    ? "Speak your query clearly..."
                    : "Press the microphone button and speak your query"}
              </p>
              {!session && (
                <Alert variant="warning" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication Required</AlertTitle>
                  <AlertDescription>Please log in to use voice input features.</AlertDescription>
                </Alert>
              )}
              {query && (
                <div className="mt-4 p-4 bg-muted rounded-md w-full">
                  <p className="font-medium">Recognized Query:</p>
                  <p className="text-muted-foreground">{query}</p>
                </div>
              )}
              {sqlQuery && (
                <div className="mt-4 p-4 bg-primary/10 rounded-md w-full">
                  <p className="font-medium">Generated SQL:</p>
                  <pre className="text-sm bg-muted p-2 rounded mt-2 overflow-x-auto">{sqlQuery}</pre>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Enter your query here (e.g., 'Show me sales data for Q1 2023 by region')"
              className="min-h-[120px]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={!session}
            />
            <Button className="w-full" onClick={handleSubmitQuery} disabled={!query.trim() || isProcessing || !session}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Query
                </>
              )}
            </Button>
            {!session && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Required</AlertTitle>
                <AlertDescription>Please log in to use text-to-SQL features.</AlertDescription>
              </Alert>
            )}
            {sqlQuery && (
              <div className="mt-4 p-4 bg-primary/10 rounded-md w-full">
                <p className="font-medium">Generated SQL:</p>
                <pre className="text-sm bg-muted p-2 rounded mt-2 overflow-x-auto">{sqlQuery}</pre>
              </div>
            )}
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-md p-8 text-center">
              <FileAudio className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Drag and drop an audio file, or click to browse</p>
              <p className="text-xs text-muted-foreground mb-4">Supports MP3, WAV, M4A (Max 10MB)</p>
              <input
                type="file"
                id="audio-upload"
                className="hidden"
                accept="audio/wav,audio/mp3,audio/mpeg,audio/m4a"
                onChange={handleFileUpload}
                disabled={isProcessing || !session}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("audio-upload")?.click()}
                disabled={isProcessing || !session}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Browse Files"
                )}
              </Button>
            </div>
            {!session && (
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Authentication Required</AlertTitle>
                <AlertDescription>Please log in to use audio file processing features.</AlertDescription>
              </Alert>
            )}
            {query && (
              <div className="mt-4 p-4 bg-muted rounded-md w-full">
                <p className="font-medium">Transcribed Text:</p>
                <p className="text-muted-foreground">{query}</p>
              </div>
            )}
            {sqlQuery && (
              <div className="mt-4 p-4 bg-primary/10 rounded-md w-full">
                <p className="font-medium">Generated SQL:</p>
                <pre className="text-sm bg-muted p-2 rounded mt-2 overflow-x-auto">{sqlQuery}</pre>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


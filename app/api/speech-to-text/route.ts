import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { SpeechClient } from "@google-cloud/speech"

// Initialize the Google Speech client
// In a production environment, you would use proper credential management
let speechClient: SpeechClient

try {
  speechClient = new SpeechClient({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "{}"),
  })
} catch (error) {
  console.error("Error initializing Google Speech client:", error)
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the audio data from the request
    const formData = await req.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    // Convert the file to a buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Configure the request to Google Speech-to-Text
    const audio = {
      content: buffer.toString("base64"),
    }

    const config = {
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US",
    }

    const request = {
      audio: audio,
      config: config,
    }

    // Perform the speech recognition
    const [response] = await speechClient.recognize(request)
    const transcription = response.results
      ?.map((result) => result.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join("\n")

    return NextResponse.json({ transcription })
  } catch (error) {
    console.error("Speech-to-text error:", error)
    return NextResponse.json({ error: "Failed to process speech to text" }, { status: 500 })
  }
}


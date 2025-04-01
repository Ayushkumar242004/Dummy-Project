import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, databaseType = "mysql" } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Use OpenAI to convert natural language to SQL
    const prompt = `
      Convert the following natural language query to a SQL query for ${databaseType} database:
      
      "${text}"
      
      Return only the SQL query without any explanations or markdown formatting.
    `

    const { text: sqlQuery } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })

    return NextResponse.json({ sqlQuery })
  } catch (error) {
    console.error("Text-to-SQL error:", error)
    return NextResponse.json({ error: "Failed to convert text to SQL" }, { status: 500 })
  }
}


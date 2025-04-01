import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, databaseType = "mysql" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Use Gemini API to convert natural language to SQL
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Convert the following natural language query to a SQL query for ${databaseType} database:\n\n"${text}"\n\nReturn only the SQL query without any explanations or markdown formatting. If Query seems incomplete then autocomplete it.`,
            },
          ],
        },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log("Response status:", response.status);
    const responseBody = await response.text();
    console.log("Response body:", responseBody);

    if (!response.ok) {
      console.error("Gemini API error:", responseBody);
      throw new Error(`Gemini API request failed: ${responseBody}`);
    }

    // Parse the response body
    const data = JSON.parse(responseBody);

    // Extract the SQL query from the response
    const sqlQuery = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!sqlQuery) {
      console.error("Invalid response structure:", data);
      return NextResponse.json({ error: "Failed to generate SQL query" }, { status: 500 });
    }

    return NextResponse.json({ sqlQuery });
  } catch (error) {
    console.error("Text-to-SQL error:", error);
    return NextResponse.json({ error: "Failed to convert text to SQL" }, { status: 500 });
  }
}
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import mysql from "mysql2/promise"
import { Pool as PostgresPool } from "pg"
import { MongoClient } from "mongodb"

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, host, port, database, username, password } = await req.json()

    if (!type || !host || !database) {
      return NextResponse.json({ error: "Missing required connection parameters" }, { status: 400 })
    }

    // Test the connection based on the database type
    let connectionResult

    switch (type.toLowerCase()) {
      case "mysql":
        connectionResult = await testMySQLConnection({
          host,
          port: port || 3306,
          database,
          user: username,
          password,
        })
        break

      case "postgresql":
      case "postgres":
        connectionResult = await testPostgresConnection({
          host,
          port: port || 5432,
          database,
          user: username,
          password,
        })
        break

      case "mongodb":
        connectionResult = await testMongoDBConnection({
          host,
          port: port || 27017,
          database,
          username,
          password,
        })
        break

      default:
        return NextResponse.json({ error: `Unsupported database type: ${type}` }, { status: 400 })
    }

    if (connectionResult.success) {
      // In a real app, you would store the connection info securely
      // For demo purposes, we'll just return success
      return NextResponse.json({
        success: true,
        message: "Database connection successful",
      })
    } else {
      return NextResponse.json({ error: connectionResult.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json({ error: "Failed to connect to database" }, { status: 500 })
  }
}

async function testMySQLConnection(config: any) {
  try {
    const connection = await mysql.createConnection(config)
    await connection.ping()
    await connection.end()
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

async function testPostgresConnection(config: any) {
  try {
    const pool = new PostgresPool(config)
    const client = await pool.connect()
    client.release()
    await pool.end()
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

async function testMongoDBConnection(config: any) {
  try {
    const { host, port, database, username, password } = config
    const uri =
      username && password
        ? `mongodb://${username}:${password}@${host}:${port}/${database}`
        : `mongodb://${host}:${port}/${database}`

    const client = new MongoClient(uri)
    await client.connect()
    await client.db().admin().ping()
    await client.close()
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}


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

    const { type, connectionConfig, query } = await req.json()

    if (!type || !connectionConfig || !query) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Execute the query based on the database type
    let result

    switch (type.toLowerCase()) {
      case "mysql":
        result = await executeMySQLQuery(connectionConfig, query)
        break

      case "postgresql":
      case "postgres":
        result = await executePostgresQuery(connectionConfig, query)
        break

      case "mongodb":
        result = await executeMongoDBQuery(connectionConfig, query)
        break

      default:
        return NextResponse.json({ error: `Unsupported database type: ${type}` }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Query execution error:", error)
    return NextResponse.json({ error: "Failed to execute query" }, { status: 500 })
  }
}

async function executeMySQLQuery(config: any, query: string) {
  try {
    const connection = await mysql.createConnection(config)
    const [rows] = await connection.execute(query)
    await connection.end()
    return { success: true, data: rows }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

async function executePostgresQuery(config: any, query: string) {
  try {
    const pool = new PostgresPool(config)
    const result = await pool.query(query)
    await pool.end()
    return { success: true, data: result.rows }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

async function executeMongoDBQuery(config: any, query: string) {
  try {
    const { host, port, database, username, password } = config
    const uri =
      username && password
        ? `mongodb://${username}:${password}@${host}:${port}/${database}`
        : `mongodb://${host}:${port}/${database}`

    const client = new MongoClient(uri)
    await client.connect()

    // For MongoDB, we need to parse the query string into a MongoDB query
    // This is a simplified implementation
    const parsedQuery = JSON.parse(query)
    const collection = parsedQuery.collection
    const operation = parsedQuery.operation
    const filter = parsedQuery.filter || {}
    const options = parsedQuery.options || {}

    let result
    const db = client.db(database)

    switch (operation) {
      case "find":
        result = await db.collection(collection).find(filter, options).toArray()
        break
      case "findOne":
        result = await db.collection(collection).findOne(filter, options)
        break
      case "insertOne":
        result = await db.collection(collection).insertOne(filter)
        break
      case "updateOne":
        result = await db.collection(collection).updateOne(filter, { $set: options })
        break
      case "deleteOne":
        result = await db.collection(collection).deleteOne(filter)
        break
      default:
        throw new Error(`Unsupported MongoDB operation: ${operation}`)
    }

    await client.close()
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}


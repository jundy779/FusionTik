import { MongoClient, type Collection } from "mongodb"

const uri = process.env.MONGODB_URI

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>
}

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null

  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(uri)
    globalForMongo._mongoClientPromise = client.connect()
  }

  return globalForMongo._mongoClientPromise
}

export const isMongoConfigured = (): boolean => !!uri

export interface GlobalStatsDocument {
  _id: "counter"
  totalDownloads: number
  updatedAt: Date
}

async function getStatsCollection(): Promise<Collection<GlobalStatsDocument>> {
  const clientPromise = getClientPromise()
  if (!clientPromise) throw new Error("MongoDB not configured")

  const client = await clientPromise
  const dbName = process.env.MONGODB_DB_NAME || "fusiontik"
  return client.db(dbName).collection<GlobalStatsDocument>("global_stats")
}

export async function readStatsFromMongo(): Promise<{ totalDownloads: number }> {
  const collection = await getStatsCollection()
  const doc = await collection.findOne({ _id: "counter" })
  return { totalDownloads: doc?.totalDownloads ?? 0 }
}

export async function incrementStatsInMongo(): Promise<{ totalDownloads: number }> {
  const collection = await getStatsCollection()
  const result = await collection.findOneAndUpdate(
    { _id: "counter" },
    {
      $inc: { totalDownloads: 1 },
      $set: { updatedAt: new Date() },
    },
    { upsert: true, returnDocument: "after" },
  )

  return { totalDownloads: result?.totalDownloads ?? 1 }
}

// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient, ServerApiVersion } from "mongodb"

if (!process.env.MONGODB_URL) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URL"')
}

const uri = process.env.MONGODB_URL
console.log('MongoDB URI (masked):', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'))

const options = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    // Add connection timeout and retry settings
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
    retryWrites: true,
    retryReads: true,
}

let client: MongoClient

if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    const globalWithMongo = global as typeof globalThis & {
        _mongoClient?: MongoClient
    }

    if (!globalWithMongo._mongoClient) {
        console.log('Creating new MongoDB client in development mode')
        globalWithMongo._mongoClient = new MongoClient(uri, options)
    }
    client = globalWithMongo._mongoClient
} else {
    // In production mode, it's best to not use a global variable.
    console.log('Creating new MongoDB client in production mode')
    client = new MongoClient(uri, options)
}

// Test the connection
const testConnection = async () => {
    try {
        console.log('Testing MongoDB connection...')
        await client.connect()
        console.log('✅ MongoDB connection successful')
        await client.db('admin').command({ ping: 1 })
        console.log('✅ MongoDB ping successful')
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error)
        throw error
    }
}

// Test connection on module load (only in development)
if (process.env.NODE_ENV === "development") {
    testConnection().catch(console.error)
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client
export const db = client.db('ihuusa')
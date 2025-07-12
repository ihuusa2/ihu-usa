import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection
const uri = process.env.MONGODBURL;
if (!uri) {
    throw new Error('MONGODBURL environment variable is required');
}

const client = new MongoClient(uri);
const db = client.db('ihuusa');

async function testConnection() {
    try {
        console.log('🔌 Testing MongoDB connection...');
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');
        
        // Test database access
        const collections = await db.listCollections().toArray();
        console.log('📋 Available collections:', collections.map(c => c.name));
        
        // Test each collection
        const testCollections = ['Registration', 'Users', 'Courses', 'Teams', 'Blogs', 'Events', 'FAQ'];
        
        for (const collectionName of testCollections) {
            try {
                const collection = db.collection(collectionName);
                const count = await collection.countDocuments();
                console.log(`✅ ${collectionName}: ${count} documents`);
            } catch (error) {
                console.log(`⚠️  ${collectionName}: Collection not found or error accessing`);
            }
        }
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
    } finally {
        await client.close();
        console.log('🔌 Connection closed.');
    }
}

// Run test
testConnection().catch(console.error); 
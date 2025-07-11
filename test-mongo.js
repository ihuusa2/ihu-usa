import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

async function testMongoConnection() {
    const uri = process.env.MONGODBURL;
    console.log('Testing MongoDB connection...');
    console.log('URI (masked):', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    const client = new MongoClient(uri, {
        serverApi: {
            version: '1',
            strict: true,
            deprecationErrors: true,
        },
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 10000,
    });

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');
        
        // Test the database
        const db = client.db('ihuusa');
        console.log('✅ Database "ihuusa" accessed successfully!');
        
        // Test a simple query
        const collections = await db.listCollections().toArray();
        console.log('✅ Available collections:', collections.map(c => c.name));
        
        // Test the Blogs collection specifically
        const blogsCollection = db.collection('Blogs');
        const blogCount = await blogsCollection.countDocuments();
        console.log(`✅ Blogs collection has ${blogCount} documents`);
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            hostname: error.hostname
        });
    } finally {
        await client.close();
        console.log('Connection closed.');
    }
}

testMongoConnection(); 
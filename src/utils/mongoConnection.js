const mongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;


let db;


const connectToMongo=async()=>{
    if (db) {
        return db;
    }
    try {
        const client = await mongoClient.connect(MONGO_URI);
        db = client.db(dbName);
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectToMongo first.');
    }
    return db;
}   

module.exports={connectToMongo, getDb};
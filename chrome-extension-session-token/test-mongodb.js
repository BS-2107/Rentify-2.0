// Test script to clear MongoDB database and test connection
// Run this with Node.js: node test-mongodb.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://sahajgupta12345:1248@cluster0.ebdiiuk.mongodb.net/user";
const DATABASE_NAME = "tockens";
const COLLECTION_NAME = "session_tokens";

async function testMongoDB() {
  let client;
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Get database and collection
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Step 1: Clear all existing data
    console.log('🗑️ Clearing existing data...');
    const deleteResult = await collection.deleteMany({});
    console.log(`🧹 Deleted ${deleteResult.deletedCount} existing documents`);
    
    // Step 2: Insert a test document
    console.log('📝 Inserting test document...');
    const testDocument = {
      _id: `test_token_${Date.now()}`,
      domain: 'test.example.com',
      url: 'https://test.example.com/dashboard',
      tokens: {
        access_token: 'test_access_123',
        session_id: 'test_session_456'
      },
      cookies: {
        auth_cookie: 'test_cookie_789',
        session_cookie: 'test_session_abc'
      },
      localStorage: {
        user_data: 'test_user_data',
        api_key: 'test_api_key_xyz'
      },
      sessionStorage: {
        temp_token: 'test_temp_123'
      },
      timestamp: new Date().toISOString(),
      userAgent: 'Test-Agent/1.0',
      source: 'test-script',
      status: 'active',
      createdAt: new Date()
    };
    
    const insertResult = await collection.insertOne(testDocument);
    console.log('✅ Test document inserted with ID:', insertResult.insertedId);
    
    // Step 3: Verify the insert
    console.log('🔍 Verifying insert...');
    const foundDocument = await collection.findOne({ _id: testDocument._id });
    
    if (foundDocument) {
      console.log('✅ Document found successfully!');
      console.log('📊 Document data:');
      console.log('  - Domain:', foundDocument.domain);
      console.log('  - URL:', foundDocument.url);
      console.log('  - Tokens count:', Object.keys(foundDocument.tokens).length);
      console.log('  - Cookies count:', Object.keys(foundDocument.cookies).length);
      console.log('  - Created at:', foundDocument.createdAt);
    } else {
      console.log('❌ Document not found after insert!');
    }
    
    // Step 4: Count total documents
    const count = await collection.countDocuments();
    console.log(`📈 Total documents in collection: ${count}`);
    
    // Step 5: Clean up test document
    console.log('🧹 Cleaning up test document...');
    await collection.deleteOne({ _id: testDocument._id });
    console.log('✅ Test document cleaned up');
    
    console.log('\n🎉 MongoDB test completed successfully!');
    console.log('💡 Your extension should now be able to save tokens to this database.');
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
    console.error('🔧 Error details:', error);
    
    // Common error solutions
    console.log('\n🛠️ Troubleshooting:');
    console.log('1. Check if your IP address is whitelisted in MongoDB Atlas');
    console.log('2. Verify the connection string is correct');
    console.log('3. Ensure the database user has read/write permissions');
    console.log('4. Check if the cluster is running and accessible');
    
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
}

// Run the test
testMongoDB();

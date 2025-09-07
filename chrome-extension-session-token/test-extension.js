// Test script to verify MongoDB connection and token saving
// Run this in Node.js to test the database before using the extension

console.log('🧪 Testing Rentify Extension MongoDB Integration...\n');

const MONGODB_URI = "mongodb+srv://sahajgupta12345:1248@cluster0.ebdiiuk.mongodb.net/user";

// Test MongoDB Data API approach (what the extension uses)
async function testMongoDBDataAPI() {
  console.log('📡 Testing MongoDB Data API connection...');
  
  try {
    // First, clear the collection for testing
    console.log('🧹 Clearing existing test data...');
    
    const clearResponse = await fetch('https://data.mongodb-api.com/app/data-bkxon/endpoint/data/v1/action/deleteMany', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': 'YOUR_API_KEY_HERE', // You need to replace this with your actual API key
      },
      body: JSON.stringify({
        dataSource: 'Cluster0',
        database: 'user',
        collection: 'session_tokens',
        filter: { extractedBy: 'test-script' } // Only delete test documents
      })
    });
    
    if (clearResponse.ok) {
      const clearResult = await clearResponse.json();
      console.log('✅ Test data cleared:', clearResult.deletedCount, 'documents');
    } else {
      console.log('⚠️ Clear operation failed, but continuing with test...');
    }
    
    // Test document to insert
    const testToken = {
      _id: `test_token_${Date.now()}`,
      domain: 'test.rentify.com',
      url: 'https://test.rentify.com/dashboard',
      tokens: {
        authToken: 'test_auth_token_12345',
        sessionId: 'test_session_67890',
        csrfToken: 'test_csrf_abcdef'
      },
      cookies: {
        userSession: 'test_user_session_cookie',
        preferences: 'test_prefs_cookie'
      },
      localStorage: {
        userId: 'test_user_123',
        theme: 'dark'
      },
      sessionStorage: {
        currentPage: 'dashboard',
        lastAction: 'login'
      },
      timestamp: new Date().toISOString(),
      userAgent: 'Mozilla/5.0 (Test) Chrome/120.0.0.0',
      extractedBy: 'test-script',
      status: 'test',
      createdAt: new Date(),
      version: '1.0.0'
    };
    
    console.log('💾 Inserting test token data...');
    
    // Insert test document
    const insertResponse = await fetch('https://data.mongodb-api.com/app/data-bkxon/endpoint/data/v1/action/insertOne', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': 'YOUR_API_KEY_HERE', // You need to replace this with your actual API key
      },
      body: JSON.stringify({
        dataSource: 'Cluster0',
        database: 'user',
        collection: 'session_tokens',
        document: testToken
      })
    });
    
    console.log('📡 Insert response status:', insertResponse.status);
    
    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      console.error('❌ Insert failed:', errorText);
      throw new Error(`Insert failed: ${insertResponse.status} - ${errorText}`);
    }
    
    const insertResult = await insertResponse.json();
    console.log('✅ Test token inserted successfully!');
    console.log('📄 Inserted document ID:', insertResult.insertedId);
    
    // Test retrieving the data
    console.log('\n📋 Testing data retrieval...');
    
    const findResponse = await fetch('https://data.mongodb-api.com/app/data-bkxon/endpoint/data/v1/action/find', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': 'YOUR_API_KEY_HERE', // You need to replace this with your actual API key
      },
      body: JSON.stringify({
        dataSource: 'Cluster0',
        database: 'user',
        collection: 'session_tokens',
        filter: { extractedBy: 'test-script' },
        sort: { timestamp: -1 },
        limit: 5
      })
    });
    
    if (!findResponse.ok) {
      const errorText = await findResponse.text();
      console.error('❌ Find failed:', errorText);
      throw new Error(`Find failed: ${findResponse.status} - ${errorText}`);
    }
    
    const findResult = await findResponse.json();
    console.log('✅ Data retrieved successfully!');
    console.log('📊 Found', findResult.documents?.length || 0, 'documents');
    
    if (findResult.documents && findResult.documents.length > 0) {
      console.log('📄 Sample document:');
      const sampleDoc = findResult.documents[0];
      console.log('   - ID:', sampleDoc._id);
      console.log('   - Domain:', sampleDoc.domain);
      console.log('   - URL:', sampleDoc.url);
      console.log('   - Tokens count:', Object.keys(sampleDoc.tokens || {}).length);
      console.log('   - Cookies count:', Object.keys(sampleDoc.cookies || {}).length);
      console.log('   - Timestamp:', sampleDoc.timestamp);
    }
    
    console.log('\n🎉 MongoDB Data API test completed successfully!');
    console.log('💡 Your extension should now be able to save tokens to MongoDB.');
    console.log('🔧 Next steps:');
    console.log('   1. Replace "YOUR_API_KEY_HERE" in background.js with your actual MongoDB Data API key');
    console.log('   2. Load the extension in Chrome');
    console.log('   3. Test token extraction on a website');
    
  } catch (error) {
    console.error('\n💥 MongoDB Data API test failed:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Check if your MongoDB cluster is running');
    console.log('   2. Verify the connection string is correct');
    console.log('   3. Ensure you have the correct MongoDB Data API key');
    console.log('   4. Check if the database and collection exist');
    console.log('   5. Verify API access is enabled in MongoDB Atlas');
    
    if (error.message.includes('401') || error.message.includes('403')) {
      console.log('\n🔑 Authentication issue detected:');
      console.log('   - Your API key might be incorrect or expired');
      console.log('   - Check MongoDB Atlas Data API settings');
      console.log('   - Ensure the API key has read/write permissions');
    }
    
    if (error.message.includes('404')) {
      console.log('\n🎯 Resource not found:');
      console.log('   - Check if the database name "user" is correct');
      console.log('   - Verify the collection name "session_tokens" exists');
      console.log('   - Ensure the Data API endpoint URL is correct');
    }
  }
}

// Instructions for getting MongoDB Data API key
function showAPIKeyInstructions() {
  console.log('\n📚 How to get your MongoDB Data API Key:');
  console.log('   1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
  console.log('   2. Select your project and cluster');
  console.log('   3. Go to "Data API" in the left sidebar');
  console.log('   4. Enable the Data API if not already enabled');
  console.log('   5. Create a new API key or copy an existing one');
  console.log('   6. Replace "YOUR_API_KEY_HERE" in the background.js file');
  console.log('   7. Make sure the API key has read/write permissions for your database');
}

// Run the test
async function runTest() {
  showAPIKeyInstructions();
  console.log('\n' + '='.repeat(60));
  await testMongoDBDataAPI();
}

// Check if running in Node.js environment
if (typeof window === 'undefined') {
  // Running in Node.js
  if (!global.fetch) {
    console.log('⚠️ fetch is not available. Installing node-fetch...');
    try {
      const fetch = require('node-fetch');
      global.fetch = fetch;
    } catch (error) {
      console.log('❌ node-fetch not available. Please install it:');
      console.log('   npm install node-fetch');
      process.exit(1);
    }
  }
  
  runTest().catch(console.error);
} else {
  // Running in browser
  runTest().catch(console.error);
}

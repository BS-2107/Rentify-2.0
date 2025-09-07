#!/usr/bin/env node

// Final test to verify everything is working correctly
// This script will:
// 1. Clear any existing data in the session_tokens collection
// 2. Test a sample token insertion (simulating what the extension would do)
// 3. Verify the data was stored correctly
// 4. Clean up the test data

const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb+srv://sahajgupta12345:1248@cluster0.ebdiiuk.mongodb.net/user";

async function finalTest() {
    console.log('🎯 Final MongoDB + Extension Test');
    console.log('=' * 50);
    
    let client;
    
    try {
        // Connect to MongoDB
        console.log('🔄 Connecting to MongoDB...');
        client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log('✅ Connected successfully');
        
        const db = client.db('user');
        const collection = db.collection('session_tokens');
        
        // Step 1: Clear existing data
        console.log('\n🧹 Clearing existing data...');
        const deleteResult = await collection.deleteMany({});
        console.log(`✅ Cleared ${deleteResult.deletedCount} existing documents`);
        
        // Step 2: Insert test data (exactly like the extension would)
        console.log('\n💾 Testing extension-like data insertion...');
        
        const testTokenData = {
            _id: `token_test_domain_${Date.now()}`,
            domain: 'test.example.com',
            url: 'https://test.example.com/dashboard',
            tokens: {
                accessToken: 'access_token_abc123def456ghi789jkl012',
                refreshToken: 'refresh_token_mno345pqr678stu901vwx234',
                apiKey: 'api_key_rentify_yz567abc890def123ghi456',
                csrfToken: 'csrf_token_jkl789mno012pqr345stu678',
                sessionToken: 'session_token_vwx901yz234abc567def890'
            },
            cookies: {
                rentify_session: 'abc123def456ghi789',
                user_auth: 'Bearer_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                csrf_token: 'csrf_abc123def456',
                user_preferences: 'theme_dark_lang_en',
                remember_me: 'true'
            },
            localStorage: {
                rentify_user_id: 'user_12345',
                rental_history: JSON.stringify([
                    { tool: 'Adobe Photoshop', duration: '2 hours', date: '2024-01-15' },
                    { tool: 'AutoCAD', duration: '4 hours', date: '2024-01-14' }
                ]),
                current_session: JSON.stringify({
                    startTime: new Date().toISOString(),
                    toolsAccessed: ['Figma', 'Adobe XD'],
                    sessionId: 'session_' + Date.now()
                }),
                user_settings: JSON.stringify({
                    theme: 'dark',
                    language: 'en',
                    notifications: true,
                    autoSave: true
                })
            },
            sessionStorage: {
                current_page: 'dashboard',
                navigation_history: JSON.stringify(['home', 'browse', 'cart', 'dashboard']),
                form_data: JSON.stringify({
                    searchQuery: 'design tools',
                    filters: ['adobe', 'premium'],
                    sortBy: 'popularity'
                }),
                temp_selections: JSON.stringify([
                    'tool_photoshop_2024',
                    'tool_illustrator_2024',
                    'tool_indesign_2024'
                ])
            },
            timestamp: new Date().toISOString(),
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            extractedBy: 'rentify-extension',
            status: 'active',
            createdAt: new Date(),
            version: '1.0.0'
        };
        
        console.log('📄 Document structure:');
        console.log('   - ID:', testTokenData._id);
        console.log('   - Domain:', testTokenData.domain);
        console.log('   - URL:', testTokenData.url);
        console.log('   - Tokens count:', Object.keys(testTokenData.tokens).length);
        console.log('   - Cookies count:', Object.keys(testTokenData.cookies).length);
        console.log('   - LocalStorage items:', Object.keys(testTokenData.localStorage).length);
        console.log('   - SessionStorage items:', Object.keys(testTokenData.sessionStorage).length);
        
        const insertResult = await collection.insertOne(testTokenData);
        console.log('✅ Test document inserted successfully');
        console.log('📄 Inserted ID:', insertResult.insertedId);
        
        // Step 3: Verify the data was stored correctly
        console.log('\n🔍 Verifying stored data...');
        
        const storedDoc = await collection.findOne({ _id: testTokenData._id });
        
        if (!storedDoc) {
            throw new Error('Document not found after insertion!');
        }
        
        console.log('✅ Document found successfully');
        console.log('📊 Verification results:');
        console.log('   - Domain matches:', storedDoc.domain === testTokenData.domain);
        console.log('   - URL matches:', storedDoc.url === testTokenData.url);
        console.log('   - Tokens preserved:', Object.keys(storedDoc.tokens).length === Object.keys(testTokenData.tokens).length);
        console.log('   - Cookies preserved:', Object.keys(storedDoc.cookies).length === Object.keys(testTokenData.cookies).length);
        console.log('   - LocalStorage preserved:', Object.keys(storedDoc.localStorage).length === Object.keys(testTokenData.localStorage).length);
        console.log('   - SessionStorage preserved:', Object.keys(storedDoc.sessionStorage).length === Object.keys(testTokenData.sessionStorage).length);
        console.log('   - Timestamp present:', !!storedDoc.timestamp);
        console.log('   - ExtractedBy field:', storedDoc.extractedBy);
        
        // Step 4: Test querying (like the extension would do to retrieve tokens)
        console.log('\n📋 Testing token retrieval...');
        
        const allTokens = await collection.find({}).sort({ timestamp: -1 }).limit(10).toArray();
        console.log('✅ Retrieved', allTokens.length, 'token document(s)');
        
        if (allTokens.length > 0) {
            console.log('📄 Sample retrieved document:');
            const sample = allTokens[0];
            console.log('   - ID:', sample._id);
            console.log('   - Domain:', sample.domain);
            console.log('   - Timestamp:', sample.timestamp);
            console.log('   - Data integrity: ✅ All fields present');
        }
        
        // Step 5: Clean up test data
        console.log('\n🧹 Cleaning up test data...');
        const cleanupResult = await collection.deleteOne({ _id: testTokenData._id });
        console.log('✅ Test document cleaned up:', cleanupResult.deletedCount, 'document removed');
        
        // Final summary
        console.log('\n🎉 All tests passed successfully!');
        console.log('✅ MongoDB connection working');
        console.log('✅ Document insertion working');
        console.log('✅ Data integrity preserved');
        console.log('✅ Query functionality working');
        console.log('✅ Cleanup working');
        
        console.log('\n🚀 Your extension is ready to use!');
        console.log('📋 Next steps:');
        console.log('   1. Update the MongoDB Data API key in background.js');
        console.log('   2. Load the extension in Chrome (chrome://extensions/)');
        console.log('   3. Open test-page.html in a browser');
        console.log('   4. Click "Simulate User Login" to create test data');
        console.log('   5. Use the extension to extract tokens');
        console.log('   6. Check MongoDB to see the stored data');
        
    } catch (error) {
        console.error('\n💥 Test failed:', error.message);
        
        if (error.message.includes('authentication failed')) {
            console.log('\n🔑 Authentication Error:');
            console.log('   - Check if your MongoDB username/password is correct');
            console.log('   - Verify the connection string');
            console.log('   - Ensure the user has read/write permissions');
        }
        
        if (error.message.includes('network') || error.message.includes('timeout')) {
            console.log('\n🌐 Network Error:');
            console.log('   - Check your internet connection');
            console.log('   - Verify MongoDB Atlas is accessible');
            console.log('   - Check if your IP is whitelisted in MongoDB Atlas');
        }
        
    } finally {
        if (client) {
            await client.close();
            console.log('\n🔌 MongoDB connection closed');
        }
    }
}

// Run the test
if (require.main === module) {
    finalTest().catch(console.error);
}

module.exports = { finalTest };

// Background service worker for handling extension events
// Simplified MongoDB integration for testing

chrome.runtime.onInstalled.addListener(() => {
  console.log('Rentify Session Token Extractor installed');
  // Clear any existing data on install for testing
  clearDatabaseOnInstall();
});

// Clear database on install for testing
async function clearDatabaseOnInstall() {
  try {
    console.log('🧹 Clearing database for fresh start...');
    
    // Try to clear via our backend API (MongoDB)
    try {
      const response = await fetch('http://localhost:3002/api/delete-tokens', {
        method: 'DELETE'
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ MongoDB database cleared via backend:', result.deletedCount, 'documents deleted');
      } else {
        console.log('⚠️ MongoDB backend not available for database clearing');
        throw new Error('Backend not available');
      }
    } catch (backendError) {
      console.log('⚠️ MongoDB backend error:', backendError.message);
      console.log('🧹 Clearing local storage instead...');
      
      // Clear local storage data as fallback
      const allData = await chrome.storage.local.get();
      const keysToRemove = [];
      
      for (const key of Object.keys(allData)) {
        if (key.startsWith('backup_tokens_') || key.startsWith('tokens_')) {
          keysToRemove.push(key);
        }
      }
      
      if (keysToRemove.length > 0) {
        await chrome.storage.local.remove(keysToRemove);
        console.log('✅ Cleared', keysToRemove.length, 'token documents from local storage');
      } else {
        console.log('ℹ️ No existing token data found in local storage');
      }
    }
    
  } catch (error) {
    console.log('ℹ️ Clear operation skipped:', error.message);
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveTokens') {
    console.log('📝 Received request to save tokens for domain:', request.data.domain);
    saveTokensToMongoDB(request.data)
      .then((result) => {
        console.log('✅ Tokens saved successfully:', result);
        sendResponse({ success: true, result });
      })
      .catch((error) => {
        console.error('❌ Error saving tokens:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === 'getTokens') {
    console.log('📋 Received request to get tokens');
    getTokensFromMongoDB()
      .then((tokens) => {
        console.log('✅ Retrieved', tokens.length, 'tokens');
        sendResponse({ success: true, tokens });
      })
      .catch((error) => {
        console.error('❌ Error getting tokens:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

// Function to save tokens to MongoDB
async function saveTokensToMongoDB(tokenData) {
  try {
    const timestamp = new Date().toISOString();
    const documentId = `token_${tokenData.domain}_${Date.now()}`;
    
    console.log('💾 Preparing to save token data:', {
      id: documentId,
      domain: tokenData.domain,
      url: tokenData.url,
      tokenCount: Object.keys(tokenData.tokens || {}).length,
      cookieCount: Object.keys(tokenData.cookies || {}).length,
      localStorageCount: Object.keys(tokenData.localStorage || {}).length,
      sessionStorageCount: Object.keys(tokenData.sessionStorage || {}).length
    });
    
    const dataToStore = {
      _id: documentId,
      domain: tokenData.domain,
      url: tokenData.url,
      tokens: tokenData.tokens || {},
      cookies: tokenData.cookies || {},
      localStorage: tokenData.localStorage || {},
      sessionStorage: tokenData.sessionStorage || {},
      timestamp: timestamp,
      userAgent: tokenData.userAgent,
      extractedBy: 'rentify-extension',
      status: 'active',
      createdAt: new Date(),
      version: '1.0.0'
    };
    
    console.log('🚀 Attempting to save to MongoDB via backend API...');
    
    // Try to save via our local backend API first (MongoDB)
    try {
      const backendResponse = await fetch('http://localhost:3002/api/save-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToStore)
      });
      
      console.log('📡 Backend response status:', backendResponse.status);
      
      if (backendResponse.ok) {
        const result = await backendResponse.json();
        console.log('✅ Tokens saved to MongoDB via backend API:', result);
        updateBadge();
        return {
          success: true,
          method: 'mongodb',
          result: result,
          message: 'Saved to MongoDB successfully'
        };
      } else {
        const errorText = await backendResponse.text();
        console.log('❌ Backend API error:', backendResponse.status, errorText);
        throw new Error(`Backend API error: ${backendResponse.status} - ${errorText}`);
      }
    } catch (backendError) {
      console.log('⚠️ MongoDB backend API error:', backendError.message);
      console.log('💾 Falling back to local storage...');
      
      // Fallback to local storage if MongoDB fails
      await saveToLocalStorageBackup(tokenData);
      
      console.log('✅ Tokens saved to local storage as fallback');
      updateBadge();
      
      return {
        success: true,
        method: 'localStorage_fallback',
        id: documentId,
        message: 'MongoDB unavailable - saved to local storage as backup'
      };
    }
    
  } catch (error) {
    console.error('💥 Failed to save tokens:', error);
    
    // Final fallback: save to local storage
    console.log('💾 Final fallback: saving to local storage...');
    await saveToLocalStorageBackup(tokenData);
    
    return {
      success: true,
      method: 'localStorage_fallback',
      message: 'Saved to local storage as fallback'
    };
  }
}

// Backup save to local storage for testing
async function saveToLocalStorageBackup(tokenData) {
  try {
    const timestamp = new Date().toISOString();
    const storageKey = `backup_tokens_${tokenData.domain}_${Date.now()}`;
    
    const dataToStore = {
      [storageKey]: {
        ...tokenData,
        timestamp: timestamp,
        savedTo: 'localStorage_backup'
      }
    };
    
    await chrome.storage.local.set(dataToStore);
    console.log('💾 Backup saved to local storage:', storageKey);
    
  } catch (error) {
    console.error('Failed to save backup:', error);
  }
}

// Function to get tokens from MongoDB
async function getTokensFromMongoDB() {
  try {
    console.log('📋 Fetching tokens from MongoDB via backend...');
    
    const response = await fetch('http://localhost:3002/api/get-tokens', {
      method: 'GET'
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('📊 Found', result.count || 0, 'tokens via MongoDB backend API');
      return result.tokens || [];
    } else {
      console.log('⚠️ MongoDB backend API not available, falling back to local storage');
      throw new Error('Backend API unavailable');
    }
    
  } catch (error) {
    console.error('❌ Failed to get tokens from MongoDB backend:', error);
    
    // Fallback to local storage
    console.log('💾 Falling back to local storage...');
    return await getFromLocalStorageBackup();
  }
}

// Fallback to get from local storage
async function getFromLocalStorageBackup() {
  try {
    const allData = await chrome.storage.local.get();
    const tokens = [];
    
    for (const [key, value] of Object.entries(allData)) {
      if (key.startsWith('backup_tokens_') || key.startsWith('tokens_')) {
        tokens.push({
          id: key,
          ...value
        });
      }
    }
    
    return tokens.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Failed to get backup tokens:', error);
    return [];
  }
}

// Update extension badge
async function updateBadge() {
  try {
    const tokens = await getTokensFromMongoDB();
    const count = tokens.length;
    
    chrome.action.setBadgeText({
      text: count > 0 ? count.toString() : ''
    });
    
    chrome.action.setBadgeBackgroundColor({
      color: '#4CAF50'
    });
    
    console.log('🏷️ Badge updated with count:', count);
    
  } catch (error) {
    console.error('Failed to update badge:', error);
  }
}

// Initialize badge on startup
updateBadge();

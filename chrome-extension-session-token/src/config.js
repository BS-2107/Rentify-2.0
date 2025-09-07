// Configuration for Rentify Token Extractor
const CONFIG = {
  // MongoDB Configuration
  mongodb: {
    // MongoDB Atlas Data API URL (replace YOUR_APP_ID with your actual App ID)
    dataApiUrl: 'https://data.mongodb-api.com/app/data-YOUR_APP_ID/endpoint/data/v1',
    
    // Your MongoDB Atlas Data API Key
    apiKey: 'YOUR_MONGODB_DATA_API_KEY', // Get this from MongoDB Atlas
    
    // Database configuration
    dataSource: 'Cluster0',
    database: 'user',
    collection: 'session_tokens'
  },
  
  // Alternative API endpoint (if you deploy your own backend)
  api: {
    baseUrl: 'https://your-app.vercel.app/api', // Replace with your deployed API
    endpoints: {
      save: '/tokens/save',
      list: '/tokens/list',
      delete: '/tokens/delete'
    },
    
    // API Authentication (if required)
    auth: {
      type: 'bearer', // or 'api-key'
      token: 'your-api-token' // Replace with your auth token
    }
  },
  
  // Extension settings
  extension: {
    version: '1.0.0',
    fallbackToLocalStorage: true, // Use local storage if MongoDB fails
    maxTokensPerDomain: 100, // Limit tokens per domain
    autoCleanup: {
      enabled: true,
      olderThanDays: 30 // Auto-delete tokens older than 30 days
    }
  },
  
  // Token extraction patterns
  tokenPatterns: [
    /(?:access_token|accessToken|auth_token|authToken|token)['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi,
    /(?:session|sessionId|session_id)['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi,
    /(?:jwt|bearer)['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi,
    /(?:api_key|apiKey|key)['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi,
    /(?:csrf_token|csrfToken)['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi,
    /(?:refresh_token|refreshToken)['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi
  ],
  
  // Sites to skip (browser internal pages, etc.)
  skipSites: [
    'chrome://',
    'chrome-extension://',
    'edge://',
    'about:',
    'moz-extension://',
    'safari-extension://'
  ]
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else if (typeof window !== 'undefined') {
  window.RENTIFY_CONFIG = CONFIG;
}

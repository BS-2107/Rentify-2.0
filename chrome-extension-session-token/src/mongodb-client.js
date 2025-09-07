// MongoDB Atlas Data API integration for Chrome Extension
// This file provides direct MongoDB operations without a backend server

class MongoDBClient {
  constructor() {
    // MongoDB Atlas Data API configuration
    this.dataApiUrl = 'https://data.mongodb-api.com/app/data-bkxon/endpoint/data/v1';
    this.apiKey = 'YOUR_MONGODB_DATA_API_KEY'; // You need to get this from MongoDB Atlas
    this.dataSource = 'Cluster0';
    this.database = 'user';
    this.collection = 'session_tokens';
  }

  // Generic method to make requests to MongoDB Data API
  async makeRequest(action, payload) {
    try {
      const response = await fetch(`${this.dataApiUrl}/action/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          dataSource: this.dataSource,
          database: this.database,
          collection: this.collection,
          ...payload
        })
      });

      if (!response.ok) {
        throw new Error(`MongoDB API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('MongoDB request failed:', error);
      throw error;
    }
  }

  // Save tokens to MongoDB
  async saveTokens(tokenData) {
    try {
      const document = {
        ...tokenData,
        _id: `token_${tokenData.domain}_${Date.now()}`,
        createdAt: new Date(),
        serverTimestamp: new Date().toISOString(),
        source: 'rentify-extension',
        status: 'active'
      };

      const result = await this.makeRequest('insertOne', {
        document: document
      });

      console.log('Token saved to MongoDB:', result);
      return result;
    } catch (error) {
      console.error('Error saving tokens to MongoDB:', error);
      throw error;
    }
  }

  // Get tokens from MongoDB
  async getTokens(query = {}, options = {}) {
    try {
      const { limit = 100, sort = { timestamp: -1 } } = options;

      const result = await this.makeRequest('find', {
        filter: query,
        sort: sort,
        limit: limit
      });

      return result.documents || [];
    } catch (error) {
      console.error('Error getting tokens from MongoDB:', error);
      throw error;
    }
  }

  // Get tokens by domain
  async getTokensByDomain(domain) {
    return await this.getTokens({ domain });
  }

  // Delete token by ID
  async deleteToken(tokenId) {
    try {
      const result = await this.makeRequest('deleteOne', {
        filter: { _id: tokenId }
      });

      return result;
    } catch (error) {
      console.error('Error deleting token:', error);
      throw error;
    }
  }

  // Delete all tokens for a domain
  async deleteTokensByDomain(domain) {
    try {
      const result = await this.makeRequest('deleteMany', {
        filter: { domain }
      });

      return result;
    } catch (error) {
      console.error('Error deleting tokens by domain:', error);
      throw error;
    }
  }

  // Clear all tokens
  async clearAllTokens() {
    try {
      const result = await this.makeRequest('deleteMany', {
        filter: {}
      });

      return result;
    } catch (error) {
      console.error('Error clearing all tokens:', error);
      throw error;
    }
  }

  // Count tokens
  async countTokens(query = {}) {
    try {
      const result = await this.makeRequest('aggregate', {
        pipeline: [
          { $match: query },
          { $count: "total" }
        ]
      });

      return result.documents[0]?.total || 0;
    } catch (error) {
      console.error('Error counting tokens:', error);
      return 0;
    }
  }

  // Get storage statistics
  async getStorageStats() {
    try {
      const result = await this.makeRequest('aggregate', {
        pipeline: [
          {
            $group: {
              _id: null,
              totalTokens: { $sum: 1 },
              domains: { $addToSet: "$domain" },
              oldestToken: { $min: "$timestamp" },
              newestToken: { $max: "$timestamp" }
            }
          }
        ]
      });

      const stats = result.documents[0] || {
        totalTokens: 0,
        domains: [],
        oldestToken: null,
        newestToken: null
      };

      return {
        ...stats,
        uniqueDomains: stats.domains.length
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalTokens: 0,
        domains: [],
        uniqueDomains: 0,
        oldestToken: null,
        newestToken: null
      };
    }
  }
}

// Export for use in extension
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MongoDBClient;
} else if (typeof window !== 'undefined') {
  window.MongoDBClient = MongoDBClient;
}

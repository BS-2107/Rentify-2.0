// Storage utility functions for the Rentify Token Extractor

class TokenStorage {
  
  // Save tokens to Chrome storage
  static async saveTokens(tokenData) {
    try {
      const timestamp = new Date().toISOString();
      const storageKey = `tokens_${tokenData.domain}_${Date.now()}`;
      
      const dataToStore = {
        [storageKey]: {
          ...tokenData,
          id: storageKey,
          timestamp: timestamp
        }
      };
      
      // Save the token data
      await chrome.storage.local.set(dataToStore);
      
      // Update the tokens list
      const { tokensList = [] } = await chrome.storage.local.get(['tokensList']);
      tokensList.push(storageKey);
      await chrome.storage.local.set({ tokensList });
      
      return storageKey;
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  }
  
  // Get all saved tokens
  static async getAllTokens() {
    try {
      const { tokensList = [] } = await chrome.storage.local.get(['tokensList']);
      const allTokens = [];
      
      for (const key of tokensList) {
        const tokenData = await chrome.storage.local.get([key]);
        if (tokenData[key]) {
          allTokens.push(tokenData[key]);
        }
      }
      
      return allTokens.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw error;
    }
  }
  
  // Get tokens by domain
  static async getTokensByDomain(domain) {
    try {
      const allTokens = await this.getAllTokens();
      return allTokens.filter(token => token.domain === domain);
    } catch (error) {
      console.error('Error getting tokens by domain:', error);
      throw error;
    }
  }
  
  // Delete a specific token
  static async deleteToken(tokenId) {
    try {
      // Remove the token data
      await chrome.storage.local.remove([tokenId]);
      
      // Update the tokens list
      const { tokensList = [] } = await chrome.storage.local.get(['tokensList']);
      const updatedList = tokensList.filter(id => id !== tokenId);
      await chrome.storage.local.set({ tokensList: updatedList });
      
      return true;
    } catch (error) {
      console.error('Error deleting token:', error);
      throw error;
    }
  }
  
  // Clear all tokens
  static async clearAllTokens() {
    try {
      await chrome.storage.local.clear();
      return true;
    } catch (error) {
      console.error('Error clearing all tokens:', error);
      throw error;
    }
  }
  
  // Export tokens to JSON
  static async exportTokens() {
    try {
      const allTokens = await this.getAllTokens();
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        tokens: allTokens
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting tokens:', error);
      throw error;
    }
  }
  
  // Import tokens from JSON
  static async importTokens(jsonData) {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.tokens || !Array.isArray(importData.tokens)) {
        throw new Error('Invalid import data format');
      }
      
      const importedCount = 0;
      
      for (const tokenData of importData.tokens) {
        try {
          await this.saveTokens(tokenData);
          importedCount++;
        } catch (error) {
          console.warn('Failed to import token:', error);
        }
      }
      
      return importedCount;
    } catch (error) {
      console.error('Error importing tokens:', error);
      throw error;
    }
  }
  
  // Get storage stats
  static async getStorageStats() {
    try {
      const { tokensList = [] } = await chrome.storage.local.get(['tokensList']);
      const allData = await chrome.storage.local.get();
      
      const stats = {
        totalTokens: tokensList.length,
        storageKeys: Object.keys(allData).length,
        domains: new Set(),
        oldestToken: null,
        newestToken: null
      };
      
      // Calculate additional stats
      for (const key of tokensList) {
        const tokenData = allData[key];
        if (tokenData) {
          stats.domains.add(tokenData.domain);
          
          const tokenDate = new Date(tokenData.timestamp);
          if (!stats.oldestToken || tokenDate < new Date(stats.oldestToken)) {
            stats.oldestToken = tokenData.timestamp;
          }
          if (!stats.newestToken || tokenDate > new Date(stats.newestToken)) {
            stats.newestToken = tokenData.timestamp;
          }
        }
      }
      
      stats.uniqueDomains = stats.domains.size;
      stats.domains = Array.from(stats.domains);
      
      return stats;
    } catch (error) {
      console.error('Error getting storage stats:', error);
      throw error;
    }
  }
  
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TokenStorage;
} else if (typeof window !== 'undefined') {
  window.TokenStorage = TokenStorage;
}

// Popup JavaScript for Rentify Token Extractor
document.addEventListener('DOMContentLoaded', function() {
  
  // Get DOM elements
  const extractBtn = document.getElementById('extractBtn');
  const createVMBtn = document.getElementById('createVMBtn');
  const viewTokensBtn = document.getElementById('viewTokensBtn');
  const clearTokensBtn = document.getElementById('clearTokensBtn');
  const statusMessage = document.getElementById('statusMessage');
  const tokenCount = document.getElementById('tokenCount');
  const tokensList = document.getElementById('tokensList');
  const tokensContainer = document.getElementById('tokensContainer');
  const currentDomain = document.getElementById('currentDomain');
  const currentUrl = document.getElementById('currentUrl');
  
  let isViewingTokens = false;
  
  // Initialize popup
  init();
  
  async function init() {
    try {
      // Get current page info
      await getCurrentPageInfo();
      
      // Update token count
      await updateTokenCount();
      
      showStatus('Ready to extract tokens', 'info');
    } catch (error) {
      console.error('Error initializing popup:', error);
      showStatus('Error initializing extension', 'error');
    }
  }
  
  // Get current page information
  async function getCurrentPageInfo() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        const url = new URL(tab.url);
        currentDomain.textContent = url.hostname;
        currentUrl.textContent = tab.url.length > 50 ? tab.url.substring(0, 50) + '...' : tab.url;
        
        // Send message to content script for more info
        chrome.tabs.sendMessage(tab.id, { action: 'getPageInfo' }, (response) => {
          if (response && response.success) {
            // Update with more detailed info if available
            currentDomain.textContent = response.pageInfo.domain;
            currentUrl.textContent = response.pageInfo.url.length > 50 ? 
              response.pageInfo.url.substring(0, 50) + '...' : 
              response.pageInfo.url;
          }
        });
      }
    } catch (error) {
      console.error('Error getting page info:', error);
      currentDomain.textContent = 'Unknown';
      currentUrl.textContent = 'Unknown';
    }
  }
  
  // Update token count display
  async function updateTokenCount() {
    try {
      const response = await sendMessage({ action: 'getTokens' });
      if (response.success) {
        const count = response.tokens.length;
        tokenCount.textContent = count > 0 ? `${count} token session${count === 1 ? '' : 's'} saved` : 'No tokens saved';
      }
    } catch (error) {
      console.error('Error updating token count:', error);
      tokenCount.textContent = 'Error loading count';
    }
  }
  
  // Show status message
  function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide after 3 seconds for non-error messages
    if (type !== 'error') {
      setTimeout(() => {
        statusMessage.style.display = 'none';
      }, 3000);
    }
  }
  
  // Send message to background script
  function sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  }
  
  // Extract tokens from current page
  async function extractTokens() {
    try {
      extractBtn.disabled = true;
      extractBtn.innerHTML = '<span class="loading">⏳</span> Extracting...';
      
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab) {
        throw new Error('No active tab found');
      }

      // Check if we can access this tab
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:')) {
        throw new Error('Cannot extract tokens from browser internal pages');
      }
      
      try {
        // First, try to inject the content script if it's not already there
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['src/content.js']
        });
      } catch (injectionError) {
        console.log('Content script might already be injected:', injectionError);
      }

      // Wait a bit for content script to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Try to send message to content script
      chrome.tabs.sendMessage(tab.id, { action: 'extractTokens' }, async (response) => {
        try {
          if (chrome.runtime.lastError) {
            console.error('Runtime error:', chrome.runtime.lastError);
            // If content script communication fails, extract directly
            await extractTokensDirectly(tab);
            return;
          }
          
          if (response && response.success) {
            const method = response.result && response.result.method ? response.result.method : 'storage';
            let message;
            if (method === 'mongodb') {
              message = 'Tokens saved successfully to MongoDB database! 🎉';
            } else if (method === 'localStorage_fallback') {
              message = 'Tokens saved to local storage (MongoDB unavailable)';
            } else {
              message = 'Tokens extracted and saved successfully!';
            }
            showStatus(message, 'success');
            await updateTokenCount();
          } else {
            throw new Error('Failed to extract tokens from content script');
          }
        } catch (error) {
          console.error('Error in extraction response:', error);
          // Fallback to direct extraction
          await extractTokensDirectly(tab);
        } finally {
          extractBtn.disabled = false;
          extractBtn.innerHTML = '🔍 Extract Tokens';
        }
      });
      
    } catch (error) {
      console.error('Error extracting tokens:', error);
      showStatus('Error: ' + error.message, 'error');
      extractBtn.disabled = false;
      extractBtn.innerHTML = '🔍 Extract Tokens';
    }
  }

  // Fallback method to extract tokens directly
  async function extractTokensDirectly(tab) {
    try {
      // Execute extraction script directly
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Direct token extraction function
          const domain = window.location.hostname;
          const url = window.location.href;
          
          // Extract cookies
          const cookies = {};
          if (document.cookie) {
            document.cookie.split(';').forEach(cookie => {
              const [name, value] = cookie.trim().split('=');
              if (name && value) {
                cookies[name] = value;
              }
            });
          }
          
          // Extract localStorage
          const localStorage = {};
          try {
            for (let i = 0; i < window.localStorage.length; i++) {
              const key = window.localStorage.key(i);
              const value = window.localStorage.getItem(key);
              localStorage[key] = value;
            }
          } catch (error) {
            console.log('Could not access localStorage:', error);
          }
          
          // Extract sessionStorage
          const sessionStorage = {};
          try {
            for (let i = 0; i < window.sessionStorage.length; i++) {
              const key = window.sessionStorage.key(i);
              const value = window.sessionStorage.getItem(key);
              sessionStorage[key] = value;
            }
          } catch (error) {
            console.log('Could not access sessionStorage:', error);
          }
          
          // Look for tokens in page
          const pageTokens = {};
          const scripts = document.querySelectorAll('script');
          scripts.forEach((script, index) => {
            const content = script.textContent || script.innerText;
            if (content) {
              const tokenPatterns = [
                /(?:access_token|accessToken|auth_token|authToken|token)['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi,
                /(?:session|sessionId|session_id)['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi,
                /(?:jwt|bearer)['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi,
                /(?:api_key|apiKey|key)['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi
              ];
              
              tokenPatterns.forEach((pattern, patternIndex) => {
                let match;
                while ((match = pattern.exec(content)) !== null) {
                  pageTokens[`script_${index}_pattern_${patternIndex}_${match[0].split(/[:=]/)[0].trim()}`] = match[1];
                }
              });
            }
          });
          
          return {
            domain,
            url,
            tokens: pageTokens,
            cookies,
            localStorage,
            sessionStorage,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          };
        }
      });

      if (results && results[0] && results[0].result) {
        const tokenData = results[0].result;
        
        // Save tokens using background script
        const response = await sendMessage({ action: 'saveTokens', data: tokenData });
        
        if (response && response.success) {
          const method = response.result && response.result.method ? response.result.method : 'storage';
          let message;
          if (method === 'mongodb') {
            message = 'Tokens saved successfully to MongoDB database! 🎉';
          } else if (method === 'localStorage_fallback') {
            message = 'Tokens saved to local storage (MongoDB unavailable)';
          } else {
            message = 'Tokens extracted and saved successfully!';
          }
          showStatus(message, 'success');
          await updateTokenCount();
        } else {
          throw new Error('Failed to save extracted tokens');
        }
      } else {
        throw new Error('No data extracted from page');
      }
      
    } catch (error) {
      console.error('Direct extraction failed:', error);
      showStatus('Error extracting tokens: ' + error.message, 'error');
    }
  }
  
  // View saved tokens
  async function viewTokens() {
    try {
      if (isViewingTokens) {
        // Hide tokens
        tokensList.style.display = 'none';
        viewTokensBtn.textContent = '👁️ View Saved Tokens';
        isViewingTokens = false;
        return;
      }
      
      viewTokensBtn.innerHTML = '<span class="loading">⏳</span> Loading...';
      
      const response = await sendMessage({ action: 'getTokens' });
      
      if (response.success) {
        displayTokens(response.tokens);
        tokensList.style.display = 'block';
        viewTokensBtn.textContent = '🙈 Hide Tokens';
        isViewingTokens = true;
      } else {
        throw new Error(response.error || 'Failed to load tokens');
      }
      
    } catch (error) {
      console.error('Error viewing tokens:', error);
      showStatus('Error loading tokens: ' + error.message, 'error');
    } finally {
      viewTokensBtn.innerHTML = '👁️ View Saved Tokens';
    }
  }
  
  // Display tokens in the UI
  function displayTokens(tokens) {
    tokensContainer.innerHTML = '';
    
    if (tokens.length === 0) {
      tokensContainer.innerHTML = '<p style="text-align: center; color: #798777; opacity: 0.7;">No tokens saved yet</p>';
      return;
    }
    
    tokens.forEach((tokenData, index) => {
      const tokenItem = document.createElement('div');
      tokenItem.className = 'token-item';
      
      const date = new Date(tokenData.timestamp);
      const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      
      const tokenCount = Object.keys(tokenData.tokens || {}).length +
                        Object.keys(tokenData.cookies || {}).length +
                        Object.keys(tokenData.localStorage || {}).length +
                        Object.keys(tokenData.sessionStorage || {}).length;
      
      tokenItem.innerHTML = `
        <div class="token-header">
          <div class="token-domain">${tokenData.domain}</div>
          <div class="token-timestamp">${formattedDate}</div>
        </div>
        <div class="token-details">
          ${tokenCount} items • ${tokenData.url.substring(0, 40)}${tokenData.url.length > 40 ? '...' : ''}
        </div>
        <div class="token-actions">
          <button class="btn-small btn-copy" onclick="copyTokenData('${tokenData.id}')">📋 Copy</button>
          <button class="btn-small btn-delete" onclick="deleteToken('${tokenData.id}')">🗑️ Delete</button>
        </div>
      `;
      
      tokensContainer.appendChild(tokenItem);
    });
  }
  
  // Clear all tokens
  async function clearAllTokens() {
    if (!confirm('Are you sure you want to delete all saved tokens? This action cannot be undone.')) {
      return;
    }
    
    try {
      clearTokensBtn.disabled = true;
      clearTokensBtn.innerHTML = '<span class="loading">⏳</span> Clearing...';
      
      // Clear from storage
      await chrome.storage.local.clear();
      
      showStatus('All tokens cleared successfully!', 'success');
      await updateTokenCount();
      
      // Hide tokens list if showing
      if (isViewingTokens) {
        tokensList.style.display = 'none';
        viewTokensBtn.textContent = '👁️ View Saved Tokens';
        isViewingTokens = false;
      }
      
    } catch (error) {
      console.error('Error clearing tokens:', error);
      showStatus('Error clearing tokens: ' + error.message, 'error');
    } finally {
      clearTokensBtn.disabled = false;
      clearTokensBtn.innerHTML = '🗑️ Clear All Tokens';
    }
  }
  
  // Create VM Session with extracted tokens
  async function createVMSession() {
    try {
      showStatus('🔄 Creating VM session...', 'info');
      createVMBtn.disabled = true;
      createVMBtn.innerHTML = '<span class="loading">⏳</span> Creating VM...';
      
      // Get latest tokens from current domain
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const domain = new URL(tab.url).hostname;
      
      // Request background script to create VM session
      const response = await chrome.runtime.sendMessage({ 
        action: 'createVMSession',
        domain: domain,
        url: tab.url
      });
      
      if (response.success) {
        showStatus(`✅ VM Session Created! <a href="${response.vncUrl}" target="_blank" style="color: #28a745; text-decoration: underline;">Open VNC</a>`, 'success');
        
        // Show VNC link prominently
        const vncLinkDiv = document.createElement('div');
        vncLinkDiv.style.cssText = `
          background: #d4edda;
          border: 2px solid #28a745;
          border-radius: 8px;
          padding: 15px;
          margin: 10px 0;
          text-align: center;
        `;
        vncLinkDiv.innerHTML = `
          <strong>🖥️ VM Session Ready!</strong><br>
          <a href="${response.vncUrl}" target="_blank" style="color: #28a745; font-size: 16px; text-decoration: none; font-weight: bold;">
            Click to Access VM
          </a><br>
          <small style="color: #666;">Session ID: ${response.sessionId}</small>
        `;
        
        statusMessage.appendChild(vncLinkDiv);
      } else {
        showStatus(`❌ Failed to create VM session: ${response.error}`, 'error');
      }
      
    } catch (error) {
      console.error('Error creating VM session:', error);
      showStatus(`❌ Error: ${error.message}`, 'error');
    } finally {
      createVMBtn.disabled = false;
      createVMBtn.innerHTML = '🖥️ Create VM Session';
    }
  }

  // Event listeners
  extractBtn.addEventListener('click', extractTokens);
  createVMBtn.addEventListener('click', createVMSession);
  viewTokensBtn.addEventListener('click', viewTokens);
  clearTokensBtn.addEventListener('click', clearAllTokens);
  
  // Global functions for token actions (called from dynamically created buttons)
  window.copyTokenData = async function(tokenId) {
    try {
      const tokenData = await chrome.storage.local.get([tokenId]);
      const data = tokenData[tokenId];
      
      if (data) {
        const copyText = JSON.stringify(data, null, 2);
        await navigator.clipboard.writeText(copyText);
        showStatus('Token data copied to clipboard!', 'success');
      }
    } catch (error) {
      console.error('Error copying token data:', error);
      showStatus('Error copying data', 'error');
    }
  };
  
  window.deleteToken = async function(tokenId) {
    if (!confirm('Are you sure you want to delete this token?')) {
      return;
    }
    
    try {
      // Remove from storage
      await chrome.storage.local.remove([tokenId]);
      
      // Update tokens list
      const { tokensList = [] } = await chrome.storage.local.get(['tokensList']);
      const updatedList = tokensList.filter(id => id !== tokenId);
      await chrome.storage.local.set({ tokensList: updatedList });
      
      showStatus('Token deleted successfully!', 'success');
      await updateTokenCount();
      
      // Refresh view if showing tokens
      if (isViewingTokens) {
        await viewTokens();
        await viewTokens(); // Call twice to refresh the display
      }
      
    } catch (error) {
      console.error('Error deleting token:', error);
      showStatus('Error deleting token', 'error');
    }
  };
  
});

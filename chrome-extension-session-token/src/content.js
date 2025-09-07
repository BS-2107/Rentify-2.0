// Content script to extract session tokens and storage data
(function() {
  'use strict';
  
  // Prevent multiple injections
  if (window.rentifyTokenExtractorLoaded) {
    return;
  }
  window.rentifyTokenExtractorLoaded = true;
  
  console.log('Rentify Token Extractor loaded on:', window.location.href);
  
  // Function to extract all possible session tokens
  function extractSessionTokens() {
    const tokens = {};
    const domain = window.location.hostname;
    const url = window.location.href;
    
    // Extract from cookies
    const cookies = {};
    try {
      if (document.cookie) {
        document.cookie.split(';').forEach(cookie => {
          const [name, value] = cookie.trim().split('=');
          if (name && value) {
            cookies[name] = value;
          }
        });
      }
    } catch (error) {
      console.log('Could not access cookies:', error);
    }
    
    // Extract from localStorage
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
    
    // Extract from sessionStorage
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
    
    // Look for common token patterns in the page
    const pageTokens = {};
    
    try {
      // Check for tokens in script tags
      const scripts = document.querySelectorAll('script');
      scripts.forEach((script, index) => {
        const content = script.textContent || script.innerText;
        if (content) {
          // Look for common token patterns
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
      
      // Check meta tags
      const metaTags = document.querySelectorAll('meta[name*="token"], meta[name*="auth"], meta[name*="session"]');
      metaTags.forEach((meta, index) => {
        const name = meta.getAttribute('name');
        const content = meta.getAttribute('content');
        if (name && content) {
          pageTokens[`meta_${name}`] = content;
        }
      });
    } catch (error) {
      console.log('Could not extract page tokens:', error);
    }
    
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
  
  // Function to send tokens to background script
  function sendTokensToBackground() {
    try {
      const tokenData = extractSessionTokens();
      
      chrome.runtime.sendMessage({
        action: 'saveTokens',
        data: tokenData
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending to background:', chrome.runtime.lastError);
          showNotification('Failed to save tokens', 'error');
          return;
        }
        
        if (response && response.success) {
          console.log('Tokens saved successfully');
          showNotification('Session tokens extracted and saved!', 'success');
        } else {
          console.error('Failed to save tokens:', response?.error);
          showNotification('Failed to save tokens', 'error');
        }
      });
    } catch (error) {
      console.error('Error in sendTokensToBackground:', error);
      showNotification('Error extracting tokens', 'error');
    }
  }
  
  // Function to show notification to user
  function showNotification(message, type = 'info') {
    try {
      // Create notification element
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Fade in
      setTimeout(() => {
        notification.style.opacity = '1';
      }, 100);
      
      // Remove after 3 seconds
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 3000);
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      if (request.action === 'extractTokens') {
        sendTokensToBackground();
        sendResponse({ success: true });
        return true;
      }
      
      if (request.action === 'getPageInfo') {
        sendResponse({
          success: true,
          pageInfo: {
            url: window.location.href,
            domain: window.location.hostname,
            title: document.title
          }
        });
        return true;
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  });
  
  // Signal that content script is ready
  console.log('Rentify Token Extractor content script ready');
  
})();

// Session Injection Service for Rentify VM System
const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');

class SessionInjector {
  constructor() {
    this.browser = null;
    this.page = null;
    this.sessionData = null;
    this.targetUrl = null;
    this.sessionId = process.env.SESSION_ID || 'default';
    
    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());
    
    this.setupRoutes();
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        sessionId: this.sessionId,
        browserRunning: !!this.browser,
        timestamp: new Date().toISOString()
      });
    });

    // Inject session data
    this.app.post('/inject', async (req, res) => {
      try {
        const { sessionData, targetUrl } = req.body;
        
        console.log('🔧 Received injection request:', {
          domain: sessionData?.domain,
          url: targetUrl,
          sessionId: this.sessionId
        });

        const result = await this.injectSession(sessionData, targetUrl);
        
        res.json({
          success: true,
          sessionId: this.sessionId,
          result: result,
          vncUrl: `http://${req.get('host').split(':')[0]}:6080/vnc.html`,
          message: 'Session injected successfully'
        });

      } catch (error) {
        console.error('❌ Injection failed:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get current page info
    this.app.get('/page-info', async (req, res) => {
      try {
        if (!this.page) {
          return res.status(400).json({ error: 'No active page' });
        }

        const url = await this.page.url();
        const title = await this.page.title();
        
        res.json({
          success: true,
          url: url,
          title: title,
          sessionId: this.sessionId
        });

      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Navigate to URL
    this.app.post('/navigate', async (req, res) => {
      try {
        const { url } = req.body;
        
        if (!this.page) {
          return res.status(400).json({ error: 'No active page' });
        }

        await this.page.goto(url);
        
        res.json({
          success: true,
          url: await this.page.url(),
          message: 'Navigation successful'
        });

      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  async injectSession(sessionData, targetUrl) {
    console.log('🚀 Starting browser with session injection...');
    
    // Close existing browser if any
    if (this.browser) {
      await this.browser.close();
    }

    // Launch browser
    this.browser = await puppeteer.launch({
      headless: false,
      executablePath: '/usr/bin/google-chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--display=' + (process.env.DISPLAY || ':1'),
        '--remote-debugging-port=9222',
        '--user-data-dir=/tmp/chrome-session-' + this.sessionId,
        '--window-size=1920,1080',
        '--start-fullscreen'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Set viewport
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Store session data
    this.sessionData = sessionData;
    this.targetUrl = targetUrl;
    
    // Extract domain from URL
    const domain = new URL(targetUrl).hostname;
    
    console.log('💾 Injecting session data for domain:', domain);
    
    // Navigate to the target site first
    await this.page.goto(targetUrl);
    
    // Wait for page to load
    await this.page.waitForTimeout(2000);
    
    // Inject localStorage data
    if (sessionData.localStorage && Object.keys(sessionData.localStorage).length > 0) {
      await this.page.evaluate((localStorageData) => {
        for (const [key, value] of Object.entries(localStorageData)) {
          try {
            localStorage.setItem(key, value);
          } catch (e) {
            console.log('Failed to set localStorage item:', key, e);
          }
        }
      }, sessionData.localStorage);
      console.log('✅ localStorage injected:', Object.keys(sessionData.localStorage).length, 'items');
    }
    
    // Inject sessionStorage data
    if (sessionData.sessionStorage && Object.keys(sessionData.sessionStorage).length > 0) {
      await this.page.evaluate((sessionStorageData) => {
        for (const [key, value] of Object.entries(sessionStorageData)) {
          try {
            sessionStorage.setItem(key, value);
          } catch (e) {
            console.log('Failed to set sessionStorage item:', key, e);
          }
        }
      }, sessionData.sessionStorage);
      console.log('✅ sessionStorage injected:', Object.keys(sessionData.sessionStorage).length, 'items');
    }
    
    // Inject cookies
    if (sessionData.cookies && Object.keys(sessionData.cookies).length > 0) {
      for (const [name, value] of Object.entries(sessionData.cookies)) {
        try {
          await this.page.setCookie({
            name: name,
            value: value,
            domain: domain,
            path: '/'
          });
        } catch (e) {
          console.log('Failed to set cookie:', name, e);
        }
      }
      console.log('✅ Cookies injected:', Object.keys(sessionData.cookies).length, 'items');
    }
    
    // Inject custom tokens via JavaScript
    if (sessionData.tokens && Object.keys(sessionData.tokens).length > 0) {
      await this.page.evaluate((tokens) => {
        window.injectedTokens = tokens;
        // Try to set common token patterns
        for (const [key, value] of Object.entries(tokens)) {
          try {
            window[key] = value;
            // Common token variable names
            if (key.toLowerCase().includes('access') || key.toLowerCase().includes('auth')) {
              window.accessToken = value;
              window.authToken = value;
            }
            if (key.toLowerCase().includes('session')) {
              window.sessionToken = value;
            }
          } catch (e) {
            console.log('Failed to set token:', key, e);
          }
        }
      }, sessionData.tokens);
      console.log('✅ Tokens injected:', Object.keys(sessionData.tokens).length, 'items');
    }
    
    // Refresh the page to apply all injected data
    console.log('🔄 Refreshing page to apply injected session data...');
    await this.page.reload({ waitUntil: 'networkidle0' });
    
    console.log('🎉 Session injection complete! Browser ready for user access.');
    
    return {
      domain: domain,
      url: targetUrl,
      injectedItems: {
        localStorage: Object.keys(sessionData.localStorage || {}).length,
        sessionStorage: Object.keys(sessionData.sessionStorage || {}).length,
        cookies: Object.keys(sessionData.cookies || {}).length,
        tokens: Object.keys(sessionData.tokens || {}).length
      },
      timestamp: new Date().toISOString()
    };
  }

  async start() {
    const port = process.env.PORT || 3000;
    
    this.app.listen(port, '0.0.0.0', () => {
      console.log('🚀 Rentify Session Injector running on port', port);
      console.log('🆔 Session ID:', this.sessionId);
      console.log('📺 Display:', process.env.DISPLAY || ':1');
      console.log('🌐 VNC will be available on port 6080');
      console.log('⚡ Ready to inject sessions!');
    });

    // Auto-inject if session data is provided via environment
    if (process.env.SESSION_DATA && process.env.TARGET_URL) {
      try {
        const sessionData = JSON.parse(process.env.SESSION_DATA);
        const targetUrl = process.env.TARGET_URL;
        
        console.log('🔧 Auto-injecting session from environment...');
        await this.injectSession(sessionData, targetUrl);
      } catch (error) {
        console.error('❌ Auto-injection failed:', error);
      }
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 Browser cleaned up');
    }
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📡 Received SIGTERM, shutting down gracefully...');
  if (global.injector) {
    await global.injector.cleanup();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📡 Received SIGINT, shutting down gracefully...');
  if (global.injector) {
    await global.injector.cleanup();
  }
  process.exit(0);
});

// Start the session injector
const injector = new SessionInjector();
global.injector = injector;
injector.start().catch(console.error);

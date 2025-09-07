// VM Manager for Rentify Session Injection System
const express = require('express');
const cors = require('cors');
const { exec, spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class VMManager {
  constructor() {
    this.app = express();
    this.activeContainers = new Map(); // sessionId -> containerInfo
    this.basePort = 7000; // Starting port for VNC access
    this.maxContainers = 10; // Limit concurrent containers
    
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb' }));
    
    this.setupRoutes();
    this.cleanupInterval = setInterval(() => this.cleanupExpiredContainers(), 300000); // 5 minutes
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        activeContainers: this.activeContainers.size,
        maxContainers: this.maxContainers,
        timestamp: new Date().toISOString()
      });
    });

    // List active sessions
    this.app.get('/sessions', (req, res) => {
      const sessions = Array.from(this.activeContainers.entries()).map(([sessionId, info]) => ({
        sessionId,
        status: info.status,
        createdAt: info.createdAt,
        expiresAt: info.expiresAt,
        vncUrl: info.vncUrl,
        domain: info.domain
      }));

      res.json({
        success: true,
        sessions: sessions,
        totalActive: sessions.length
      });
    });

    // Create new session
    this.app.post('/create-session', async (req, res) => {
      try {
        const { sessionData, targetUrl, duration = 30 } = req.body;

        if (!sessionData || !targetUrl) {
          return res.status(400).json({
            success: false,
            error: 'sessionData and targetUrl are required'
          });
        }

        // Check container limit
        if (this.activeContainers.size >= this.maxContainers) {
          return res.status(429).json({
            success: false,
            error: 'Maximum number of sessions reached. Please try again later.'
          });
        }

        // Create session
        const sessionId = this.generateSessionId();
        const result = await this.createSession(sessionId, sessionData, targetUrl, duration);

        res.json({
          success: true,
          sessionId: sessionId,
          vncUrl: result.vncUrl,
          directUrl: result.directUrl,
          expiresAt: result.expiresAt,
          message: 'Session created successfully'
        });

      } catch (error) {
        console.error('❌ Failed to create session:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Get session info
    this.app.get('/session/:sessionId', (req, res) => {
      const { sessionId } = req.params;
      const sessionInfo = this.activeContainers.get(sessionId);

      if (!sessionInfo) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }

      res.json({
        success: true,
        sessionId: sessionId,
        status: sessionInfo.status,
        vncUrl: sessionInfo.vncUrl,
        directUrl: sessionInfo.directUrl,
        createdAt: sessionInfo.createdAt,
        expiresAt: sessionInfo.expiresAt,
        domain: sessionInfo.domain
      });
    });

    // Stop session
    this.app.delete('/session/:sessionId', async (req, res) => {
      try {
        const { sessionId } = req.params;
        
        const result = await this.stopSession(sessionId);
        
        if (result.success) {
          res.json({
            success: true,
            message: 'Session stopped successfully'
          });
        } else {
          res.status(404).json({
            success: false,
            error: result.error
          });
        }

      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });

    // Send command to session
    this.app.post('/session/:sessionId/command', async (req, res) => {
      try {
        const { sessionId } = req.params;
        const { action, data } = req.body;

        const sessionInfo = this.activeContainers.get(sessionId);
        if (!sessionInfo) {
          return res.status(404).json({
            success: false,
            error: 'Session not found'
          });
        }

        const result = await this.sendCommand(sessionId, action, data);
        
        res.json({
          success: true,
          result: result
        });

      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    });
  }

  generateSessionId() {
    return 'session_' + crypto.randomBytes(16).toString('hex');
  }

  async createSession(sessionId, sessionData, targetUrl, durationMinutes) {
    console.log('🚀 Creating new session:', sessionId);

    // Find available port
    const vncPort = await this.findAvailablePort();
    const sessionPort = vncPort + 1000; // Offset for session injector

    // Create expiration time
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    // Extract domain for tracking
    const domain = new URL(targetUrl).hostname;

    // Build Docker command
    const containerName = `rentify-session-${sessionId}`;
    const dockerCommand = [
      'docker', 'run', '-d',
      '--name', containerName,
      '-p', `${vncPort}:6080`,
      '-p', `${sessionPort}:3000`,
      '-e', `SESSION_ID=${sessionId}`,
      '-e', `SESSION_DATA=${JSON.stringify(sessionData)}`,
      '-e', `TARGET_URL=${targetUrl}`,
      '-e', `DISPLAY=:1`,
      '--memory=2g',
      '--cpus=1',
      '--rm',
      'rentify-session-vm'
    ];

    console.log('🐳 Starting Docker container:', containerName);
    
    return new Promise((resolve, reject) => {
      exec(dockerCommand.join(' '), async (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Docker start failed:', error);
          reject(error);
          return;
        }

        const containerId = stdout.trim();
        console.log('✅ Container started:', containerId);

        // Wait for container to be ready
        await this.waitForContainer(sessionId, sessionPort);

        // Store session info
        const sessionInfo = {
          sessionId,
          containerId,
          containerName,
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: expiresAt.toISOString(),
          vncPort,
          sessionPort,
          vncUrl: `http://${this.getServerIP()}:${vncPort}/vnc.html`,
          directUrl: `http://${this.getServerIP()}:${sessionPort}`,
          domain,
          targetUrl
        };

        this.activeContainers.set(sessionId, sessionInfo);

        // Set auto-cleanup timer
        setTimeout(() => {
          this.stopSession(sessionId);
        }, durationMinutes * 60 * 1000);

        resolve({
          vncUrl: sessionInfo.vncUrl,
          directUrl: sessionInfo.directUrl,
          expiresAt: sessionInfo.expiresAt
        });
      });
    });
  }

  async waitForContainer(sessionId, port, maxWait = 60000) {
    console.log('⏳ Waiting for container to be ready...');
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWait) {
      try {
        const response = await fetch(`http://localhost:${port}/health`);
        if (response.ok) {
          console.log('✅ Container is ready!');
          return true;
        }
      } catch (error) {
        // Container not ready yet
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Container failed to start within timeout');
  }

  async stopSession(sessionId) {
    const sessionInfo = this.activeContainers.get(sessionId);
    
    if (!sessionInfo) {
      return { success: false, error: 'Session not found' };
    }

    console.log('🛑 Stopping session:', sessionId);

    return new Promise((resolve) => {
      exec(`docker stop ${sessionInfo.containerName}`, (error) => {
        if (error) {
          console.error('❌ Failed to stop container:', error);
        } else {
          console.log('✅ Container stopped:', sessionInfo.containerName);
        }
        
        this.activeContainers.delete(sessionId);
        resolve({ success: true });
      });
    });
  }

  async sendCommand(sessionId, action, data) {
    const sessionInfo = this.activeContainers.get(sessionId);
    
    if (!sessionInfo) {
      throw new Error('Session not found');
    }

    const url = `http://localhost:${sessionInfo.sessionPort}/${action}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Command failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async findAvailablePort() {
    // Simple port allocation - in production, use a proper port manager
    for (let port = this.basePort; port < this.basePort + 1000; port++) {
      try {
        // Check if port is in use
        const used = Array.from(this.activeContainers.values()).some(info => 
          info.vncPort === port || info.sessionPort === port
        );
        
        if (!used) {
          return port;
        }
      } catch (error) {
        continue;
      }
    }
    
    throw new Error('No available ports');
  }

  getServerIP() {
    // In production, return the actual server IP
    return process.env.SERVER_IP || 'localhost';
  }

  async cleanupExpiredContainers() {
    console.log('🧹 Checking for expired containers...');
    
    const now = new Date();
    const expiredSessions = [];
    
    for (const [sessionId, info] of this.activeContainers.entries()) {
      if (new Date(info.expiresAt) <= now) {
        expiredSessions.push(sessionId);
      }
    }
    
    for (const sessionId of expiredSessions) {
      console.log('⏰ Cleaning up expired session:', sessionId);
      await this.stopSession(sessionId);
    }
    
    if (expiredSessions.length > 0) {
      console.log(`✅ Cleaned up ${expiredSessions.length} expired sessions`);
    }
  }

  async start() {
    const port = process.env.VM_MANAGER_PORT || 8080;
    
    // Build Docker image first
    console.log('🏗️ Building Docker image...');
    await this.buildDockerImage();
    
    this.app.listen(port, '0.0.0.0', () => {
      console.log('🚀 Rentify VM Manager running on port', port);
      console.log('🐳 Docker image ready for session creation');
      console.log('📊 Max concurrent sessions:', this.maxContainers);
      console.log('🌐 Server IP:', this.getServerIP());
    });
  }

  async buildDockerImage() {
    return new Promise((resolve, reject) => {
      console.log('🔨 Building rentify-session-vm Docker image...');
      
      exec('docker build -t rentify-session-vm .', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Docker build failed:', error);
          console.error('stderr:', stderr);
          reject(error);
          return;
        }
        
        console.log('✅ Docker image built successfully');
        console.log(stdout);
        resolve();
      });
    });
  }

  async cleanup() {
    clearInterval(this.cleanupInterval);
    
    console.log('🛑 Stopping all active sessions...');
    const stopPromises = Array.from(this.activeContainers.keys()).map(sessionId => 
      this.stopSession(sessionId)
    );
    
    await Promise.all(stopPromises);
    console.log('✅ All sessions stopped');
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📡 Received SIGTERM, shutting down gracefully...');
  if (global.vmManager) {
    await global.vmManager.cleanup();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📡 Received SIGINT, shutting down gracefully...');
  if (global.vmManager) {
    await global.vmManager.cleanup();
  }
  process.exit(0);
});

// Start the VM manager
const vmManager = new VMManager();
global.vmManager = vmManager;
vmManager.start().catch(console.error);

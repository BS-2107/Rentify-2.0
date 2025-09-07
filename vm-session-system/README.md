# Rentify VM Session System

Complete Docker-based session injection system for secure browser session rental.

## Overview

This system creates isolated browser environments in Docker containers where users can access injected sessions through VNC. Each session gets its own container with Chrome browser, VNC server, and session injection capabilities.

## Components

- **vm-manager.js** - Main orchestrator for creating/managing Docker containers
- **session-injector.js** - Service running inside each container to inject session data
- **Dockerfile** - Container definition with Ubuntu + Chrome + VNC + Node.js
- **supervisord.conf** - Process manager for container services
- **start-session.sh** - Container startup script
- **deploy-to-azure.sh** - Automated deployment script for Azure

## Quick Start

### 1. Deploy to Azure Server

```bash
# Make deployment script executable
chmod +x deploy-to-azure.sh

# Deploy to Azure (requires SSH key and server access)
./deploy-to-azure.sh
```

### 2. Test the System

```bash
# Check if VM Manager is running
curl http://57.153.184.55:8080/health

# Create a test session
curl -X POST http://57.153.184.55:8080/create-session \
  -H "Content-Type: application/json" \
  -d '{
    "sessionData": {
      "domain": "example.com",
      "cookies": {"session": "abc123"},
      "localStorage": {"token": "xyz789"},
      "sessionStorage": {"user": "testuser"}
    },
    "targetUrl": "https://example.com/login",
    "duration": 30
  }'
```

## API Endpoints

### VM Manager (Port 8080)

- `GET /health` - Service health check
- `GET /sessions` - List active sessions
- `POST /create-session` - Create new session container
- `GET /session/:id` - Get session details
- `DELETE /session/:id` - Stop session
- `POST /session/:id/command` - Send command to session

### Session Injector (Per Container)

- `GET /health` - Container health check
- `POST /inject` - Inject session data
- `GET /page-info` - Get current page information
- `POST /navigate` - Navigate to URL

## Architecture

```
[Chrome Extension] → [VM Manager] → [Docker Container]
                                      ├── Chrome Browser
                                      ├── VNC Server (noVNC)
                                      ├── Session Injector
                                      └── Xvfb Display
```

## Session Creation Flow

1. **Request** - Client sends session data to VM Manager
2. **Container** - VM Manager creates new Docker container
3. **Injection** - Session Injector loads browser and injects data
4. **Access** - User accesses browser via VNC web interface
5. **Cleanup** - Container auto-expires and gets cleaned up

## Session Data Format

```json
{
  "sessionData": {
    "domain": "website.com",
    "cookies": {
      "sessionId": "abc123",
      "authToken": "xyz789"
    },
    "localStorage": {
      "userPrefs": "...",
      "accessToken": "..."
    },
    "sessionStorage": {
      "tempData": "..."
    },
    "tokens": {
      "apiKey": "...",
      "refreshToken": "..."
    }
  },
  "targetUrl": "https://website.com/dashboard",
  "duration": 30
}
```

## Container Specifications

- **Base Image**: Ubuntu 20.04
- **Browser**: Google Chrome (headless/headed)
- **VNC**: noVNC web interface on port 6080
- **Resources**: 2GB RAM, 1 CPU core
- **Display**: Xvfb virtual display
- **Session Timeout**: Configurable (default 30 minutes)

## Security Features

- **Isolated Containers** - Each session runs in separate container
- **Resource Limits** - Memory and CPU constraints per container
- **Auto Cleanup** - Sessions expire automatically
- **Port Isolation** - Dynamic port allocation for VNC access
- **No Persistence** - Containers are ephemeral

## Monitoring

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs rentify-vm-manager

# Monitor system resources
docker stats

# List active containers
docker ps | grep rentify-session
```

## Configuration

### Environment Variables

- `VM_MANAGER_PORT` - VM Manager port (default: 8080)
- `SERVER_IP` - Public server IP for VNC URLs
- `SESSION_ID` - Unique session identifier
- `SESSION_DATA` - JSON session data for injection
- `TARGET_URL` - Initial URL to load
- `DISPLAY` - X11 display number (:1)

### Limits

- **Max Containers**: 10 concurrent sessions
- **Port Range**: 7000-8000 (VNC), 8000-9000 (Session Injectors)
- **Session Duration**: 5-120 minutes
- **Container Resources**: 2GB RAM, 1 CPU core

## Troubleshooting

### Container Issues

```bash
# Check container logs
docker logs rentify-session-SESSION_ID

# Enter container for debugging
docker exec -it rentify-session-SESSION_ID bash

# Rebuild Docker image
docker build -t rentify-session-vm .
```

### VNC Access Issues

```bash
# Check if VNC is running inside container
docker exec -it CONTAINER_ID ps aux | grep vnc

# Test VNC port
curl http://localhost:PORT/vnc.html
```

### Session Injection Issues

```bash
# Check session injector logs
docker exec -it CONTAINER_ID pm2 logs session-injector

# Test injection endpoint
curl http://localhost:SESSION_PORT/health
```

## Integration with Chrome Extension

Update your Chrome extension to use the VM Manager:

```javascript
// In your Chrome extension
const VM_MANAGER_URL = 'http://57.153.184.55:8080';

async function createSessionVM(sessionData, targetUrl) {
  const response = await fetch(`${VM_MANAGER_URL}/create-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionData: sessionData,
      targetUrl: targetUrl,
      duration: 30
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Open VNC in new tab
    chrome.tabs.create({ url: result.vncUrl });
    return result;
  }
  
  throw new Error(result.error);
}
```

## Production Considerations

- **Load Balancing** - Add nginx for multiple VM Manager instances
- **Database** - Store session metadata in MongoDB/Redis
- **Scaling** - Use Docker Swarm or Kubernetes
- **Monitoring** - Add Prometheus/Grafana for metrics
- **Security** - Add authentication and rate limiting
- **Backup** - Regular container image updates

## License

MIT License - See LICENSE file for details

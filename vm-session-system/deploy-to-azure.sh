#!/bin/bash

# Rentify VM Session System Deployment Script
# Usage: ./deploy-to-azure.sh

set -e

echo "🚀 Deploying Rentify VM Session System to Azure..."

# Configuration
AZURE_SERVER="57.153.184.55"
SSH_KEY="/Users/sahaj/Downloads/sahaj.pem"
REMOTE_USER="azureuser"
REMOTE_PATH="/home/azureuser/rentify-vm-system"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo -e "  Server: ${AZURE_SERVER}"
echo -e "  User: ${REMOTE_USER}"
echo -e "  SSH Key: ${SSH_KEY}"
echo -e "  Remote Path: ${REMOTE_PATH}"
echo ""

# Verify SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}❌ SSH key not found: $SSH_KEY${NC}"
    exit 1
fi

# Set correct permissions for SSH key
chmod 600 "$SSH_KEY"

echo -e "${YELLOW}🔑 Testing SSH connection...${NC}"
if ! ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=10 "$REMOTE_USER@$AZURE_SERVER" "echo 'SSH connection successful'"; then
    echo -e "${RED}❌ Failed to connect to Azure server${NC}"
    exit 1
fi
echo -e "${GREEN}✅ SSH connection verified${NC}"

# Create remote directory
echo -e "${YELLOW}📁 Creating remote directory...${NC}"
ssh -i "$SSH_KEY" "$REMOTE_USER@$AZURE_SERVER" "mkdir -p $REMOTE_PATH"

# Copy files to server
echo -e "${YELLOW}📤 Copying files to Azure server...${NC}"
scp -i "$SSH_KEY" -r \
    ./Dockerfile \
    ./package.json \
    ./supervisord.conf \
    ./start-session.sh \
    ./session-injector.js \
    ./vm-manager.js \
    "$REMOTE_USER@$AZURE_SERVER:$REMOTE_PATH/"

echo -e "${GREEN}✅ Files copied successfully${NC}"

# Make scripts executable
echo -e "${YELLOW}🔧 Setting up permissions...${NC}"
ssh -i "$SSH_KEY" "$REMOTE_USER@$AZURE_SERVER" "chmod +x $REMOTE_PATH/start-session.sh"

# Install dependencies and setup on server
echo -e "${YELLOW}🔨 Setting up server environment...${NC}"
ssh -i "$SSH_KEY" "$REMOTE_USER@$AZURE_SERVER" << 'EOF'
    set -e
    
    # Update system
    echo "📦 Updating system packages..."
    sudo apt update
    
    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        echo "🐳 Installing Docker..."
        sudo apt install -y docker.io
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
        echo "✅ Docker installed"
    else
        echo "✅ Docker already installed"
    fi
    
    # Install Node.js if not present
    if ! command -v node &> /dev/null; then
        echo "📦 Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
        echo "✅ Node.js installed"
    else
        echo "✅ Node.js already installed"
    fi
    
    # Install PM2 for process management
    if ! command -v pm2 &> /dev/null; then
        echo "📦 Installing PM2..."
        sudo npm install -g pm2
        echo "✅ PM2 installed"
    else
        echo "✅ PM2 already installed"
    fi
    
    echo "🎉 Server environment setup complete!"
EOF

# Install npm dependencies and build Docker image
echo -e "${YELLOW}📦 Installing dependencies and building Docker image...${NC}"
ssh -i "$SSH_KEY" "$REMOTE_USER@$AZURE_SERVER" << EOF
    cd $REMOTE_PATH
    
    echo "📦 Installing npm dependencies..."
    npm install
    
    echo "🏗️ Building Docker image..."
    sudo docker build -t rentify-session-vm .
    
    echo "✅ Dependencies installed and Docker image built"
EOF

# Setup PM2 configuration
echo -e "${YELLOW}⚙️ Setting up PM2 configuration...${NC}"
ssh -i "$SSH_KEY" "$REMOTE_USER@$AZURE_SERVER" << EOF
    cd $REMOTE_PATH
    
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [
    {
      name: 'rentify-vm-manager',
      script: 'vm-manager.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        VM_MANAGER_PORT: 8080,
        SERVER_IP: '$AZURE_SERVER'
      },
      log_file: './logs/vm-manager.log',
      out_file: './logs/vm-manager-out.log',
      error_file: './logs/vm-manager-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
EOL
    
    # Create logs directory
    mkdir -p logs
    
    echo "✅ PM2 configuration created"
EOF

# Start the services
echo -e "${YELLOW}🚀 Starting Rentify VM Manager...${NC}"
ssh -i "$SSH_KEY" "$REMOTE_USER@$AZURE_SERVER" << EOF
    cd $REMOTE_PATH
    
    # Stop any existing PM2 processes
    pm2 delete rentify-vm-manager 2>/dev/null || true
    
    # Start VM Manager
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    
    # Setup PM2 to start on boot
    pm2 startup | tail -1 | sudo bash || true
    
    echo "✅ Rentify VM Manager started"
    
    # Show status
    pm2 status
    pm2 logs rentify-vm-manager --lines 10
EOF

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
ssh -i "$SSH_KEY" "$REMOTE_USER@$AZURE_SERVER" << 'EOF'
    # Allow VM Manager port
    sudo ufw allow 8080/tcp comment "Rentify VM Manager"
    
    # Allow VNC port range (7000-8000)
    sudo ufw allow 7000:8000/tcp comment "Rentify VNC Sessions"
    
    # Allow session injector port range (8000-9000)
    sudo ufw allow 8000:9000/tcp comment "Rentify Session Injectors"
    
    # Enable firewall if not already enabled
    sudo ufw --force enable
    
    echo "✅ Firewall configured"
EOF

# Final verification
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
sleep 5

ssh -i "$SSH_KEY" "$REMOTE_USER@$AZURE_SERVER" << EOF
    cd $REMOTE_PATH
    
    echo "📊 PM2 Status:"
    pm2 status
    
    echo ""
    echo "🌐 Testing VM Manager health..."
    if curl -s http://localhost:8080/health > /dev/null; then
        echo "✅ VM Manager is responding"
    else
        echo "❌ VM Manager is not responding"
    fi
    
    echo ""
    echo "🐳 Docker Images:"
    sudo docker images | grep rentify
    
    echo ""
    echo "💾 Disk Usage:"
    df -h
    
    echo ""
    echo "🧠 Memory Usage:"
    free -h
EOF

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Service Information:${NC}"
echo -e "  VM Manager URL: http://${AZURE_SERVER}:8080"
echo -e "  Health Check: http://${AZURE_SERVER}:8080/health"
echo -e "  Active Sessions: http://${AZURE_SERVER}:8080/sessions"
echo ""
echo -e "${BLUE}🛠️ Management Commands:${NC}"
echo -e "  SSH to server: ssh -i ${SSH_KEY} ${REMOTE_USER}@${AZURE_SERVER}"
echo -e "  Check logs: pm2 logs rentify-vm-manager"
echo -e "  Restart service: pm2 restart rentify-vm-manager"
echo -e "  Stop service: pm2 stop rentify-vm-manager"
echo ""
echo -e "${YELLOW}🔗 Next Steps:${NC}"
echo -e "  1. Test the VM Manager: curl http://${AZURE_SERVER}:8080/health"
echo -e "  2. Create a test session via the API"
echo -e "  3. Update your Chrome extension to use: http://${AZURE_SERVER}:8080"
echo ""
echo -e "${GREEN}✅ Rentify VM Session System is now live!${NC}"

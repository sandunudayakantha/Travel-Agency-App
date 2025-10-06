#!/bin/bash

# Travel Agency App VPS Setup Script
# Run this script on your Ubuntu VPS to set up the environment

set -e

echo "🚀 Setting up Travel Agency App on VPS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run this script as root"
    exit 1
fi

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
print_status "Installing required packages..."
apt install -y curl wget git nano ufw

# Install Docker
print_status "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
print_status "Installing Docker Compose..."
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Configure firewall
print_status "Configuring firewall..."
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create application directory
print_status "Creating application directory..."
mkdir -p /opt/travel-agency
cd /opt/travel-agency

# Download docker-compose files
print_status "Downloading configuration files..."
curl -o docker-compose.yml https://raw.githubusercontent.com/sandunudayakantha/Travel-Agency-App/main/docker-compose.yml
curl -o env.production.example https://raw.githubusercontent.com/sandunudayakantha/Travel-Agency-App/main/env.production.example

# Create environment file
print_status "Creating environment file..."
cp env.production.example .env

# Create docker-compose override
cat > docker-compose.override.yml << 'EOF'
version: '3.8'

services:
  app:
    image: sandunudayakantha/travel-agency-app:latest
    environment:
      - NODE_ENV=production
    restart: unless-stopped
EOF

# Create deployment script
cat > deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying Travel Agency App..."

# Pull latest image
echo "Pulling latest image..."
docker-compose pull app

# Stop current containers
echo "Stopping current containers..."
docker-compose down

# Start with new image
echo "Starting with new image..."
docker-compose up -d

# Clean up old images
echo "Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: http://$(curl -s ifconfig.me)"
EOF

chmod +x deploy.sh

# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "📦 Creating MongoDB backup..."

docker-compose exec -T mongodb mongodump \
  --username=$MONGO_ROOT_USERNAME \
  --password=$MONGO_ROOT_PASSWORD \
  --authenticationDatabase=admin \
  --archive | gzip > $BACKUP_DIR/mongodb_backup_$DATE.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "mongodb_backup_*.gz" -mtime +7 -delete

echo "✅ Backup completed: mongodb_backup_$DATE.gz"
EOF

chmod +x backup.sh

# Verify installations
print_status "Verifying installations..."
docker --version
docker-compose --version

print_status "✅ VPS setup completed!"
print_warning "Next steps:"
echo "1. Edit the environment file: nano /opt/travel-agency/.env"
echo "2. Update docker-compose.override.yml with your Docker Hub image name"
echo "3. Run initial deployment: cd /opt/travel-agency && ./deploy.sh"
echo "4. Set up SSL certificate (optional): certbot --nginx -d yourdomain.com"
echo ""
print_status "Your Travel Agency App is ready for deployment! 🎉"

# Travel Agency App - VPS Deployment Guide

This guide will help you deploy your Travel Agency App to a Hostinger VPS with automatic CI/CD using Docker, GitHub Actions, and Watchtower.

## Prerequisites

- Hostinger VPS with Ubuntu 20.04+ 
- Domain name pointing to your VPS
- GitHub repository with your code
- Docker Hub account

## Step 1: VPS Setup

### 1.1 Connect to your VPS

```bash
ssh root@your-vps-ip
```

### 1.2 Update system packages

```bash
apt update && apt upgrade -y
```

### 1.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Add your user to docker group (optional)
usermod -aG docker $USER

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 1.4 Configure Firewall

```bash
# Install UFW if not present
apt install ufw -y

# Allow SSH, HTTP, and HTTPS
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

## Step 2: GitHub Actions Setup

### 2.1 Add Docker Hub Secrets

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add these repository secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

### 2.2 Push your code to trigger the first build

```bash
git add .
git commit -m "Add Docker deployment configuration"
git push origin main
```

## Step 3: VPS Deployment

### 3.1 Create deployment directory

```bash
mkdir -p /opt/travel-agency
cd /opt/travel-agency
```

### 3.2 Create environment file

```bash
# Copy the example environment file
wget https://raw.githubusercontent.com/your-username/your-repo/main/env.production.example -O .env

# Edit the environment file with your values
nano .env
```

Update the following values in your `.env` file:

```bash
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_mongodb_password_here
MONGO_DATABASE=travel_agency

# JWT Configuration (generate with: openssl rand -hex 64)
JWT_SECRET=your_super_secure_jwt_secret_here_at_least_64_characters_long

# Frontend URL (your domain)
FRONTEND_URL=https://yourdomain.com

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 3.3 Create docker-compose override file

```bash
cat > docker-compose.override.yml << EOF
version: '3.8'

services:
  app:
    image: your-dockerhub-username/your-repo:latest
    environment:
      - NODE_ENV=production
    restart: unless-stopped
EOF
```

### 3.4 Create deployment script

```bash
cat > deploy.sh << 'EOF'
#!/bin/bash

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

echo "Deployment complete!"
EOF

chmod +x deploy.sh
```

### 3.5 Initial deployment

```bash
# Pull and start the application
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

## Step 4: SSL Certificate (Optional but Recommended)

### 4.1 Install Certbot

```bash
apt install certbot python3-certbot-nginx -y
```

### 4.2 Get SSL certificate

```bash
certbot --nginx -d yourdomain.com
```

### 4.3 Auto-renewal

```bash
# Test auto-renewal
certbot renew --dry-run

# Add to crontab for auto-renewal
crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## Step 5: Monitoring and Maintenance

### 5.1 Check application health

```bash
# View logs
docker-compose logs -f app

# Check container status
docker-compose ps

# Monitor resources
docker stats
```

### 5.2 Backup MongoDB data

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker-compose exec -T mongodb mongodump \
  --username=$MONGO_ROOT_USERNAME \
  --password=$MONGO_ROOT_PASSWORD \
  --authenticationDatabase=admin \
  --archive | gzip > $BACKUP_DIR/mongodb_backup_$DATE.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "mongodb_backup_*.gz" -mtime +7 -delete

echo "Backup completed: mongodb_backup_$DATE.gz"
EOF

chmod +x backup.sh

# Add to crontab for daily backups
crontab -e
# Add this line:
# 0 2 * * * /opt/travel-agency/backup.sh
```

## Step 6: Auto-Deployment with Watchtower

Watchtower is already configured in the docker-compose.yml file. It will:

- Monitor your Docker Hub repository
- Pull new images when available
- Automatically restart containers with new images
- Clean up old images

### 6.1 Configure Watchtower notifications (optional)

```bash
# Add to your .env file
WATCHTOWER_NOTIFICATION_URL=discord://webhook_id/webhook_token
# or
WATCHTOWER_NOTIFICATION_URL=slack://webhook_id/webhook_token
```

## Troubleshooting

### Common Issues

1. **Port 80 already in use**
   ```bash
   # Check what's using port 80
   netstat -tlnp | grep :80
   # Stop Apache if running
   systemctl stop apache2
   systemctl disable apache2
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB logs
   docker-compose logs mongodb
   # Check network connectivity
   docker-compose exec app ping mongodb
   ```

3. **Application not starting**
   ```bash
   # Check application logs
   docker-compose logs app
   # Check environment variables
   docker-compose exec app env
   ```

### Useful Commands

```bash
# View all containers
docker ps -a

# View container logs
docker logs container_name

# Execute commands in running container
docker-compose exec app sh

# Restart specific service
docker-compose restart app

# Scale services
docker-compose up -d --scale app=2

# Remove all stopped containers and unused images
docker system prune -a
```

## Security Considerations

1. **Change default passwords** in your environment file
2. **Use strong JWT secrets** (at least 64 characters)
3. **Enable firewall** and only open necessary ports
4. **Regular updates** of Docker images and system packages
5. **Monitor logs** for suspicious activity
6. **Backup regularly** and test restore procedures

## Performance Optimization

1. **Enable gzip compression** (already configured in nginx.conf)
2. **Use CDN** for static assets
3. **Monitor resource usage** with `docker stats`
4. **Scale horizontally** if needed
5. **Use Redis** for session storage in production

## Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Check GitHub Actions build status
4. Review this deployment guide

Your Travel Agency App should now be running with automatic CI/CD! 🚀

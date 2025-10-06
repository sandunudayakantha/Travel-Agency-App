# Docker Deployment Setup

This document describes the Docker-based deployment setup for the Travel Agency App with CI/CD integration.

## Files Overview

### Core Docker Files
- `Dockerfile` - Multi-stage build for React frontend + Node.js backend
- `docker-compose.yml` - Orchestrates app, MongoDB, and Watchtower services
- `nginx.conf` - Nginx configuration for serving frontend and proxying API
- `supervisord.conf` - Manages Nginx and Node.js processes
- `.dockerignore` - Excludes unnecessary files from Docker build

### CI/CD Files
- `.github/workflows/deploy.yml` - GitHub Actions workflow for building and pushing to Docker Hub

### Configuration Files
- `env.production.example` - Production environment variables template
- `vps-setup.sh` - Automated VPS setup script

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   MongoDB       │
│   (React)       │    │   (Node.js)     │    │   Database      │
│   Port: 80      │◄──►│   Port: 5000    │◄──►│   Port: 27017   │
│   Nginx         │    │   Express       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Watchtower    │
                    │   Auto-update   │
                    └─────────────────┘
```

## Port Configuration

- **Port 80**: Nginx serves React frontend and proxies API requests
- **Port 5000**: Node.js backend API (internal)
- **Port 27017**: MongoDB database (internal)

## Services

### 1. App Service (Frontend + Backend)
- **Image**: Custom multi-stage Docker build
- **Frontend**: React app built with Vite, served by Nginx
- **Backend**: Node.js/Express API server
- **Process Management**: Supervisor manages both Nginx and Node.js
- **Restart Policy**: `unless-stopped`

### 2. MongoDB Service
- **Image**: `mongo:7.0`
- **Authentication**: Root user with configurable credentials
- **Persistence**: Named volume `mongodb_data`
- **Health Check**: MongoDB ping command
- **Restart Policy**: `unless-stopped`

### 3. Watchtower Service
- **Image**: `containrrr/watchtower`
- **Purpose**: Auto-update containers when new images are pushed
- **Polling**: Every 5 minutes
- **Cleanup**: Removes old images automatically
- **Restart Policy**: `unless-stopped`

## Environment Variables

### Required Variables
```bash
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_password
JWT_SECRET=64_character_random_string
FRONTEND_URL=https://yourdomain.com
```

### Optional Variables
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## CI/CD Workflow

### GitHub Actions Pipeline
1. **Trigger**: Push to `main` branch
2. **Build**: Multi-architecture Docker image (amd64, arm64)
3. **Push**: Image to Docker Hub with tags:
   - `latest` (for main branch)
   - `main` (branch name)
   - `main-<commit-sha>` (specific commit)
4. **Security**: Trivy vulnerability scanning

### Auto-Deployment
1. Watchtower monitors Docker Hub for new images
2. Pulls new image when available
3. Stops current container
4. Starts new container with updated image
5. Cleans up old images

## Security Features

### Nginx Security
- Rate limiting for API endpoints
- Security headers (XSS, CSRF, etc.)
- Gzip compression
- Static file caching

### Docker Security
- Non-root user execution (where possible)
- Health checks for all services
- Network isolation
- Resource limits

### Application Security
- JWT authentication
- Environment variable validation
- CORS configuration
- Helmet.js security middleware

## Monitoring

### Health Checks
- **App**: HTTP GET to `/health` endpoint
- **MongoDB**: MongoDB ping command
- **Watchtower**: Container status monitoring

### Logging
- **Nginx**: Access and error logs
- **Backend**: Application logs via Supervisor
- **MongoDB**: Database logs
- **All**: Centralized via Docker logging driver

## Backup Strategy

### MongoDB Backup
```bash
# Daily automated backup
docker-compose exec -T mongodb mongodump \
  --username=$MONGO_ROOT_USERNAME \
  --password=$MONGO_ROOT_PASSWORD \
  --authenticationDatabase=admin \
  --archive | gzip > backup_$(date +%Y%m%d).gz
```

### Volume Backup
```bash
# Backup Docker volumes
docker run --rm -v mongodb_data:/data -v $(pwd):/backup ubuntu tar czf /backup/mongodb_data.tar.gz /data
```

## Scaling Considerations

### Horizontal Scaling
- Frontend: Multiple Nginx instances behind load balancer
- Backend: Multiple Node.js instances
- Database: MongoDB replica set

### Vertical Scaling
- Increase container resources
- Optimize application performance
- Database query optimization

## Troubleshooting

### Common Issues
1. **Port conflicts**: Check with `netstat -tlnp`
2. **Permission issues**: Verify Docker group membership
3. **Memory issues**: Monitor with `docker stats`
4. **Network issues**: Check Docker network connectivity

### Debug Commands
```bash
# View logs
docker-compose logs -f

# Check container status
docker-compose ps

# Execute commands in container
docker-compose exec app sh

# Monitor resources
docker stats

# Check network
docker network ls
docker network inspect travel-agency-network
```

## Performance Optimization

### Frontend
- Gzip compression enabled
- Static asset caching
- CDN integration ready

### Backend
- Connection pooling
- Request compression
- Rate limiting

### Database
- Index optimization
- Query monitoring
- Connection management

This setup provides a robust, scalable, and maintainable deployment solution with automatic CI/CD integration.

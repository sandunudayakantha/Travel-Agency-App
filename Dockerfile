# Multi-stage build for Travel Agency App
# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies (including dev dependencies for build)
RUN npm ci

# Copy frontend source code
COPY frontend/ .

# Build frontend
RUN npm run build

# Stage 2: Build Node.js backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci --only=production

# Copy backend source code
COPY backend/ .

# Stage 3: Production image with Nginx and Node.js
FROM node:18-alpine AS production

# Install Nginx and other required packages
RUN apk add --no-cache nginx supervisor

# Create necessary directories
RUN mkdir -p /var/www/html /var/log/nginx /var/log/supervisor /run/nginx

# Copy built frontend from frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# Copy backend from backend-builder stage
COPY --from=backend-builder /app/backend /app/backend

# Set working directory for backend
WORKDIR /app/backend

# Create uploads directory
RUN mkdir -p /app/backend/uploads

# Configure Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Configure Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports
EXPOSE 80 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

# Start services with Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

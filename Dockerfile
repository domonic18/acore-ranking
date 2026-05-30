# Multi-stage build for acore-ranking
# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine AS production
WORKDIR /app

# Install production dependencies only
COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy backend build output
COPY --from=backend-builder /app/backend/dist ./dist

# Copy frontend build output to public directory served by Express
COPY --from=frontend-builder /app/frontend/dist ./dist/public

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 9000

ENV NODE_ENV=production
ENV PORT=9000

CMD ["node", "dist/server.js"]

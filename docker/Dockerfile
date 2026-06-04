# docker/Dockerfile
# 前后端统一构建，输出单一可运行镜像

# ============================================================
# Stage 1: 前端构建
# ============================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

ARG VITE_ICON_BASE_URL
ARG VITE_AOWOW_BASE_URL
ARG VITE_WIDGET_DETAIL_URL
ARG VITE_WIDGET_ONLINE_URL
ENV VITE_ICON_BASE_URL=${VITE_ICON_BASE_URL}
ENV VITE_AOWOW_BASE_URL=${VITE_AOWOW_BASE_URL}
ENV VITE_WIDGET_DETAIL_URL=${VITE_WIDGET_DETAIL_URL}
ENV VITE_WIDGET_ONLINE_URL=${VITE_WIDGET_ONLINE_URL}
# 打印构建时环境变量，辅助排查
RUN echo "[Docker Build] VITE_WIDGET_DETAIL_URL=${VITE_WIDGET_DETAIL_URL}" && \
    echo "[Docker Build] VITE_WIDGET_ONLINE_URL=${VITE_WIDGET_ONLINE_URL}"

COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps

COPY frontend/ ./
RUN npm run build
# 验证: 确认 Widget URL 已注入构建产物
RUN grep -o 'http://[^"]*page_id=[^"]*' dist/assets/OnlineWidgetPage-*.js || echo "[WARN] Widget URL not found in build output"
# 输出: /app/frontend/dist/

# ============================================================
# Stage 2: 后端构建
# ============================================================
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --legacy-peer-deps

COPY backend/ ./
RUN npm run build
# 输出: /app/backend/dist/

# ============================================================
# Stage 3: 生产运行镜像
# ============================================================
FROM node:20-alpine AS production
WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=frontend-builder /app/frontend/dist ./dist/public

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 9000

CMD ["node", "dist/server.js"]

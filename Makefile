.PHONY: build up down logs clean

# 构建生产镜像 / Build production image
build:
	docker build -t acore-ranking:latest -f docker/Dockerfile .

# 启动本地开发环境 / Start local dev environment
up:
	docker-compose up -d

# 停止本地环境 / Stop local environment
down:
	docker-compose down

# 查看日志 / View logs
logs:
	docker-compose logs -f app

# 清理构建缓存 / Clean build cache
clean:
	docker system prune -f
	docker-compose down -v

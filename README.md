# acore-ranking

AzerothCore private server ranking and statistics service.
魔兽世界私服数据排行与统计展示服务。

## Features / 功能特性

- Online player statistics / 在线玩家统计
- Multi-dimensional rankings (gold, playtime, mounts, honor, achievements) / 多维排行（金币、游戏时长、坐骑、荣誉、成就）
- Hardcore challenge records / 硬核模式挑战记录
- Recent achievements timeline / 最近成就时间线
- Ban list / 封禁列表
- Character profile lookup / 角色信息查询
- iframe embedding support / iframe 嵌入支持
- Mobile responsive / 移动端适配

## Tech Stack / 技术栈

- **Backend**: Express + TypeScript + TypeORM + Redis
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Deployment**: Docker + Tencent Cloud SCF / Docker + 腾讯云 SCF

## Quick Start / 快速开始

```bash
# 1. Install dependencies / 安装依赖
cd backend && npm install
cd ../frontend && npm install

# 2. Configure environment / 配置环境变量
cp ../.env.example ../.env
# Edit .env with your database credentials

# 3. Start development / 启动开发
# Terminal 1: Backend
cd backend && npm run dev
# Terminal 2: Frontend
cd frontend && npm run dev
```

## Docker / Docker 部署

```bash
make build
make up
```

## License / 许可证

MIT

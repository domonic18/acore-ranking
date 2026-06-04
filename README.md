# acore-ranking

AzerothCore 数据排行与统计展示服务。

基于 Express + React + TypeScript 构建，支持在线玩家统计、多维排行、角色信息查询、成就展示等功能，专为 iframe 嵌入场景优化。

## 功能特性

- 在线玩家统计
- 多维排行（金币、游戏时长、坐骑数量、荣誉击杀、成就点数）
- 硬核模式挑战记录
- 成就时间线与分类浏览
- 封禁列表
- 角色信息查询（装备、天赋、成就）

## 快速开始

### 前置依赖

- Node.js 20+
- MySQL 8+（AzerothCore 数据库，只读连接）
- Redis 7+（缓存）
- Docker & Docker Compose（可选，用于容器化部署）

### 1. 克隆仓库

```bash
git clone https://github.com/your-org/acore-ranking.git
cd acore-ranking
```

### 2. 准备游戏数据

本项目依赖魔兽世界 WotLK 3.3.5 版本的 DBC 数据文件。**首次拉取仓库后必须执行以下步骤生成静态数据**，否则后端编译会失败。

#### 数据来源

以下 CSV 文件需自行从 WoW 3.3.5 客户端或 AzerothCore 数据库导出，放入对应目录：

| 文件路径 | 来源 | 说明 |
|---------|------|------|
| `data/dbc/ItemDisplayInfo_3.3.5_12340.csv` | DBC 导出 | 物品显示信息与图标映射 |
| `data/dbc/SpellIcon_3.3.5_12340.csv` | DBC 导出 | 法术图标映射表 |
| `data/dbc/Spell_3.3.5_12340.csv` | DBC 导出 | 法术数据表 |
| `data/dbc/TalentTab_3.3.5_12340.csv` | DBC 导出 | 天赋页签信息 |
| `data/dbc/Talent_3.3.5_12340.csv` | DBC 导出 | 天赋详细信息 |
| `data/dbc/Achievement_3.3.5_12340.csv` | DBC 导出 | 成就列表 |
| `data/dbc/AchievementCategory_3.3.5_12340.csv` | DBC 导出 | 成就分类 |
| `data/spell.csv` |  AzerothCore `spell_dbc` 表导出 | 用于提取坐骑法术 ID |

> **获取 DBC 文件的方法**：使用 [WowParser](https://github.com/WowDevTools/WowParser) 或 [WDBX Editor](https://github.com/WowDevTools/WDBXEditor) 从 `WoW 3.3.5a (12340)` 客户端的 `*.dbc` 文件导出为 CSV。也可直接从 AzerothCore 数据库的对应表中导出。

#### 生成 TypeScript 常量文件

数据文件放置完成后，运行脚本生成后端所需的 TypeScript 常量：

```bash
cd backend && npm run generate-dbc
```

该脚本会解析 `data/dbc/` 下的 CSV 文件，在 `backend/src/generated/` 目录生成以下内容：

| 生成文件 | 数据来源 | 用途 |
|---------|---------|------|
| `itemDisplayInfo.ts` | `ItemDisplayInfo_3.3.5_12340.csv` | 物品显示 ID → 图标名映射 |
| `spellIcon.ts` | `SpellIcon_3.3.5_12340.csv` | 法术图标 ID → 贴图文件名 |
| `spellToIcon.ts` | `Spell_3.3.5_12340.csv` | 法术 ID → 图标 ID 映射 |
| `talents.ts` | `TalentTab` + `Talent` CSV | 天赋树和天赋数据 |
| `achievements.ts` | `Achievement` + `AchievementCategory` CSV | 成就列表与分类层级 |

#### 提取坐骑法术 ID

```bash
cd backend && npm run extract-mounts -- ../data/spell.csv
```

该脚本读取 `data/spell.csv`，识别出所有坐骑类法术 ID，输出到 `backend/src/shared/constants/mount-spell-ids.ts`。

### 3. 安装依赖

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，填写数据库连接信息、Redis 地址等
```

关键配置项说明：

| 变量 | 说明 |
|------|------|
| `DB_URL` / `DB_AUTH` / `DB_CHARACTERS` / `DB_WORLD` | AzerothCore 数据库连接信息 |
| `REDIS_URL` | Redis 连接地址，用于热点数据缓存 |
| `ALLOWED_ORIGINS` | 允许的 CORS 来源，iframe 嵌入场景需配置父页面域名 |
| `VITE_ICON_BASE_URL` | 图标 CDN 地址，默认使用 Wowhead CDN，生产环境建议配置为自托管 CDN 如腾讯云 COS |
| `VITE_AOWOW_BASE_URL` | 物品/法术查询外链地址 |

### 5. 启动开发环境

```bash
# 终端 1：后端
cd backend && npm run dev

# 终端 2：前端
cd frontend && npm run dev
```

后端默认监听 `9000` 端口，前端开发服务器默认 `5173` 端口。

## Docker 部署

```bash
# 构建并启动
make build
make up

# 查看日志
make logs

# 停止
make down
```

构建后的镜像同时提供 API 服务和静态前端文件（前端构建产物复制到 `backend/dist/public`，由 Express 静态中间件托管）。

## 图标资源说明

### 本地图标下载（可选）

如需将图标下载到本地或上传到自己的 CDN，可使用以下脚本：

```bash
# 1. 从生成的 TypeScript 常量中提取所有图标名
cd backend
cat src/generated/itemDisplayInfo.ts src/generated/spellIcon.ts src/generated/achievements.ts | \
  grep -oP '[a-zA-Z0-9_]+' | sort -u > /tmp/icon_list.txt

# 2. 批量下载图标到 frontend/public/assets/icons/wow/
node ../scripts/download-icons.js

# 或使用 Shell 版本（需安装 GNU parallel）
bash ../scripts/download-icons.sh
```

> 注意：`download-icons.js` 依赖 `/tmp/icon_list.txt`，该文件需自行从生成的数据文件中提取所有唯一的图标名称。

## 项目结构

```
acore-ranking/
├── backend/
│   ├── src/
│   │   ├── routes/         # Express HTTP 路由（薄层）
│   │   ├── services/       # 业务逻辑与缓存管理
│   │   ├── repositories/   # TypeORM 查询封装
│   │   ├── generated/      # 由 scripts 生成的 DBC 数据常量
│   │   └── shared/         # 工具函数、常量
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── features/       # 按功能模块组织的页面组件
│   │   └── shared/         # 跨功能共享组件、API 客户端、常量
│   └── package.json
├── data/
│   ├── dbc/                # DBC 导出 CSV 文件（需自行准备）
│   └── spell.csv           # spell_dbc 表导出（坐骑提取用）
├── scripts/                # 构建时数据生成脚本
├── docker/
│   └── Dockerfile          # 多阶段构建 Dockerfile
├── docs/                   # 项目文档
└── docker-compose.yml
```

## 相关文档

- [`docs/icon-loading-issue-analysis.md`](docs/icon-loading-issue-analysis.md) — 图标加载问题分析与解决方案
- [`scripts/README.md`](scripts/README.md) — 构建脚本详细说明

## License

MIT

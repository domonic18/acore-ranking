# PlayerMap 迁移方案评估

## 一、现状分析

### 1.1 现有 PHP PlayerMap 功能

PlayerMap 是一个 AzerothCore 在线玩家地图展示工具，核心功能包括：

| 功能 | 说明 |
|------|------|
| 三地图切换 | 艾泽拉斯(Azeroth)、外域(Outland)、诺森德(Northrend) |
| 玩家点位显示 | 将游戏世界坐标 (position_x, position_y) 转换为地图像素坐标 |
| 阵营区分 | 联盟(蓝色)、部落(红色)不同图标 |
| 副本标识 | 副本内玩家显示为副本图标，悬停显示列表 |
| 组队聚合 | 同一位置附近玩家聚合为组图标，点击展开列表 |
| 玩家详情 Tooltip | 悬停显示：名称、等级、种族图标、职业图标 |
| 服务器状态 | 在线状态、运行时间、最大在线人数、GM 在线数 |
| 自动刷新 | 可配置刷新间隔（默认 5 秒） |
| 玩家详情跳转 | 点击玩家名称跳转至角色详情页（装备/天赋/成就） |
| 硬核玩家标识 | 正在进行硬核挑战的玩家（已开始挑战且未阵亡）使用特殊样式区分 |
| GM 控制 | 是否显示 GM、GM 后缀、GM 可见性规则 |

### 1.2 现有技术实现

**后端 (PHP)**
- 直接查询 `characters` 表获取 `online=1` 的玩家
- 查询 `group_member` 表获取组队信息
- 查询 `uptime` 表获取服务器状态
- 使用 socket 探测游戏服务器端口判断在线状态
- 通过 `JsHttpRequest` 库返回 JSON 数据

**前端 (HTML + 内联 JS)**
- 三层 div 叠放：地图底图 → 玩家点位层 → UI 层
- 手写 DOM 操作渲染玩家点位（`innerHTML` 拼接字符串）
- `setTimeout` 轮询后端数据
- 内联坐标转换算法（硬编码各副本像素坐标）

**移动端问题**
- 地图固定尺寸 966×732px，使用 `left: 50%; margin-left: -483px` 居中
- 移动端屏幕宽度仅 375-430px，只能看到地图右侧区域，左侧内容被截断且无法滚动
- 无缩放功能，触控操作完全不可用

**资源文件**
- 地图背景：`img/map/azeroth.jpg`、`outland.jpg`、`northrend.jpg`
- 阵营图标：`img/map/allia.gif`、`horde.gif`、`group-icon.gif`、`inst-icon.gif`
- 种族/职业图标：`img/c_icons/{race}-{gender}.gif`、`{class}.gif`
- 状态图标：`realm_on.gif`、`realm_off.gif`、`status.gif`

### 1.3 当前 acore-ranking 项目复用度

| 现有能力 | 复用程度 | 说明 |
|---------|---------|------|
| 在线玩家查询 | **高** | `OnlineRepository.findOnlinePlayers()` 已查询在线玩家，只需扩展字段 |
| 阵营判断 | **高** | `getFactionByRace()` 已有工具函数 |
| 数据库连接 | **高** | TypeORM 多数据源已配置 |
| 缓存层 | **高** | Redis + `CacheService` 可直接使用 |
| 种族/职业图标 | **中** | 前端已有 `/assets/icons/race/`、`/assets/icons/class/`，但格式不同 |
| 地图资源 | **低** | 需要新增地图背景图和点位图标 |
| API 路由 | **高** | Express 路由体系已就绪 |

---

## 二、迁移方案

### 2.1 架构设计

将 PlayerMap 作为 acore-ranking 的一个**新功能模块**集成，而非独立服务：

```
用户浏览器
    |
    |-- /playermap (前端路由)
    |   |-- React PlayerMap 组件
    |   |-- Canvas/SVG 渲染地图 + 玩家点位
    |
    |-- /api/playermap/players (API)
    |   |-- PlayerMapService
    |   |-- 坐标转换 → 分组聚合 → 返回 JSON
    |
    |-- /api/playermap/status (API)
        |-- 服务器状态 + 运行时间
```

### 2.2 后端实现

#### 新增 Repository

```typescript
// backend/src/repositories/playermap.repository.ts
export class PlayerMapRepository extends BaseRepository {
  async findOnlinePlayersWithPosition() {
    return this.rawQuery(`
      SELECT
        c.guid, c.name, c.class, c.race, c.level, c.gender,
        c.position_x, c.position_y, c.map, c.zone,
        c.extra_flags, c.online,
        gm.id as gm_account,
        hc.character_guid IS NOT NULL as is_hardcore
      FROM characters c
      LEFT JOIN account_access gm ON gm.id = c.account AND gm.gmlevel > 0
      LEFT JOIN hardcore_challenge_completed hc ON hc.character_guid = c.guid
      LEFT JOIN hardcore_challenge_failed hf ON hf.character_guid = c.guid
      WHERE c.online = 1
        AND hf.character_guid IS NULL
      ORDER BY c.name
    `);
  }
}
```

> **硬核玩家判断逻辑**：正在进行硬核挑战的玩家 = 在 `hardcore_challenge_completed` 表中有记录（已开始挑战，无论当前进度是 60/70/80）且不在 `hardcore_challenge_failed` 表中。

> **对比 PHP 版本**：PHP 使用了两个查询（characters + group_member），新版建议**单次查询**用 JOIN 获取 group_leader，减少数据库往返。

#### 新增 Service

```typescript
// backend/src/services/playermap.service.ts
interface MapPlayer {
  name: string;
  level: number;
  race: number;
  class: number;
  gender: number;
  faction: 'alliance' | 'horde';
  x: number;        // 地图像素坐标
  y: number;
  map: number;      // 原始 map_id
  zone: string;     // 区域名称
  isDead: boolean;
  isGm: boolean;
  isHardcore: boolean;  // 是否硬核挑战玩家
  leaderGuid?: number;
}

interface MapData {
  azeroth: { alliance: number; horde: number; players: MapPlayer[] };
  outland: { alliance: number; horde: number; players: MapPlayer[] };
  northrend: { alliance: number; horde: number; players: MapPlayer[] };
  status: { online: boolean; uptime: number; maxPlayers: number };
}
```

**核心坐标转换算法**（从 PHP 迁移）：

PHP 中的 `get_player_position(x, y, m)` 需要完整移植到 TypeScript：

```typescript
function getPlayerPosition(x: number, y: number, map: number): { x: number; y: number } {
  // 530 外域需要特殊处理：血精灵/德莱尼新手区坐标偏移
  // 571 诺森德、609 死亡骑士起始区也有特殊处理
  // 原始算法中的缩放系数：
  // - 艾泽拉斯: 0.025140
  // - 外域: 0.051446
  // - 诺森德: 0.050085
  // 详见 PHP 代码 pomm_play.php / index.php
}
```

#### 新增路由

```typescript
// backend/src/routes/playermap.routes.ts
router.get('/players', async (req, res) => {
  const data = await service.getMapData();
  res.jsonSuccess(data);
});

router.get('/status', async (req, res) => {
  const status = await service.getServerStatus();
  res.jsonSuccess(status);
});
```

### 2.3 前端实现

#### 技术选型

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| A. HTML5 Canvas | 性能高，适合大量点位 | 交互实现复杂（tooltip、点击） | ★★★☆☆ |
| B. SVG + DOM | 交互自然，CSS 控制样式 | 大量 DOM 节点性能一般 | ★★★★☆ |
| C. 混合方案 (SVG地图 + DOM点位) | 地图用背景图，点位用绝对定位 div | 实现简单，与现有技术栈一致 | **★★★★★** |

**推荐方案 C**：复用 PHP 版本的 DOM 叠加思路，但用 React 重构：

```tsx
// frontend/src/features/playermap/components/PlayerMap.tsx
export function PlayerMap() {
  const [activeMap, setActiveMap] = useState<'azeroth' | 'outland' | 'northrend'>('azeroth');
  const { data, refetch } = useMapData();  // TanStack Query 自动轮询

  return (
    <div className="relative mx-auto" style={{ width: 966, height: 732 }}>
      {/* 地图背景层 */}
      <MapBackground map={activeMap} />

      {/* 玩家点位层 */}
      <PlayerLayer
        players={data?.[activeMap].players}
        onPlayerHover={setTooltip}
        onPlayerClick={setDetailPanel}
      />

      {/* UI 控制层 */}
      <MapSwitcher active={activeMap} onChange={setActiveMap} />
      <ServerStatus status={data?.status} />
      <PlayerCount counts={data?.[activeMap]} />

      {/* Tooltip */}
      <PlayerTooltip {...tooltip} />
    </div>
  );
}
```

#### 硬核玩家标识样式

后端返回 `isHardcore` 字段后，前端通过 CSS 样式区分：

```tsx
// 玩家点位渲染
function PlayerMarker({ player }: { player: MapPlayer }) {
  const baseClasses = "absolute w-4 h-4 rounded-full border-2 cursor-pointer";
  const factionColor = player.faction === 'alliance'
    ? 'bg-blue-500 border-blue-300'
    : 'bg-red-500 border-red-300';

  // 硬核玩家：增加金色发光边框 + 骷髅角标
  const hardcoreClasses = player.isHardcore
    ? 'shadow-[0_0_6px_2px_rgba(255,215,0,0.8)] border-yellow-400'
    : '';

  return (
    <div
      className={`${baseClasses} ${factionColor} ${hardcoreClasses}`}
      style={{ left: player.x, top: player.y }}
      title={player.isHardcore ? '硬核挑战玩家' : ''}
    >
      {player.isHardcore && (
        <span className="absolute -top-2 -right-2 text-[10px]">💀</span>
      )}
    </div>
  );
}
```

**视觉区分对照**：

| 玩家类型 | 普通样式 | 硬核样式 |
|---------|---------|---------|
| 联盟 | 蓝色圆点 + 蓝边框 | 蓝色圆点 + **金色发光边框** + 骷髅角标 |
| 部落 | 红色圆点 + 红边框 | 红色圆点 + **金色发光边框** + 骷髅角标 |

#### 自动刷新

使用 TanStack Query 的 `refetchInterval`：

```typescript
const { data } = useQuery({
  queryKey: ['playermap'],
  queryFn: fetchMapData,
  refetchInterval: 5000,  // 5 秒轮询，与 PHP 版一致
});
```

#### 移动端适配方案

**核心问题**：地图固定 966×732，移动端只能看到右侧区域。

**方案设计：地图缩放 + 手势操作**

```tsx
// frontend/src/features/playermap/components/PlayerMap.tsx
export function PlayerMap() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeMap, setActiveMap] = useState<'azeroth' | 'outland' | 'northrend'>('azeroth');
  const { data } = useMapData();

  // 移动端：计算初始缩放使地图宽度适配屏幕
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const containerWidth = containerRef.current?.clientWidth || 966;
    const initialScale = Math.min(1, containerWidth / 966);
    setScale(initialScale);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* 地图可视区域 */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative bg-black"
        style={{ touchAction: 'none' }}
      >
        <MapContainer
          scale={scale}
          position={position}
          onScaleChange={setScale}
          onPositionChange={setPosition}
        >
          <MapBackground map={activeMap} />
          <PlayerLayer
            players={data?.[activeMap].players}
            scale={scale}
          />
        </MapContainer>
      </div>

      {/* 移动端底部操作栏 */}
      <MobileBottomBar
        activeMap={activeMap}
        onMapChange={setActiveMap}
        onZoomIn={() => setScale(s => Math.min(s * 1.2, 2))}
        onZoomOut={() => setScale(s => Math.max(s / 1.2, 0.3))}
        onReset={() => { setScale(0.4); setPosition({ x: 0, y: 0 }); }}
        playerCount={data?.[activeMap]}
      />
    </div>
  );
}
```

**MapContainer 实现要点**（支持 pinch 缩放 + drag 平移）：

```typescript
// 使用原生 TouchEvent 实现手势
// - pinch: 双指缩放，调整 scale
// - pan: 单指拖动，调整 position (x, y)
// - 限制边界：position 不能超过地图边缘
```

**响应式断点策略**：

| 场景 | 处理方式 |
|------|---------|
| PC 端 (≥966px) | 地图居中显示，原始尺寸，hover 触发 tooltip |
| 平板 (768-965px) | 宽度适配，允许横向滚动，保持原始尺寸 |
| 手机 (<768px) | 缩放模式默认 0.4 倍，支持手势缩放/拖动，点击触发详情 |

**移动端交互差异**：

| 交互 | PC 端 | 移动端 |
|------|-------|--------|
| 玩家详情 | hover 显示 tooltip，点击名称跳转角色页 | 点击显示 Bottom Sheet，点击名称跳转角色页 |
| 组队展开 | 点击图标 | 点击图标 |
| 地图切换 | 顶部 tab | 底部操作栏 |
| 缩放 | 滚轮 / 按钮 | 双指 pinch / 按钮 |
| 平移 | 鼠标拖动 | 单指拖动 |

**Bottom Sheet 玩家详情**：

```tsx
// 移动端点击玩家/组队后弹出底部抽屉
<BottomSheet
  open={!!selectedPlayer}
  onClose={() => setSelectedPlayer(null)}
>
  <PlayerDetailCard player={selectedPlayer}>
    {/* 硬核玩家标识 */}
    {selectedPlayer.isHardcore && (
      <span className="inline-flex items-center gap-1 rounded bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
        💀 硬核挑战
      </span>
    )}
    {/* 点击跳转至角色详情页 */}
    <Link
      to={`/character/${selectedPlayer.name}`}
      className="mt-2 block text-center text-sm text-blue-400"
    >
      查看装备 / 天赋 / 成就 →
    </Link>
  </PlayerDetailCard>
</BottomSheet>
```

**PC 端 Tooltip 跳转**：

```tsx
// hover 显示的 tooltip 中，玩家名称作为链接
<div className="tooltip">
  <Link to={`/character/${player.name}`} className="font-bold hover:underline">
    {player.name}
  </Link>
  <span> {player.level}级 </span>
  <span>{raceName[player.race]} {className[player.class]}</span>
</div>
```

### 2.4 资源文件处理

| 资源 | 来源 | 处理方式 |
|------|------|---------|
| 地图背景图 (azeroth.jpg, outland.jpg, northrend.jpg) | 从 PHP PlayerMap 复制 | 放入 `frontend/public/assets/maps/` |
| 阵营图标 (allia.gif, horde.gif, group-icon.gif, inst-icon.gif) | 从 PHP PlayerMap 复制 | 放入 `frontend/public/assets/playermap/` |
| 种族/职业图标 | 现有项目 `/assets/icons/` | 复用或新增 gif → png 转换 |
| 状态图标 | 从 PHP PlayerMap 复制 | 放入 `frontend/public/assets/playermap/` |

> **图标兼容性**：PHP 版使用 `.gif` 格式，当前项目使用其他格式。建议统一为 `.png` 或复用现有图标体系。

---

## 三、数据表与查询对比

### 3.1 PHP 版查询

```php
// 查询在线玩家（含位置）
SELECT account, name, class, race, level, gender,
       position_x, position_y, map, zone, extra_flags
FROM characters
WHERE online = '1'
ORDER BY name

// 查询组队信息
SELECT leaderGuid, memberGuid
FROM group_member
WHERE memberGuid IN (SELECT guid FROM characters WHERE online = '1')

// 查询 GM 账号
SELECT GROUP_CONCAT(id SEPARATOR ' ') FROM account_access WHERE gmlevel > '0'

// 查询服务器状态
SELECT UNIX_TIMESTAMP(), starttime, maxplayers
FROM uptime
WHERE starttime = (SELECT MAX(starttime) FROM uptime)
```

### 3.2 新版推荐查询

**优化点**：合并为单次查询，减少数据库往返

```sql
-- 在线玩家 + 位置 + GM 标识 + 硬核标识 + 组队 leader（单次查询）
-- 硬核玩家 = 已开始挑战(在 completed 表中有记录) 且 未阵亡
SELECT
  c.guid, c.name, c.class, c.race, c.level, c.gender,
  c.position_x, c.position_y, c.map, c.zone, c.extra_flags,
  gm.gmlevel IS NOT NULL as is_gm,
  hc.character_guid IS NOT NULL as is_hardcore,
  g.leaderGuid
FROM characters c
LEFT JOIN account_access gm ON gm.id = c.account AND gm.gmlevel > 0
LEFT JOIN hardcore_challenge_completed hc ON hc.character_guid = c.guid
LEFT JOIN hardcore_challenge_failed hf ON hf.character_guid = c.guid
LEFT JOIN group_member g ON g.memberGuid = c.guid
WHERE c.online = 1
  AND hf.character_guid IS NULL
ORDER BY c.name
```

---

## 四、与现有系统的集成

### 4.1 路由集成

```typescript
// backend/src/app.ts
import playermapRoutes from './routes/playermap.routes';
app.use('/api/playermap', playermapRoutes);
```

```typescript
// frontend/src/App.tsx 或路由配置
{ path: '/playermap', element: <PlayerMapPage /> }
```

### 4.2 导航入口

在现有前端导航中增加 PlayerMap 入口：

```tsx
// 例如在 OnlinePage 或顶部导航中添加
<Link to="/playermap">在线地图</Link>
```

### 4.3 与角色详情页联动

PlayerMap 中的玩家名称直接链接至已有的角色详情页：

```tsx
// 点击玩家名称跳转
<Link to={`/character/${player.name}`}>{player.name}</Link>
```

该路由已存在于前端路由表中（`/character/:name`），后端 `/api/character/:name` 接口已提供完整的装备、天赋、成就数据，无需额外开发。

### 4.3 环境变量

```bash
# .env
# PlayerMap 配置
PLAYERMAP_REFRESH_INTERVAL=5
PLAYERMAP_SHOW_GM=1
PLAYERMAP_GM_SUFFIX=1
```

---

## 五、工作量评估

| 模块 | 任务 | 预计工时 |
|------|------|---------|
| **后端** | PlayerMapRepository 扩展查询 | 1h |
| | 坐标转换算法移植 (TypeScript) | 3h |
 | | 玩家分组/聚合逻辑 | 2h |
| | 服务器状态查询 | 1h |
| | API 路由 + Service | 1h |
| **前端 (PC)** | PlayerMap 页面组件结构 | 2h |
| | 地图背景 + 图层切换 | 2h |
| | 玩家点位渲染 (DOM) | 3h |
| | Tooltip 交互 | 1.5h |
| | 点击展开玩家列表 | 1.5h |
| | 服务器状态面板 | 1h |
| | 自动刷新 (TanStack Query) | 0.5h |
| **前端 (移动端)** | 响应式地图容器 (缩放+平移) | 3h |
| | 手势交互 (pinch + drag) | 3h |
| | 底部操作栏 + 地图切换 | 2h |
| | Bottom Sheet 玩家详情面板 | 2h |
| **资源** | 地图图片迁移 | 0.5h |
| | 图标格式统一 | 1h |
| **测试** | 坐标精度验证 | 2h |
| | 副本/组队场景测试 | 1h |
| | 移动端手势/响应式测试 | 2h |
| **总计** | | **约 35h** |

---

## 六、风险与注意事项

### 6.1 坐标精度风险

PHP 版中坐标转换有大量硬编码参数（缩放系数、偏移量、副本像素坐标）。迁移时需**逐行对照验证**，确保新版地图点位与旧版一致。

**验证方法**：
1. 同时运行新旧版本
2. 对比同一玩家在两个版本中的地图位置
3. 重点检查外域（map=530）的血精灵/德莱尼新手区偏移

### 6.2 SCF 部署限制

腾讯云 SCF 对容器镜像有以下限制：
- 镜像大小 ≤ 10GB（当前项目镜像约 ~200MB，加上地图图片后仍可接受）
- 请求超时 ≤ 900 秒（PlayerMap API 查询简单，无问题）
- 并发限制需根据实际在线人数评估

### 6.3 数据库性能

PHP 版每次刷新执行 3-4 次查询。新版合并为单次查询后性能更好，但仍建议：
- 使用 Redis 缓存（如已有 `CacheService`）
- 缓存 TTL 设为 3-5 秒（与刷新间隔匹配）

### 6.4 静态资源路径

PHP 版图标路径为 `img/map/`、`img/c_icons/`，新版统一使用 `public/assets/` 体系，需要调整所有图标引用。

---

## 七、推荐实施顺序

```
Week 1
├── Day 1: 后端 Repository 扩展 + 坐标转换算法移植
├── Day 2: 后端 Service（分组聚合 + 服务器状态）+ API 路由
├── Day 3: 前端基础结构（地图背景层 + PC 端玩家点位渲染）
├── Day 4-5: PC 端交互（Tooltip + 点击展开 + 地图切换 + 状态面板）

Week 2
├── Day 1: 移动端响应式容器（缩放 + 平移 + 手势）
├── Day 2: 移动端底部操作栏 + Bottom Sheet 玩家详情
├── Day 3: 资源文件迁移 + 图标统一 + 自动刷新联调
├── Day 4: PC 端坐标精度验证 + 副本/组队场景测试
├── Day 5: 移动端手势/响应式测试 + SCF 部署验证
```

---

## 八、移动端设计要点补充

### 8.1 默认视图策略

移动端首次进入时，地图默认缩放至 **0.4 倍**（约 386×293），完整展示整张地图概览。用户可通过手势放大查看局部区域。

```
移动端初始状态：
┌──────────────────────┐
│                      │
│    完整地图缩略图     │  (scale 0.4)
│    玩家点位可见       │
│                      │
└──────────────────────┘
     [底部操作栏]
```

### 8.2 性能优化

- 地图背景图较大（每张约 200-500KB），使用 `loading="lazy"` 并按需加载当前地图
- 玩家点位使用 `transform: translate()` 而非 `top/left`，启用 GPU 加速
- 手势操作使用 `requestAnimationFrame` 节流，避免频繁重绘

### 8.3 可访问性

- 为每个玩家点位添加 `aria-label`（"玩家名称，等级，区域"）
- 底部操作栏按钮尺寸 ≥ 44×44px，符合触控规范

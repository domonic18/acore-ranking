# 排行榜模块重构方案 / Ranking Module Refactoring Plan

## 1. 现状与问题

随着排行榜数量增加到 18 个，代码重复和扩展成本逐渐显现：

### 1.1 后端

- **RankingRepository 重复**：每个基于 `character_achievement_progress` 的排行榜（死亡、杀怪、5人本、10人团本、25人团本等）都有独立的 `findTopXxxPlayers` 方法，SQL 结构几乎完全相同，仅 `criteria` 和返回列别名不同。
- **RankingService 重复**：每个排行榜方法都重复“读缓存 → 调 repository → 映射字段 → 写缓存 → 异常兜底”的模板代码。
- **新增成本高**：增加一个同类排行榜需要同时修改 repository、service、routes、cache keys、tests 等多个文件。

### 1.2 前端

- **表格组件重复**：18 个 `*RankingTable.tsx` 中，绝大多数只有最后一列的字段名和表头不同，其余 5 列（角色名、种族、职业、等级、阵营）完全一致。
- **Query Hook 重复**：`queries.ts` 中有 18 个结构完全相同的 `useXxxRanking` hook。
- **RankingPage 臃肿**：大量 import、大量 query hook 调用、大量条件渲染分支。
- **RankingTabs 硬编码**：分类和 tab 数据写死在组件内，新增排行榜需要同时修改多处。

### 1.3 类型

- 大量 `*RankPlayer` 接口只在计数字段名上有差异，可以通过泛型统一。

## 2. 重构目标

1. **消除重复**：把重复的 repository/service/table/hook 抽象为通用实现。
2. **配置驱动**：新增普通排行榜时尽量只改配置，不改通用代码。
3. **提升层次性**：明确分层（repository → service → route；config → hook → table → page）。
4. **保持兼容**：API 响应结构、字段名、URL 路径、UI 行为保持不变，避免影响外部 iframe 调用方。
5. **便于扩展**：未来新增排行榜时，给出清晰的“三步扩展”指南。

## 3. 后端重构方案

### 3.1 Repository 层：提取通用成就进度查询

所有通过 `character_achievement_progress.criteria` 统计的排行榜，SQL 模板完全一致：

```sql
SELECT
  c.guid, c.name, c.race, c.class, c.level, c.gender,
  COALESCE(p.counter, 0) as {alias}
FROM characters c
LEFT JOIN character_achievement_progress p ON c.guid = p.guid AND p.criteria = {criteriaId}
ORDER BY {alias} DESC
LIMIT {limit}
```

**建议新增通用方法**：

```ts
async findTopByAchievementCriteria(
  criteriaId: number,
  alias: string,
  limit = 200,
): Promise<unknown[]>
```

覆盖的排行榜：

- 死亡次数（criteria `111`）
- 杀怪数（`4948`）
- 小动物击杀（`4958`）
- 飞行点（`5305`）
- 治疗药水（`4299`）
- 5人本（`4987`）
- 10人团本（`4988`）
- 25人团本（`4989`）

**保留独立方法**（SQL 差异较大）：

- `findTopGoldPlayers`
- `findTopPlaytimePlayers`
- `findTopHonorPlayers`
- `findTopKillsPlayers`
- `findTopReputationPlayers`
- `findTopQuestPlayers`
- `findTopLegendaryPlayers`
- `findTopTodayKillsPlayers`
- `findTopAchievementPlayers`
- `findTopMountPlayers`

### 3.2 Service 层：提取通用服务方法

**建议新增**：

```ts
async getAchievementProgressRanking(
  cacheKey: string,
  criteriaId: number,
  countField: string,
): Promise<unknown[]>
```

该方法统一处理：

1. 缓存读取
2. 调用 `findTopByAchievementCriteria`
3. 统一字段映射（`guid/name/race/class/gender/level/side/{countField}`）
4. 缓存写入
5. 异常兜底返回空数组

现有 8 个 achievement-progress 类 service 方法可以改为直接调用此通用方法。

### 3.3 Route 层：循环注册路由（可选）

对于同类 achievement-progress 排行榜，可以通过配置数组循环注册，减少重复代码：

```ts
const achievementRankings = [
  { path: '/deaths', method: 'getDeathRanking', cacheKey: CacheKeys.topDeaths, criteria: 111, field: 'death_count' },
  // ...
];
```

或者保持显式路由，但 service 方法内部复用通用方法。

### 3.4 Cache Keys

Cache keys 建议集中到一个映射表中，避免散落在 service 里：

```ts
const ACHIEVEMENT_RANKING_CONFIG = [
  { key: 'deaths', cacheKey: CacheKeys.topDeaths, criteria: 111, field: 'death_count' },
  // ...
];
```

## 4. 前端重构方案

### 4.1 通用表格组件

#### 4.1.1 BaseRankingTable

抽出固定列（角色名、种族、职业、等级、阵营）作为通用组件：

```tsx
interface BaseRankingTableProps<T extends RankPlayer> {
  data: T[];
  extraColumns: ColumnDef<T>[];
}
```

#### 4.1.2 CountRankingTable

对于只有“一个数字列”差异的排行榜，使用更简单的封装：

```tsx
interface CountRankingTableProps<T extends RankPlayer> {
  data: T[];
  accessorKey: keyof T;
  header: string;
}
```

可覆盖：死亡、击杀、杀怪、小动物、飞行点、治疗药水、5人本、10人团本、25人团本、成就点、坐骑数等。

#### 4.1.3 保留特殊表格

以下表格因列渲染特殊，保留独立组件或作为 `BaseRankingTable` 的特例：

- `GoldRankingTable`（使用 `GoldDisplay`）
- `PlaytimeRankingTable`（显示格式化时间字符串）
- `HonorRankingTable`（若启用，含 honor + time）
- `KillsRankingTable`（含 time）
- `ReputationRankingTable`（两列：总声望、崇拜声望）
- `QuestRankingTable`（单数字列，可合并到 CountRankingTable）
- `LegendaryRankingTable`（含装备图标列表）
- `TodayKillsRankingTable`（单数字列）
- `AchievementRankingTable`（单数字列）
- `MountRankingTable`（单数字列 + 坐骑 ID 字符串）

### 4.2 Query Hook 工厂

用工厂函数替代 `queries.ts` 中的重复 hook：

```ts
function createRankingQuery<T extends RankPlayer>(
  queryKey: string,
  endpoint: string,
) {
  return function useRankingQuery() {
    return useQuery<T[]>({
      queryKey: ['ranking', queryKey],
      queryFn: () => apiClient.get(endpoint),
    });
  };
}

export const useDeathRanking = createRankingQuery<DeathRankPlayer>('deaths', Endpoints.ranking.deaths);
// ...
```

### 4.3 配置驱动 RankingPage

定义统一的排行榜配置：

```ts
interface RankingConfig {
  key: TabKey;
  label: string;
  category: CategoryKey;
  endpoint: string;
  useQuery: () => UseQueryResult<RankPlayer[], unknown>;
  component: React.ComponentType<{ data: RankPlayer[] }>;
}

const rankingConfig: RankingConfig[] = [
  {
    key: 'gold',
    label: '财富排行',
    category: 'character',
    endpoint: Endpoints.ranking.gold,
    useQuery: useGoldRanking,
    component: GoldRankingTable,
  },
  // ...
];
```

`RankingPage` 改为：

```tsx
const queries = Object.fromEntries(
  rankingConfig.map((c) => [c.key, c.useQuery()]),
);
const current = queries[activeTab];
const activeConfig = rankingConfig.find((c) => c.key === activeTab)!;
const TableComponent = activeConfig.component;
```

从而消除大量 import、hook 调用和条件渲染。

### 4.4 RankingTabs 配置化

`RankingTabs` 从 `rankingConfig` 派生 `categories` 和 `tabs`，不再硬编码：

```ts
const categories = deriveCategories(rankingConfig);
```

这样新增排行榜只需改一处配置，分类菜单会自动更新。

## 5. 类型重构

引入泛型类型减少重复接口：

```ts
export type CountedRankPlayer<K extends string> = RankPlayer & Record<K, number>;
```

例如：

```ts
export type DeathRankPlayer = CountedRankPlayer<'death_count'>;
export type MonsterKillRankPlayer = CountedRankPlayer<'monster_kill_count'>;
```

对于更复杂的类型（如 `LegendaryRankPlayer`）保留独立接口。

## 6. 测试重构

### 6.1 后端

- 对 `getAchievementProgressRanking` 进行参数化单元测试，覆盖不同 criteria 和字段名。
- 特殊 service 方法保持单独测试。
- e2e 路由测试通过配置数组循环断言。

### 6.2 前端

- 为 `BaseRankingTable` / `CountRankingTable` 补充通用测试。
- 删除或简化大量重复的单组件测试（如果存在）。

## 7. 实施步骤（建议）

### Phase 1：后端通用化

1. 在 `RankingRepository` 新增 `findTopByAchievementCriteria`。
2. 在 `RankingService` 新增 `getAchievementProgressRanking`。
3. 将 8 个 achievement-progress 类方法改为调用通用方法。
4. 更新单元测试和 e2e 测试。
5. 运行 `npm test` 和 `npm run build`。

### Phase 2：前端通用化

1. 新增 `BaseRankingTable` 和 `CountRankingTable`。
2. 用 `CountRankingTable` 替换简单的单数字列表格组件。
3. 在 `queries.ts` 使用 `createRankingQuery` 工厂。
4. 重构 `RankingPage` 为配置驱动。
5. 重构 `RankingTabs` 从配置派生。
6. 运行 `npx tsc --noEmit`、`npm run lint`、`npm run build`。

### Phase 3：清理与回归

1. 删除已被通用组件替代的废弃表格组件。
2. 删除废弃的 query hook（如果已内联到配置）。
3. 全量回归测试。
4. 更新文档中的扩展指南。

## 8. 风险与注意事项

1. **API 兼容性**：保持响应字段名、顺序和类型不变，避免外部调用方（iframe/WordPress）需要修改。
2. **缓存 Key**：保持现有 `CacheKeys` 值不变，或切换时清理旧缓存。
3. **URL 路径**：保持所有 `/api/ranking/xxx` 路径不变。
4. **组件删除**：删除旧组件前确认没有其它页面引用。
5. **类型导出**：保留现有类型导出，避免其它模块 import 路径失效；可逐步迁移到泛型类型。

## 9. 未来扩展指南

### 新增一个基于成就标准的排行榜

只需三步：

1. **后端**：在 achievement-ranking 配置中添加一行：

   ```ts
   { key: 'xxx', cacheKey: CacheKeys.topXxx, criteria: 12345, field: 'xxx_count' }
   ```

2. **前端类型**（可选）：

   ```ts
   export type XxxRankPlayer = CountedRankPlayer<'xxx_count'>;
   ```

3. **前端配置**：在 `rankingConfig` 中添加：

   ```ts
   {
     key: 'xxx',
     label: 'XXX排行',
     category: 'combat',
     endpoint: Endpoints.ranking.xxx,
     useQuery: useXxxRanking, // 由 createRankingQuery 工厂生成
     component: (props) => <CountRankingTable {...props} accessorKey="xxx_count" header="XXX次数" />,
   }
   ```

无需新增 repository、service、table 组件或 hook 文件。

### 新增一个特殊排行榜

如果 SQL 或 UI 无法复用通用逻辑，则按现有模式新增：

1. 后端新增 repository + service + route + cache key。
2. 前端新增类型、hook、表格组件（可基于 `BaseRankingTable`）。
3. 在 `rankingConfig` 中注册。

## 10. 预期收益

- 后端 achievement-progress 类排行榜代码从 8 组重复方法收敛到 1 个通用方法，新增同类榜仅需 1 行配置。
- 前端简单表格组件从约 12 个收敛到 1 个 `CountRankingTable`。
- `RankingPage` 行数显著减少，逻辑由配置驱动。
- 新增排行榜的开发成本从“改 10+ 个文件”降低到“改 1-2 个配置文件”。

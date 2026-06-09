# SCF 数据库连接弹性方案 / Database Connection Resilience for Tencent Cloud SCF

## 问题背景

部署在腾讯云 SCF（Serverless Cloud Function）上的服务，在 MySQL/Redis 暂时不可用时出现以下问题：

1. **页面无法打开**：返回 `{"errorMessage":"context deadline exceeded","statusCode":446}`
2. **DB 恢复后仍返回 503**：即使 MySQL/Redis 已恢复，API 仍返回 503 Service Unavailable
3. **无日志**：SCF 日志中看不到任何请求记录

## 根因分析

### 问题 1：页面无法打开（446 超时）

**根因：`app.listen()` 未绑定 `0.0.0.0`**

```typescript
// 错误：只监听 localhost
app.listen(PORT, () => { ... });

// 正确：监听所有网络接口（容器外部可访问）
app.listen(PORT, '0.0.0.0', () => { ... });
```

在 Docker/SCF 容器环境中，Node.js 默认只监听 `127.0.0.1`。SCF 平台从容器外部访问应用时无法连接，导致请求超时。

### 问题 2：DB 恢复后仍返回 503

**根因：自定义超时配置过短 + 无定时重连机制**

与 acore-manager 项目对比发现以下关键差异：

| 配置项 | acore-manager (正常) | acore-ranking (503) | 影响 |
|--------|---------------------|---------------------|------|
| `connectTimeout` | 未设置 (默认 ~10s) | `5000` (5s) | **高**: SCF 冷启动网络延迟可能超过 5s |
| `acquireTimeout` | 未设置 (默认) | `5000` (5s) | **高**: 连接池获取超时 |
| `charset` | 未设置 (驱动默认) | `'utf8mb4'` | **中**: 可能与云 MySQL 配置冲突 |
| `MAX_RETRIES` | 10 | 5 | **高**: 重试窗口太短 |
| `RETRY_DELAY_MS` | 3000 | 2000 | **中**: 间隔太短 |
| 总重试窗口 | ~27 秒 | ~8 秒 | **高**: SCF 网络抖动恢复需要更长时间 |

**为什么 DB 恢复后仍然 503？**

SCF 实例在 DB 不可用时创建，`initializeDataSourcesWithRetry()` 用完所有重试后失败。DB 恢复后，同一实例不会自动重新连接，因为没有定时重连机制。

## 重构方案

### 1. 恢复默认数据库配置

移除自定义超时和 charset，使用驱动器默认值：

```typescript
const commonConfig = {
  type: 'mysql' as const,
  host: dbConn.host,
  port: dbConn.port,
  username: dbConn.user,
  password: dbConn.pass,
  synchronize: false,
  logging: env.NODE_ENV === 'development',
};
```

恢复重试策略为 10 次 × 3 秒间隔，与 acore-manager 保持一致。

### 2. 添加定时重连机制

初始化失败后，启动后台定时器每 30 秒重试一次：

```typescript
const PERIODIC_RETRY_MS = 30000;
let periodicRetryTimer: NodeJS.Timeout | null = null;

export function startPeriodicRetry(): void {
  if (periodicRetryTimer) return;
  periodicRetryTimer = setInterval(() => {
    if (!dataSourcesInitialized) {
      tryInitializeOnce();
    }
  }, PERIODIC_RETRY_MS);
}
```

连接成功后自动清除定时器。

### 3. DB Readiness Gate 触发重试

API 请求到达时，如果 DB 未就绪，触发一次后台重试：

```typescript
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || areDataSourcesReady()) {
    next();
    return;
  }
  // 触发一次后台重试，不阻塞当前请求
  initializeDataSourcesWithRetry().catch(() => {
    startPeriodicRetry();
  });
  res.status(503).json({
    success: false,
    error: 'Database not available, please retry later',
  });
});
```

### 4. Redis 恢复默认配置

移除 `connectTimeout` 和 `commandTimeout`，使用 ioredis 默认值。

### 5. 端口绑定修复

```typescript
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server listening on port ${PORT}`);
});
```

## SCF 部署最佳实践

### 网络连接

1. **不要设置过短的连接超时**：SCF 冷启动时，VPC 内网路由、安全组检查等会增加网络延迟。使用驱动器默认值（通常 10-30 秒）更可靠。
2. **使用 `0.0.0.0` 绑定**：容器部署必须监听所有网络接口。
3. **避免自定义 charset**：除非确有必要，否则使用数据库服务器默认字符集。

### 容错设计

1. **后台初始化**：数据库连接应在 `app.listen()` 之后异步进行，不阻塞服务启动。
2. **定时重连**：初始化失败后，应持续尝试重连，而不是一次性放弃。
3. **请求触发重试**：每次 API 请求时检查 DB 状态，未就绪时触发后台重试。
4. **静态资源不依赖 DB**：`express.static` 应在 API 路由之前，确保页面能正常加载。

### 日志与监控

1. **health 端点**：返回 `dbReady` 状态，便于排查。
2. **分级日志**：`info` 记录成功，`warn` 记录重试，`error` 记录最终失败。
3. **SCF 日志级别**：确保 SCF 日志配置能捕获 `warn` 和 `info` 级别日志。

## 验证清单

- [ ] `app.listen(PORT, '0.0.0.0')` 绑定所有接口
- [ ] 数据库配置使用默认值，不设置自定义超时
- [ ] 重试策略：10 次 × 3 秒间隔
- [ ] 定时重连：每 30 秒一次
- [ ] DB readiness gate 触发后台重试
- [ ] Redis 使用默认超时
- [ ] 静态资源在 API 路由之前
- [ ] health 端点返回 dbReady 状态
- [ ] TypeScript 编译通过
- [ ] 所有单元测试通过
- [ ] SCF 部署验证：DB 断开时页面正常加载
- [ ] SCF 部署验证：DB 恢复后数据正常显示

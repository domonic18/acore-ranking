#!/usr/bin/env node
/**
 * 把已推送到 TCR 的镜像更新到腾讯云 SCF 容器镜像函数(只换镜像,其余配置原样保留)。
 *
 * 为什么不用 Serverless Framework:`serverless deploy` 按 serverless.yml 全量重建函数配置
 * (环境变量/端口/超时/网络…),而线上函数的这些值是人工在控制台调过的(如 RECENT_ACHIEVEMENT_LIMIT、
 * WIDGET_DETAIL_URL),全量覆盖容易把人工配置打回默认值。这里只调 UpdateFunctionCode 换
 * Code.ImageConfig.ImageUri,其余字段一律不传。
 *
 * 环境变量:
 *   TENCENT_SECRET_ID / TENCENT_SECRET_KEY  腾讯云 API 密钥
 *   SCF_REGION          地域(默认 ap-beijing)
 *   SCF_NAMESPACE       函数所在命名空间(staging / production)
 *   SCF_FUNCTION_NAME   函数名
 *   SCF_IMAGE_URI       新镜像 {registry}/{namespace}/{image}:{tag}@{digest}
 *   SCF_IMAGE_PORT      镜像端口(默认 9000,须与 docker/Dockerfile 的 EXPOSE 一致)
 */

import tencentcloud from "tencentcloud-sdk-nodejs-scf";

const { Client } = tencentcloud.scf.v20180416;

// self-hosted runner 的 node 未锁版本(actions/setup-node 在国内拉不动),这里兜一道
const nodeMajor = Number(process.versions.node.split(".")[0]);
if (!Number.isInteger(nodeMajor) || nodeMajor < 18) {
  console.error(`[scf-deploy] 需要 Node.js ≥ 18,当前 ${process.versions.node}`);
  process.exit(1);
}

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`[scf-deploy] 缺少环境变量 ${name}`);
    process.exit(1);
  }
  return value;
}

const secretId = required("TENCENT_SECRET_ID");
const secretKey = required("TENCENT_SECRET_KEY");
const imageUri = required("SCF_IMAGE_URI");
const region = process.env.SCF_REGION ?? "ap-beijing";
const namespace = process.env.SCF_NAMESPACE ?? "staging";
const functionName = process.env.SCF_FUNCTION_NAME ?? "acore-ranking";
const imagePort = Number(process.env.SCF_IMAGE_PORT ?? 9000);

if (!Number.isInteger(imagePort) || imagePort <= 0) {
  console.error(`[scf-deploy] SCF_IMAGE_PORT 非法: ${process.env.SCF_IMAGE_PORT}`);
  process.exit(1);
}
if (!/@sha256:[0-9a-f]{64}$/.test(imageUri)) {
  console.error(`[scf-deploy] SCF_IMAGE_URI 必须是 {registry}/{ns}/{image}:{tag}@sha256:{digest} 形式: ${imageUri}`);
  process.exit(1);
}

const client = new Client({
  credential: { secretId, secretKey },
  region,
  profile: { httpProfile: { endpoint: "scf.tencentcloudapi.com" } },
});

/** 取镜像摘要(SCF 回填的 URI 可能与传入的 tag 写法略有差异,只比摘要) */
function digestOf(uri) {
  const m = /@?(sha256:[0-9a-f]{64})$/.exec(uri ?? "");
  return m ? m[1] : uri;
}

async function main() {
  console.log(`[scf-deploy] 目标函数 ${namespace}/${functionName} (${region})`);
  console.log(`[scf-deploy] 新镜像 ${imageUri}`);

  await client.UpdateFunctionCode({
    FunctionName: functionName,
    Namespace: namespace,
    Code: {
      ImageConfig: {
        ImageType: "personal",
        ImageUri: imageUri,
        ImagePort: imagePort,
      },
    },
  });
  console.log("[scf-deploy] 镜像更新请求已提交,等待函数就绪…");

  const deadline = Date.now() + 5 * 60_000;
  for (;;) {
    await new Promise((r) => setTimeout(r, 5000));
    const res = await client.GetFunction({ FunctionName: functionName, Namespace: namespace });
    const status = res.Status;
    const current = res.ImageConfig?.ImageUri ?? "";
    console.log(`[scf-deploy] 状态=${status} 镜像=${current}`);

    if (status === "UpdateFailed") {
      console.error(`[scf-deploy] 部署失败: ${res.StatusDesc || "无错误描述"}`);
      process.exit(1);
    }
    if (status === "Active" && digestOf(current) === digestOf(imageUri)) {
      console.log("[scf-deploy] 部署成功");
      return;
    }
    if (Date.now() > deadline) {
      console.error(`[scf-deploy] 等待超时(5 分钟),当前状态=${status}`);
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(`[scf-deploy] 调用失败: ${err?.message ?? err}`);
  process.exit(1);
});

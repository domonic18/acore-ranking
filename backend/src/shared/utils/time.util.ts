export function formatTotalTime(seconds: number): string {
  let total = Math.floor(seconds / 60);
  const min = total % 60;
  total = Math.floor(total / 60);
  const hours = total % 24;
  const days = Math.floor(total / 24);
  return `${days} 天 ${hours} 小时 ${min} 分钟`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString();
}

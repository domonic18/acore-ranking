import { useOnlineCount } from '@/features/online/api/queries';

export function OnlineWidget() {
  const { data: count, isLoading, error } = useOnlineCount();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-xs text-gray-400">
        加载中...
      </div>
    );
  }

  if (error || !count) {
    return (
      <div className="flex items-center justify-center p-4 text-xs text-red-400">
        加载失败
      </div>
    );
  }

  const total = count.total_count || 1;
  const alliancePct = total > 0 ? (count.alliance_count / total) * 100 : 0;
  const hordePct = total > 0 ? (count.horde_count / total) * 100 : 0;

  return (
    <div className="w-full p-3 text-xs" style={{ fontSize: 12, minWidth: 240 }}>
      {/* 标题行 */}
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-base font-bold" style={{ color: '#F1B132' }}>
          阿拉希
        </span>
        <a
          href="http://lokta.cn/?page_id=135"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:underline"
        >
          设置详情
        </a>
        <span className="text-green-500">● 运行中</span>
      </div>

      {/* 联盟 */}
      <div className="mb-1 flex items-center gap-1">
        <span className="inline-block w-12 text-left text-white">联盟：</span>
        <span className="inline-block w-8 text-right text-white">{count.alliance_count}</span>
        <div
          className="inline-block overflow-hidden rounded-full"
          style={{ width: 120, height: 8, backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${alliancePct}%`,
              backgroundColor: '#69a2ff',
            }}
          />
        </div>
      </div>

      {/* 部落 */}
      <div className="mb-1.5 flex items-center gap-1">
        <span className="inline-block w-12 text-left text-white">部落：</span>
        <span className="inline-block w-8 text-right text-white">{count.horde_count}</span>
        <div
          className="inline-block overflow-hidden rounded-full"
          style={{ width: 120, height: 8, backgroundColor: 'rgba(0,0,0,0.2)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${hordePct}%`,
              backgroundColor: '#ff6961',
            }}
          />
        </div>
      </div>

      {/* 总数 */}
      <div className="mt-2">
        <span className="text-white">
          共计{' '}
          <a
            href="http://lokta.cn/?page_id=1897"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-white hover:underline"
          >
            {count.total_count}
          </a>{' '}
          人在线
        </span>
      </div>
    </div>
  );
}

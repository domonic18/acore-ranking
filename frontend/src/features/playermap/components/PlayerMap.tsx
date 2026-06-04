import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePlayerMapData, usePlayerMapStatus } from '../api/queries';
import type { MapPlayer, MapSection } from '../types';

const MAP_WIDTH = 966;
const MAP_HEIGHT = 732;
const MAP_HALF_WIDTH = 483;

const MAP_BG: Record<string, string> = {
  azeroth: '/assets/maps/azeroth.jpg',
  outland: '/assets/maps/outland.jpg',
  northrend: '/assets/maps/northrend.jpg',
};

const MAP_NAMES: Record<string, string> = {
  azeroth: '艾泽拉斯',
  outland: '外域',
  northrend: '诺森德',
};

const RACE_MAP: Record<number, string> = {
  1: 'human', 2: 'orc', 3: 'dwarf', 4: 'nightelf',
  5: 'undead', 6: 'tauren', 7: 'gnome', 8: 'troll',
  9: 'goblin', 10: 'bloodelf', 11: 'draenei',
};

const CLASS_MAP: Record<number, string> = {
  1: '战士', 2: '圣骑士', 3: '猎人', 4: '潜行者',
  5: '牧师', 6: '死亡骑士', 7: '萨满', 8: '法师',
  9: '术士', 11: '德鲁伊',
};

function getRaceIcon(race: number, gender: number): string {
  const raceName = RACE_MAP[race];
  if (!raceName) return '';
  const genderStr = gender === 1 ? 'female' : 'male';
  return `/assets/icons/race/Ui-charactercreate-races_${raceName}-${genderStr}.png`;
}

function getClassIcon(classId: number): string {
  return `/assets/icons/class/hd${classId}.png`;
}

function formatTime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${String(hours).padStart(2, '0')}时`);
  parts.push(`${String(mins).padStart(2, '0')}分`);
  parts.push(`${String(secs).padStart(2, '0')}秒`);
  return parts.join('');
}

function PlayerTooltip({ player, x, y, visible, onClose }: {
  player: MapPlayer | null;
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
}) {
  if (!visible || !player) return null;

  const isGroup = player.groupSize > 1;
  const tooltipWidth = isGroup ? 260 : 200;
  let left = x + 15;
  let top = y - 10;

  if (left + tooltipWidth > window.innerWidth) {
    left = x - tooltipWidth - 15;
  }
  if (top < 0) top = y + 20;

  // 分组 tooltip：显示成员列表
  if (isGroup && player.members) {
    return (
      <div
        className="fixed z-50 rounded border border-gray-700 bg-black/95 px-3 py-2 text-xs text-white shadow-lg"
        style={{ left, top, width: tooltipWidth, maxHeight: 320, overflowY: 'auto' }}
        onMouseLeave={onClose}
      >
        <div className="mb-2 border-b border-gray-700 pb-1 text-amber-400">
          {player.zone} · {player.groupSize}人
        </div>
        <div className="flex flex-col gap-1.5">
          {player.members.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <img src={getRaceIcon(m.race, m.gender)} alt="" className="h-4 w-4" />
              <img src={getClassIcon(m.class)} alt="" className="h-4 w-4" />
              <Link
                to={`/character/${encodeURIComponent(m.name)}`}
                className={`truncate hover:underline ${m.faction === 'horde' ? 'text-red-400' : 'text-blue-400'}`}
                onClick={onClose}
              >
                {m.name}
              </Link>
              <span className="text-gray-500">{m.level}级</span>
              {m.isHardcore && <span className="text-[10px] text-yellow-400">💀</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed z-50 rounded border border-gray-700 bg-black/90 px-3 py-2 text-xs text-white shadow-lg"
      style={{ left, top, width: tooltipWidth }}
      onMouseLeave={onClose}
    >
      <div className="mb-1 flex items-center gap-2">
        <img src={getRaceIcon(player.race, player.gender)} alt="" className="h-5 w-5" />
        <img src={getClassIcon(player.class)} alt="" className="h-5 w-5" />
        <Link
          to={`/character/${encodeURIComponent(player.name)}`}
          className={`font-bold hover:underline ${player.faction === 'horde' ? 'text-red-400' : 'text-blue-400'}`}
          onClick={onClose}
        >
          {player.name}
        </Link>
        {player.isHardcore && (
          <span className="text-[10px] text-yellow-400" title="硬核挑战">💀</span>
        )}
      </div>
      <div className="text-gray-400">
        {player.level}级 · {CLASS_MAP[player.class]} · {player.zone}
      </div>
    </div>
  );
}

function BottomSheet({ open, onClose, children }: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-xl bg-gray-900 p-4 text-white">
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-gray-600" />
        {children}
      </div>
    </>
  );
}

export function PlayerMap() {
  const [activeMap, setActiveMap] = useState<'azeroth' | 'outland' | 'northrend'>('azeroth');
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ player: MapPlayer; x: number; y: number } | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<MapPlayer | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startPosX: 0, startPosY: 0 });

  const { data: mapData } = usePlayerMapData();
  const { data: statusData } = usePlayerMapStatus();

  const totalAlliance = (mapData?.azeroth?.alliance || 0) + (mapData?.outland?.alliance || 0) + (mapData?.northrend?.alliance || 0);
  const totalHorde = (mapData?.azeroth?.horde || 0) + (mapData?.outland?.horde || 0) + (mapData?.northrend?.horde || 0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const containerWidth = containerRef.current?.clientWidth || MAP_WIDTH;
      setScale(Math.min(0.4, containerWidth / MAP_WIDTH));
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isMobile]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current.isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPosition({
      x: dragRef.current.startPosX + dx,
      y: dragRef.current.startPosY + dy,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    dragRef.current.isDragging = false;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragRef.current = {
        isDragging: true,
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        startPosX: position.x,
        startPosY: position.y,
      };
    }
  }, [position]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && dragRef.current.isDragging) {
      const dx = e.touches[0].clientX - dragRef.current.startX;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.startPosX + dx,
        y: dragRef.current.startPosY + dy,
      });
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    dragRef.current.isDragging = false;
  }, []);

  const currentSection: MapSection | undefined = mapData?.[activeMap];

  const handlePlayerClick = (player: MapPlayer, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setSelectedPlayer(player);
    }
  };

  const handlePlayerHover = (player: MapPlayer, e: React.MouseEvent) => {
    if (!isMobile) {
      setTooltip({ player, x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div className="fixed inset-0 bg-black">
      {/* 地图拖拽容器 */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        style={{ cursor: dragRef.current.isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setTooltip(null); }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 地图内容 - 水平居中 + 拖拽偏移 */}
        <div
          className="absolute"
          style={{
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            left: '50%',
            marginLeft: -MAP_HALF_WIDTH,
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* 地图背景 */}
          <img
            src={MAP_BG[activeMap]}
            alt={MAP_NAMES[activeMap]}
            className="absolute left-0 top-0"
            style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
            draggable={false}
          />

          {/* 玩家点位层 */}
          {currentSection?.players.map((player, index) => (
            <PlayerMarker
              key={`${player.name}-${index}`}
              player={player}
              onClick={(e) => handlePlayerClick(player, e)}
              onMouseEnter={(e) => handlePlayerHover(player, e)}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </div>
      </div>

      {/* PC端顶部居中状态面板 */}
      {!isMobile && (
        <div className="pointer-events-none absolute left-1/2 top-6 z-20 -translate-x-1/2 text-center">
          <div className="pointer-events-auto inline-flex items-center gap-4 rounded-full bg-gray-900/80 px-5 py-2 text-xs text-white shadow-lg backdrop-blur">
            <span className="flex items-center gap-1.5">
              <img
                src={statusData?.online ? '/assets/playermap/realm_on.gif' : '/assets/playermap/realm_off.gif'}
                alt=""
                className="h-4 w-4"
              />
              <span className={statusData?.online ? 'text-green-400' : 'text-red-400'}>
                {statusData?.online ? '在线' : '离线'}
              </span>
            </span>
            {statusData?.online && (
              <span className="text-gray-400">{formatTime(statusData.uptime)}</span>
            )}
            <span className="flex items-center gap-1 text-blue-400">
              <img src="/assets/playermap/allianceicon.gif" alt="" className="h-3 w-3" />
              {totalAlliance}
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <img src="/assets/playermap/hordeicon.gif" alt="" className="h-3 w-3" />
              {totalHorde}
            </span>
            {statusData?.online && (
              <span className="text-gray-500">最高: {statusData.maxPlayers}</span>
            )}
          </div>
        </div>
      )}

      {/* PC端底部居中地图切换 */}
      {!isMobile && (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <div className="pointer-events-auto inline-flex gap-1 rounded-full bg-gray-900/80 p-1 shadow-lg backdrop-blur">
            {(['azeroth', 'outland', 'northrend'] as const).map((map) => {
              const count = (mapData?.[map]?.alliance || 0) + (mapData?.[map]?.horde || 0);
              return (
                <button
                  key={map}
                  onClick={() => setActiveMap(map)}
                  className={`rounded-full px-4 py-1.5 text-xs transition-colors ${
                    activeMap === map
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {MAP_NAMES[map]} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 移动端底部操作栏 */}
      {isMobile && (
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-gray-800/80 bg-gray-900/90 px-4 py-2 backdrop-blur">
          <div className="mb-2 flex items-center justify-between text-xs text-white">
            <span className="text-blue-400">联盟: {currentSection?.alliance || 0}</span>
            <span className="text-gray-400">
              {statusData?.online ? `运行 ${formatTime(statusData.uptime)}` : '离线'}
            </span>
            <span className="text-red-400">部落: {currentSection?.horde || 0}</span>
          </div>
          <div className="flex gap-2">
            {(['azeroth', 'outland', 'northrend'] as const).map((map) => (
              <button
                key={map}
                onClick={() => setActiveMap(map)}
                className={`flex-1 rounded py-1.5 text-xs ${
                  activeMap === map
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-gray-800/80 text-gray-400'
                }`}
              >
                {MAP_NAMES[map]}
              </button>
            ))}
          </div>
          <div className="mt-2 flex justify-center gap-4">
            <button
              onClick={() => setScale(s => Math.min(s * 1.2, 2))}
              className="rounded bg-gray-800/80 px-3 py-1 text-xs text-white"
            >
              +
            </button>
            <button
              onClick={() => { setScale(0.4); setPosition({ x: 0, y: 0 }); }}
              className="rounded bg-gray-800/80 px-3 py-1 text-xs text-white"
            >
              重置
            </button>
            <button
              onClick={() => setScale(s => Math.max(s / 1.2, 0.3))}
              className="rounded bg-gray-800/80 px-3 py-1 text-xs text-white"
            >
              -
            </button>
          </div>
        </div>
      )}

      {/* PC Tooltip */}
      <PlayerTooltip
        player={tooltip?.player || null}
        x={tooltip?.x || 0}
        y={tooltip?.y || 0}
        visible={!!tooltip && !isMobile}
        onClose={() => setTooltip(null)}
      />

      {/* 移动端 Bottom Sheet */}
      <BottomSheet open={!!selectedPlayer} onClose={() => setSelectedPlayer(null)}>
        {selectedPlayer && (
          <div>
            <div className="mb-3 flex items-center gap-3">
              <img
                src={getRaceIcon(selectedPlayer.race, selectedPlayer.gender)}
                alt=""
                className="h-10 w-10"
              />
              <img
                src={getClassIcon(selectedPlayer.class)}
                alt=""
                className="h-10 w-10"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/character/${encodeURIComponent(selectedPlayer.name)}`}
                    className={`text-lg font-bold ${selectedPlayer.faction === 'horde' ? 'text-red-400' : 'text-blue-400'}`}
                    onClick={() => setSelectedPlayer(null)}
                  >
                    {selectedPlayer.name}
                  </Link>
                  {selectedPlayer.isHardcore && (
                    <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
                      💀 硬核挑战
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-400">
                  {selectedPlayer.level}级 · {CLASS_MAP[selectedPlayer.class]} · {selectedPlayer.zone}
                </div>
              </div>
            </div>
            <Link
              to={`/character/${encodeURIComponent(selectedPlayer.name)}`}
              className="block rounded bg-amber-500/20 py-2 text-center text-amber-400"
              onClick={() => setSelectedPlayer(null)}
            >
              查看装备 / 天赋 / 成就 →
            </Link>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

function PlayerMarker({
  player,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: {
  player: MapPlayer;
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}) {
  const isInstance = player.x === 0 && player.y === 0;
  const isGroup = player.groupSize > 1 && !isInstance;

  // 副本图标
  if (isInstance) {
    return (
      <img
        src="/assets/playermap/inst-icon.gif"
        alt="副本"
        className="absolute h-4 w-4 cursor-pointer"
        style={{ left: player.x, top: player.y }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        draggable={false}
      />
    );
  }

  // 组队聚合点：与单玩家圆点风格一致，稍大并带人数角标
  if (isGroup) {
    const isHorde = player.faction === 'horde';
    const baseColor = isHorde ? 'bg-[#D2321E]' : 'bg-[#0096BE]';
    const glowColor = isHorde ? 'rgba(210,50,30,0.6)' : 'rgba(0,150,190,0.6)';
    const hardcoreBorder = player.isHardcore
      ? 'border border-yellow-400'
      : 'border border-white/40';
    const glow = player.isHardcore
      ? { boxShadow: `0 0 4px 1px rgba(255,215,0,0.7), 0 0 8px 2px ${glowColor}` }
      : { boxShadow: `0 0 3px 1px ${glowColor}` };

    return (
      <div
        className="absolute cursor-pointer"
        style={{ left: player.x - 5, top: player.y - 5 }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={`h-2.5 w-2.5 rounded-full ${baseColor} ${hardcoreBorder}`}
          style={glow}
          title={player.isHardcore ? '💀 硬核挑战' : undefined}
        />
        <span className="absolute -right-1.5 -top-1.5 flex h-3 min-w-3 items-center justify-center rounded-full bg-black/80 px-0.5 text-[8px] font-bold text-white">
          {player.groupSize}
        </span>
      </div>
    );
  }

  // 单个玩家 - 缩小圆点并改进样式
  const isHorde = player.faction === 'horde';
  const baseColor = isHorde ? 'bg-[#D2321E]' : 'bg-[#0096BE]';
  const glowColor = isHorde ? 'rgba(210,50,30,0.6)' : 'rgba(0,150,190,0.6)';
  const hardcoreBorder = player.isHardcore
    ? 'border border-yellow-400'
    : 'border border-white/40';
  const glow = player.isHardcore
    ? { boxShadow: `0 0 4px 1px rgba(255,215,0,0.7), 0 0 8px 2px ${glowColor}` }
    : { boxShadow: `0 0 3px 1px ${glowColor}` };

  return (
    <div
      className={`absolute h-2 w-2 cursor-pointer rounded-full ${baseColor} ${hardcoreBorder}`}
      style={{ left: player.x - 4, top: player.y - 4, ...glow }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={player.isHardcore ? '💀 硬核挑战' : undefined}
    />
  );
}

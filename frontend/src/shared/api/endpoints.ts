export const Endpoints = {
  config: {
    widget: '/api/config/widget',
  },
  online: {
    count: '/api/online/count',
    players: '/api/online/players',
  },
  ranking: {
    gold: '/api/ranking/gold',
    playtime: '/api/ranking/playtime',
    mount: '/api/ranking/mount',
    honor: '/api/ranking/honor',
    kills: '/api/ranking/kills',
    deaths: '/api/ranking/deaths',
    reputation: '/api/ranking/reputation',
    quest: '/api/ranking/quest',
    legendary: '/api/ranking/legendary',
    todayKills: '/api/ranking/today-kills',
    yesterdayKills: '/api/ranking/yesterday-kills',
    achievement: '/api/ranking/achievement',
  },
  hardcore: {
    completed: (level: number) => `/api/hardcore/completed/${level}`,
    fail: '/api/hardcore/fail',
    incomplete: '/api/hardcore/incomplete',
  },
  achievement: {
    recent: '/api/achievement/recent',
  },
  banlist: {
    recent: '/api/banlist/recent',
  },
  character: {
    info: (name: string) => `/api/character/${encodeURIComponent(name)}`,
    items: (name: string) => `/api/character/${encodeURIComponent(name)}/items`,
    talents: (name: string) => `/api/character/${encodeURIComponent(name)}/talents`,
    achievements: (name: string) => `/api/character/${encodeURIComponent(name)}/achievements`,
  },
  playermap: {
    players: '/api/playermap/players',
    status: '/api/playermap/status',
  },
  encounter: {
    recent: '/api/encounter/recent',
    bosses: '/api/encounter/bosses',
  },
  auction: {
    list: '/api/auction',
  },
} as const;

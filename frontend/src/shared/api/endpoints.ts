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
  },
} as const;

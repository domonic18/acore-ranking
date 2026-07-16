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
    monsterKills: '/api/ranking/monster-kills',
    critterKills: '/api/ranking/critter-kills',
    flightPaths: '/api/ranking/flight-paths',
    healingPotions: '/api/ranking/healing-potions',
    reputation: '/api/ranking/reputation',
    quest: '/api/ranking/quest',
    legendary: '/api/ranking/legendary',
    todayKills: '/api/ranking/today-kills',
    achievement: '/api/ranking/achievement',
    dungeon5: '/api/ranking/dungeon-5',
    raid10: '/api/ranking/raid-10',
    raid25: '/api/ranking/raid-25',
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

export function formatDeathReason(
  deathReason: string | null | undefined,
  killerInfo: string | null | undefined,
): string | null {
  if (!deathReason || deathReason === 'death') {
    return null;
  }

  const reason = deathReason.toLowerCase();

  if (reason === 'resurrect') {
    return '被复活';
  }

  if (reason === 'environmental') {
    return '非正常死亡';
  }

  if (killerInfo) {
    if (reason === 'player') {
      const match = killerInfo.match(/^player:([^:]+):level(\d+):class\d+$/);
      if (match) {
        const [, name, level] = match;
        return `被玩家 ${name} (等级 ${level}) 击杀`;
      }
    }

    if (reason === 'creature') {
      const match = killerInfo.match(/^creature:\d+:([^:]+):level(\d+)$/);
      if (match) {
        const [, name, level] = match;
        return `被怪物 ${name} (等级 ${level}) 击杀`;
      }
    }
  }

  if (reason === 'player') {
    return '被玩家击杀';
  }

  if (reason === 'creature') {
    return '被怪物击杀';
  }

  return deathReason;
}

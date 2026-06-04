import * as fs from 'fs';

const php = fs.readFileSync('/Users/deadwalk/Code/acore-playermap/srv/zone_names_chinese.php', 'utf8');
const lines = php.split('\n');
const entries: string[] = [];

for (const line of lines) {
  const m = line.match(/(\d+)\s*=>\s*'((?:[^'\\]|\\.)*)'/);
  if (m) {
    const name = m[2].replace(/\\'/g, "'").replace(/"/g, '\\"');
    entries.push(`  ${m[1]}: "${name}"`);
  }
}

const ts = `export const ZONE_NAMES: Record<number, string> = {
${entries.join(',\n')},
};

export function getZoneName(zoneId: number | string | null | undefined): string {
  if (zoneId == null) return '未知区域';
  const id = typeof zoneId === 'string' ? parseInt(zoneId, 10) : zoneId;
  return ZONE_NAMES[id] || String(zoneId);
}
`;

fs.writeFileSync('/Users/deadwalk/Code/acore-ranking/backend/src/data/zoneNames.ts', ts);
console.log('Written', entries.length, 'zone names');

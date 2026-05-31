import * as fs from 'fs';
import * as path from 'path';

const dataDir = path.join(__dirname, '../data/dbc');
const outDir = path.join(__dirname, '../backend/src/generated');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function parseCsv(content: string): string[][] {
  const lines = content.trim().split('\n');
  const result: string[][] = [];
  for (const line of lines) {
    const cols: string[] = [];
    let col = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      const next = line[i + 1];
      if (ch === '"' && inQuote && next === '"') {
        col += '"';
        i++;
        continue;
      }
      if (ch === '"') {
        inQuote = !inQuote;
        continue;
      }
      if (ch === ',' && !inQuote) {
        cols.push(col);
        col = '';
        continue;
      }
      col += ch;
    }
    cols.push(col);
    result.push(cols);
  }
  return result;
}

function generateItemDisplayInfo() {
  const content = fs.readFileSync(path.join(dataDir, 'ItemDisplayInfo_3.3.5_12340.csv'), 'utf-8');
  const rows = parseCsv(content);
  const headers = rows[0];
  const iconIdx = headers.findIndex(h => h === 'InventoryIcon[0]');
  const idIdx = headers.findIndex(h => h === 'ID');

  const map: Record<number, string> = {};
  for (let i = 1; i < rows.length; i++) {
    const id = parseInt(rows[i][idIdx], 10);
    const icon = rows[i][iconIdx]?.trim();
    if (id && icon) {
      map[id] = icon;
    }
  }

  fs.writeFileSync(
    path.join(outDir, 'itemDisplayInfo.ts'),
    `export const ITEM_DISPLAY_INFO: Record<number, string> = ${JSON.stringify(map, null, 2)};\n`,
  );
  console.log(`Generated itemDisplayInfo.ts with ${Object.keys(map).length} entries`);
}

function generateSpellIcon() {
  const content = fs.readFileSync(path.join(dataDir, 'SpellIcon_3.3.5_12340.csv'), 'utf-8');
  const rows = parseCsv(content);
  const headers = rows[0];
  const idIdx = headers.findIndex(h => h === 'ID');
  const textureIdx = headers.findIndex(h => h === 'TextureFilename');

  const map: Record<number, string> = {};
  for (let i = 1; i < rows.length; i++) {
    const id = parseInt(rows[i][idIdx], 10);
    const texture = rows[i][textureIdx]?.trim();
    if (id && texture) {
      map[id] = texture.toLowerCase()
        .replace('interface\\icons\\', '')
        .replace('interface\\spellbook\\', '')
        .replace(/\.$/, '');
    }
  }

  fs.writeFileSync(
    path.join(outDir, 'spellIcon.ts'),
    `export const SPELL_ICON: Record<number, string> = ${JSON.stringify(map, null, 2)};\n`,
  );
  console.log(`Generated spellIcon.ts with ${Object.keys(map).length} entries`);
}

function generateTalents() {
  const tabContent = fs.readFileSync(path.join(dataDir, 'TalentTab_3.3.5_12340.csv'), 'utf-8');
  const tabRows = parseCsv(tabContent);
  const tabHeaders = tabRows[0];
  const tabIdIdx = tabHeaders.findIndex(h => h === 'ID');
  const tabNameIdx = tabHeaders.findIndex(h => h === 'Name_lang[0]');
  const tabIconIdx = tabHeaders.findIndex(h => h === 'SpellIconID');
  const tabClassMaskIdx = tabHeaders.findIndex(h => h === 'ClassMask');

  const talentContent = fs.readFileSync(path.join(dataDir, 'Talent_3.3.5_12340.csv'), 'utf-8');
  const talentRows = parseCsv(talentContent);
  const tHeaders = talentRows[0];
  const tIdIdx = tHeaders.findIndex(h => h === 'ID');
  const tTabIdIdx = tHeaders.findIndex(h => h === 'TabID');
  const tTierIdx = tHeaders.findIndex(h => h === 'TierID');
  const tColIdx = tHeaders.findIndex(h => h === 'ColumnIndex');
  const tRank0Idx = tHeaders.findIndex(h => h === 'SpellRank[0]');
  const tRank1Idx = tHeaders.findIndex(h => h === 'SpellRank[1]');
  const tRank2Idx = tHeaders.findIndex(h => h === 'SpellRank[2]');
  const tRank3Idx = tHeaders.findIndex(h => h === 'SpellRank[3]');
  const tRank4Idx = tHeaders.findIndex(h => h === 'SpellRank[4]');
  const tPreReqIdx = tHeaders.findIndex(h => h === 'PrereqTalent[0]');

  const tabs: any[] = [];
  for (let i = 1; i < tabRows.length; i++) {
    const classMask = parseInt(tabRows[i][tabClassMaskIdx], 10);
    if (!classMask) continue;
    tabs.push({
      id: parseInt(tabRows[i][tabIdIdx], 10),
      name: tabRows[i][tabNameIdx],
      iconId: parseInt(tabRows[i][tabIconIdx], 10),
      classMask,
    });
  }

  const talents: any[] = [];
  for (let i = 1; i < talentRows.length; i++) {
    talents.push({
      id: parseInt(talentRows[i][tIdIdx], 10),
      tabId: parseInt(talentRows[i][tTabIdIdx], 10),
      tierId: parseInt(talentRows[i][tTierIdx], 10),
      columnIndex: parseInt(talentRows[i][tColIdx], 10),
      spellRank0: parseInt(talentRows[i][tRank0Idx], 10) || 0,
      spellRank1: parseInt(talentRows[i][tRank1Idx], 10) || 0,
      spellRank2: parseInt(talentRows[i][tRank2Idx], 10) || 0,
      spellRank3: parseInt(talentRows[i][tRank3Idx], 10) || 0,
      spellRank4: parseInt(talentRows[i][tRank4Idx], 10) || 0,
      prereqTalent0: parseInt(talentRows[i][tPreReqIdx], 10) || 0,
    });
  }

  fs.writeFileSync(
    path.join(outDir, 'talents.ts'),
    `export const TALENT_TABS = ${JSON.stringify(tabs, null, 2)} as const;\nexport const TALENTS = ${JSON.stringify(talents, null, 2)} as const;\n`,
  );
  console.log(`Generated talents.ts with ${tabs.length} tabs and ${talents.length} talents`);
}

function generateAchievements() {
  const achContent = fs.readFileSync(path.join(dataDir, 'Achievement_3.3.5_12340.csv'), 'utf-8');
  const achRows = parseCsv(achContent);
  const aHeaders = achRows[0];
  const aIdIdx = aHeaders.findIndex(h => h === 'ID');
  const aFactionIdx = aHeaders.findIndex(h => h === 'Faction');
  const aTitleIdx = aHeaders.findIndex(h => h === 'Title_lang[0]');
  const aDescIdx = aHeaders.findIndex(h => h === 'Description_lang[0]');
  const aCatIdx = aHeaders.findIndex(h => h === 'Category');
  const aPointsIdx = aHeaders.findIndex(h => h === 'Points');
  const aIconIdx = aHeaders.findIndex(h => h === 'IconID');

  const achievements: any[] = [];
  for (let i = 1; i < achRows.length; i++) {
    achievements.push({
      id: parseInt(achRows[i][aIdIdx], 10),
      faction: parseInt(achRows[i][aFactionIdx], 10),
      title: achRows[i][aTitleIdx],
      description: achRows[i][aDescIdx],
      category: parseInt(achRows[i][aCatIdx], 10),
      points: parseInt(achRows[i][aPointsIdx], 10) || 0,
      iconId: parseInt(achRows[i][aIconIdx], 10),
    });
  }

  const catContent = fs.readFileSync(path.join(dataDir, 'AchievementCategory_3.3.5_12340.csv'), 'utf-8');
  const catRows = parseCsv(catContent);
  const cHeaders = catRows[0];
  const cIdIdx = cHeaders.findIndex(h => h === 'ID');
  const cParentIdx = cHeaders.findIndex(h => h === 'Parent');
  const cNameIdx = cHeaders.findIndex(h => h === 'Name_lang[0]');

  const categories: any[] = [];
  for (let i = 1; i < catRows.length; i++) {
    categories.push({
      id: parseInt(catRows[i][cIdIdx], 10),
      parent: parseInt(catRows[i][cParentIdx], 10),
      name: catRows[i][cNameIdx],
    });
  }

  fs.writeFileSync(
    path.join(outDir, 'achievements.ts'),
    `export const ACHIEVEMENTS = ${JSON.stringify(achievements, null, 2)} as const;\nexport const ACHIEVEMENT_CATEGORIES = ${JSON.stringify(categories, null, 2)} as const;\n`,
  );
  console.log(`Generated achievements.ts with ${achievements.length} achievements and ${categories.length} categories`);
}

generateItemDisplayInfo();
generateSpellIcon();
generateTalents();
generateAchievements();
console.log('Done!');

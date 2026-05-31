# Scripts / 构建脚本

This directory contains build-time scripts used to generate static data from external sources.

## generate-dbc-data.ts

Parses DBC CSV files (from `../data/dbc/`) and generates TypeScript constant files under `../backend/src/generated/`.

### What it generates

| Output File | Source CSV | Description |
|------------|-----------|-------------|
| `itemDisplayInfo.ts` | `ItemDisplayInfo_3.3.5_12340.csv` | Maps item display IDs to icon names |
| `spellIcon.ts` | `SpellIcon_3.3.5_12340.csv` | Maps spell icon IDs to texture file names |
| `talents.ts` | `TalentTab_3.3.5_12340.csv` + `Talent_3.3.5_12340.csv` | Talent trees and individual talents data |
| `achievements.ts` | `Achievement_3.3.5_12340.csv` + `AchievementCategory_3.3.5_12340.csv` | Achievement list and category hierarchy |

### How to run

```bash
cd backend && npm run generate-dbc
```

### When to regenerate

- After adding or updating DBC CSV files in `data/dbc/`
- When the generated data structures need to change

## extract-mounts.js

Extracts mount spell IDs from `data/spell.csv` and generates a compact TypeScript constant. Run via `npm run extract-mounts` from the backend directory.

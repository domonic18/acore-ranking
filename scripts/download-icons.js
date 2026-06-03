const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const ICON_BASE_URL = 'https://wow.zamimg.com/images/wow/icons/medium';
const OUTPUT_DIR = path.join(__dirname, '..', 'frontend', 'public', 'assets', 'icons', 'wow');
const ICON_LIST_FILE = '/tmp/icon_list.txt';
const CONCURRENCY = 20;
const MAX_RETRIES = 3;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read icon list
const icons = fs.readFileSync(ICON_LIST_FILE, 'utf8')
  .split('\n')
  .map(s => s.trim())
  .filter(Boolean);

console.log(`Total icons to download: ${icons.length}`);
console.log(`Output directory: ${OUTPUT_DIR}`);
console.log(`Concurrency: ${CONCURRENCY}`);
console.log('');

let downloaded = 0;
let skipped = 0;
let failed = 0;
let current = 0;

function downloadIcon(iconName, retryCount = 0) {
  return new Promise((resolve) => {
    const filePath = path.join(OUTPUT_DIR, `${iconName}.jpg`);

    // Skip if already exists and has content
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
      skipped++;
      resolve();
      return;
    }

    const url = `${ICON_BASE_URL}/${iconName}.jpg`;
    const cmd = `curl -sfL --max-time 15 \
      -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36" \
      -H "Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" \
      -H "Referer: https://www.wowhead.com/" \
      "${url}" -o "${filePath}"`;

    exec(cmd, { timeout: 20000 }, (error) => {
      if (error || !fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch {}
        }
        if (retryCount < MAX_RETRIES) {
          setTimeout(() => {
            downloadIcon(iconName, retryCount + 1).then(resolve);
          }, 300 * (retryCount + 1));
          return;
        }
        failed++;
        resolve();
        return;
      }

      downloaded++;
      resolve();
    });
  });
}

async function run() {
  const startTime = Date.now();
  const total = icons.length;

  // Process in batches
  for (let i = 0; i < total; i += CONCURRENCY) {
    const batch = icons.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(icon => downloadIcon(icon)));

    current = Math.min(i + CONCURRENCY, total);
    const progress = ((current / total) * 100).toFixed(1);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    process.stdout.write(`\rProgress: ${current}/${total} (${progress}%) | Downloaded: ${downloaded} | Skipped: ${skipped} | Failed: ${failed} | Time: ${elapsed}s`);
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n');
  console.log('========================================');
  console.log('Download complete!');
  console.log(`Total: ${total}`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Time: ${totalTime}s`);
  console.log('========================================');

  // Save failed list for retry
  if (failed > 0) {
    const failedIcons = icons.filter(icon => {
      const filePath = path.join(OUTPUT_DIR, `${icon}.jpg`);
      return !fs.existsSync(filePath) || fs.statSync(filePath).size === 0;
    });
    fs.writeFileSync(path.join(__dirname, 'failed-icons.txt'), failedIcons.join('\n'));
    console.log(`Failed icons saved to scripts/failed-icons.txt (${failedIcons.length} icons)`);
  }
}

run().catch(console.error);

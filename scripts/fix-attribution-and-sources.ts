/**
 * Post-wiring cleanup:
 *  1. Replace iNat usernames with real display names in plants.ts
 *  2. Add 'INATURALIST' to imageSources for plants that have iNat images
 *
 * Usage: node --import tsx scripts/fix-attribution-and-sources.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const candidates: Array<{
  plantId: string;
  slot: string;
  assetKey: string;
  photographer: string;
  attribution: string;
  downloaded: boolean;
  skipped?: string;
}> = JSON.parse(fs.readFileSync(path.join(__dirname, 'inaturalist-candidates.json'), 'utf8'));

// Extract real display name from attribution string: "(c) Real Name, some rights reserved (CC BY)"
function realName(attribution: string): string | null {
  const match = attribution.match(/^\(c\)\s+(.+?),\s+some rights reserved/i);
  if (!match) return null;
  const name = match[1].trim();
  // Reject Google account numbers and obvious non-names
  if (/^\d{10,}$/.test(name)) return null;
  return name;
}

const valid = candidates.filter((c) => c.downloaded && !c.skipped);

// Build a map: assetKey → real photographer name
const nameByAssetKey = new Map<string, string>();
for (const c of valid) {
  const name = realName(c.attribution);
  nameByAssetKey.set(c.assetKey, name ?? c.photographer);
}

// Plants that have at least one iNat image
const plantsWithInat = new Set(valid.map((c) => c.plantId));

// ── 1 & 2. Patch plants.ts ────────────────────────────────────────────────────
const plantsPath = path.join(ROOT, 'src/data/plants.ts');
let plantsText = fs.readFileSync(plantsPath, 'utf8');

let nameFixed = 0;
let sourceFixed = 0;

// Fix photographer names: find `assetKey: 'PLANT-inat-SLOT'` blocks and replace username
for (const [assetKey, name] of nameByAssetKey) {
  // Match the photographer line immediately after the assetKey line
  const pattern = new RegExp(
    `(assetKey: '${assetKey}',[\\s\\S]*?photographer: ')(\\w+)(')`,
    'g'
  );
  const before = plantsText;
  plantsText = plantsText.replace(pattern, (_, pre, _user, post) => {
    return `${pre}${name}${post}`;
  });
  if (plantsText !== before) nameFixed++;
}

// Fix imageSources: add 'INATURALIST' where missing for plants that have iNat images
for (const plantId of plantsWithInat) {
  // Find the imageSources line for this plant
  // Pattern: id: 'PLANT_ID' ... imageSources: [...]
  const plantStart = plantsText.indexOf(`id: '${plantId}'`);
  if (plantStart === -1) continue;

  // Find imageSources within the next 500 chars of the plant start
  const searchSlice = plantsText.slice(plantStart, plantStart + 800);
  const sourcesMatch = searchSlice.match(/imageSources:\s*\[([^\]]*)\]/);
  if (!sourcesMatch) continue;

  const sourcesContent = sourcesMatch[1];
  if (sourcesContent.includes('INATURALIST')) continue; // already there

  const oldSources = `imageSources: [${sourcesContent}]`;
  const newContent = sourcesContent.trimEnd().replace(/,?\s*$/, '') + ", 'INATURALIST'";
  const newSources = `imageSources: [${newContent}]`;

  const replaceAt = plantStart + searchSlice.indexOf(oldSources);
  plantsText =
    plantsText.slice(0, replaceAt) +
    newSources +
    plantsText.slice(replaceAt + oldSources.length);
  sourceFixed++;
}

fs.writeFileSync(plantsPath, plantsText);
console.log(`plants.ts: fixed ${nameFixed} photographer names, ${sourceFixed} imageSources entries.`);

console.log('\nDone. Bump SEED_VERSION in src/db/constants.ts to propagate to native SQLite.');

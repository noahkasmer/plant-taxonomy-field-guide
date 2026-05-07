/**
 * Reads scripts/inaturalist-candidates.json and wires the downloaded images into:
 *   - src/data/imageAssets.ts   (adds require() entries)
 *   - src/data/plants.ts        (appends image entries to each plant's images array)
 *   - src/data/imageManifest.ts (appends ReviewedImageCandidate entries)
 *
 * Usage: node --import tsx scripts/wire-stage-images.ts
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
  photoId: number;
  photoUrl: string;
  observationUrl: string;
  photographer: string;
  attribution: string;
  license: string;
  downloaded: boolean;
  skipped?: string;
}> = JSON.parse(fs.readFileSync(path.join(__dirname, 'inaturalist-candidates.json'), 'utf8'));

// Only wire images that were actually downloaded and are unique (dedupe same photoId per plant)
const seen = new Set<string>();
const valid = candidates.filter((c) => {
  if (!c.downloaded || c.skipped?.startsWith('pre')) return false;
  const key = `${c.plantId}-${c.photoId}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

console.log(`Wiring ${valid.length} unique downloaded images…\n`);

// ── 1. imageAssets.ts ─────────────────────────────────────────────────────────

const assetsPath = path.join(ROOT, 'src/data/imageAssets.ts');
let assetsText = fs.readFileSync(assetsPath, 'utf8');

const newRequires = valid
  .map(
    (c) =>
      `  '${c.assetKey}': require('../../assets/images/plants/${c.assetKey}.jpg'),`
  )
  .join('\n');

// Insert before the closing `};`
if (assetsText.includes('// iNaturalist life-stage images')) {
  console.log('imageAssets.ts: iNaturalist block already present, skipping.');
} else {
  assetsText = assetsText.replace(
    /\n\};\s*$/,
    `\n  // iNaturalist life-stage images (detail / fruit / leaf)\n${newRequires}\n};\n`
  );
  fs.writeFileSync(assetsPath, assetsText);
  console.log(`imageAssets.ts: added ${valid.length} require() entries.`);
}

// ── 2. plants.ts ──────────────────────────────────────────────────────────────

const plantsPath = path.join(ROOT, 'src/data/plants.ts');
let plantsText = fs.readFileSync(plantsPath, 'utf8');

const slotCaptions: Record<string, (plantId: string) => string> = {
  detail: (id) => `Close-up flower detail of ${id.replace(/-/g, ' ')}.`,
  fruit:  (id) => `Seed head / fruit of ${id.replace(/-/g, ' ')}.`,
  leaf:   (id) => `Leaf detail of ${id.replace(/-/g, ' ')}.`,
};

// Group by plantId
const byPlant = new Map<string, typeof valid>();
for (const c of valid) {
  if (!byPlant.has(c.plantId)) byPlant.set(c.plantId, []);
  byPlant.get(c.plantId)!.push(c);
}

for (const [plantId, images] of byPlant) {
  const heroIdPattern = `id: '${plantId}-hero'`;
  const heroIdx = plantsText.indexOf(heroIdPattern);
  if (heroIdx === -1) {
    console.warn(`  WARNING: could not find hero entry for ${plantId}, skipping.`);
    continue;
  }

  // Skip if already wired (check for first inat assetKey)
  if (plantsText.includes(`assetKey: '${images[0].assetKey}'`)) {
    console.log(`  ${plantId}: already wired, skipping.`);
    continue;
  }

  // Find the closing `},\n    ],` of the hero image entry (end of images array)
  // The hero entry ends with `      },\n    ],`
  const searchFrom = heroIdx;
  // Find the next occurrence of `    ],` after the hero entry
  const closingPattern = /\n    \],/;
  const afterHero = plantsText.slice(searchFrom);
  const closingMatch = closingPattern.exec(afterHero);
  if (!closingMatch) {
    console.warn(`  WARNING: could not find images array close for ${plantId}, skipping.`);
    continue;
  }
  const insertAt = searchFrom + closingMatch.index + 1; // after the \n, before `    ],`

  const newEntries = images.map((c) => {
    const licenseStr = c.license; // already 'CC_BY' or 'CC_BY_SA'
    const caption = slotCaptions[c.slot]?.(plantId) ?? '';
    return `      {
        id: '${c.assetKey}',
        slot: '${c.slot}',
        assetKey: '${c.assetKey}',
        url: '${c.photoUrl}',
        originalUrl: '${c.observationUrl}',
        photographer: '${c.photographer}',
        source: 'INATURALIST',
        license: '${licenseStr}',
        licenseStatus: 'verified',
        commercialUseReviewed: true,
        attributionRequired: true,
        caption: '${caption}',
      },`;
  }).join('\n');

  plantsText = plantsText.slice(0, insertAt) + newEntries + '\n' + plantsText.slice(insertAt);
  console.log(`  ${plantId}: added ${images.length} image(s).`);
}

fs.writeFileSync(plantsPath, plantsText);
console.log('\nplants.ts: written.');

// ── 3. imageManifest.ts ───────────────────────────────────────────────────────

const manifestPath = path.join(ROOT, 'src/data/imageManifest.ts');
let manifestText = fs.readFileSync(manifestPath, 'utf8');

if (manifestText.includes('inat-detail')) {
  console.log('\nimageManifest.ts: iNaturalist entries already present, skipping.');
} else {
  const today = new Date().toISOString().slice(0, 10);
  const newEntries = valid.map((c) => {
    const licenseStr = c.license;
    const creditLine = c.attribution.replace(/"/g, "'");
    return `  {
    id: '${c.assetKey}',
    plantId: '${c.plantId}',
    assetKey: '${c.assetKey}',
    slot: '${c.slot}',
    source: 'INATURALIST',
    sourcePageUrl: '${c.observationUrl}',
    photographer: '${c.photographer}',
    creditLine: '${creditLine}',
    license: '${licenseStr}',
    licenseStatus: 'verified',
    commercialUseReviewed: true,
    attributionRequired: true,
    reviewedOn: '${today}',
    reviewedBy: 'inaturalist_stage_fetch_script',
    reviewStatus: 'approved_for_bundle',
    publicDomainBasis: 'N/A — ${licenseStr.replace('_', '-')} via iNaturalist; commercially usable with attribution.',
    reviewNotes: 'Research-grade observation. License confirmed via iNaturalist API response.',
  },`;
  }).join('\n');

  // Insert before closing `];`
  manifestText = manifestText.replace(/\n\];\s*$/, `\n${newEntries}\n];\n`);
  fs.writeFileSync(manifestPath, manifestText);
  console.log(`\nimageManifest.ts: added ${valid.length} entries.`);
}

console.log('\nDone. Restart Metro (npm run web) to pick up new assets.');

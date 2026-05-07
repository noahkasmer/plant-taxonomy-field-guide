/**
 * One-time patch:
 *  1. Add bloomSeason to all 31 plants
 *  2. Fix black-eyed-susan detail/fruit slot swap (user verified wrong)
 *  3. Fix usfwsImageSources variable refs that are missing 'INATURALIST'
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const plantsPath = path.join(__dirname, '..', 'src/data/plants.ts');
let text = fs.readFileSync(plantsPath, 'utf8');

// ── 1. bloomSeason per plant ────────────────────────────────────────────────
const bloomSeasons: Record<string, string> = {
  'black-eyed-susan':        'Summer',
  'blue-flag-iris':          'Late spring',
  'butterfly-milkweed':      'Summer',
  'cardinal-flower':         'Midsummer to fall',
  'eastern-purple-coneflower': 'Summer',
  'prairie-blazingstar':     'Late summer to fall',
  'prairie-dock':            'Late summer to fall',
  'swamp-milkweed':          'Midsummer to fall',
  'wild-bergamot':           'Midsummer',
  'wild-columbine':          'Late spring',
  'common-milkweed':         'Summer',
  'golden-alexanders':       'Late spring',
  'great-blue-lobelia':      'Late summer to fall',
  'virginia-bluebells':      'Spring',
  'wild-geranium':           'Late spring',
  'mayapple':                'Spring',
  'bloodroot':               'Early spring',
  'jack-in-the-pulpit':      'Spring',
  'common-boneset':          'Midsummer to fall',
  'joe-pye-weed':            'Midsummer to fall',
  'new-england-aster':       'Fall',
  'stiff-goldenrod':         'Late summer to fall',
  'blue-vervain':            'Midsummer to fall',
  'obedient-plant':          'Midsummer to fall',
  'cup-plant':               'Midsummer to fall',
  'compass-plant':           'Midsummer',
  'rattlesnake-master':      'Midsummer',
  'culvers-root':            'Midsummer',
  'ironweed':                'Midsummer to fall',
  'red-osier-dogwood':       'Late spring',
  'virginia-creeper':        'Early summer',
};

let bloomAdded = 0;
for (const [id, season] of Object.entries(bloomSeasons)) {
  // Find nativeStatus line within the plant's block
  const idMarker = `id: '${id}'`;
  const idx = text.indexOf(idMarker);
  if (idx === -1) { console.warn(`Plant not found: ${id}`); continue; }

  // Look for nativeStatus within 400 chars
  const slice = text.slice(idx, idx + 400);
  const nsMatch = slice.match(/nativeStatus: '([^']+)',/);
  if (!nsMatch) { console.warn(`nativeStatus not found for ${id}`); continue; }

  const nsStr = `nativeStatus: '${nsMatch[1]}',`;
  const insertAfter = idx + slice.indexOf(nsStr) + nsStr.length;

  // Only insert if bloomSeason not already there
  const after200 = text.slice(insertAfter, insertAfter + 200);
  if (after200.includes('bloomSeason:')) { continue; }

  const indent = '    '; // 4 spaces
  const insertion = `\n${indent}bloomSeason: '${season}',`;
  text = text.slice(0, insertAfter) + insertion + text.slice(insertAfter);
  bloomAdded++;
}

// ── 2. black-eyed-susan slot swap ───────────────────────────────────────────
// detail slot is actually showing seed head → should be fruit
// fruit slot is actually showing a flower → should be detail
text = text
  .replace(
    "id: 'black-eyed-susan-inat-detail',\n        slot: 'detail',\n        assetKey: 'black-eyed-susan-inat-detail',",
    "id: 'black-eyed-susan-inat-detail',\n        slot: 'fruit',\n        assetKey: 'black-eyed-susan-inat-detail',"
  )
  .replace(
    "caption: 'Close-up flower detail of black eyed susan.'",
    "caption: 'Seed head / fruit of black eyed susan (formerly labeled detail).'"
  )
  .replace(
    "id: 'black-eyed-susan-inat-fruit',\n        slot: 'fruit',\n        assetKey: 'black-eyed-susan-inat-fruit',",
    "id: 'black-eyed-susan-inat-fruit',\n        slot: 'detail',\n        assetKey: 'black-eyed-susan-inat-fruit',"
  )
  .replace(
    "caption: 'Seed head / fruit of black eyed susan.'",
    "caption: 'Flower detail of black eyed susan.'"
  );

// ── 3. Fix usfwsImageSources variable refs missing INATURALIST ────────────
// Plants with usfwsImageSources that also have iNat images
const usfwsWithInat = [
  'butterfly-milkweed', 'cardinal-flower', 'eastern-purple-coneflower',
  'prairie-blazingstar', 'swamp-milkweed', 'wild-bergamot', 'wild-columbine',
  'common-milkweed', 'great-blue-lobelia', 'virginia-bluebells', 'wild-geranium',
  'mayapple', 'bloodroot', 'jack-in-the-pulpit', 'new-england-aster',
  'blue-vervain', 'obedient-plant',
];

let sourceFixed = 0;
for (const id of usfwsWithInat) {
  const idMarker = `id: '${id}'`;
  const idx = text.indexOf(idMarker);
  if (idx === -1) continue;

  const slice = text.slice(idx, idx + 500);
  if (!slice.includes('imageSources: usfwsImageSources,')) continue;

  const before = text;
  const replaceAt = idx + slice.indexOf('imageSources: usfwsImageSources,');
  text =
    text.slice(0, replaceAt) +
    "imageSources: ['USFWS_LIBRARY', 'INATURALIST']," +
    text.slice(replaceAt + 'imageSources: usfwsImageSources,'.length);
  if (text !== before) sourceFixed++;
}

fs.writeFileSync(plantsPath, text);
console.log(`bloomSeason added: ${bloomAdded}`);
console.log(`black-eyed-susan slots swapped`);
console.log(`imageSources fixed: ${sourceFixed}`);

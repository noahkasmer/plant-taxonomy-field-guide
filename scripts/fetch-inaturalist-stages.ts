/**
 * Searches iNaturalist for CC-BY / CC-BY-SA photos across three phenology stages
 * (Flowering → detail, Fruiting → fruit, No-Evidence → leaf) for each plant.
 *
 * Usage: node --import tsx scripts/fetch-inaturalist-stages.ts
 *
 * Outputs:
 *  - Downloaded images to assets/images/plants/
 *  - A JSON candidate report to scripts/inaturalist-candidates.json
 */

import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'plants');
const REPORT_PATH = path.join(__dirname, 'inaturalist-candidates.json');

// iNaturalist Plant Phenology annotation term/value IDs
const PHENOLOGY = {
  detail:  { termId: 12, valueId: 14, label: 'Flowering'           }, // → detail slot
  fruit:   { termId: 12, valueId: 15, label: 'Fruiting'            }, // → fruit slot
  leaf:    { termId: 12, valueId: 21, label: 'No Evidence'         }, // → leaf slot
} as const;

type Slot = keyof typeof PHENOLOGY;

const PLANTS: { id: string; scientificName: string }[] = [
  { id: 'black-eyed-susan',        scientificName: 'Rudbeckia hirta' },
  { id: 'blue-flag-iris',          scientificName: 'Iris virginica shrevei' },
  { id: 'butterfly-milkweed',      scientificName: 'Asclepias tuberosa' },
  { id: 'cardinal-flower',         scientificName: 'Lobelia cardinalis' },
  { id: 'eastern-purple-coneflower', scientificName: 'Echinacea purpurea' },
  { id: 'prairie-blazingstar',     scientificName: 'Liatris pycnostachya' },
  { id: 'prairie-dock',            scientificName: 'Silphium terebinthinaceum' },
  { id: 'swamp-milkweed',          scientificName: 'Asclepias incarnata' },
  { id: 'wild-bergamot',           scientificName: 'Monarda fistulosa' },
  { id: 'wild-columbine',          scientificName: 'Aquilegia canadensis' },
  { id: 'common-milkweed',         scientificName: 'Asclepias syriaca' },
  { id: 'golden-alexanders',       scientificName: 'Zizia aurea' },
  { id: 'great-blue-lobelia',      scientificName: 'Lobelia siphilitica' },
  { id: 'virginia-bluebells',      scientificName: 'Mertensia virginica' },
  { id: 'wild-geranium',           scientificName: 'Geranium maculatum' },
  { id: 'mayapple',                scientificName: 'Podophyllum peltatum' },
  { id: 'bloodroot',               scientificName: 'Sanguinaria canadensis' },
  { id: 'jack-in-the-pulpit',      scientificName: 'Arisaema triphyllum' },
  { id: 'common-boneset',          scientificName: 'Eupatorium perfoliatum' },
  { id: 'joe-pye-weed',            scientificName: 'Eutrochium maculatum' },
  { id: 'new-england-aster',       scientificName: 'Symphyotrichum novae-angliae' },
  { id: 'stiff-goldenrod',         scientificName: 'Solidago rigida' },
  { id: 'blue-vervain',            scientificName: 'Verbena hastata' },
  { id: 'obedient-plant',          scientificName: 'Physostegia virginiana' },
  { id: 'cup-plant',               scientificName: 'Silphium perfoliatum' },
  { id: 'compass-plant',           scientificName: 'Silphium laciniatum' },
  { id: 'rattlesnake-master',      scientificName: 'Eryngium yuccifolium' },
  { id: 'culvers-root',            scientificName: 'Veronicastrum virginicum' },
  { id: 'ironweed',                scientificName: 'Vernonia fasciculata' },
  { id: 'red-osier-dogwood',       scientificName: 'Cornus sericea' },
  { id: 'virginia-creeper',        scientificName: 'Parthenocissus quinquefolia' },
];

type Candidate = {
  plantId: string;
  slot: Slot;
  assetKey: string;
  photoId: number;
  photoUrl: string;
  observationUrl: string;
  photographer: string;
  attribution: string;
  license: string;
  downloaded: boolean;
  skipped?: string;
};

function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function get(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          'User-Agent': 'PlantFieldGuideApp/1.0 (educational; contact mith77@protonmail.com)',
          Accept: 'application/json',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode} from ${url}`));
          } else {
            resolve(data);
          }
        });
      }
    ).on('error', reject);
  });
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { 'User-Agent': 'PlantFieldGuideApp/1.0' } }, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          file.close();
          fs.unlink(dest, () => {});
          const location = res.headers.location;
          if (location) return downloadFile(location, dest).then(resolve).catch(reject);
          reject(new Error('Redirect without location'));
          return;
        }
        if (!res.statusCode || res.statusCode >= 400) {
          res.resume();
          file.close();
          fs.unlink(dest, () => {});
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve()));
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

/** Convert iNat thumbnail URL to medium (800px longest edge) */
function mediumUrl(squareUrl: string): string {
  return squareUrl.replace('/square.', '/medium.').replace('square.jpg', 'medium.jpg');
}

async function fetchTopPhoto(
  scientificName: string,
  termId: number,
  valueId: number
): Promise<{ photoId: number; photoUrl: string; observationId: number; photographer: string; attribution: string; license: string } | null> {
  const params = new URLSearchParams({
    taxon_name: scientificName,
    quality_grade: 'research',
    photos: 'true',
    license: 'cc-by,cc-by-sa',
    term_id: String(termId),
    term_value_id: String(valueId),
    per_page: '5',
    order_by: 'votes',
  });

  const url = `https://api.inaturalist.org/v1/observations?${params}`;
  let body: string;
  try {
    body = await get(url);
  } catch (e) {
    return null;
  }

  const data = JSON.parse(body);
  const results = data.results ?? [];

  for (const obs of results) {
    const photos: any[] = obs.photos ?? [];
    for (const photo of photos) {
      const lc: string = photo.license_code ?? '';
      if (lc !== 'cc-by' && lc !== 'cc-by-sa') continue;
      const squareUrl: string = photo.url ?? '';
      if (!squareUrl) continue;
      return {
        photoId: photo.id,
        photoUrl: mediumUrl(squareUrl),
        observationId: obs.id,
        photographer: obs.user?.login ?? 'unknown',
        attribution: photo.attribution ?? '',
        license: lc === 'cc-by' ? 'CC_BY' : 'CC_BY_SA',
      };
    }
  }
  return null;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const report: Candidate[] = [];

  for (const plant of PLANTS) {
    console.log(`\n── ${plant.commonName ?? plant.id} (${plant.scientificName})`);

    for (const [slot, config] of Object.entries(PHENOLOGY) as [Slot, typeof PHENOLOGY[Slot]][]) {
      const assetKey = `${plant.id}-inat-${slot}`;
      const dest = path.join(OUT_DIR, `${assetKey}.jpg`);

      if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
        console.log(`  ${slot}: already exists`);
        report.push({
          plantId: plant.id, slot, assetKey,
          photoId: 0, photoUrl: '', observationUrl: '', photographer: '', attribution: '', license: '',
          downloaded: true, skipped: 'pre-existing',
        });
        continue;
      }

      process.stdout.write(`  ${slot} (${config.label})... `);
      await delay(1100); // stay well under iNat's 60 req/min rate limit

      const photo = await fetchTopPhoto(plant.scientificName, config.termId, config.valueId);
      if (!photo) {
        console.log('no result');
        report.push({
          plantId: plant.id, slot, assetKey,
          photoId: 0, photoUrl: '', observationUrl: '', photographer: '', attribution: '', license: '',
          downloaded: false, skipped: 'no CC-BY result',
        });
        continue;
      }

      try {
        await downloadFile(photo.photoUrl, dest);
        const size = fs.statSync(dest).size;
        console.log(`done (${(size / 1024).toFixed(0)} KB) — @${photo.photographer}`);
        report.push({
          plantId: plant.id, slot, assetKey,
          photoId: photo.photoId,
          photoUrl: photo.photoUrl,
          observationUrl: `https://www.inaturalist.org/observations/${photo.observationId}`,
          photographer: photo.photographer,
          attribution: photo.attribution,
          license: photo.license,
          downloaded: true,
        });
      } catch (err) {
        console.log(`download failed: ${(err as Error).message}`);
        report.push({
          plantId: plant.id, slot, assetKey,
          photoId: photo.photoId, photoUrl: photo.photoUrl,
          observationUrl: `https://www.inaturalist.org/observations/${photo.observationId}`,
          photographer: photo.photographer, attribution: photo.attribution, license: photo.license,
          downloaded: false, skipped: (err as Error).message,
        });
      }
    }
  }

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\n\nDone. Candidate report written to scripts/inaturalist-candidates.json`);
  console.log(`Downloaded: ${report.filter((r) => r.downloaded && !r.skipped?.includes('pre')).length} / ${report.length} slots`);
}

main();

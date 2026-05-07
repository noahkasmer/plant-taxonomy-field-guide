/**
 * Downloads missing plant hero images from Wikimedia Commons.
 * Run with: node --import tsx scripts/download-plant-images.ts
 *
 * Images are CC-BY-SA 4.0 (Krzysztof Ziarnek/Kenraiz) unless noted.
 * All require attribution per imageManifest.ts entries.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { URL, fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'plants');

type ImageDownload = {
  assetKey: string;
  wikimediaFile: string;
};

const images: ImageDownload[] = [
  {
    assetKey: 'blue-flag-iris-wikimedia',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/b/be/Iris_virginica_var._shrevei.jpg',
  },
  {
    assetKey: 'prairie-dock-wikimedia',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/6/64/Silphium_terebinthinaceum_PRAIRIE_DOCK_%285146939397%29.jpg',
  },
  {
    assetKey: 'golden-alexanders-wikimedia-kenraiz',
    wikimediaFile: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Zizia_aurea_kz03.jpg',
  },
  {
    assetKey: 'common-boneset-wikimedia-kenraiz',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Eupatorium_perfoliatum_kz01.jpg',
  },
  {
    assetKey: 'joe-pye-weed-wikimedia-kenraiz',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/9/9f/Eutrochium_purpureum_kz02.jpg',
  },
  {
    assetKey: 'stiff-goldenrod-wikimedia',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/0/00/Solidago_rigida_%284991314459%29.jpg',
  },
  {
    assetKey: 'cup-plant-wikimedia-kenraiz',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/d/d3/Silphium_perfoliatum_kz01.jpg',
  },
  {
    assetKey: 'compass-plant-wikimedia-kenraiz',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Silphium_laciniatum_kz07.jpg',
  },
  {
    assetKey: 'rattlesnake-master-wikimedia-kenraiz',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/d/d7/Eryngium_yuccifolium_kz03.jpg',
  },
  {
    assetKey: 'culvers-root-wikimedia-kenraiz',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/e/e1/Veronicastrum_virginicum_kz02.jpg',
  },
  {
    assetKey: 'ironweed-wikimedia-kenraiz',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/a/a4/Vernonia_fasciculata_kz01.jpg',
  },
  { assetKey: 'red-osier-dogwood-wikimedia', wikimediaFile: 'Red_Osier_Dogwood.jpg' },
  {
    assetKey: 'virginia-creeper-wikimedia',
    wikimediaFile:
      'https://upload.wikimedia.org/wikipedia/commons/e/e8/Virginia_Creeper_on_Pin_Oak_in_Blacklick_Woods.jpg',
  },
];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https
      .get(url, { headers: { 'User-Agent': 'PlantFieldGuideBot/1.0 (educational/offline-app)' } }, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          fs.unlink(dest, () => {});
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
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

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const { assetKey, wikimediaFile } of images) {
    const dest = path.join(OUT_DIR, `${assetKey}.jpg`);
    // treat 0-byte files as missing
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      console.log(`✓ already exists: ${assetKey}.jpg`);
      continue;
    }
    if (fs.existsSync(dest)) fs.unlinkSync(dest);
    const url = wikimediaFile.startsWith('http')
      ? wikimediaFile
      : `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(wikimediaFile)}`;
    process.stdout.write(`  downloading ${assetKey}... `);
    let success = false;
    for (let attempt = 1; attempt <= 3 && !success; attempt++) {
      try {
        await downloadFile(url, dest);
        console.log('done');
        success = true;
      } catch (err) {
        if (attempt < 3) {
          process.stdout.write(`retry ${attempt}... `);
          await delay(5000 * attempt);
        } else {
          console.log(`FAILED: ${(err as Error).message}`);
        }
      }
    }
    await delay(3000);
  }

  console.log('\nDone. Run the app to verify images appear correctly.');
}

main();

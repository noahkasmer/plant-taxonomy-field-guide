import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { reviewedImageCandidates } from '@/data/imageManifest';
import { licenseCatalog } from '@/data/licenses';
import { plants } from '@/data/plants';
import { sourceCatalog } from '@/data/sources';
import { validateCatalogData } from '@/data/validateCatalog';

async function main() {
  const projectRoot = process.cwd();
  const backendDataDir = path.join(projectRoot, 'backend', 'data');

  await mkdir(backendDataDir, { recursive: true });
  validateCatalogData();

  await writeFile(
    path.join(backendDataDir, 'plants.json'),
    `${JSON.stringify(plants, null, 2)}\n`,
    'utf8',
  );
  await writeFile(
    path.join(backendDataDir, 'reviewed-image-candidates.json'),
    `${JSON.stringify(reviewedImageCandidates, null, 2)}\n`,
    'utf8',
  );
  await writeFile(
    path.join(backendDataDir, 'sources.json'),
    `${JSON.stringify(sourceCatalog, null, 2)}\n`,
    'utf8',
  );
  await writeFile(
    path.join(backendDataDir, 'licenses.json'),
    `${JSON.stringify(licenseCatalog, null, 2)}\n`,
    'utf8',
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        plantCount: plants.length,
        reviewedImageCandidateCount: reviewedImageCandidates.length,
        sourceCount: sourceCatalog.length,
        licenseCount: licenseCatalog.length,
      },
      null,
      2,
    ),
  );
}

void main();

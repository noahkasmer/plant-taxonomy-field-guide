const http = require('http');
const fs = require('fs');
const path = require('path');

const plantsPath = path.join(__dirname, 'data', 'plants.json');
const reviewedImageCandidatesPath = path.join(
  __dirname,
  'data',
  'reviewed-image-candidates.json',
);
const sourcesPath = path.join(__dirname, 'data', 'sources.json');
const licensesPath = path.join(__dirname, 'data', 'licenses.json');

function readJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, { encoding: 'utf-8' });
  return JSON.parse(raw);
}

const plants = readJsonFile(plantsPath);
const reviewedImageCandidates = readJsonFile(reviewedImageCandidatesPath);
const sources = readJsonFile(sourcesPath);
const licenses = readJsonFile(licensesPath);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8',
  });
  res.end(JSON.stringify(payload));
}

function sendNotFound(res, message = 'Not found') {
  sendJson(res, 404, { error: message });
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const requestUrl = new URL(req.url, 'http://localhost');
  const pathname = requestUrl.pathname;

  if (pathname === '/api/health') {
    sendJson(res, 200, {
      ok: true,
      plants: plants.length,
      reviewedImageCandidates: reviewedImageCandidates.length,
      sources: sources.length,
      licenses: licenses.length,
    });
    return;
  }

  if (pathname === '/api/plants') {
    sendJson(res, 200, plants);
    return;
  }

  const plantMatch = pathname.match(/^\/api\/plants\/([^/]+)$/);
  if (plantMatch) {
    const id = decodeURIComponent(plantMatch[1]);
    const plant = plants.find((entry) => entry.id === id);

    if (!plant) {
      sendNotFound(res, 'Plant not found');
      return;
    }

    sendJson(res, 200, plant);
    return;
  }

  if (pathname === '/api/reviewed-image-candidates') {
    const plantId = requestUrl.searchParams.get('plantId');

    if (!plantId) {
      sendJson(res, 200, reviewedImageCandidates);
      return;
    }

    const filteredCandidates = reviewedImageCandidates.filter(
      (candidate) => candidate.plantId === plantId,
    );

    sendJson(res, 200, filteredCandidates);
    return;
  }

  if (pathname === '/api/sources') {
    sendJson(res, 200, sources);
    return;
  }

  if (pathname === '/api/licenses') {
    sendJson(res, 200, licenses);
    return;
  }

  const candidateMatch = pathname.match(/^\/api\/reviewed-image-candidates\/([^/]+)$/);
  if (candidateMatch) {
    const plantId = decodeURIComponent(candidateMatch[1]);
    const filteredCandidates = reviewedImageCandidates.filter(
      (candidate) => candidate.plantId === plantId,
    );

    sendJson(res, 200, filteredCandidates);
    return;
  }

  sendNotFound(res);
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => {
  console.log(`Plant backend listening on http://localhost:${port}`);
});

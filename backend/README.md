# Backend

This is a minimal read-only Node.js API for the Illinois Plant ID app.

It mirrors the current frontend seed dataset and metadata so the project can begin backend work without replacing the offline-first frontend flow yet.

## Endpoints

- `GET /api/health`
- `GET /api/plants`
- `GET /api/plants/:id`
- `GET /api/reviewed-image-candidates`
- `GET /api/reviewed-image-candidates/:plantId`
- `GET /api/reviewed-image-candidates?plantId=<id>`
- `GET /api/sources`
- `GET /api/licenses`

## Run

From the project root:

```bash
npm run server
```

The API listens on `http://localhost:3000` by default.

## Notes

- The backend is read-only for now.
- No authentication is included.
- The frontend app still uses local SQLite-backed data bootstrapped from bundled seed files by default.
- `backend/data/` is generated from the canonical frontend data via `npm run data:export-backend`.
- This is intended as a clean step toward future sync or API work without changing the current offline-first contract.

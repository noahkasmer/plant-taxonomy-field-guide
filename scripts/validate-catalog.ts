import { validateCatalogData } from '@/data/validateCatalog';

const summary = validateCatalogData();

console.log(
  JSON.stringify(
    {
      ok: true,
      ...summary,
    },
    null,
    2,
  ),
);

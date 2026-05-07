import type { SourceCatalogEntry } from '@/types/plant';

export const sourceCatalog: SourceCatalogEntry[] = [
  {
    id: 'USDA_PLANTS',
    label: 'USDA PLANTS Database',
    sourceType: 'fact',
    baseUrl: 'https://plants.usda.gov/home',
    policyUrl: 'https://www.usda.gov/about-usda/policies-and-links',
    usageNotes:
      'Good factual reference. Most USDA website information is considered public domain unless otherwise noted, but individual assets still need review.',
    preferredForCommercialApp: true,
  },
  {
    id: 'ILLINOIS_WILDFLOWERS',
    label: 'Illinois Wildflowers',
    sourceType: 'fact',
    baseUrl: 'https://www.illinoiswildflowers.info/',
    policyUrl: 'https://www.illinoiswildflowers.info/files/photo_use.html',
    usageNotes:
      'Useful factual reference for Illinois field traits and habitat notes. Use for paraphrased facts only, not copied text or photos by default.',
    preferredForCommercialApp: false,
  },
  {
    id: 'US_FOREST_SERVICE',
    label: 'U.S. Forest Service',
    sourceType: 'fact',
    baseUrl: 'https://www.fs.usda.gov/',
    policyUrl: 'https://www.fs.usda.gov/about-agency/disclaimers',
    usageNotes:
      'Useful federal factual source. Treat individual media assets conservatively and verify any non-text content separately.',
    preferredForCommercialApp: true,
  },
  {
    id: 'ILLINOIS_EXTENSION',
    label: 'State Extension Resources',
    sourceType: 'fact',
    baseUrl: 'https://extension.illinois.edu/',
    policyUrl: 'https://extension.illinois.edu/',
    usageNotes:
      'Useful for horticultural and regional context when licensing is reusable or the content is used only as a factual reference.',
    preferredForCommercialApp: false,
  },
  {
    id: 'INATURALIST_METADATA',
    label: 'iNaturalist Metadata',
    sourceType: 'fact',
    baseUrl: 'https://www.inaturalist.org/',
    policyUrl: 'https://help.inaturalist.org/en/support/solutions/articles/151000169918-can-i-use-the-photos-and-sounds-that-are-posted-on-inaturalist-',
    usageNotes:
      'Use metadata and taxonomy carefully. Individual media rights vary by upload and must be reviewed asset-by-asset.',
    preferredForCommercialApp: false,
  },
  {
    id: 'USFWS_LIBRARY',
    label: 'U.S. Fish and Wildlife Service Library',
    sourceType: 'image',
    baseUrl: 'https://www.fws.gov/media',
    policyUrl: 'https://www.fws.gov/node/268813',
    usageNotes:
      'Preferred image source when the specific media page explicitly marks the asset as public domain and the credit line is preserved.',
    preferredForCommercialApp: true,
  },
  {
    id: 'NPS',
    label: 'National Park Service',
    sourceType: 'image',
    baseUrl: 'https://www.nps.gov/',
    policyUrl: 'https://www.nps.gov/disclaimer.htm',
    usageNotes:
      'Only use specific assets that are clearly public domain or otherwise approved. Not all NPS-hosted media is automatically reusable.',
    preferredForCommercialApp: true,
  },
  {
    id: 'USDA',
    label: 'U.S. Department of Agriculture',
    sourceType: 'image',
    baseUrl: 'https://www.usda.gov/',
    policyUrl: 'https://www.usda.gov/about-usda/policies-and-links',
    usageNotes:
      'Preferred image source when the asset is official USDA content and no contradictory rights restriction is noted on the asset page.',
    preferredForCommercialApp: true,
  },
  {
    id: 'LIBRARY_OF_CONGRESS',
    label: 'Library of Congress',
    sourceType: 'image',
    baseUrl: 'https://www.loc.gov/',
    policyUrl: 'https://www.loc.gov/collections/fsa-owi-color-photographs/about-this-collection/rights-and-access/',
    usageNotes:
      'Use public-domain or rights-cleared items only, preserving the cited source and collection context.',
    preferredForCommercialApp: true,
  },
  {
    id: 'WIKIMEDIA_COMMONS',
    label: 'Wikimedia Commons',
    sourceType: 'image',
    baseUrl: 'https://commons.wikimedia.org/',
    policyUrl: 'https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia',
    usageNotes:
      'Useful reviewed fallback. Every file must be checked individually for rights and attribution requirements.',
    preferredForCommercialApp: false,
  },
];

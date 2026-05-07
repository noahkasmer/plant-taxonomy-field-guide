export type NativeStatus = 'native' | 'introduced' | 'naturalized' | 'unknown';
export type PlantType = 'wildflower' | 'shrub' | 'vine' | 'fern' | 'tree';
export type ThemePreference = 'system' | 'light' | 'dark';

export type FactSourceName =
  | 'USDA_PLANTS'
  | 'ILLINOIS_WILDFLOWERS'
  | 'US_FOREST_SERVICE'
  | 'ILLINOIS_EXTENSION'
  | 'INATURALIST_METADATA';

export type ImageSourceName =
  | 'USFWS_LIBRARY'
  | 'NPS'
  | 'USDA'
  | 'LIBRARY_OF_CONGRESS'
  | 'WIKIMEDIA_COMMONS'
  | 'INATURALIST';

export type FactSummaryMethod = 'manual_paraphrase';
export type LicenseStatus = 'verified' | 'review_required' | 'blocked';
export type ReviewedImageStatus = 'approved_for_bundle' | 'bundled' | 'rejected';

export type ImageLicense =
  | 'PUBLIC_DOMAIN'
  | 'CC0'
  | 'CC_BY'
  | 'CC_BY_SA'
  | 'UNKNOWN';

export type Habitat =
  | 'prairie'
  | 'wet prairie'
  | 'savanna'
  | 'woodland'
  | 'forest'
  | 'meadow'
  | 'marsh'
  | 'fen'
  | 'bog'
  | 'floodplain'
  | 'streambank'
  | 'lakeshore'
  | 'glade'
  | 'roadside'
  | 'disturbed area'
  | 'dry field'
  | 'wetland edge';

export type FlowerColor =
  | 'white'
  | 'cream'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'pink'
  | 'purple'
  | 'blue'
  | 'green'
  | 'brown'
  | 'maroon';

export type BloomMonth =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type LeafArrangement =
  | 'alternate'
  | 'opposite'
  | 'basal'
  | 'whorled'
  | 'rosette';

export type LeafShape =
  | 'linear'
  | 'lanceolate'
  | 'elliptic'
  | 'ovate'
  | 'obovate'
  | 'cordate'
  | 'spatulate'
  | 'lobed'
  | 'palmate'
  | 'compound'
  | 'arrowhead';

export type LeafMargin =
  | 'entire'
  | 'serrate'
  | 'double-serrate'
  | 'toothed'
  | 'lobed'
  | 'crenate'
  | 'undulate';

export type StemType =
  | 'erect'
  | 'unbranched'
  | 'branching'
  | 'clumping'
  | 'square'
  | 'hairy'
  | 'creeping'
  | 'vining'
  | 'woody';

export type ImageSlot = 'hero' | 'detail' | 'habitat' | 'leaf' | 'fruit';
export type PlantSynonymKind = 'common' | 'scientific' | 'regional';
export type TagCategory = 'flower_color' | 'field_cue' | 'habitat' | 'season';

export type HeightRangeInches = {
  min: number;
  max: number;
};

export type PlantSynonym = {
  term: string;
  kind: PlantSynonymKind;
};

export type PlantImage = {
  id: string;
  slot: ImageSlot;
  assetKey?: string;
  url: string;
  originalUrl: string;
  photographer: string;
  source: ImageSourceName;
  license: ImageLicense;
  licenseStatus: LicenseStatus;
  commercialUseReviewed: boolean;
  attributionRequired: boolean;
  caption?: string;
};

export type ReviewedImageCandidate = {
  id: string;
  plantId: string;
  assetKey?: string;
  slot: ImageSlot;
  source: ImageSourceName;
  sourcePageUrl: string;
  photographer: string;
  creditLine: string;
  license: ImageLicense;
  licenseStatus: LicenseStatus;
  commercialUseReviewed: boolean;
  attributionRequired: boolean;
  caption?: string;
  reviewedOn: string;
  reviewedBy: string;
  reviewStatus: ReviewedImageStatus;
  publicDomainBasis: string;
  reviewNotes: string;
};

export type Plant = {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  genus: string;
  species: string;
  plantType: PlantType;
  nativeStatus: NativeStatus;
  factSources: FactSourceName[];
  factSourceNotes?: string;
  factSummaryMethod: FactSummaryMethod;
  lastVerified?: string;
  imageSources: ImageSourceName[];
  habitats: Habitat[];
  bloomSeason: string;
  flowerColors: FlowerColor[];
  bloomMonths: BloomMonth[];
  leafArrangement: LeafArrangement;
  leafShape: LeafShape;
  leafMargin: LeafMargin;
  stemType: StemType;
  heightRangeInches: HeightRangeInches;
  identificationDescription: string;
  leafDescription: string;
  flowerDescription: string;
  habitatDescription: string;
  notes: string;
  similarSpeciesIds: string[];
  synonyms: PlantSynonym[];
  images: PlantImage[];
};

export type LicenseCatalogEntry = {
  id: ImageLicense;
  label: string;
  sourceUrl: string;
  attributionRequired: boolean;
  commercialSafeDefault: boolean;
  usageNotes: string;
};

export type SourceCatalogEntry = {
  id: FactSourceName | ImageSourceName;
  label: string;
  sourceType: 'fact' | 'image';
  baseUrl: string;
  policyUrl: string;
  usageNotes: string;
  preferredForCommercialApp: boolean;
};

export type PlantSummary = {
  id: string;
  commonName: string;
  scientificName: string;
  family: string;
  plantType: PlantType;
  nativeStatus: NativeStatus;
  habitats: Habitat[];
  flowerColors: FlowerColor[];
  bloomMonths: BloomMonth[];
  offlineReady: boolean;
  offlineImageCount: number;
  identificationDescription: string;
  synonyms: PlantSynonym[];
  heroImage?: PlantImage;
};

export type PlantDetail = PlantSummary & {
  genus: string;
  species: string;
  leafArrangement: LeafArrangement;
  leafShape: LeafShape;
  leafMargin: LeafMargin;
  stemType: StemType;
  heightRangeInches: HeightRangeInches;
  leafDescription: string;
  flowerDescription: string;
  habitatDescription: string;
  notes: string;
  factSources: FactSourceName[];
  factSourceNotes?: string;
  factSummaryMethod: FactSummaryMethod;
  lastVerified?: string;
  imageSources: ImageSourceName[];
  images: PlantImage[];
  similarSpecies: PlantSummary[];
};

export type CatalogFilters = {
  query: string;
  flowerColors: FlowerColor[];
  bloomMonths: BloomMonth[];
  habitats: Habitat[];
  plantTypes: PlantType[];
  nativeStatuses: NativeStatus[];
  families: string[];
};

export type CatalogFilterOptions = {
  flowerColors: FlowerColor[];
  bloomMonths: BloomMonth[];
  habitats: Habitat[];
  plantTypes: PlantType[];
  nativeStatuses: NativeStatus[];
  families: string[];
};

export type AppDataStats = {
  plantCount: number;
  favoriteCount: number;
  recentCount: number;
  reviewedImageCount: number;
  bundledImageCount: number;
  lastSeededAt: string;
  seedVersion: string;
  databasePath: string;
};

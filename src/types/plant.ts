export type NativeStatus = 'native' | 'introduced' | 'naturalized' | 'unknown';
export type FactSourceName =
  | 'USDA_PLANTS'
  | 'ILLINOIS_WILDFLOWERS'
  | 'INATURALIST';

export type ImageSourceName =
  | 'USFWS_LIBRARY'
  | 'NPS'
  | 'USDA'
  | 'LIBRARY_OF_CONGRESS'
  | 'WIKIMEDIA_COMMONS';

export type FactSummaryMethod = 'manual_paraphrase';
export type LicenseStatus = 'verified' | 'review_required' | 'blocked';
export type ReviewedImageStatus = 'approved_for_bundle' | 'bundled' | 'rejected';

export type ImageLicense =
  | 'PUBLIC_DOMAIN'
  | 'CC0'
  | 'CC_BY'
  | 'CC_BY_SA'
  | 'UNKNOWN';

// These unions are intentionally practical rather than exhaustive.
// They cover common field-guide traits for Illinois wildflowers.
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
  | 'dry field';

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
  | 'compound';

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
  | 'vining';

export type HeightRangeInches = {
  min: number;
  max: number;
};

export type PlantImage = {
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
  nativeStatus: NativeStatus;
  factSources: FactSourceName[];
  factSourceNotes?: string;
  factSummaryMethod: FactSummaryMethod;
  lastVerified?: string;
  imageSources: ImageSourceName[];
  habitats: Habitat[];
  flowerColors: FlowerColor[];
  bloomMonths: BloomMonth[];
  // Use the dominant field-guide trait rather than every botanical variation.
  leafArrangement: LeafArrangement;
  leafShape: LeafShape;
  leafMargin: LeafMargin;
  // Keep this to the most useful stem cue for simple offline filtering.
  stemType: StemType;
  heightRangeInches: HeightRangeInches;
  notes: string;
  images: PlantImage[];
};

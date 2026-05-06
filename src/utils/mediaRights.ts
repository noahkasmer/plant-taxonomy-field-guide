import type { PlantImage } from '@/types/plant';

const attributionSourceLabels = {
  USFWS_LIBRARY: 'U.S. Fish and Wildlife Service Library',
  NPS: 'National Park Service',
  USDA: 'U.S. Department of Agriculture',
  LIBRARY_OF_CONGRESS: 'Library of Congress',
  WIKIMEDIA_COMMONS: 'Wikimedia Commons',
} as const;

function formatAttributionSource(source: PlantImage['source']) {
  return attributionSourceLabels[source];
}

export function isPreferredCommercialImageSource(image?: PlantImage | null) {
  if (!image) {
    return false;
  }

  return (
    image.source === 'USFWS_LIBRARY' ||
    image.source === 'NPS' ||
    image.source === 'USDA' ||
    image.source === 'LIBRARY_OF_CONGRESS'
  );
}

export function canUseImage(image?: PlantImage | null) {
  if (!image?.license || image.licenseStatus !== 'verified') {
    return false;
  }

  if (image.license === 'PUBLIC_DOMAIN' || image.license === 'CC0') {
    return true;
  }

  if (image.license === 'CC_BY' || image.license === 'CC_BY_SA') {
    return Boolean(image.photographer?.trim() && image.source && image.originalUrl?.trim());
  }

  return false;
}

export function canUseImageInCommercialApp(image?: PlantImage | null) {
  if (!canUseImage(image) || !image?.commercialUseReviewed) {
    return false;
  }

  if (image.license !== 'PUBLIC_DOMAIN' && image.license !== 'CC0') {
    return false;
  }

  return isPreferredCommercialImageSource(image) || image.source === 'WIKIMEDIA_COMMONS';
}

export function getAttributionText(image: PlantImage) {
  const reviewText = image.commercialUseReviewed
    ? 'Commercial-use compatibility reviewed.'
    : 'Commercial-use compatibility not yet reviewed.';
  const sourceLabel = formatAttributionSource(image.source);
  const photographerText = image.photographer?.trim() ? `Photo by ${image.photographer}. ` : '';

  if (image.license === 'CC_BY' || image.license === 'CC_BY_SA') {
    return `${photographerText}Source: ${sourceLabel}. License: ${image.license}. Original: ${image.originalUrl}. Rights status: ${image.licenseStatus}. ${reviewText}`.trim();
  }

  if (image.license === 'PUBLIC_DOMAIN' || image.license === 'CC0') {
    const sourceText = `Source: ${sourceLabel}. `;
    const originalText = image.originalUrl ? `Original: ${image.originalUrl}` : '';
    return `${photographerText}${sourceText}License: ${image.license}. Rights status: ${image.licenseStatus}.${originalText ? ` ${originalText}` : ''} ${reviewText}`.trim();
  }

  return 'Image not cleared for use.';
}

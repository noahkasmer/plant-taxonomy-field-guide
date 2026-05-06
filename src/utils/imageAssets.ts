import type { ImageSourcePropType } from 'react-native';

import { bundledPlantImages } from '@/data/imageAssets';
import type { PlantImage } from '@/types/plant';

export function getBundledPlantImageSource(image?: PlantImage | null): ImageSourcePropType | null {
  if (!image?.assetKey) {
    return null;
  }

  return bundledPlantImages[image.assetKey] ?? null;
}

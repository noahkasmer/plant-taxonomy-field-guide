import { Stack, useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Attribution } from '@/components/Attribution';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getBundledPlantImageSource } from '@/utils/imageAssets';
import { canUseImageInCommercialApp, isPreferredCommercialImageSource } from '@/utils/mediaRights';
import {
  formatFactSummaryMethod,
  formatFactSourceList,
  formatHeightRange,
  formatImageSourceName,
  formatImageSourceList,
  formatTraitList,
  getReviewedImageCandidatesForPlant,
  getPlantById,
} from '@/utils/plants';

export function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plantId = Array.isArray(id) ? id[0] : id;
  const plant = plantId ? getPlantById(plantId) : undefined;

  if (!plant) {
    return (
      <ScreenContainer>
        <Stack.Screen options={{ title: 'Plant Details' }} />
        <View style={styles.section}>
          <Text style={styles.title}>Plant not found</Text>
          <Text style={styles.body}>This local record is missing from the starter dataset.</Text>
        </View>
      </ScreenContainer>
    );
  }

  const approvedImages = plant.images.filter((image) => canUseImageInCommercialApp(image));
  const bundledImages = approvedImages
    .map((image) => ({
      image,
      source: getBundledPlantImageSource(image),
    }))
    .filter(
      (entry): entry is { image: (typeof approvedImages)[number]; source: NonNullable<typeof entry.source> } =>
        entry.source !== null,
    );
  const reviewedCandidates = getReviewedImageCandidatesForPlant(plant.id);
  const preferredImagePolicy =
    plant.imageSources.length > 0 && plant.images.some((image) => isPreferredCommercialImageSource(image))
      ? 'Government public-domain source on file.'
      : 'Government public-domain sources are preferred; Wikimedia Commons is a reviewed fallback only.';

  return (
    <ScreenContainer>
      <Stack.Screen options={{ title: plant.commonName }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>{plant.commonName}</Text>
          <Text style={styles.scientificName}>{plant.scientificName}</Text>
          <Text style={styles.meta}>
            {plant.family} - {plant.nativeStatus} - verified {plant.lastVerified ?? 'pending'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Media</Text>
          {bundledImages.length > 0 ? (
            bundledImages.map(({ image, source }) => (
              <View
                key={`${plant.id}-${image.originalUrl}`}
                style={styles.mediaBlock}
              >
                <Image
                  source={source}
                  style={styles.image}
                  resizeMode="cover"
                />
                {image.caption ? <Text style={styles.caption}>{image.caption}</Text> : null}
                <Attribution image={image} />
              </View>
            ))
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderTitle}>No approved image bundled yet</Text>
              <Text style={styles.body}>
                This build only shows locally bundled images that are commercially reviewed and conservatively safe
                for a paid app.
              </Text>
              {approvedImages.length > 0 ? (
                <Text style={styles.body}>A reviewed public-domain source is on file, but the local asset is not bundled yet.</Text>
              ) : null}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Field Traits</Text>
          <Text style={styles.body}>Habitats: {formatTraitList(plant.habitats)}</Text>
          <Text style={styles.body}>Flower colors: {formatTraitList(plant.flowerColors)}</Text>
          <Text style={styles.body}>Bloom months: {formatTraitList(plant.bloomMonths)}</Text>
          <Text style={styles.body}>
            Leaf: {plant.leafArrangement}, {plant.leafShape}, {plant.leafMargin}
          </Text>
          <Text style={styles.body}>Stem: {plant.stemType}</Text>
          <Text style={styles.body}>Height: {formatHeightRange(plant.heightRangeInches)}</Text>
          <Text style={styles.body}>Notes: {plant.notes}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fact Provenance</Text>
          <Text style={styles.body}>Referenced fact sources: {formatFactSourceList(plant.factSources)}</Text>
          <Text style={styles.body}>Summary method: {formatFactSummaryMethod(plant.factSummaryMethod)}</Text>
          <Text style={styles.body}>Last verified: {plant.lastVerified ?? 'pending'}</Text>
          {plant.factSourceNotes ? <Text style={styles.body}>Source notes: {plant.factSourceNotes}</Text> : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Media Provenance</Text>
          <Text style={styles.body}>
            Preferred image policy: {preferredImagePolicy}
          </Text>
          <Text style={styles.body}>
            Image sources: {plant.imageSources.length > 0 ? formatImageSourceList(plant.imageSources) : 'none bundled'}
          </Text>
          <Text style={styles.body}>
            The live app only renders reviewed public-domain or CC0 images, with U.S. government public-domain sources
            preferred over other public repositories.
          </Text>
          <Text style={styles.body}>Reviewed bundle candidates: {reviewedCandidates.length}</Text>
          <Text style={styles.body}>Locally bundled images: {bundledImages.length}</Text>
          {reviewedCandidates.map((candidate) => (
            <View key={candidate.id} style={styles.candidate}>
              <Text style={styles.body}>
                Candidate: {formatImageSourceName(candidate.source)} - {candidate.license} - {candidate.reviewStatus}
              </Text>
              {candidate.assetKey ? <Text style={styles.body}>Asset key: {candidate.assetKey}</Text> : null}
              <Text style={styles.body}>Credit line: {candidate.creditLine}</Text>
              {candidate.caption ? <Text style={styles.body}>Caption: {candidate.caption}</Text> : null}
              <Text style={styles.body}>Reviewed: {candidate.reviewedOn}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingBottom: 32,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DED0',
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
  title: {
    color: '#1F3D2F',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  scientificName: {
    color: '#4A5B4D',
    fontSize: 18,
    fontStyle: 'italic',
  },
  meta: {
    color: '#5E6F60',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#1F3D2F',
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    color: '#4A5B4D',
    fontSize: 15,
    lineHeight: 22,
  },
  mediaBlock: {
    gap: 10,
  },
  image: {
    backgroundColor: '#DCE8D8',
    borderRadius: 14,
    height: 220,
    width: '100%',
  },
  caption: {
    color: '#4A5B4D',
    fontSize: 14,
    lineHeight: 20,
  },
  candidate: {
    borderTopColor: '#D7DED0',
    borderTopWidth: 1,
    gap: 6,
    marginTop: 4,
    paddingTop: 12,
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: '#EEF2E8',
    borderRadius: 14,
    gap: 8,
    minHeight: 180,
    justifyContent: 'center',
    padding: 20,
  },
  placeholderTitle: {
    color: '#1F3D2F',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

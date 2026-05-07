import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { licenseCatalog } from '@/data/licenses';
import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';

export function LicensesScreen() {
  const { isDark } = useAppTheme();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={tw`pb-10`}>
        <SectionHeading
          title="Attribution and licenses"
          subtitle="The live app keeps a stricter commercial-safe rule than the broadest legally arguable position."
        />

        <View
          style={[
            tw`mb-6 rounded-card border p-4`,
            isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
          ]}
        >
          <Text style={[tw`text-base font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
            Live display rule
          </Text>
          <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
            By default, only verified Public Domain and CC0 images with complete attribution metadata and commercial-use review are eligible for live commercial-safe display.
          </Text>
        </View>

        <View style={tw`gap-3`}>
          {licenseCatalog.map((license) => (
            <Pressable
              key={license.id}
              onPress={() => void Linking.openURL(license.sourceUrl)}
              style={({ pressed }) => [
                tw`rounded-card border p-4`,
                isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
                pressed && tw`opacity-85`,
              ]}
            >
              <Text style={[tw`text-base font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
                {license.label}
              </Text>
              <Text style={[tw`mt-1 text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
                {license.commercialSafeDefault ? 'Live-safe by default' : 'Reviewed but not default live-safe'}
              </Text>
              <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
                {license.usageNotes}
              </Text>
              <Text style={[tw`mt-3 text-sm font-semibold`, isDark ? tw`text-mist` : tw`text-fern`]}>
                Open license reference
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

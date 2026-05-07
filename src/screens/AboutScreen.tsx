import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeading } from '@/components/SectionHeading';
import { sourceCatalog } from '@/data/sources';
import { useAppTheme } from '@/hooks/useAppTheme';
import tw from '@/theme/tw';

export function AboutScreen() {
  const { isDark } = useAppTheme();
  const factSources = sourceCatalog.filter((entry) => entry.sourceType === 'fact');
  const imageSources = sourceCatalog.filter((entry) => entry.sourceType === 'image');

  const renderSourceGroup = (
    title: string,
    items: typeof sourceCatalog,
  ) => (
    <View style={tw`mb-6`}>
      <Text style={[tw`mb-3 text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
        {title}
      </Text>
      <View style={tw`gap-3`}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => void Linking.openURL(item.policyUrl)}
            style={({ pressed }) => [
              tw`rounded-card border p-4`,
              isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
              pressed && tw`opacity-85`,
            ]}
          >
            <Text style={[tw`text-base font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
              {item.label}
            </Text>
            <Text style={[tw`mt-1 text-xs font-semibold uppercase`, isDark ? tw`text-stone` : tw`text-smoke`]}>
              {item.preferredForCommercialApp ? 'Preferred source family' : 'Reviewed supporting source'}
            </Text>
            <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
              {item.usageNotes}
            </Text>
            <Text style={[tw`mt-3 text-sm font-semibold`, isDark ? tw`text-mist` : tw`text-fern`]}>
              Open policy page
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={tw`pb-10`}>
        <SectionHeading
          title="About and data sources"
          subtitle="This app is built as an offline-first Illinois field guide with conservative factual sourcing and strict media-rights rules."
        />

        <View
          style={[
            tw`mb-6 rounded-card border p-4`,
            isDark ? tw`border-stone bg-pine` : tw`border-stone bg-white`,
          ]}
        >
          <Text style={[tw`text-base font-bold`, isDark ? tw`text-sand` : tw`text-moss`]}>
            Current app posture
          </Text>
          <Text style={[tw`mt-2 text-sm leading-6`, isDark ? tw`text-stone` : tw`text-bark`]}>
            Facts are stored locally in SQLite after validating bundled seed data. The app favors original paraphrases of factual references and only renders reviewed image assets that fit the project&apos;s conservative rights policy.
          </Text>
        </View>

        {renderSourceGroup('Fact sources', factSources)}
        {renderSourceGroup('Image source families', imageSources)}
      </ScrollView>
    </ScreenContainer>
  );
}

import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, Dimensions } from 'react-native';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import type { OnboardingStackScreenProps } from '@navigation/types';
import { useAppTheme } from '@hooks/useAppTheme';

const { width } = Dimensions.get('window');

const slides = [
  {
    title: 'Voice Journaling',
    description: 'Talk through your struggles and wins with unlimited voice entries.',
  },
  {
    title: 'AI Companion',
    description: 'Receive empathetic responses tuned for physical recovery journeys.',
  },
  {
    title: 'Track Progress',
    description: 'See mood, pain, and milestone trends that prove your progress.',
  },
];

export const ValueSlidesScreen = ({ navigation }: OnboardingStackScreenProps<'ValueSlides'>) => {
  const [index, setIndex] = useState(0);
  const { theme } = useAppTheme();

  const progress = useMemo(() => ((index + 1) / slides.length) * 100, [index]);

  return (
    <OnboardingLayout title="Why RecoverVoice?" subtitle="Designed for every phase of recovery">
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={slides}
        keyExtractor={item => item.title}
        onMomentumScrollEnd={event => {
          const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setIndex(nextIndex);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: width - 48 }]}>
            <AppText variant="h2">{item.title}</AppText>
            <AppText style={styles.slideDescription}>{item.description}</AppText>
          </View>
        )}
      />
      <View style={styles.progressWrapper}>
        <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%`, backgroundColor: theme.colors.primary },
            ]}
          />
        </View>
        <PrimaryButton
          label={index === slides.length - 1 ? 'Next' : 'Keep Going'}
          onPress={() => {
            if (index < slides.length - 1) {
              setIndex(prev => prev + 1);
            } else {
              navigation.navigate('SignUp');
            }
          }}
        />
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  progressFill: {
    borderRadius: 999,
    height: 6,
  },
  progressTrack: {
    borderRadius: 999,
    height: 6,
  },
  progressWrapper: {
    gap: 16,
    marginTop: 24,
  },
  slide: {
    gap: 12,
    paddingVertical: 24,
  },
  slideDescription: {
    fontSize: 16,
    opacity: 0.85,
  },
});

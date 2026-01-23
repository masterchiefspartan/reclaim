import { useMemo, useRef, useState } from 'react';
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
  const listRef = useRef<FlatList<(typeof slides)[number]>>(null);

  const progress = useMemo(() => ((index + 1) / slides.length) * 100, [index]);
  const themedStyles = useMemo(
    () =>
      StyleSheet.create({
        dot: {
          backgroundColor: theme.colors.border,
        },
        dotActive: {
          backgroundColor: theme.colors.primary,
        },
        progressFill: {
          backgroundColor: theme.colors.primary,
        },
        progressTrack: {
          backgroundColor: theme.colors.border,
        },
        slideCard: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      }),
    [theme]
  );

  return (
    <OnboardingLayout
      eyebrow="Why it works"
      title="Why RecoverVoice?"
      subtitle="Designed for every phase of recovery"
    >
      <FlatList
        ref={listRef}
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
          <View style={[styles.slide, styles.slideWidth]}>
            <View style={[styles.slideCard, themedStyles.slideCard]}>
              <AppText variant="h2">{item.title}</AppText>
              <AppText style={styles.slideDescription}>{item.description}</AppText>
            </View>
          </View>
        )}
      />
      <View style={styles.progressWrapper}>
        <View style={[styles.progressTrack, themedStyles.progressTrack]}>
          <View
            style={[styles.progressFill, themedStyles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <View style={styles.dots}>
          {slides.map((slide, slideIndex) => (
            <View
              key={slide.title}
              style={[
                styles.dot,
                themedStyles.dot,
                slideIndex === index ? themedStyles.dotActive : null,
              ]}
            />
          ))}
        </View>
        <PrimaryButton
          label={index === slides.length - 1 ? 'Next' : 'Keep Going'}
          onPress={() => {
            if (index < slides.length - 1) {
              const nextIndex = index + 1;
              setIndex(nextIndex);
              listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
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
  dot: {
    borderRadius: 6,
    height: 6,
    width: 6,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
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
  slideCard: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  slideDescription: {
    fontSize: 16,
    opacity: 0.85,
  },
  slideWidth: {
    width: width - 48,
  },
});

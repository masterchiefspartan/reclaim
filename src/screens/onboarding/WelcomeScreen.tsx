import { View, StyleSheet } from 'react-native';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { AppText } from '@components/common/AppText';
import type { OnboardingStackScreenProps } from '@navigation/types';

export const WelcomeScreen = ({ navigation }: OnboardingStackScreenProps<'Welcome'>) => {
  return (
    <OnboardingLayout
      eyebrow="Welcome"
      title="RecoverVoice"
      subtitle="Your AI companion for recovery & resilience"
    >
      <View style={styles.content}>
        <AppText>
          Talk through tough days, celebrate wins, and see your progress with empathetic AI support.
        </AppText>
        <View style={styles.bullets}>
          <AppText>• Gentle daily check-ins</AppText>
          <AppText>• Recovery-specific encouragement</AppText>
          <AppText>• Streaks and progress you can feel</AppText>
        </View>
        <PrimaryButton label="Get Started" onPress={() => navigation.navigate('ValueSlides')} />
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  bullets: {
    gap: 6,
  },
  content: {
    gap: 16,
  },
});

import { View, StyleSheet } from 'react-native';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { AppText } from '@components/common/AppText';
import type { OnboardingStackScreenProps } from '@navigation/types';

export const WelcomeScreen = ({ navigation }: OnboardingStackScreenProps<'Welcome'>) => {
  return (
    <OnboardingLayout title="RecoverVoice" subtitle="Your AI companion for recovery & resilience">
      <View style={styles.content}>
        <AppText>
          Talk through tough days, celebrate wins, and see your progress with empathetic AI support.
        </AppText>
        <PrimaryButton label="Get Started" onPress={() => navigation.navigate('ValueSlides')} />
      </View>
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
});

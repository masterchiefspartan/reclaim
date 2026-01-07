import { PropsWithChildren } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';

interface OnboardingLayoutProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
}

export const OnboardingLayout = ({ title, subtitle, children }: OnboardingLayoutProps) => {
  return (
    <ScreenContainer scrollable testID="onboarding-layout">
      <View style={styles.hero}>
        <ImageBackground
          source={require('../../../assets/splash-icon.png')}
          resizeMode="contain"
          style={styles.heroImage}
          imageStyle={{ opacity: 0.12 }}
        >
          <AppText variant="h1" style={styles.title}>
            {title}
          </AppText>
          {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
        </ImageBackground>
      </View>
      <View style={styles.content}>{children}</View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  hero: {
    marginBottom: 16,
  },
  heroImage: {
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.8,
  },
  content: {
    gap: 16,
  },
});

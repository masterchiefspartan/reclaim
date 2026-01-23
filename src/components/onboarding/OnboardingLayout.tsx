import { PropsWithChildren } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

import { ScreenContainer } from '@components/common/ScreenContainer';
import { AppText } from '@components/common/AppText';
import { useAppTheme } from '@hooks/useAppTheme';

interface OnboardingLayoutProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}

export const OnboardingLayout = ({ title, subtitle, eyebrow, children }: OnboardingLayoutProps) => {
  const { theme } = useAppTheme();
  return (
    <ScreenContainer scrollable testID="onboarding-layout">
      <View
        style={[
          styles.hero,
          { backgroundColor: theme.colors.muted, borderColor: theme.colors.border },
        ]}
      >
        <View
          style={[
            styles.heroBadge,
            { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
          ]}
        >
          <AppText variant="caption" style={styles.badgeText} color={theme.colors.textSecondary}>
            {eyebrow ?? 'Recovery Companion'}
          </AppText>
        </View>
        <ImageBackground
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          source={require('../../../assets/splash-icon.png')}
          resizeMode="contain"
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <AppText variant="h1" style={styles.title} color={theme.colors.text}>
            {title}
          </AppText>
          {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
        </ImageBackground>
      </View>
      <View
        style={[
          styles.contentCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <View style={styles.content}>{children}</View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  badgeText: {
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  content: {
    gap: 16,
  },
  contentCard: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
  },
  hero: {
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  heroImage: {
    paddingVertical: 8,
  },
  heroImageStyle: {
    opacity: 0.16,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.8,
  },
  title: {
    letterSpacing: 0.2,
  },
});

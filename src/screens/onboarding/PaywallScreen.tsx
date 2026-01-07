import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import type { OnboardingStackScreenProps } from '@navigation/types';
import type { SubscriptionPlan } from '@/types/user';
import { useAppTheme } from '@hooks/useAppTheme';

const PLAN_COPY: Record<SubscriptionPlan, { title: string; price: string; description: string }> = {
  monthly: {
    title: 'Monthly',
    price: '$9.99/mo',
    description: 'Cancel anytime. Great for trying the full experience.',
  },
  annual: {
    title: 'Annual',
    price: '$59.99/yr',
    description: 'Save 40% and commit to your full recovery journey.',
  },
  trial: {
    title: '7-Day Trial',
    price: 'Free for 7 days',
    description: 'Full access. Cancel before the trial ends to avoid charges.',
  },
};

export const PaywallScreen = ({ navigation }: OnboardingStackScreenProps<'Paywall'>) => {
  const [plan, setPlan] = useState<SubscriptionPlan>('trial');
  const { theme } = useAppTheme();

  const cards = useMemo(() => Object.entries(PLAN_COPY), []);

  return (
    <OnboardingLayout
      title="Recovery is hard. You shouldn’t do it alone."
      subtitle="Choose your membership plan."
    >
      <View style={styles.cards}>
        {cards.map(([key, value]) => {
          const typedPlan = key as SubscriptionPlan;
          const isSelected = plan === typedPlan;
          return (
            <Pressable
              key={typedPlan}
              accessibilityRole="button"
              onPress={() => setPlan(typedPlan)}
              style={[
                styles.card,
                {
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  backgroundColor: theme.colors.surface,
                },
              ]}
            >
              <AppText variant="h3">{value.title}</AppText>
              <AppText variant="h2">{value.price}</AppText>
              <AppText style={styles.cardDescription}>{value.description}</AppText>
              {isSelected ? (
                <AppText style={[styles.badge, { color: theme.colors.primary }]}>Selected</AppText>
              ) : null}
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton
        label="Continue"
        onPress={() => navigation.navigate('ProfileSetup', { plan })}
      />
    </OnboardingLayout>
  );
};

const styles = StyleSheet.create({
  cards: {
    gap: 16,
  },
  card: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardDescription: {
    opacity: 0.8,
  },
  badge: {
    fontWeight: '600',
  },
});

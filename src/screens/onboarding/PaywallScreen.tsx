/**
 * PaywallScreen — Apple Glass Aesthetic
 * =======================================
 * Custom paywall with glass cards, product selection,
 * and transformation-focused copy.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { AppText } from '@components/common/AppText';
import { GlassCard } from '@components/common/GlassCard';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { LoadingState } from '@components/common/LoadingState';
import { useSubscription } from '@hooks/useSubscription';
import { useAppTheme } from '@hooks/useAppTheme';
import { logger } from '@utils/logger';
import type { OnboardingStackScreenProps } from '@navigation/types';
import type { DisplayProduct } from '@/types/subscription';

export const PaywallScreen = ({ navigation }: OnboardingStackScreenProps<'Paywall'>) => {
  const { theme } = useAppTheme();
  const { isInitialized, isLoading, error, products, isSubscribed, purchase, restore } =
    useSubscription();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DisplayProduct | null>(null);

  // Auto-select recommended product
  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      const recommended = products.find(p => p.isRecommended) || products[0];
      setSelectedProduct(recommended);
    }
  }, [products, selectedProduct]);

  // If already subscribed, navigate forward
  useEffect(() => {
    if (isSubscribed && !isPurchasing) {
      navigation.navigate('ProfileSetup', { plan: 'monthly' });
    }
  }, [isSubscribed, isPurchasing, navigation]);

  // Handle purchase
  const handlePurchase = useCallback(async () => {
    if (!selectedProduct) return;

    setIsPurchasing(true);

    try {
      const result = await purchase(selectedProduct);

      if (result.success) {
        logger.info('Paywall: Purchase successful');
        navigation.navigate('ProfileSetup', { plan: 'monthly' });
      } else if (result.error && !result.userCancelled) {
        Alert.alert('Purchase Failed', result.error, [{ text: 'OK' }]);
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  }, [selectedProduct, purchase, navigation]);

  // Handle restore
  const handleRestore = useCallback(async () => {
    setIsPurchasing(true);

    try {
      const result = await restore();

      if (result.success && result.hasActiveEntitlements) {
        navigation.navigate('ProfileSetup', { plan: 'monthly' });
      }
    } catch {
      // Error handled in restore()
    } finally {
      setIsPurchasing(false);
    }
  }, [restore, navigation]);

  // Button label
  const buttonLabel = useMemo(() => {
    if (!selectedProduct) return 'Continue';
    return `Start Subscription — ${selectedProduct.price}`;
  }, [selectedProduct]);

  // Loading state
  if (!isInitialized || (isLoading && products.length === 0)) {
    return (
      <OnboardingLayout
        eyebrow="Membership"
        title="Loading..."
        subtitle="Please wait while we load subscription options."
      >
        <LoadingState message="Loading subscription options..." />
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout
      eyebrow="Science-Backed Support"
      title="Your Mental Recovery Companion"
      subtitle="Research shows emotional support can improve recovery outcomes by 25%"
    >
      {/* Error */}
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: theme.colors.fillQuaternary }]}>
          <AppText color={theme.colors.error} variant="footnote">
            {error}
          </AppText>
        </View>
      )}

      {/* Science Badge */}
      <View style={[styles.scienceBadge, { backgroundColor: theme.colors.primarySubtle }]}>
        <Feather name="award" size={14} color={theme.colors.primary} />
        <AppText variant="caption1" color={theme.colors.primary} style={styles.scienceText}>
          Based on 30+ years of expressive writing research
        </AppText>
      </View>

      {/* Product Cards */}
      {products.length > 0 && (
        <View style={styles.products}>
          {products.map(product => (
            <ProductCard
              key={product.identifier}
              product={product}
              isSelected={selectedProduct?.identifier === product.identifier}
              onSelect={() => setSelectedProduct(product)}
              disabled={isPurchasing}
              theme={theme}
            />
          ))}
        </View>
      )}

      {/* Transformation Features */}
      <View style={styles.features}>
        <TransformFeature
          beforeText="Struggling alone with recovery anxiety"
          afterText="Daily support that actually understands"
          theme={theme}
        />
        <TransformFeature
          beforeText="Progress feels invisible day-to-day"
          afterText="AI tracks patterns you can't see yourself"
          theme={theme}
        />
        <TransformFeature
          beforeText="Recovery taking longer than expected"
          afterText="Week-by-week proof of your progress"
          theme={theme}
        />
      </View>

      {/* Stats */}
      <GlassCard style={styles.statsCard} blurEnabled={false}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <AppText variant="title2" color={theme.colors.primary}>
              85%
            </AppText>
            <AppText variant="caption2" color={theme.colors.textTertiary} style={styles.statLabel}>
              report better{'\n'}mental health
            </AppText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.statItem}>
            <AppText variant="title2" color={theme.colors.primary}>
              40%
            </AppText>
            <AppText variant="caption2" color={theme.colors.textTertiary} style={styles.statLabel}>
              better PT{'\n'}adherence
            </AppText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.divider }]} />
          <View style={styles.statItem}>
            <AppText variant="title2" color={theme.colors.primary}>
              3x
            </AppText>
            <AppText variant="caption2" color={theme.colors.textTertiary} style={styles.statLabel}>
              faster than{'\n'}typing
            </AppText>
          </View>
        </View>
      </GlassCard>

      {/* Purchase Button */}
      <PrimaryButton
        label={buttonLabel}
        onPress={handlePurchase}
        isLoading={isPurchasing}
        disabled={isPurchasing || !selectedProduct}
      />

      {/* Restore */}
      <Pressable
        onPress={handleRestore}
        disabled={isPurchasing}
        style={styles.restoreButton}
        accessibilityRole="button"
        accessibilityLabel="Restore Purchases"
      >
        <AppText variant="footnote" color={theme.colors.primary}>
          Restore Purchases
        </AppText>
      </Pressable>

      {/* Legal */}
      <AppText variant="caption2" color={theme.colors.textMuted} style={styles.legalText}>
        Re:Claim is not a substitute for professional medical care. Subscriptions auto-renew unless
        cancelled 24 hours before period end.
      </AppText>
    </OnboardingLayout>
  );
};

// ============================================
// Sub-Components
// ============================================

interface ProductCardProps {
  product: DisplayProduct;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const ProductCard = ({ product, isSelected, onSelect, disabled, theme }: ProductCardProps) => (
  <Pressable
    onPress={onSelect}
    disabled={disabled}
    style={({ pressed }) => [
      styles.productCard,
      {
        backgroundColor: isSelected ? theme.colors.primarySubtle : theme.colors.surface,
        borderColor: isSelected ? theme.colors.primary : theme.colors.border,
        opacity: disabled ? 0.6 : 1,
      },
      pressed && !disabled && { opacity: 0.85 },
    ]}
    accessibilityRole="radio"
    accessibilityState={{ selected: isSelected }}
  >
    {/* Badge */}
    {product.badge && (
      <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
        <AppText style={styles.badgeText} color="#FFFFFF">
          {product.badge}
        </AppText>
      </View>
    )}

    {/* Content */}
    <View style={styles.productContent}>
      <AppText variant="headline" color={theme.colors.text}>
        {product.title}
      </AppText>
      <AppText variant="title2" color={theme.colors.text}>
        {product.price}
      </AppText>
      {product.pricePerMonth && (
        <AppText variant="caption1" color={theme.colors.textTertiary}>
          {product.pricePerMonth}
        </AppText>
      )}
      <AppText
        variant="caption1"
        color={theme.colors.textSecondary}
        style={styles.productDescription}
      >
        {product.description}
      </AppText>
    </View>

    {/* Selection */}
    <View style={styles.selectionIndicator}>
      {isSelected ? (
        <View style={[styles.checkmark, { backgroundColor: theme.colors.primary }]}>
          <Feather name="check" size={14} color="#FFFFFF" />
        </View>
      ) : (
        <View style={[styles.radioOuter, { borderColor: theme.colors.border }]} />
      )}
    </View>
  </Pressable>
);

interface TransformFeatureProps {
  beforeText: string;
  afterText: string;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const TransformFeature = ({ beforeText, afterText, theme }: TransformFeatureProps) => (
  <View style={styles.transformItem}>
    <View style={styles.transformBefore}>
      <Feather name="x" size={14} color={theme.colors.error} />
      <AppText
        variant="footnote"
        color={theme.colors.textTertiary}
        style={styles.transformBeforeText}
      >
        {beforeText}
      </AppText>
    </View>
    <View style={styles.transformAfter}>
      <Feather name="check" size={14} color={theme.colors.success} />
      <AppText variant="subheadline" color={theme.colors.text} style={styles.transformAfterText}>
        {afterText}
      </AppText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    position: 'absolute',
    right: 12,
    top: -10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  checkmark: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  errorContainer: {
    borderRadius: 10,
    marginBottom: 8,
    padding: 12,
  },
  features: {
    gap: 14,
  },
  legalText: {
    lineHeight: 15,
    textAlign: 'center',
  },
  productCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  productContent: {
    flex: 1,
    gap: 2,
  },
  productDescription: {
    marginTop: 4,
  },
  products: {
    gap: 12,
  },
  radioOuter: {
    borderRadius: 12,
    borderWidth: 1.5,
    height: 24,
    width: 24,
  },
  restoreButton: {
    alignSelf: 'center',
    padding: 8,
  },
  scienceBadge: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  scienceText: {
    fontWeight: '500',
  },
  selectionIndicator: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  statDivider: {
    height: 36,
    width: 0.5,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    marginTop: 4,
    textAlign: 'center',
  },
  statsCard: {
    padding: 16,
  },
  statsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  transformAfter: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginLeft: 22,
  },
  transformAfterText: {
    flex: 1,
    fontWeight: '500',
  },
  transformBefore: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  transformBeforeText: {
    flex: 1,
    textDecorationLine: 'line-through',
  },
  transformItem: {
    gap: 4,
  },
});

/**
 * Paywall Screen
 *
 * Displays subscription options using RevenueCat's paywall UI.
 * Falls back to custom UI if RevenueCat paywall is unavailable.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

import { OnboardingLayout } from '@components/onboarding/OnboardingLayout';
import { AppText } from '@components/common/AppText';
import { PrimaryButton } from '@components/common/PrimaryButton';
import { LoadingState } from '@components/common/LoadingState';
import { useSubscription } from '@hooks/useSubscription';
import { useAppTheme } from '@hooks/useAppTheme';
import { logger } from '@utils/logger';
import type { OnboardingStackScreenProps } from '@navigation/types';
import type { DisplayProduct } from '@/types/subscription';

// Whether to use RevenueCat's native paywall UI
const USE_REVENUECAT_PAYWALL = true;

export const PaywallScreen = ({ navigation }: OnboardingStackScreenProps<'Paywall'>) => {
  const { theme } = useAppTheme();
  const { isInitialized, isLoading, error, products, isSubscribed, purchase, restore } =
    useSubscription();

  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<DisplayProduct | null>(null);
  const [showingPaywall, setShowingPaywall] = useState(false);

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

  // Present RevenueCat Paywall
  const presentRevenueCatPaywall = useCallback(async () => {
    setShowingPaywall(true);

    try {
      const result = await RevenueCatUI.presentPaywall();

      switch (result) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          logger.info('Paywall: Purchase/Restore successful');
          navigation.navigate('ProfileSetup', { plan: 'monthly' });
          break;
        case PAYWALL_RESULT.CANCELLED:
          logger.info('Paywall: User cancelled');
          break;
        case PAYWALL_RESULT.ERROR:
          logger.error('Paywall: Error occurred');
          Alert.alert('Error', 'Something went wrong. Please try again.');
          break;
      }
    } catch (err) {
      logger.error('Failed to present paywall', { error: err });
      Alert.alert('Error', 'Unable to load subscription options. Please try again.');
    } finally {
      setShowingPaywall(false);
    }
  }, [navigation]);

  // Handle custom purchase
  const handleCustomPurchase = useCallback(async () => {
    if (!selectedProduct) return;

    setIsPurchasing(true);

    try {
      const result = await purchase(selectedProduct);

      if (result.success) {
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

  // Get button label
  const buttonLabel = useMemo(() => {
    if (!selectedProduct) return 'Continue';

    if (selectedProduct.packageType === 'LIFETIME') {
      return `Get Lifetime Access - ${selectedProduct.price}`;
    }

    return `Start Subscription - ${selectedProduct.price}`;
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

  // RevenueCat Paywall Mode
  if (USE_REVENUECAT_PAYWALL) {
    return (
      <OnboardingLayout
        eyebrow="Membership"
        title="Unlock Your Recovery Journey"
        subtitle="Get unlimited access to all features with Re:Claim Pro."
      >
        <View style={styles.rcPaywallContainer}>
          {/* Features List */}
          <View style={styles.features}>
            <FeatureItem icon="mic" text="Unlimited voice journaling" theme={theme} />
            <FeatureItem icon="message-circle" text="AI-powered conversations" theme={theme} />
            <FeatureItem icon="trending-up" text="Progress tracking & insights" theme={theme} />
            <FeatureItem icon="heart" text="Personalized recovery support" theme={theme} />
          </View>

          {/* Present Paywall Button */}
          <PrimaryButton
            label="View Subscription Options"
            onPress={presentRevenueCatPaywall}
            isLoading={showingPaywall}
            disabled={showingPaywall}
          />

          {/* Restore Link */}
          <Pressable
            onPress={handleRestore}
            disabled={isPurchasing || showingPaywall}
            style={styles.restoreButton}
          >
            <AppText variant="caption" color={theme.colors.primary}>
              Restore Purchases
            </AppText>
          </Pressable>

          {/* Legal */}
          <AppText variant="caption" color={theme.colors.textSecondary} style={styles.legalText}>
            Subscriptions auto-renew unless cancelled at least 24 hours before the end of the
            current period.
          </AppText>
        </View>
      </OnboardingLayout>
    );
  }

  // Custom Paywall Mode (fallback)
  return (
    <OnboardingLayout
      eyebrow="Membership"
      title="Unlock Your Recovery Journey"
      subtitle="Choose the plan that fits your needs."
    >
      {/* Error Display */}
      {error && (
        <View style={[styles.errorContainer, { backgroundColor: `${theme.colors.error}15` }]}>
          <AppText color={theme.colors.error} variant="caption">
            {error}
          </AppText>
        </View>
      )}

      {/* Product Cards */}
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

      {/* Features */}
      <View style={styles.features}>
        <AppText variant="caption" color={theme.colors.textSecondary} style={styles.featuresTitle}>
          Included in Re:Claim Pro:
        </AppText>
        <FeatureItem icon="mic" text="Unlimited voice journaling" theme={theme} />
        <FeatureItem icon="message-circle" text="AI-powered conversations" theme={theme} />
        <FeatureItem icon="trending-up" text="Progress tracking & insights" theme={theme} />
        <FeatureItem icon="heart" text="Personalized recovery support" theme={theme} />
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <PrimaryButton
          label={buttonLabel}
          onPress={handleCustomPurchase}
          isLoading={isPurchasing}
          disabled={isPurchasing || !selectedProduct}
        />

        <Pressable onPress={handleRestore} disabled={isPurchasing} style={styles.restoreButton}>
          <AppText variant="caption" color={theme.colors.primary}>
            Restore Purchases
          </AppText>
        </Pressable>
      </View>

      {/* Legal */}
      <AppText variant="caption" color={theme.colors.textSecondary} style={styles.legalText}>
        By subscribing, you agree to our Terms of Service and Privacy Policy. Subscriptions
        auto-renew unless cancelled at least 24 hours before the end of the current period.
      </AppText>
    </OnboardingLayout>
  );
};

// Product Card Component
interface ProductCardProps {
  product: DisplayProduct;
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
  disabled,
  theme,
}) => {
  return (
    <Pressable
      onPress={onSelect}
      disabled={disabled}
      style={[
        styles.productCard,
        {
          backgroundColor: theme.colors.surface,
          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
    >
      {/* Badge */}
      {product.badge && (
        <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
          <AppText style={styles.badgeText} color={theme.colors.surface}>
            {product.badge}
          </AppText>
        </View>
      )}

      {/* Content */}
      <View style={styles.productContent}>
        <AppText variant="h3">{product.title}</AppText>
        <AppText variant="h2" style={styles.price}>
          {product.price}
        </AppText>
        {product.pricePerMonth && (
          <AppText variant="caption" color={theme.colors.textSecondary}>
            {product.pricePerMonth}
          </AppText>
        )}
        <AppText
          variant="caption"
          color={theme.colors.textSecondary}
          style={styles.productDescription}
        >
          {product.description}
        </AppText>
      </View>

      {/* Selection Indicator */}
      <View style={styles.selectionIndicator}>
        {isSelected ? (
          <View style={[styles.checkmark, { backgroundColor: theme.colors.primary }]}>
            <Feather name="check" size={16} color={theme.colors.surface} />
          </View>
        ) : (
          <View style={[styles.radioOuter, { borderColor: theme.colors.border }]} />
        )}
      </View>
    </Pressable>
  );
};

// Feature Item Component
interface FeatureItemProps {
  icon: keyof typeof Feather.glyphMap;
  text: string;
  theme: ReturnType<typeof useAppTheme>['theme'];
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text, theme }) => (
  <View style={styles.featureItem}>
    <View style={[styles.featureIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
      <Feather name={icon} size={16} color={theme.colors.primary} />
    </View>
    <AppText variant="body" style={styles.featureText}>
      {text}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  errorContainer: {
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  featureIcon: {
    alignItems: 'center',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  featureItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  featureText: {
    flex: 1,
  },
  features: {
    gap: 12,
  },
  featuresTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  legalText: {
    lineHeight: 16,
    textAlign: 'center',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
  },
  productCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  productContent: {
    flex: 1,
    gap: 2,
  },
  productDescription: {
    lineHeight: 18,
    marginTop: 4,
  },
  products: {
    gap: 12,
  },
  radioOuter: {
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    width: 24,
  },
  rcPaywallContainer: {
    gap: 24,
  },
  restoreButton: {
    padding: 8,
  },
  selectionIndicator: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
});

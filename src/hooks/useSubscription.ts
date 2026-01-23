/**
 * useSubscription Hook
 *
 * Provides a simplified interface for subscription state and actions.
 * Wraps the RevenueCat provider for ease of use in components.
 */

import { useCallback } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';

import { useRevenueCat } from '@providers/RevenueCatProvider';
import { getManagementURL } from '@services/subscription/revenueCatService';
import { logger } from '@utils/logger';
import type { PurchaseResult, RestoreResult, DisplayProduct } from '@/types/subscription';

interface UseSubscriptionReturn {
  /** Whether user has active subscription */
  isSubscribed: boolean;
  /** Whether user is in trial period */
  isTrialing: boolean;
  /** Current subscription status */
  status: string;
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether RevenueCat is initialized */
  isInitialized: boolean;
  /** Error message if any */
  error: string | null;
  /** Expiration date of current subscription */
  expirationDate: Date | null;
  /** Whether subscription will auto-renew */
  willRenew: boolean;
  /** Available products for purchase */
  products: DisplayProduct[];
  /** Purchase a product */
  purchase: (product: DisplayProduct) => Promise<PurchaseResult>;
  /** Purchase a package directly */
  purchasePackage: (pkg: PurchasesPackage) => Promise<PurchaseResult>;
  /** Restore previous purchases */
  restore: () => Promise<RestoreResult>;
  /** Refresh subscription data */
  refresh: () => Promise<void>;
  /** Open subscription management (App Store / Play Store) */
  openManagement: () => Promise<void>;
}

export const useSubscription = (): UseSubscriptionReturn => {
  const {
    isInitialized,
    isLoading,
    error,
    subscriptionState,
    currentOffering,
    purchase: rcPurchase,
    restore: rcRestore,
    refresh,
  } = useRevenueCat();

  // Get products from current offering
  const products = currentOffering?.packages || [];

  // Purchase a display product
  const purchase = useCallback(
    async (product: DisplayProduct): Promise<PurchaseResult> => {
      return rcPurchase(product.rcPackage);
    },
    [rcPurchase]
  );

  // Purchase a package directly
  const purchasePackage = useCallback(
    async (pkg: PurchasesPackage): Promise<PurchaseResult> => {
      return rcPurchase(pkg);
    },
    [rcPurchase]
  );

  // Restore with user feedback
  const restore = useCallback(async (): Promise<RestoreResult> => {
    const result = await rcRestore();

    if (result.success) {
      if (result.hasActiveEntitlements) {
        Alert.alert('Purchases Restored', 'Your subscription has been restored successfully.', [
          { text: 'OK' },
        ]);
      } else {
        Alert.alert(
          'No Active Subscriptions',
          'No active subscriptions were found for your account.',
          [{ text: 'OK' }]
        );
      }
    } else if (result.error) {
      Alert.alert('Restore Failed', result.error, [{ text: 'OK' }]);
    }

    return result;
  }, [rcRestore]);

  // Open subscription management
  const openManagement = useCallback(async () => {
    try {
      const managementURL = await getManagementURL();

      if (managementURL) {
        await Linking.openURL(managementURL);
      } else {
        // Fallback to store subscription settings
        const storeURL = Platform.select({
          ios: 'https://apps.apple.com/account/subscriptions',
          android: 'https://play.google.com/store/account/subscriptions',
          default: null,
        });

        if (storeURL) {
          await Linking.openURL(storeURL);
        } else {
          Alert.alert(
            'Manage Subscription',
            'Please visit the App Store or Play Store to manage your subscription.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (err) {
      logger.error('Failed to open subscription management', { error: err });
      Alert.alert('Error', 'Unable to open subscription management. Please try again.', [
        { text: 'OK' },
      ]);
    }
  }, []);

  return {
    isSubscribed: subscriptionState.isSubscribed,
    isTrialing: subscriptionState.isTrialing,
    status: subscriptionState.status,
    isLoading,
    isInitialized,
    error,
    expirationDate: subscriptionState.expirationDate,
    willRenew: subscriptionState.willRenew,
    products,
    purchase,
    purchasePackage,
    restore,
    refresh,
    openManagement,
  };
};

/**
 * Hook to check if user has pro access
 * Simpler hook when you just need to gate features
 */
export const useProAccess = (): {
  hasAccess: boolean;
  isLoading: boolean;
} => {
  const { subscriptionState, isLoading } = useRevenueCat();

  return {
    hasAccess: subscriptionState.isSubscribed,
    isLoading,
  };
};

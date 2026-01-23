/**
 * RevenueCat Provider
 *
 * Provides RevenueCat state and methods throughout the app.
 * Handles initialization, customer info updates, and user identification.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { CustomerInfo, PurchasesPackage } from 'react-native-purchases';

import {
  initializeRevenueCat,
  isRevenueCatInitialized,
  getCustomerInfo,
  parseCustomerInfo,
  getDisplayOffering,
  purchasePackage,
  restorePurchases,
  identifyUser,
  logoutUser,
  setUserAttributes,
  addCustomerInfoUpdateListener,
} from '@services/subscription/revenueCatService';
import { useAuth } from '@hooks/useAuth';
import { logger } from '@utils/logger';
import type {
  SubscriptionState,
  DisplayOffering,
  PurchaseResult,
  RestoreResult,
} from '@/types/subscription';

// Default subscription state
const defaultSubscriptionState: SubscriptionState = {
  isSubscribed: false,
  isTrialing: false,
  status: 'none',
  activeEntitlement: null,
  expirationDate: null,
  activeProductId: null,
  willRenew: false,
  customerInfo: null,
};

interface RevenueCatContextValue {
  /** Whether RevenueCat SDK is initialized */
  isInitialized: boolean;
  /** Whether data is being loaded */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Current subscription state */
  subscriptionState: SubscriptionState;
  /** Available offerings for purchase */
  currentOffering: DisplayOffering | null;
  /** Purchase a package */
  purchase: (pkg: PurchasesPackage) => Promise<PurchaseResult>;
  /** Restore previous purchases */
  restore: () => Promise<RestoreResult>;
  /** Refresh subscription state */
  refresh: () => Promise<void>;
  /** Refresh offerings */
  refreshOfferings: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextValue | null>(null);

interface RevenueCatProviderProps {
  children: ReactNode;
}

export const RevenueCatProvider: React.FC<RevenueCatProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionState, setSubscriptionState] =
    useState<SubscriptionState>(defaultSubscriptionState);
  const [currentOffering, setCurrentOffering] = useState<DisplayOffering | null>(null);

  // Initialize RevenueCat SDK
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (isRevenueCatInitialized()) {
        setIsInitialized(true);
        return;
      }

      try {
        await initializeRevenueCat();
        if (mounted) {
          setIsInitialized(true);
          setError(null);
        }
      } catch (err) {
        logger.error('RevenueCat initialization failed', { error: err });
        if (mounted) {
          setError('Failed to initialize subscription service');
          setIsInitialized(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  // Identify user when authenticated
  useEffect(() => {
    if (!isInitialized) return;

    const handleUserChange = async () => {
      setIsLoading(true);

      try {
        if (user?.uid) {
          // Identify user with RevenueCat
          const customerInfo = await identifyUser(user.uid);
          setSubscriptionState(parseCustomerInfo(customerInfo));

          // Set user attributes
          if (user.email) {
            await setUserAttributes({
              email: user.email,
              displayName: user.displayName || undefined,
            });
          }
        } else {
          // User logged out - reset to anonymous
          await logoutUser();
          setSubscriptionState(defaultSubscriptionState);
        }
      } catch (userChangeErr) {
        logger.error('Failed to handle user change', { error: userChangeErr });
        // Don't set error state for user change failures - subscription may still work
      } finally {
        setIsLoading(false);
      }
    };

    handleUserChange();
  }, [isInitialized, user?.uid, user?.email, user?.displayName]);

  // Listen for customer info updates
  useEffect(() => {
    if (!isInitialized) return;

    const unsubscribe = addCustomerInfoUpdateListener((customerInfo: CustomerInfo) => {
      logger.info('Customer info updated');
      setSubscriptionState(parseCustomerInfo(customerInfo));
    });

    return unsubscribe;
  }, [isInitialized]);

  // Fetch offerings when initialized
  useEffect(() => {
    if (!isInitialized) return;

    const fetchOfferings = async () => {
      try {
        const offering = await getDisplayOffering();
        setCurrentOffering(offering);
      } catch (err) {
        logger.error('Failed to fetch offerings', { error: err });
      }
    };

    fetchOfferings();
  }, [isInitialized]);

  // Purchase handler
  const purchase = useCallback(async (pkg: PurchasesPackage): Promise<PurchaseResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await purchasePackage(pkg);

      if (result.success && result.customerInfo) {
        setSubscriptionState(parseCustomerInfo(result.customerInfo));
      } else if (result.error && !result.userCancelled) {
        setError(result.error);
      }

      return result;
    } catch {
      const errorMsg = 'An unexpected error occurred during purchase';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore handler
  const restore = useCallback(async (): Promise<RestoreResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await restorePurchases();

      if (result.success && result.customerInfo) {
        setSubscriptionState(parseCustomerInfo(result.customerInfo));
      } else if (result.error) {
        setError(result.error);
      }

      return result;
    } catch {
      const errorMsg = 'An unexpected error occurred during restore';
      setError(errorMsg);
      return { success: false, error: errorMsg, hasActiveEntitlements: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh subscription state
  const refresh = useCallback(async () => {
    if (!isInitialized) return;

    setIsLoading(true);

    try {
      const customerInfo = await getCustomerInfo();
      setSubscriptionState(parseCustomerInfo(customerInfo));
      setError(null);
    } catch (err) {
      logger.error('Failed to refresh subscription state', { error: err });
      setError('Failed to refresh subscription status');
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Refresh offerings
  const refreshOfferings = useCallback(async () => {
    if (!isInitialized) return;

    try {
      const offering = await getDisplayOffering();
      setCurrentOffering(offering);
    } catch (offeringsErr) {
      logger.error('Failed to refresh offerings', { error: offeringsErr });
    }
  }, [isInitialized]);

  const contextValue = useMemo<RevenueCatContextValue>(
    () => ({
      isInitialized,
      isLoading,
      error,
      subscriptionState,
      currentOffering,
      purchase,
      restore,
      refresh,
      refreshOfferings,
    }),
    [
      isInitialized,
      isLoading,
      error,
      subscriptionState,
      currentOffering,
      purchase,
      restore,
      refresh,
      refreshOfferings,
    ]
  );

  return <RevenueCatContext.Provider value={contextValue}>{children}</RevenueCatContext.Provider>;
};

/**
 * Hook to access RevenueCat context
 */
export const useRevenueCat = (): RevenueCatContextValue => {
  const context = useContext(RevenueCatContext);

  if (!context) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }

  return context;
};

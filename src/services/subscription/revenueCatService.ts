/**
 * RevenueCat Service
 *
 * Handles all RevenueCat SDK interactions including:
 * - SDK initialization
 * - Customer info management
 * - Purchases and restores
 * - Entitlement checking
 * - Offering/product retrieval
 */

import Purchases, {
  LOG_LEVEL,
  CustomerInfo,
  PurchasesOffering,
  PurchasesPackage,
  PURCHASES_ERROR_CODE,
  PurchasesError,
} from 'react-native-purchases';

import { REVENUECAT_CONFIG, PRODUCT_DISPLAY_INFO } from '@config/revenuecat';
import { logger } from '@utils/logger';
import type {
  SubscriptionState,
  SubscriptionStatus,
  DisplayProduct,
  DisplayOffering,
  PurchaseResult,
  RestoreResult,
} from '@/types/subscription';

// Track initialization state
let isInitialized = false;

/**
 * Initialize RevenueCat SDK
 * Should be called once at app startup
 */
export async function initializeRevenueCat(): Promise<void> {
  if (isInitialized) {
    logger.warn('RevenueCat already initialized');
    return;
  }

  try {
    // Set log level based on environment
    if (REVENUECAT_CONFIG.debugLogsEnabled) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    // Configure the SDK
    await Purchases.configure({
      apiKey: REVENUECAT_CONFIG.apiKey,
    });

    isInitialized = true;
    logger.info('RevenueCat initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize RevenueCat', { error });
    throw error;
  }
}

/**
 * Check if RevenueCat is initialized
 */
export function isRevenueCatInitialized(): boolean {
  return isInitialized;
}

/**
 * Get current customer info from RevenueCat
 */
export async function getCustomerInfo(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    logger.error('Failed to get customer info', { error });
    throw error;
  }
}

/**
 * Parse CustomerInfo into our SubscriptionState
 */
export function parseCustomerInfo(customerInfo: CustomerInfo): SubscriptionState {
  const entitlement = customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlementId];

  if (!entitlement) {
    return {
      isSubscribed: false,
      isTrialing: false,
      status: 'none',
      activeEntitlement: null,
      expirationDate: null,
      activeProductId: null,
      willRenew: false,
      customerInfo,
    };
  }

  // Determine subscription status
  let status: SubscriptionStatus = 'active';

  if (entitlement.periodType === 'TRIAL') {
    status = 'trialing';
  } else if (entitlement.willRenew === false && entitlement.expirationDate) {
    status = 'canceled';
  }

  // Check for grace period or billing issues
  if (customerInfo.entitlements.all[REVENUECAT_CONFIG.entitlementId]?.billingIssueDetectedAt) {
    status = 'grace_period';
  }

  return {
    isSubscribed: true,
    isTrialing: entitlement.periodType === 'TRIAL',
    status,
    activeEntitlement: REVENUECAT_CONFIG.entitlementId,
    expirationDate: entitlement.expirationDate ? new Date(entitlement.expirationDate) : null,
    activeProductId: entitlement.productIdentifier,
    willRenew: entitlement.willRenew,
    customerInfo,
  };
}

/**
 * Get subscription state for current user
 */
export async function getSubscriptionState(): Promise<SubscriptionState> {
  try {
    const customerInfo = await getCustomerInfo();
    return parseCustomerInfo(customerInfo);
  } catch (error) {
    logger.error('Failed to get subscription state', { error });
    return {
      isSubscribed: false,
      isTrialing: false,
      status: 'none',
      activeEntitlement: null,
      expirationDate: null,
      activeProductId: null,
      willRenew: false,
      customerInfo: null,
    };
  }
}

/**
 * Check if user has active entitlement (Pro access)
 */
export async function hasProAccess(): Promise<boolean> {
  try {
    const customerInfo = await getCustomerInfo();
    return !!customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlementId];
  } catch (error) {
    logger.error('Failed to check pro access', { error });
    return false;
  }
}

/**
 * Get available offerings/packages
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    logger.error('Failed to get offerings', { error });
    return null;
  }
}

/**
 * Convert RevenueCat package to display product
 */
function packageToDisplayProduct(pkg: PurchasesPackage): DisplayProduct {
  const product = pkg.product;

  // Try to get display info from our config
  let badge: string | null = null;
  let isRecommended = false;

  if (pkg.packageType === 'ANNUAL') {
    badge = PRODUCT_DISPLAY_INFO.yearly.badge;
    isRecommended = true;
  } else if (pkg.packageType === 'LIFETIME') {
    badge = PRODUCT_DISPLAY_INFO.lifetime.badge;
  }

  // Calculate price per month for annual subscriptions
  let pricePerMonth: string | undefined;
  if (pkg.packageType === 'ANNUAL' && product.price) {
    const monthlyPrice = product.price / 12;
    pricePerMonth = `${product.currencyCode} ${monthlyPrice.toFixed(2)}/mo`;
  }

  return {
    identifier: product.identifier,
    packageType: pkg.packageType,
    title: product.title || pkg.packageType,
    description: product.description || '',
    price: product.priceString,
    pricePerMonth,
    currencyCode: product.currencyCode,
    rcPackage: pkg,
    badge,
    isRecommended,
  };
}

/**
 * Get offerings formatted for display
 */
export async function getDisplayOffering(): Promise<DisplayOffering | null> {
  try {
    const offering = await getOfferings();

    if (!offering) {
      return null;
    }

    const packages = offering.availablePackages.map(packageToDisplayProduct);

    // Sort packages: yearly first (recommended), then monthly, then lifetime
    packages.sort((a, b) => {
      const order = { ANNUAL: 0, MONTHLY: 1, LIFETIME: 2 };
      const aOrder = order[a.packageType as keyof typeof order] ?? 99;
      const bOrder = order[b.packageType as keyof typeof order] ?? 99;
      return aOrder - bOrder;
    });

    return {
      identifier: offering.identifier,
      packages,
      metadata: offering.metadata || {},
    };
  } catch (error) {
    logger.error('Failed to get display offering', { error });
    return null;
  }
}

/**
 * Purchase a package
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<PurchaseResult> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    const hasEntitlement = !!customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlementId];

    if (hasEntitlement) {
      logger.info('Purchase successful', { productId: pkg.product.identifier });
      return {
        success: true,
        customerInfo,
      };
    } else {
      // Purchase completed but entitlement not active (rare edge case)
      logger.warn('Purchase completed but entitlement not active');
      return {
        success: false,
        customerInfo,
        error: 'Purchase completed but subscription not activated. Please contact support.',
      };
    }
  } catch (error) {
    const purchaseError = error as PurchasesError;

    // Check if user cancelled
    if (purchaseError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      logger.info('Purchase cancelled by user');
      return {
        success: false,
        userCancelled: true,
      };
    }

    // Handle other errors
    logger.error('Purchase failed', { error: purchaseError });

    let errorMessage = 'Purchase failed. Please try again.';

    switch (purchaseError.code) {
      case PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR:
        errorMessage = 'Purchases are not allowed on this device.';
        break;
      case PURCHASES_ERROR_CODE.PURCHASE_INVALID_ERROR:
        errorMessage = 'The purchase was invalid. Please try again.';
        break;
      case PURCHASES_ERROR_CODE.PRODUCT_NOT_AVAILABLE_FOR_PURCHASE_ERROR:
        errorMessage = 'This product is not available for purchase.';
        break;
      case PURCHASES_ERROR_CODE.NETWORK_ERROR:
        errorMessage = 'Network error. Please check your connection and try again.';
        break;
      case PURCHASES_ERROR_CODE.STORE_PROBLEM_ERROR:
        errorMessage = 'There was a problem with the app store. Please try again later.';
        break;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Restore previous purchases
 */
export async function restorePurchases(): Promise<RestoreResult> {
  try {
    const customerInfo = await Purchases.restorePurchases();

    const hasActiveEntitlements = Object.keys(customerInfo.entitlements.active).length > 0;

    logger.info('Restore completed', { hasActiveEntitlements });

    return {
      success: true,
      customerInfo,
      hasActiveEntitlements,
    };
  } catch (error) {
    const restoreError = error as PurchasesError;
    logger.error('Restore failed', { error: restoreError });

    let errorMessage = 'Failed to restore purchases. Please try again.';

    if (restoreError.code === PURCHASES_ERROR_CODE.NETWORK_ERROR) {
      errorMessage = 'Network error. Please check your connection and try again.';
    }

    return {
      success: false,
      error: errorMessage,
      hasActiveEntitlements: false,
    };
  }
}

/**
 * Identify user (call after authentication)
 * Links RevenueCat customer with your user ID
 */
export async function identifyUser(userId: string): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.logIn(userId);
    logger.info('User identified with RevenueCat', { userId });
    return customerInfo.customerInfo;
  } catch (error) {
    logger.error('Failed to identify user', { error, userId });
    throw error;
  }
}

/**
 * Logout user (call on sign out)
 * Resets to anonymous user
 */
export async function logoutUser(): Promise<CustomerInfo> {
  try {
    const customerInfo = await Purchases.logOut();
    logger.info('User logged out from RevenueCat');
    return customerInfo;
  } catch (error) {
    logger.error('Failed to logout user', { error });
    throw error;
  }
}

/**
 * Set user attributes for analytics
 */
export async function setUserAttributes(attributes: {
  email?: string;
  displayName?: string;
  phoneNumber?: string;
}): Promise<void> {
  try {
    if (attributes.email) {
      await Purchases.setEmail(attributes.email);
    }
    if (attributes.displayName) {
      await Purchases.setDisplayName(attributes.displayName);
    }
    if (attributes.phoneNumber) {
      await Purchases.setPhoneNumber(attributes.phoneNumber);
    }
    logger.info('User attributes set');
  } catch (error) {
    logger.error('Failed to set user attributes', { error });
  }
}

/**
 * Add listener for customer info updates
 */
export function addCustomerInfoUpdateListener(
  listener: (customerInfo: CustomerInfo) => void
): () => void {
  Purchases.addCustomerInfoUpdateListener(listener);
  // RevenueCat SDK manages listener cleanup internally
  // Return a no-op function for API compatibility
  return () => {
    // Listener will be cleaned up when SDK is reset
  };
}

/**
 * Get the management URL for the subscription
 * Opens App Store / Play Store subscription management
 */
export async function getManagementURL(): Promise<string | null> {
  try {
    const customerInfo = await getCustomerInfo();
    return customerInfo.managementURL;
  } catch (error) {
    logger.error('Failed to get management URL', { error });
    return null;
  }
}

/**
 * Check if this is a first-time purchase (for welcome flows)
 */
export async function isFirstPurchase(): Promise<boolean> {
  try {
    const customerInfo = await getCustomerInfo();
    // If there are no non-subscription transactions, this is likely a first purchase
    return customerInfo.nonSubscriptionTransactions.length === 0;
  } catch {
    return true;
  }
}

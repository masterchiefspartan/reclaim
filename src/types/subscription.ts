/**
 * Subscription Types
 * Types for managing user subscriptions with RevenueCat
 */

import type {
  CustomerInfo,
  PurchasesPackage,
  PurchasesOffering,
  PurchasesStoreProduct,
} from 'react-native-purchases';

// Re-export RevenueCat types for convenience
export type { CustomerInfo, PurchasesPackage, PurchasesOffering, PurchasesStoreProduct };

// Subscription plan types
export type SubscriptionPlan = 'monthly' | 'yearly' | 'lifetime' | 'trial';

// Subscription status derived from RevenueCat
export type SubscriptionStatus =
  | 'none' // No subscription
  | 'trialing' // In trial period
  | 'active' // Active paid subscription
  | 'expired' // Subscription expired
  | 'canceled' // User canceled but still has access until period ends
  | 'grace_period' // Payment failed, in grace period
  | 'paused'; // Subscription paused (Android only)

// Simplified subscription state for the app
export interface SubscriptionState {
  /** Whether user has active entitlement */
  isSubscribed: boolean;
  /** Whether user is in trial period */
  isTrialing: boolean;
  /** Current subscription status */
  status: SubscriptionStatus;
  /** Active entitlement ID (if any) */
  activeEntitlement: string | null;
  /** Expiration date of current subscription */
  expirationDate: Date | null;
  /** Product identifier of active subscription */
  activeProductId: string | null;
  /** Whether subscription will renew */
  willRenew: boolean;
  /** Original RevenueCat customer info */
  customerInfo: CustomerInfo | null;
}

// Product for display in paywall
export interface DisplayProduct {
  identifier: string;
  packageType: string;
  title: string;
  description: string;
  price: string;
  pricePerMonth?: string;
  currencyCode: string;
  /** Original RevenueCat package */
  rcPackage: PurchasesPackage;
  /** Badge text (e.g., "Best Value") */
  badge?: string | null;
  /** Whether this is the recommended option */
  isRecommended?: boolean;
}

// Offering with processed products
export interface DisplayOffering {
  identifier: string;
  packages: DisplayProduct[];
  /** Metadata from RevenueCat dashboard */
  metadata: Record<string, unknown>;
}

// Purchase result
export interface PurchaseResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
  userCancelled?: boolean;
}

// Restore result
export interface RestoreResult {
  success: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
  /** Whether any active entitlements were restored */
  hasActiveEntitlements: boolean;
}

// RevenueCat initialization state
export interface RevenueCatState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  subscriptionState: SubscriptionState;
  currentOffering: DisplayOffering | null;
}

// Default subscription state
export const DEFAULT_SUBSCRIPTION_STATE: SubscriptionState = {
  isSubscribed: false,
  isTrialing: false,
  status: 'none',
  activeEntitlement: null,
  expirationDate: null,
  activeProductId: null,
  willRenew: false,
  customerInfo: null,
};

// Legacy type for backward compatibility
export type { SubscriptionPlan as LegacySubscriptionPlan };

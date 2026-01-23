/**
 * RevenueCat Configuration
 *
 * This file contains all RevenueCat-related configuration.
 * API keys and product identifiers are defined here.
 */

import { Platform } from 'react-native';

// RevenueCat API Keys
// In production, these should come from environment variables
export const REVENUECAT_CONFIG = {
  // Using the same key for both platforms in test mode
  // In production, you may have different keys per platform
  apiKey: 'test_WpZSjLTGsHDIlOOVKwYgNcyApYi',

  // Entitlement identifier - this is what grants access to premium features
  entitlementId: 'Re:Claim Pro',

  // Enable debug logs in development
  debugLogsEnabled: __DEV__,
} as const;

// Product identifiers - these must match what's configured in RevenueCat dashboard
// and in App Store Connect / Google Play Console
export const PRODUCT_IDS = {
  monthly: Platform.select({
    ios: 'reclaim_monthly',
    android: 'reclaim_monthly',
    default: 'reclaim_monthly',
  }),
  yearly: Platform.select({
    ios: 'reclaim_yearly',
    android: 'reclaim_yearly',
    default: 'reclaim_yearly',
  }),
  lifetime: Platform.select({
    ios: 'reclaim_lifetime',
    android: 'reclaim_lifetime',
    default: 'reclaim_lifetime',
  }),
} as const;

// Offering identifier (optional - uses default if not specified)
export const DEFAULT_OFFERING_ID = 'default';

// Product display information (fallback if RevenueCat data unavailable)
export const PRODUCT_DISPLAY_INFO = {
  monthly: {
    title: 'Monthly',
    description: 'Full access, billed monthly. Cancel anytime.',
    badge: null,
  },
  yearly: {
    title: 'Yearly',
    description: 'Save 50% with annual billing.',
    badge: 'Best Value',
  },
  lifetime: {
    title: 'Lifetime',
    description: 'One-time purchase. Access forever.',
    badge: 'One Time',
  },
} as const;

export type ProductId = keyof typeof PRODUCT_IDS;

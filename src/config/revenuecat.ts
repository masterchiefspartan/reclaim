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
  // iOS Public API Key from RevenueCat dashboard
  apiKey: 'appl_jsKgUeavhrnniCncrwsWsQRHRck',

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
} as const;

export type ProductId = keyof typeof PRODUCT_IDS;

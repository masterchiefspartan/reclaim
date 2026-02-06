/**
 * Feature Gating Configuration
 * ==============================
 * Defines free-tier limits and feature availability checks.
 * Supports dev bypass via EXPO_PUBLIC_DEV_BYPASS_PAYWALL env var.
 */

/** Features that can be gated */
export type GatedFeature = 'unlimited_entries' | 'ai_conversations' | 'analytics' | 'frameworks';

/** Free-tier limits */
export const FREE_TIER_LIMITS = {
  maxEntries: 3,
  aiConversations: false,
  analytics: false,
  allFrameworks: false,
} as const;

/** Check if dev bypass is enabled */
export function isDevBypassEnabled(): boolean {
  return process.env.EXPO_PUBLIC_DEV_BYPASS_PAYWALL === 'true';
}

/**
 * Pure function: check if a specific feature is available.
 * Returns true if the user has access to the feature.
 */
export function isFeatureAvailable(
  feature: GatedFeature,
  isSubscribed: boolean,
  entryCount?: number
): boolean {
  // Dev bypass — always grant access in development
  if (isDevBypassEnabled()) return true;

  // Subscribers have full access
  if (isSubscribed) return true;

  // Free-tier logic
  switch (feature) {
    case 'unlimited_entries':
      return (entryCount ?? 0) < FREE_TIER_LIMITS.maxEntries;
    case 'ai_conversations':
      return FREE_TIER_LIMITS.aiConversations;
    case 'analytics':
      return FREE_TIER_LIMITS.analytics;
    case 'frameworks':
      return FREE_TIER_LIMITS.allFrameworks;
    default:
      return false;
  }
}

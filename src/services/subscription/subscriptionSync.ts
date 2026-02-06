/**
 * Subscription Firestore Sync
 * ============================
 * Writes RevenueCat subscription state to the user's Firestore document
 * so the backend can enforce entitlements server-side.
 */

import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { getFirestoreDb } from '@services/firebase/client';
import { logger } from '@utils/logger';
import type { SubscriptionState } from '@/types/subscription';

const USERS_COLLECTION = 'users';

/**
 * Sync subscription state from RevenueCat to Firestore.
 * Called after purchase, restore, or listener update.
 */
export async function syncSubscriptionToFirestore(
  uid: string,
  state: SubscriptionState
): Promise<void> {
  try {
    const ref = doc(getFirestoreDb(), USERS_COLLECTION, uid);

    await updateDoc(ref, {
      subscription: {
        plan: state.activeProductId?.includes('yearly') ? 'yearly' : 'monthly',
        status: state.status === 'none' ? 'expired' : state.status,
        productId: state.activeProductId ?? null,
        expirationDate: state.expirationDate ?? null,
        willRenew: state.willRenew,
        isSubscribed: state.isSubscribed,
        isTrialing: state.isTrialing,
        updatedAt: serverTimestamp(),
      },
    });

    logger.info('Subscription synced to Firestore', {
      uid,
      status: state.status,
      isSubscribed: state.isSubscribed,
    });
  } catch (error) {
    // Non-blocking: don't crash the purchase flow if sync fails
    logger.error('Failed to sync subscription to Firestore', { error, uid });
  }
}

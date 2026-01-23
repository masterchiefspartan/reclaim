import { ReactNode } from 'react';
import { ViewStyle } from 'react-native';

import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { NetworkErrorState } from './NetworkErrorState';
import { EmptyState } from './EmptyState';

interface StateContainerProps {
  /** Whether data is loading */
  loading?: boolean;
  /** Error object or message */
  error?: Error | string | null;
  /** Whether data is empty (checked after loading/error) */
  empty?: boolean;
  /** The actual data (used for empty check if empty prop not provided) */
  data?: unknown;
  /** Custom loading component */
  loadingComponent?: ReactNode;
  /** Loading message */
  loadingMessage?: string;
  /** Custom error component */
  errorComponent?: ReactNode;
  /** Error title override */
  errorTitle?: string;
  /** Custom empty component */
  emptyComponent?: ReactNode;
  /** Empty state title */
  emptyTitle?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Empty state action label */
  emptyActionLabel?: string;
  /** Empty state action callback */
  onEmptyAction?: () => void;
  /** Retry callback for errors */
  onRetry?: () => void;
  /** Whether error is a network error */
  isNetworkError?: boolean;
  /** Children to render when data is available */
  children: ReactNode;
  /** Container style */
  style?: ViewStyle;
}

/**
 * StateContainer Component
 * Wrapper component that handles loading, error, and empty states
 *
 * Usage:
 * ```tsx
 * <StateContainer
 *   loading={isLoading}
 *   error={error}
 *   empty={entries.length === 0}
 *   onRetry={refetch}
 *   emptyTitle="No entries yet"
 *   emptyMessage="Start your first voice journal"
 *   emptyActionLabel="Record Now"
 *   onEmptyAction={startRecording}
 * >
 *   <EntryList entries={entries} />
 * </StateContainer>
 * ```
 */
export const StateContainer = ({
  loading = false,
  error = null,
  empty = false,
  data,
  loadingComponent,
  loadingMessage,
  errorComponent,
  errorTitle,
  emptyComponent,
  emptyTitle = 'No data',
  emptyMessage = 'Nothing to display',
  emptyActionLabel,
  onEmptyAction,
  onRetry,
  isNetworkError = false,
  children,
  style,
}: StateContainerProps) => {
  // Priority: Loading > Error > Empty > Content

  // Loading state
  if (loading) {
    return loadingComponent ?? <LoadingState message={loadingMessage} style={style} />;
  }

  // Error state
  if (error) {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    const errorMessage =
      typeof error === 'string' ? error : error.message || 'An unexpected error occurred';

    if (isNetworkError) {
      return <NetworkErrorState onRetry={onRetry ?? (() => {})} style={style} />;
    }

    return <ErrorState title={errorTitle} message={errorMessage} onRetry={onRetry} style={style} />;
  }

  // Empty state - check explicit empty prop or data array/object
  const isDataEmpty =
    empty || (data !== undefined && ((Array.isArray(data) && data.length === 0) || data === null));

  if (isDataEmpty) {
    return (
      emptyComponent ?? (
        <EmptyState
          title={emptyTitle}
          message={emptyMessage}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
          style={style}
        />
      )
    );
  }

  // Content
  return <>{children}</>;
};

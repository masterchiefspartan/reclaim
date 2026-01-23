import { ViewStyle } from 'react-native';

import { ErrorState } from './ErrorState';

interface NetworkErrorStateProps {
  /** Retry callback */
  onRetry: () => void;
  /** Retry button label (defaults to "Retry") */
  retryLabel?: string;
  /** Additional container styles */
  style?: ViewStyle;
}

/**
 * NetworkErrorState Component
 * Specialized error state for network/connection failures
 */
export const NetworkErrorState = ({
  onRetry,
  retryLabel = 'Retry',
  style,
}: NetworkErrorStateProps) => {
  return (
    <ErrorState
      icon="wifi-off"
      title="No Internet Connection"
      message="Please check your connection and try again. Your data will sync when you're back online."
      retryLabel={retryLabel}
      onRetry={onRetry}
      style={style}
    />
  );
};

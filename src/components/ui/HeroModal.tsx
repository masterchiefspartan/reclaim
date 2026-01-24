/**
 * HeroModal - Hero UI inspired modal/dialog component
 * Clean, modern modals with smooth animations
 */

import { useEffect } from 'react';
import {
  Modal,
  View,
  Pressable,
  type ModalProps,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { HeroText, HeroHeading } from './HeroText';
import { HeroIconButton } from './HeroButton';

type ModalSize = 'sm' | 'md' | 'lg' | 'full';

interface HeroModalProps extends Omit<ModalProps, 'animationType'> {
  /** Modal visibility */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal subtitle/description */
  subtitle?: string;
  /** Size preset */
  size?: ModalSize;
  /** Show close button */
  showCloseButton?: boolean;
  /** Close on backdrop press */
  closeOnBackdrop?: boolean;
  /** Scrollable content */
  scrollable?: boolean;
  /** Footer content */
  footer?: React.ReactNode;
  /** Additional classes for content */
  className?: string;
  children: React.ReactNode;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  full: 'max-w-full mx-4',
};

export const HeroModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  scrollable = false,
  footer,
  className = '',
  children,
  ...props
}: HeroModalProps) => {
  const backdropOpacity = useSharedValue(0);
  const contentScale = useSharedValue(0.95);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/immutability
      backdropOpacity.value = withTiming(1, { duration: 200 });
      // eslint-disable-next-line react-hooks/immutability
      contentScale.value = withSpring(1, { damping: 20 });
      // eslint-disable-next-line react-hooks/immutability
      contentOpacity.value = withTiming(1, { duration: 200 });
    } else {
      // eslint-disable-next-line react-hooks/immutability
      backdropOpacity.value = withTiming(0, { duration: 150 });
      // eslint-disable-next-line react-hooks/immutability
      contentScale.value = withTiming(0.95, { duration: 150 });
      // eslint-disable-next-line react-hooks/immutability
      contentOpacity.value = withTiming(0, { duration: 150 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: contentScale.value }],
    opacity: contentOpacity.value,
  }));

  const handleBackdropPress = () => {
    if (closeOnBackdrop) {
      onClose();
    }
  };

  const ContentWrapper = scrollable ? ScrollView : View;

  return (
    <Modal visible={isOpen} transparent statusBarTranslucent onRequestClose={onClose} {...props}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Backdrop */}
        <Animated.View style={backdropStyle} className="absolute inset-0 bg-black/50">
          <Pressable onPress={handleBackdropPress} className="flex-1" />
        </Animated.View>

        {/* Content */}
        <View className="flex-1 justify-center items-center p-4">
          <Animated.View
            style={contentStyle}
            className={`
              w-full
              ${sizeClasses[size]}
              bg-light-surface dark:bg-dark-surface
              rounded-hero-2xl
              shadow-hero-xl
              overflow-hidden
              ${className}
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <View className="flex-row items-start justify-between p-hero-xl pb-0">
                <View className="flex-1 mr-4">
                  {title && <HeroHeading level={3}>{title}</HeroHeading>}
                  {subtitle && (
                    <HeroText variant="secondary" className="mt-1">
                      {subtitle}
                    </HeroText>
                  )}
                </View>
                {showCloseButton && (
                  <HeroIconButton
                    icon={
                      <Feather
                        name="x"
                        size={20}
                        className="text-light-text-secondary dark:text-dark-text-secondary"
                      />
                    }
                    onPress={onClose}
                    variant="ghost"
                    size="sm"
                  />
                )}
              </View>
            )}

            {/* Body */}
            <ContentWrapper
              className="p-hero-xl"
              {...(scrollable && { showsVerticalScrollIndicator: false })}
            >
              {children}
            </ContentWrapper>

            {/* Footer */}
            {footer && (
              <View className="px-hero-xl pb-hero-xl pt-hero-md border-t border-light-border dark:border-dark-border">
                {footer}
              </View>
            )}
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

/**
 * Confirmation dialog preset
 */
interface HeroConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const HeroConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'info',
}: HeroConfirmDialogProps) => {
  const iconName =
    variant === 'danger' ? 'alert-triangle' : variant === 'warning' ? 'alert-circle' : 'info';
  const iconColor =
    variant === 'danger' ? 'text-error' : variant === 'warning' ? 'text-warning' : 'text-info';

  return (
    <HeroModal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <View className="items-center">
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mb-4 ${variant === 'danger' ? 'bg-error/15' : variant === 'warning' ? 'bg-warning/15' : 'bg-info/15'}`}
        >
          <Feather name={iconName} size={24} className={iconColor} />
        </View>

        <HeroHeading level={4} center className="mb-2">
          {title}
        </HeroHeading>

        <HeroText variant="secondary" center>
          {message}
        </HeroText>

        <View className="flex-row gap-3 mt-6 w-full">
          <Pressable
            onPress={onClose}
            className="flex-1 h-11 rounded-hero-lg items-center justify-center bg-light-muted dark:bg-dark-muted"
          >
            <HeroText weight="medium">{cancelLabel}</HeroText>
          </Pressable>

          <Pressable
            onPress={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 h-11 rounded-hero-lg items-center justify-center ${variant === 'danger' ? 'bg-error' : 'bg-brand-primary'}`}
          >
            <HeroText weight="medium" className="text-white">
              {confirmLabel}
            </HeroText>
          </Pressable>
        </View>
      </View>
    </HeroModal>
  );
};

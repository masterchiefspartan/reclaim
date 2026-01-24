/**
 * Hero UI Component Library
 *
 * Modern, clean UI components inspired by Hero UI (NextUI)
 * Built with NativeWind (Tailwind CSS for React Native)
 *
 * Usage:
 * ```tsx
 * import { HeroCard, HeroButton, HeroText } from '@components/ui';
 *
 * <HeroCard variant="elevated" pressable onPress={handlePress}>
 *   <HeroText size="lg" weight="semibold">Title</HeroText>
 *   <HeroButton label="Action" color="primary" />
 * </HeroCard>
 * ```
 */

// Typography
export { HeroText, HeroHeading, HeroLabel } from './HeroText';

// Buttons
export { HeroButton, HeroIconButton } from './HeroButton';

// Cards
export { HeroCard, HeroCardHeader, HeroCardContent, HeroCardFooter } from './HeroCard';

// Inputs
export { HeroInput, HeroPasswordInput, HeroSearchInput } from './HeroInput';

// Badges
export { HeroBadge, HeroStatusDot } from './HeroBadge';

// Avatar
export { HeroAvatar, HeroAvatarGroup } from './HeroAvatar';

// Modal
export { HeroModal, HeroConfirmDialog } from './HeroModal';

// Layout
export { HeroDivider, HeroSpacer } from './HeroDivider';

// Form Controls
export { HeroSwitch } from './HeroSwitch';

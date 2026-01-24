/**
 * HeroAvatar - Hero UI inspired avatar component
 * Clean, modern avatars with fallback initials
 */

/* eslint-disable react-native/no-raw-text */
import { View, Image, type ImageSourcePropType } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { HeroText } from './HeroText';
import { HeroStatusDot } from './HeroBadge';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface HeroAvatarProps {
  /** Image source */
  src?: ImageSourcePropType | string;
  /** Name for initials fallback */
  name?: string;
  /** Size preset */
  size?: AvatarSize;
  /** Show status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Border color */
  bordered?: boolean;
  /** Additional classes */
  className?: string;
}

const sizeConfig: Record<
  AvatarSize,
  {
    container: string;
    text: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
    icon: number;
    statusSize: 'sm' | 'md' | 'lg';
  }
> = {
  xs: { container: 'w-6 h-6', text: 'xs', icon: 12, statusSize: 'sm' },
  sm: { container: 'w-8 h-8', text: 'xs', icon: 14, statusSize: 'sm' },
  md: { container: 'w-10 h-10', text: 'sm', icon: 18, statusSize: 'md' },
  lg: { container: 'w-12 h-12', text: 'base', icon: 22, statusSize: 'md' },
  xl: { container: 'w-16 h-16', text: 'lg', icon: 28, statusSize: 'lg' },
  '2xl': { container: 'w-20 h-20', text: 'xl', icon: 36, statusSize: 'lg' },
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const HeroAvatar = ({
  src,
  name,
  size = 'md',
  status,
  bordered = false,
  className = '',
}: HeroAvatarProps) => {
  const config = sizeConfig[size];
  const hasImage = !!src;
  const initials = name ? getInitials(name) : '';

  const imageSource = typeof src === 'string' ? { uri: src } : src;

  return (
    <View className={`relative ${className}`}>
      <View
        className={`
          ${config.container}
          rounded-full
          overflow-hidden
          items-center
          justify-center
          bg-brand-primary/15
          ${bordered ? 'border-2 border-light-surface dark:border-dark-surface shadow-hero-sm' : ''}
        `}
      >
        {hasImage ? (
          <Image
            source={imageSource as ImageSourcePropType}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : initials ? (
          <HeroText size={config.text} weight="semibold" className="text-brand-primary">
            {initials}
          </HeroText>
        ) : (
          <Feather name="user" size={config.icon} className="text-brand-primary" />
        )}
      </View>

      {status && (
        <View className="absolute -bottom-0.5 -right-0.5 bg-light-surface dark:bg-dark-surface rounded-full p-0.5">
          <HeroStatusDot status={status} size={config.statusSize} />
        </View>
      )}
    </View>
  );
};

/**
 * Avatar group for showing multiple avatars
 */
interface HeroAvatarGroupProps {
  avatars: Array<{ src?: string; name?: string }>;
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export const HeroAvatarGroup = ({
  avatars,
  max = 4,
  size = 'md',
  className = '',
}: HeroAvatarGroupProps) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;
  const config = sizeConfig[size];

  return (
    <View className={`flex-row ${className}`}>
      {visibleAvatars.map((avatar, index) => (
        <View
          key={index}
          className={index > 0 ? '-ml-3' : ''}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          <HeroAvatar src={avatar.src} name={avatar.name} size={size} bordered />
        </View>
      ))}

      {remainingCount > 0 && (
        <View
          className={`
            ${config.container}
            rounded-full
            items-center
            justify-center
            bg-light-muted dark:bg-dark-muted
            border-2 border-light-surface dark:border-dark-surface
            -ml-3
          `}
        >
          <HeroText size={config.text} weight="medium" variant="secondary">
            {`+${remainingCount}`}
          </HeroText>
        </View>
      )}
    </View>
  );
};

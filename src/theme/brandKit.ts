/**
 * RECLAIM BRAND KIT — Apple Glass Aesthetic
 * ===========================================
 * A refined design system inspired by Apple's design language:
 * - Glass morphism (frosted glass, blur, translucency)
 * - Clean, minimal typography with generous whitespace
 * - Subtle depth through layered translucent surfaces
 * - Soft gradients and luminous accents
 * - System font stacks (SF Pro)
 *
 * Design Principles:
 * 1. Clarity — Content is the focus, chrome recedes
 * 2. Deference — Fluid, translucent UI defers to content
 * 3. Depth — Layered translucent surfaces create hierarchy
 */

import { Platform } from 'react-native';

// ===========================================
// COLOR PALETTE
// ===========================================

/**
 * Brand Colors — Clean, luminous accents
 * Inspired by Apple's use of vibrant system colors
 */
export const brandColors = {
  // Primary — A refined indigo-blue, Apple's signature accent
  primary: {
    default: '#007AFF', // iOS system blue
    light: '#409CFF',
    dark: '#0062CC',
    subtle: 'rgba(0, 122, 255, 0.08)',
    tint: 'rgba(0, 122, 255, 0.12)',
  },

  // Secondary — Soft violet for secondary actions
  secondary: {
    default: '#5856D6', // iOS system indigo
    light: '#7A79E0',
    dark: '#4644AB',
    subtle: 'rgba(88, 86, 214, 0.08)',
  },

  // Accent — Warm teal for wellness/recovery context
  accent: {
    default: '#34C759', // iOS system green
    light: '#5DD27A',
    dark: '#28A745',
    subtle: 'rgba(52, 199, 89, 0.08)',
  },
} as const;

/**
 * Mood Colors — Clean, Apple-system-inspired
 */
export const moodColors = {
  happy: {
    main: '#34C759',
    light: 'rgba(52, 199, 89, 0.15)',
    bg: 'rgba(52, 199, 89, 0.08)',
    emoji: '😊',
    label: 'Happy',
  },
  sad: {
    main: '#FF6482',
    light: 'rgba(255, 100, 130, 0.15)',
    bg: 'rgba(255, 100, 130, 0.08)',
    emoji: '😢',
    label: 'Sad',
  },
  calm: {
    main: '#5AC8FA',
    light: 'rgba(90, 200, 250, 0.15)',
    bg: 'rgba(90, 200, 250, 0.08)',
    emoji: '😌',
    label: 'Calm',
  },
  anxious: {
    main: '#FF9F0A',
    light: 'rgba(255, 159, 10, 0.15)',
    bg: 'rgba(255, 159, 10, 0.08)',
    emoji: '😰',
    label: 'Anxious',
  },
  neutral: {
    main: '#8E8E93',
    light: 'rgba(142, 142, 147, 0.15)',
    bg: 'rgba(142, 142, 147, 0.08)',
    emoji: '😐',
    label: 'Neutral',
  },
  hopeful: {
    main: '#5856D6',
    light: 'rgba(88, 86, 214, 0.15)',
    bg: 'rgba(88, 86, 214, 0.08)',
    emoji: '🙂',
    label: 'Hopeful',
  },
  grateful: {
    main: '#AF52DE',
    light: 'rgba(175, 82, 222, 0.15)',
    bg: 'rgba(175, 82, 222, 0.08)',
    emoji: '🙏',
    label: 'Grateful',
  },
  energized: {
    main: '#FF2D55',
    light: 'rgba(255, 45, 85, 0.15)',
    bg: 'rgba(255, 45, 85, 0.08)',
    emoji: '✨',
    label: 'Energized',
  },
} as const;

/**
 * Semantic Colors — iOS system semantics
 */
export const semanticColors = {
  success: '#34C759',
  warning: '#FF9F0A',
  error: '#FF3B30',
  info: '#007AFF',
} as const;

// ===========================================
// GLASS MORPHISM TOKENS
// ===========================================

/**
 * Glass effect configuration
 * These define the frosted glass surfaces throughout the app
 */
export const glass = {
  /** Standard frosted glass card */
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    blurIntensity: 40,
    blurTint: 'light' as const,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 0.5,
  },
  /** Elevated frosted surface (modals, popovers) */
  elevated: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    blurIntensity: 60,
    blurTint: 'light' as const,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 0.5,
  },
  /** Subtle frosted surface (navigation bars, tab bars) */
  chrome: {
    backgroundColor: 'rgba(249, 249, 249, 0.8)',
    blurIntensity: 50,
    blurTint: 'light' as const,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    borderWidth: 0.5,
  },
  /** Tinted accent glass */
  tinted: {
    backgroundColor: 'rgba(0, 122, 255, 0.06)',
    blurIntensity: 30,
    blurTint: 'light' as const,
    borderColor: 'rgba(0, 122, 255, 0.12)',
    borderWidth: 0.5,
  },
} as const;

export const glassDark = {
  card: {
    backgroundColor: 'rgba(30, 30, 30, 0.72)',
    blurIntensity: 40,
    blurTint: 'dark' as const,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 0.5,
  },
  elevated: {
    backgroundColor: 'rgba(44, 44, 46, 0.85)',
    blurIntensity: 60,
    blurTint: 'dark' as const,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 0.5,
  },
  chrome: {
    backgroundColor: 'rgba(22, 22, 22, 0.8)',
    blurIntensity: 50,
    blurTint: 'dark' as const,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 0.5,
  },
  tinted: {
    backgroundColor: 'rgba(10, 132, 255, 0.08)',
    blurIntensity: 30,
    blurTint: 'dark' as const,
    borderColor: 'rgba(10, 132, 255, 0.15)',
    borderWidth: 0.5,
  },
} as const;

// ===========================================
// THEME COLORS
// ===========================================

/**
 * Light Theme — Clean whites, soft grays, luminous backgrounds
 */
export const lightTheme = {
  // Backgrounds — layered depth
  background: '#F2F2F7', // iOS system grouped background
  backgroundSecondary: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.72)',

  // Text — Apple-style hierarchy
  textPrimary: '#000000',
  textSecondary: '#3C3C43', // iOS secondaryLabel (60% opacity)
  textTertiary: '#8E8E93', // iOS tertiaryLabel
  textMuted: '#AEAEB2',
  textInverse: '#FFFFFF',

  // Borders & Separators — ultra-subtle
  border: 'rgba(60, 60, 67, 0.12)', // iOS separator
  borderLight: 'rgba(60, 60, 67, 0.06)',
  divider: 'rgba(60, 60, 67, 0.1)',

  // Fills — Apple's system fill hierarchy
  fillPrimary: 'rgba(120, 120, 128, 0.2)',
  fillSecondary: 'rgba(120, 120, 128, 0.16)',
  fillTertiary: 'rgba(120, 120, 128, 0.12)',
  fillQuaternary: 'rgba(120, 120, 128, 0.08)',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlayLight: 'rgba(0, 0, 0, 0.06)',

  // Interactive states
  pressed: 'rgba(0, 0, 0, 0.04)',
  focused: 'rgba(0, 122, 255, 0.15)',
  disabled: 'rgba(60, 60, 67, 0.08)',

  // Brand
  primary: brandColors.primary.default,
  primaryLight: brandColors.primary.light,
  primaryDark: brandColors.primary.dark,
  primarySubtle: brandColors.primary.subtle,
  secondary: brandColors.secondary.default,
  accent: brandColors.accent.default,

  // Glass tokens
  glass: glass,
} as const;

/**
 * Dark Theme — True blacks, elevated surfaces, vibrant accents
 */
export const darkTheme = {
  // Backgrounds
  background: '#000000', // True black for OLED
  backgroundSecondary: '#1C1C1E', // iOS secondary system background
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  surfaceGlass: 'rgba(30, 30, 30, 0.72)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(235, 235, 245, 0.6)', // iOS dark secondaryLabel
  textTertiary: 'rgba(235, 235, 245, 0.3)',
  textMuted: 'rgba(235, 235, 245, 0.18)',
  textInverse: '#000000',

  // Borders & Separators
  border: 'rgba(84, 84, 88, 0.65)',
  borderLight: 'rgba(84, 84, 88, 0.36)',
  divider: 'rgba(84, 84, 88, 0.5)',

  // Fills
  fillPrimary: 'rgba(120, 120, 128, 0.36)',
  fillSecondary: 'rgba(120, 120, 128, 0.32)',
  fillTertiary: 'rgba(120, 120, 128, 0.24)',
  fillQuaternary: 'rgba(120, 120, 128, 0.18)',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(255, 255, 255, 0.04)',

  // Interactive states
  pressed: 'rgba(255, 255, 255, 0.06)',
  focused: 'rgba(10, 132, 255, 0.2)',
  disabled: 'rgba(120, 120, 128, 0.12)',

  // Brand (brighter variants for dark mode)
  primary: '#0A84FF', // iOS dark mode blue
  primaryLight: '#409CFF',
  primaryDark: '#007AFF',
  primarySubtle: 'rgba(10, 132, 255, 0.12)',
  secondary: '#5E5CE6',
  accent: '#30D158',

  // Glass tokens
  glass: glassDark,
} as const;

// ===========================================
// TYPOGRAPHY
// ===========================================

/**
 * Font Family — System fonts (SF Pro on iOS, Roboto on Android)
 */
export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  semibold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

/**
 * Typography Scale — Apple-inspired, tight tracking on headlines
 */
export const typography = {
  // Large Titles — iOS large title style
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.37,
  },
  // Title 1
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.36,
  },
  // Title 2
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.35,
  },
  // Title 3
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.38,
  },

  // Headline
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.41,
  },
  // Body
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.41,
  },
  // Callout
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.32,
  },
  // Subheadline
  subheadline: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.24,
  },
  // Footnote
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.08,
  },
  // Caption 1
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.regular,
    letterSpacing: 0,
  },
  // Caption 2
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.07,
  },

  // --------- Semantic aliases (for backward compat) ---------
  displayLarge: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.37,
  },
  displayMedium: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.36,
  },
  displaySmall: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.35,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.36,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.35,
  },
  h3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.38,
  },
  h4: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.41,
  },
  bodyLarge: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.41,
  },
  bodySmall: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeight.regular,
    letterSpacing: -0.24,
  },
  labelLarge: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: fontWeight.semibold,
    letterSpacing: -0.32,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeight.medium,
    letterSpacing: -0.24,
  },
  labelSmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    letterSpacing: -0.08,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeight.regular,
    letterSpacing: 0,
  },
  captionSmall: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.07,
  },
  stat: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.37,
  },
  statSmall: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.35,
  },
} as const;

// ===========================================
// SPACING
// ===========================================

/**
 * Spacing — More generous, Apple-like whitespace
 * Based on 4px grid but with larger resting values
 */
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
} as const;

/**
 * Layout — Screen-level spacing
 */
export const layout = {
  screenPaddingHorizontal: 20,
  screenPaddingVertical: 24,
  cardPadding: 16,
  sectionGap: 32,
  itemGap: 12,
  buttonGap: 12,
} as const;

// ===========================================
// BORDER RADIUS
// ===========================================

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 22,
  '3xl': 26,
  full: 9999,
} as const;

// ===========================================
// SHADOWS — Ultra-subtle, layered depth
// ===========================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  /** Glass card shadow — barely there, ethereal */
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  /** Floating element shadow (FABs, popovers) */
  float: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 12,
  },
  /** Button shadow — subtle lift */
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;

// ===========================================
// COMPONENT TOKENS
// ===========================================

export const buttonTokens = {
  height: {
    sm: 34,
    md: 44,
    lg: 50,
  },
  paddingHorizontal: {
    sm: spacing.md,
    md: spacing.xl,
    lg: spacing['2xl'],
  },
  borderRadius: borderRadius.lg,
  minWidth: 100,
} as const;

export const cardTokens = {
  padding: spacing.lg,
  borderRadius: borderRadius.xl,
  borderWidth: 0.5,
} as const;

export const inputTokens = {
  height: 44,
  paddingHorizontal: spacing.lg,
  borderRadius: borderRadius.md,
  borderWidth: 0.5,
  fontSize: typography.body.fontSize,
} as const;

export const navigationTokens = {
  tabBar: {
    height: 84,
    paddingBottom: 24,
    iconSize: 24,
    labelSize: 10,
  },
  header: {
    height: 44,
    paddingHorizontal: spacing.lg,
  },
} as const;

/**
 * Touch Target — Apple HIG compliant
 */
export const touchTarget = {
  minimum: 44,
  recommended: 48,
} as const;

// ===========================================
// ANIMATION
// ===========================================

export const duration = {
  instant: 100,
  fast: 200,
  normal: 300,
  slow: 450,
  slower: 600,
} as const;

export const easing = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  /** Apple's signature spring */
  spring: { damping: 20, stiffness: 300, mass: 0.8 },
  /** Bouncy spring for celebrations */
  springBouncy: { damping: 12, stiffness: 200, mass: 0.6 },
} as const;

// ===========================================
// ICON SIZES
// ===========================================

export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
} as const;

// ===========================================
// Z-INDEX
// ===========================================

export const zIndex = {
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1100,
  modal: 1200,
  popover: 1300,
  tooltip: 1400,
  toast: 1500,
} as const;

// ===========================================
// EMOJI MAPPING
// ===========================================

export const moodEmojis = {
  happy: '😊',
  sad: '😢',
  calm: '😌',
  anxious: '😰',
  neutral: '😐',
  hopeful: '🙂',
  grateful: '🙏',
  energized: '✨',
} as const;

// ===========================================
// THEME BUILDER
// ===========================================

export type ThemeMode = 'light' | 'dark';
export type MoodType = keyof typeof moodColors;

export interface BrandTheme {
  mode: ThemeMode;
  colors: typeof lightTheme | typeof darkTheme;
  brand: typeof brandColors;
  moods: typeof moodColors;
  semantic: typeof semanticColors;
  typography: typeof typography;
  spacing: typeof spacing;
  layout: typeof layout;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows;
  buttons: typeof buttonTokens;
  cards: typeof cardTokens;
  inputs: typeof inputTokens;
  navigation: typeof navigationTokens;
  touchTarget: typeof touchTarget;
  duration: typeof duration;
  easing: typeof easing;
  iconSize: typeof iconSize;
  zIndex: typeof zIndex;
  moodEmojis: typeof moodEmojis;
  glass: typeof glass | typeof glassDark;
}

export const buildBrandTheme = (mode: ThemeMode = 'light'): BrandTheme => ({
  mode,
  colors: mode === 'dark' ? darkTheme : lightTheme,
  brand: brandColors,
  moods: moodColors,
  semantic: semanticColors,
  typography,
  spacing,
  layout,
  borderRadius,
  shadows,
  buttons: buttonTokens,
  cards: cardTokens,
  inputs: inputTokens,
  navigation: navigationTokens,
  touchTarget,
  duration,
  easing,
  iconSize,
  zIndex,
  moodEmojis,
  glass: mode === 'dark' ? glassDark : glass,
});

export const defaultTheme = buildBrandTheme('light');

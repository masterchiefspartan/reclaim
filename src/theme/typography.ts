/**
 * Reclaim Typography System — Apple Glass Aesthetic
 * ==================================================
 * Uses iOS system font scale (SF Pro) with tight tracking.
 * See brandKit.ts for the source of truth.
 */

import { typography as brandTypography, fontFamily, fontWeight } from './brandKit';

export const typography = brandTypography;

export const baseTextStyle = {
  fontFamily: fontFamily.regular,
};

export const monoTextStyle = {
  fontFamily: fontFamily.mono,
};

export { fontWeight };

export type TypographyVariant = keyof typeof typography;

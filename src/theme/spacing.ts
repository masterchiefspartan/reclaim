/**
 * Reclaim Spacing System — Apple Glass Aesthetic
 * ================================================
 * Generous whitespace for a clean, breathable UI.
 */

import { spacing as brandSpacing, layout as brandLayout } from './brandKit';

export const spacing = brandSpacing;

export type SpacingToken = keyof typeof spacing;

export const layout = brandLayout;

export const verticalSpacing = (multiplier: number = 1) => spacing.lg * multiplier;
export const horizontalSpacing = (multiplier: number = 1) => spacing.lg * multiplier;

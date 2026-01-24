# Front-End Excellence PRD

## Re:Claim Mobile App - World-Class UI/UX Standards

**Version:** 1.0
**Last Updated:** January 2026
**Status:** Living Document

---

## Executive Summary

This PRD establishes the front-end standards, patterns, and guidelines to ensure Re:Claim delivers a top-tier mobile app experience comparable to apps like Headspace, Calm, Duolingo, and Apple's own apps. The document is designed to be **flexible and dynamic**, acknowledging that screens and flows will evolve continuously.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Component Architecture](#2-component-architecture)
3. [Animation & Motion System](#3-animation--motion-system)
4. [Navigation & Flow Patterns](#4-navigation--flow-patterns)
5. [Screen Templates](#5-screen-templates)
6. [Micro-Interactions](#6-micro-interactions)
7. [Loading & Empty States](#7-loading--empty-states)
8. [Error Handling UX](#8-error-handling-ux)
9. [Accessibility Standards](#9-accessibility-standards)
10. [Performance Guidelines](#10-performance-guidelines)
11. [Theming System](#11-theming-system)
12. [Testing Strategy](#12-testing-strategy)
13. [Implementation Checklist](#13-implementation-checklist)

---

## 1. Design Philosophy

### 1.1 Core Principles

| Principle             | Description                       | Implementation                                      |
| --------------------- | --------------------------------- | --------------------------------------------------- |
| **Calm & Supportive** | UI should feel like a safe space  | Soft colors, rounded corners, gentle animations     |
| **Effortless**        | Minimize cognitive load           | Clear hierarchy, obvious CTAs, predictable patterns |
| **Responsive**        | Instant feedback for every action | Haptics, animations, visual feedback                |
| **Delightful**        | Small surprises that spark joy    | Celebration animations, progress rewards            |
| **Accessible**        | Usable by everyone                | WCAG AA compliance, VoiceOver support               |

### 1.2 Visual Language

```
┌─────────────────────────────────────────────────────────────┐
│  VISUAL HIERARCHY                                           │
├─────────────────────────────────────────────────────────────┤
│  1. Primary Action    → Bold color, large touch target      │
│  2. Content           → Clear typography, breathing room    │
│  3. Secondary Actions → Subtle, doesn't compete             │
│  4. Navigation        → Predictable, always accessible      │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Design Tokens (Flexible)

Design tokens should be centralized and easily changeable:

```typescript
// theme/tokens.ts - Single source of truth
export const tokens = {
  // Spacing scale (8px base)
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
    '3xl': 48,
  },

  // Border radius scale
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },

  // Animation durations
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800,
  },

  // Shadows
  shadow: {
    sm: { offset: { width: 0, height: 2 }, opacity: 0.05, radius: 4 },
    md: { offset: { width: 0, height: 4 }, opacity: 0.08, radius: 12 },
    lg: { offset: { width: 0, height: 8 }, opacity: 0.12, radius: 24 },
  },
};
```

---

## 2. Component Architecture

### 2.1 Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SCREENS (Compositions)                              │   │
│  │  - Full page views                                   │   │
│  │  - Combine templates + features                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ▲                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TEMPLATES (Layouts)                                 │   │
│  │  - Screen scaffolding                                │   │
│  │  - Header/Footer patterns                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ▲                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  FEATURES (Smart Components)                         │   │
│  │  - Business logic                                    │   │
│  │  - API connections                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ▲                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  UI COMPONENTS (Dumb/Presentational)                 │   │
│  │  - Pure visual components                            │   │
│  │  - No business logic                                 │   │
│  │  - Fully reusable                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ▲                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PRIMITIVES (Atoms)                                  │   │
│  │  - Text, View, Pressable wrappers                    │   │
│  │  - Theme-aware                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Flexibility Pattern

Every component should support customization without breaking:

```typescript
interface FlexibleComponentProps {
  // Core props
  children?: React.ReactNode;

  // Style overrides (escape hatch)
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;

  // Variant system (predefined options)
  variant?: 'default' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';

  // Composition slots
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;

  // Behavior
  onPress?: () => void;
  disabled?: boolean;

  // Testing
  testID?: string;
}
```

### 2.3 Required UI Components

| Component                          | Status | Priority | Notes                         |
| ---------------------------------- | ------ | -------- | ----------------------------- |
| Button (Primary, Secondary, Ghost) | ✅     | P0       | With loading, disabled states |
| Text (all variants)                | ✅     | P0       | H1-H4, body, caption, label   |
| Card                               | ✅     | P0       | Elevated, outlined, flat      |
| Input                              | ✅     | P1       | With validation, icons        |
| Modal/BottomSheet                  | ✅     | P1       | Animated, dismissible         |
| Avatar                             | ✅     | P1       | With fallback, status         |
| Badge/Chip                         | ✅     | P1       | Multiple variants             |
| Switch/Toggle                      | ✅     | P1       | Animated                      |
| Progress (Bar, Ring)               | 🔄     | P1       | Animated                      |
| Skeleton Loader                    | 🔄     | P1       | Shimmer effect                |
| Toast/Snackbar                     | ❌     | P1       | Non-blocking alerts           |
| Action Sheet                       | ❌     | P2       | iOS-style options             |
| Slider                             | ❌     | P2       | For mood selection            |
| Calendar/Date Picker               | ❌     | P2       | Native feel                   |
| Charts (Line, Bar)                 | ❌     | P2       | For dashboard                 |

---

## 3. Animation & Motion System

### 3.1 Animation Principles

```
┌─────────────────────────────────────────────────────────────┐
│                 ANIMATION GUIDELINES                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DO:                                                        │
│  ✓ Use animations to provide feedback                       │
│  ✓ Keep animations under 300ms for interactions             │
│  ✓ Use spring physics for natural feel                      │
│  ✓ Animate layout changes smoothly                          │
│  ✓ Respect "Reduce Motion" accessibility setting            │
│                                                             │
│  DON'T:                                                      │
│  ✗ Animate for decoration without purpose                   │
│  ✗ Block user interaction during animations                 │
│  ✗ Use jarring or sudden movements                          │
│  ✗ Animate multiple unrelated elements simultaneously       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Animation Library: React Native Reanimated

```typescript
// Standard animation configurations
export const springConfig = {
  // Snappy - for buttons, toggles
  snappy: { damping: 15, stiffness: 150 },

  // Bouncy - for celebrations, success
  bouncy: { damping: 10, stiffness: 100 },

  // Gentle - for modals, sheets
  gentle: { damping: 20, stiffness: 90 },

  // Stiff - for micro-interactions
  stiff: { damping: 20, stiffness: 300 },
};

export const timingConfig = {
  fast: { duration: 150 },
  normal: { duration: 250 },
  slow: { duration: 400 },
};
```

### 3.3 Required Animations

| Animation               | Where Used       | Type              | Duration        |
| ----------------------- | ---------------- | ----------------- | --------------- |
| **Button Press**        | All buttons      | Scale + opacity   | 100ms           |
| **Card Press**          | Pressable cards  | Scale (0.98)      | 150ms           |
| **Page Transition**     | Navigation       | Slide/Fade        | 300ms           |
| **Modal Entry**         | Dialogs, sheets  | Scale + fade      | 250ms           |
| **List Item Entry**     | FlatLists        | Fade + slide up   | 200ms staggered |
| **Success Celebration** | After actions    | Confetti/pulse    | 800ms           |
| **Loading Pulse**       | Skeleton loaders | Opacity pulse     | 1000ms loop     |
| **Recording Pulse**     | Voice recording  | Scale pulse       | 1500ms loop     |
| **Progress Fill**       | Progress bars    | Width animation   | 300ms           |
| **Switch Toggle**       | Toggle switches  | Translate + color | 200ms           |
| **Shake Error**         | Invalid inputs   | Horizontal shake  | 400ms           |

### 3.4 Animation Hook Template

```typescript
// hooks/useAnimatedPress.ts
export const useAnimatedPress = (config = springConfig.snappy) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96, config);
    opacity.value = withTiming(0.9, { duration: 100 });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, config);
    opacity.value = withTiming(1, { duration: 100 });
  };

  return { animatedStyle, onPressIn, onPressOut };
};
```

### 3.5 Haptic Feedback Integration

```typescript
// utils/haptics.ts
import * as Haptics from 'expo-haptics';

export const haptics = {
  // Light tap - buttons, selections
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  // Medium tap - confirmations
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  // Heavy tap - important actions
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  // Success - completion
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  // Warning - attention needed
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

  // Error - something went wrong
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),

  // Selection - list items, toggles
  selection: () => Haptics.selectionAsync(),
};
```

---

## 4. Navigation & Flow Patterns

### 4.1 Navigation Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   NAVIGATION STRUCTURE                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ROOT NAVIGATOR (Stack)                                     │
│  ├── Loading Screen                                         │
│  ├── Onboarding Stack                                       │
│  │   ├── Welcome                                            │
│  │   ├── Value Slides                                       │
│  │   ├── Sign Up / Login                                    │
│  │   ├── Email Verification                                 │
│  │   ├── Paywall                                            │
│  │   ├── Profile Setup                                      │
│  │   └── Permissions                                        │
│  │                                                          │
│  ├── Main Tab Navigator                                     │
│  │   ├── Home Tab                                           │
│  │   ├── Journal Tab                                        │
│  │   ├── Dashboard Tab                                      │
│  │   └── Settings Tab                                       │
│  │                                                          │
│  └── Modal Stack (Overlays)                                 │
│      ├── Voice Journal (fullScreenModal)                    │
│      ├── Voice Conversation (fullScreenModal)               │
│      ├── AI Response (modal)                                │
│      ├── Celebration (modal)                                │
│      └── Entry Detail (card)                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Transition Patterns

| Transition            | Use Case              | Animation         |
| --------------------- | --------------------- | ----------------- |
| **Push**              | Drill-down navigation | Slide from right  |
| **Modal**             | Focused tasks         | Slide from bottom |
| **Full Screen Modal** | Immersive experiences | Fade + scale      |
| **Card**              | Quick previews        | Partial slide     |
| **Fade**              | Tab switches          | Cross-fade        |
| **None**              | Instant switches      | Immediate         |

### 4.3 Navigation UX Rules

1. **Always provide back navigation** - Never trap users
2. **Preserve scroll position** - When returning to lists
3. **Deep link support** - All screens should be linkable
4. **Gesture navigation** - Support swipe to go back
5. **Loading states** - Show skeleton during data fetch
6. **Error recovery** - Retry options on failure

---

## 5. Screen Templates

### 5.1 Standard Screen Template

```typescript
// templates/StandardScreen.tsx
interface StandardScreenProps {
  // Header
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  showBackButton?: boolean;

  // Content
  children: React.ReactNode;
  scrollable?: boolean;
  refreshable?: boolean;
  onRefresh?: () => Promise<void>;

  // Footer
  footer?: React.ReactNode;
  footerSticky?: boolean;

  // State
  loading?: boolean;
  error?: Error | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
}
```

### 5.2 Screen Layout Patterns

```
┌─────────────────────────────────────────────────────────────┐
│  PATTERN A: Simple Content                                  │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Safe Area Top                                          │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Header (optional)                                      │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │                   Scrollable Content                   │ │
│  │                                                        │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Footer (sticky, optional)                              │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Safe Area Bottom                                       │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PATTERN B: List with Header                                │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Header (fixed)                                         │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Search/Filter Bar (sticky)                             │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │                   FlatList Content                     │ │
│  │                   (pull to refresh)                    │ │
│  │                                                        │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Tab Bar                                                │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PATTERN C: Immersive (Voice Recording)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Close Button (top right)                               │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │                                                        │ │
│  │              Centered Visual Focus                     │ │
│  │              (recording animation)                     │ │
│  │                                                        │ │
│  │                                                        │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Status Text                                            │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ Primary Action Button (large)                          │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Micro-Interactions

### 6.1 Button Interactions

```typescript
// Every button should have:
1. Visual feedback on press (scale down 2-4%)
2. Haptic feedback (light impact)
3. Disabled state (reduced opacity + no haptic)
4. Loading state (spinner + disabled)
```

### 6.2 Form Field Interactions

```typescript
// Every input should have:
1. Focus animation (border color change)
2. Error shake animation (on validation fail)
3. Success check animation (on valid)
4. Clear button (when has value)
5. Label animation (float on focus - optional)
```

### 6.3 List Item Interactions

```typescript
// Every list item should have:
1. Press highlight (background color shift)
2. Haptic on selection (selection feedback)
3. Swipe actions (if applicable)
4. Long press menu (if applicable)
```

### 6.4 Celebration Interactions

```typescript
// Trigger celebrations for:
1. First journal entry created
2. Streak milestones (3, 7, 14, 30 days)
3. Completing onboarding
4. Subscription activation
5. Weekly progress achievements

// Celebration elements:
- Confetti animation
- Success haptic (heavy)
- Sound effect (optional, respect mute)
- Encouraging message
```

---

## 7. Loading & Empty States

### 7.1 Loading State Patterns

| Type                | Use Case         | Component             |
| ------------------- | ---------------- | --------------------- |
| **Full Screen**     | Initial app load | Branded splash        |
| **Skeleton**        | List loading     | Animated placeholders |
| **Inline Spinner**  | Button actions   | ActivityIndicator     |
| **Pull to Refresh** | List refresh     | RefreshControl        |
| **Pagination**      | Load more        | Footer spinner        |
| **Overlay**         | Blocking actions | Modal with spinner    |

### 7.2 Skeleton Loader Implementation

```typescript
// components/Skeleton.tsx
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

// Use shimmer animation for polish
// Respect "Reduce Motion" setting
```

### 7.3 Empty State Guidelines

Every list/content area needs an empty state with:

1. **Illustration** (optional but recommended)
2. **Title** - What's missing
3. **Description** - Why it's empty
4. **Action** - How to populate

```typescript
// Examples:
{
  journalEmpty: {
    title: "No entries yet",
    description: "Start your first voice journal to see it here",
    action: { label: "Record Entry", onPress: openVoiceJournal }
  },
  searchEmpty: {
    title: "No results found",
    description: "Try different keywords or filters",
    action: { label: "Clear Search", onPress: clearSearch }
  }
}
```

---

## 8. Error Handling UX

### 8.1 Error Types & Responses

| Error Type     | UI Response        | Recovery Action  |
| -------------- | ------------------ | ---------------- |
| **Network**    | Banner + retry     | Retry button     |
| **Auth**       | Redirect to login  | Re-authenticate  |
| **Validation** | Inline field error | Fix and resubmit |
| **Server**     | Toast + retry      | Retry button     |
| **Not Found**  | Empty state        | Navigate back    |
| **Permission** | Explanation modal  | Settings link    |

### 8.2 Error Message Guidelines

```
DO:
✓ "Couldn't save your entry. Please try again."
✓ "Check your connection and tap retry."
✓ "This email is already registered. Try logging in."

DON'T:
✗ "Error 500: Internal Server Error"
✗ "NetworkRequestFailed"
✗ "Something went wrong" (without action)
```

### 8.3 Error Animation

```typescript
// Shake animation for invalid inputs
const shake = useSharedValue(0);

const triggerShake = () => {
  shake.value = withSequence(
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
  haptics.error();
};
```

---

## 9. Accessibility Standards

### 9.1 Requirements (WCAG AA)

| Requirement        | Implementation                     |
| ------------------ | ---------------------------------- |
| **Touch Targets**  | Minimum 44x44pt                    |
| **Color Contrast** | 4.5:1 for text, 3:1 for large text |
| **Screen Reader**  | All elements labeled               |
| **Reduce Motion**  | Respect system setting             |
| **Dynamic Type**   | Support text scaling               |
| **Focus Order**    | Logical tab order                  |

### 9.2 Accessibility Props Checklist

```typescript
// Every interactive element needs:
<Pressable
  accessible={true}
  accessibilityLabel="Record voice journal"  // What it is
  accessibilityHint="Opens voice recording"   // What happens
  accessibilityRole="button"                  // Semantic role
  accessibilityState={{ disabled: false }}    // Current state
/>

// Every image needs:
<Image
  accessible={true}
  accessibilityLabel="User profile photo"
/>

// Every text input needs:
<TextInput
  accessibilityLabel="Email address"
  accessibilityHint="Enter your email to sign up"
/>
```

### 9.3 Reduce Motion Support

```typescript
// hooks/useReducedMotion.ts
import { useReducedMotion } from 'react-native-reanimated';

export const useAnimation = () => {
  const reduceMotion = useReducedMotion();

  return {
    duration: reduceMotion ? 0 : 300,
    withAnimation: reduceMotion ? withTiming : withSpring,
  };
};
```

---

## 10. Performance Guidelines

### 10.1 Performance Targets

| Metric                  | Target  | Measurement       |
| ----------------------- | ------- | ----------------- |
| **Time to Interactive** | < 2s    | Cold start        |
| **Frame Rate**          | 60fps   | During animations |
| **List Scroll**         | 60fps   | No jank           |
| **Tap Response**        | < 100ms | Visual feedback   |
| **Memory**              | < 200MB | Typical usage     |

### 10.2 Optimization Patterns

```typescript
// 1. Memoize expensive components
const MemoizedCard = React.memo(JournalCard);

// 2. Use useCallback for handlers passed to lists
const handlePress = useCallback((id: string) => {
  navigate('Detail', { id });
}, [navigate]);

// 3. Use getItemLayout for fixed-height lists
getItemLayout={(data, index) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
})}

// 4. Virtualize long lists
<FlatList
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={5}
/>

// 5. Optimize images
<Image
  source={{ uri, cache: 'force-cache' }}
  resizeMode="cover"
/>
```

### 10.3 Bundle Size Management

- Use dynamic imports for rarely-used screens
- Tree-shake unused icon imports
- Compress images before bundling
- Monitor bundle size in CI

---

## 11. Theming System

### 11.1 Theme Structure

```typescript
// theme/types.ts
interface Theme {
  // Identity
  isDark: boolean;

  // Colors
  colors: {
    // Backgrounds
    background: string;
    surface: string;
    surfaceElevated: string;

    // Brand
    primary: string;
    primaryLight: string;
    secondary: string;
    accent: string;

    // Text
    text: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;

    // Semantic
    success: string;
    warning: string;
    error: string;
    info: string;

    // UI
    border: string;
    divider: string;
    overlay: string;
  };

  // Typography
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    h4: TextStyle;
    body: TextStyle;
    bodySmall: TextStyle;
    caption: TextStyle;
    label: TextStyle;
    button: TextStyle;
  };

  // Spacing
  spacing: { xs; sm; md; lg; xl; '2xl'; '3xl' };

  // Border Radius
  radius: { sm; md; lg; xl; '2xl'; full };

  // Shadows
  shadows: { sm; md; lg; xl };
}
```

### 11.2 Theme Switching

```typescript
// Support automatic and manual theme switching
const ThemeContext = createContext<{
  theme: Theme;
  colorScheme: 'light' | 'dark' | 'system';
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
}>();
```

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

```
          ┌─────────┐
          │  E2E    │  10% - Critical user flows
          ├─────────┤
       ┌──┴─────────┴──┐
       │  Integration   │  30% - Screen rendering
       ├───────────────┤
    ┌──┴───────────────┴──┐
    │     Unit Tests       │  60% - Components, hooks
    └─────────────────────┘
```

### 12.2 What to Test

| Layer             | What to Test                           | Tools     |
| ----------------- | -------------------------------------- | --------- |
| **Unit**          | Component renders, props, states       | Jest, RTL |
| **Integration**   | Screen renders with mocked data        | RTL       |
| **E2E**           | Critical flows (onboarding, recording) | Detox     |
| **Visual**        | Screenshot comparison                  | Storybook |
| **Accessibility** | a11y compliance                        | jest-axe  |

### 12.3 Test IDs Convention

```typescript
// Use consistent testID naming:
// [screen]_[component]_[action/state]

testID = 'welcome_getStarted_button';
testID = 'journal_entry_card_1';
testID = 'voice_record_button';
testID = 'settings_logout_button';
```

---

## 13. Implementation Checklist

### 13.1 Per-Screen Checklist

Before marking any screen as complete:

```markdown
## Screen: [Name]

### Layout

- [ ] Safe areas handled
- [ ] Keyboard avoiding implemented (if forms)
- [ ] Scroll behavior correct
- [ ] Footer sticky (if applicable)

### States

- [ ] Loading state
- [ ] Empty state
- [ ] Error state
- [ ] Success state

### Interactions

- [ ] All buttons have press feedback
- [ ] Haptics on key actions
- [ ] Pull to refresh (if list)
- [ ] Swipe gestures (if applicable)

### Animations

- [ ] Entry animation
- [ ] Exit animation
- [ ] State transitions smooth

### Accessibility

- [ ] All elements labeled
- [ ] Touch targets 44pt minimum
- [ ] Contrast ratios pass
- [ ] Screen reader tested

### Performance

- [ ] No layout thrashing
- [ ] Lists virtualized
- [ ] Images optimized
- [ ] No memory leaks

### Edge Cases

- [ ] Long text handling
- [ ] Network failure
- [ ] Empty data
- [ ] Rapid tapping
```

### 13.2 Before App Store Submission

```markdown
## Pre-Submission Checklist

### Visual Polish

- [ ] All screens match design specs
- [ ] Consistent spacing throughout
- [ ] No cut-off text
- [ ] No overlapping elements
- [ ] Dark mode tested
- [ ] All device sizes tested

### Performance

- [ ] Cold start < 2s
- [ ] No jank during scroll
- [ ] Animations at 60fps
- [ ] Memory usage stable

### Accessibility

- [ ] VoiceOver full pass
- [ ] Dynamic Type tested
- [ ] Color contrast verified
- [ ] Reduce Motion respected

### Quality

- [ ] No console warnings
- [ ] No TypeScript errors
- [ ] Lint passing
- [ ] Tests passing
```

---

## Appendix A: Quick Reference

### Color Contrast Checker

- Primary on White: ✓ 4.5:1
- Text on Background: ✓ 7:1
- Secondary Text: ✓ 4.5:1

### Animation Timing Reference

```
Instant:    100ms  - Micro-interactions
Fast:       200ms  - Feedback
Normal:     300ms  - Transitions
Slow:       500ms  - Complex animations
Slower:     800ms  - Celebrations
```

### Touch Target Sizes

```
Minimum:    44pt x 44pt
Comfortable: 48pt x 48pt
Large:      56pt x 56pt (primary actions)
```

---

## Document History

| Version | Date     | Changes          |
| ------- | -------- | ---------------- |
| 1.0     | Jan 2026 | Initial document |

---

_This is a living document. Update as patterns evolve and new best practices emerge._

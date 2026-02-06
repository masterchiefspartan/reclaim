# Reclaim Frontend Implementation Checklist

Based on the UI mockups analysis, this document outlines what needs to be built to achieve a cohesive, polished application.

## Brand Kit Created ✅

The comprehensive brand kit has been created at `src/theme/brandKit.ts` and integrated into the theme system. It includes:

- **Colors**: Warm amber primary (#F5A623), cream background (#F5F2ED), teal secondary
- **Typography**: Complete scale from display to caption
- **Spacing**: 4px base unit system
- **Shadows**: Soft, warm shadow presets
- **Component Tokens**: Buttons, cards, inputs, navigation
- **Mood System**: Emoji-first mood colors and labels

---

## Component Implementation Status

### Core UI Components

| Component | Status | Priority | Notes |
|-----------|--------|----------|-------|
| HeroButton | ✅ Exists | - | Uses brand kit colors |
| HeroCard | ✅ Exists | - | Uses warm aesthetic |
| HeroText | ✅ Exists | - | Uses brand typography |
| HeroInput | ✅ Exists | - | - |
| HeroModal | ✅ Exists | - | - |
| HeroBadge | ✅ Exists | - | - |
| HeroAvatar | ✅ Exists | - | - |
| HeroDivider | ✅ Exists | - | - |
| HeroSwitch | ✅ Exists | - | - |
| PrimaryButton | ✅ Updated | - | Added amber glow, spring animation, variants |

### New Components Created

| Component | Status | Location |
|-----------|--------|----------|
| **CalendarStrip** | ✅ Complete | `src/components/calendar/CalendarStrip.tsx` |
| **AffirmationCard** | ✅ Complete | `src/components/home/AffirmationCard.tsx` |
| **QuickJournalCard** | ✅ Complete | `src/components/home/QuickJournalCard.tsx` |
| **StatCard** | ✅ Complete | `src/components/home/StatCard.tsx` |
| **AudioPlayer** | ✅ Complete | `src/components/audio/AudioPlayer.tsx` |
| **MoodDropdown** | ✅ Complete | `src/components/common/MoodDropdown.tsx` |
| **EntryListItem** | ✅ Complete | `src/components/journal/EntryListItem.tsx` |
| **EmotionBars** | ✅ Complete | `src/components/journal/EmotionBars.tsx` |
| **HighlightsList** | ✅ Complete | `src/components/journal/HighlightsList.tsx` |

---

## Screen Implementation Status

### Screens Updated

| Screen | Status | Changes Made |
|--------|--------|--------------|
| **HomeScreen** | ✅ Complete | Calendar strip, affirmation card, quick journal cards, stat cards, entry list |
| **JournalListScreen** | ✅ Complete | Renamed to "Journey", uses EntryListItem, improved header |
| **EntryDetailScreen** | ✅ Complete | Title, tags, audio player, transcript, highlights, mood dropdown |

### Screens to Build/Update Later

| Screen | Status | Priority | Notes |
|--------|--------|----------|-------|
| **ExploreScreen** | 🔄 Uses DashboardScreen | Medium | Framework/content discovery |
| **ProfileScreen** | 🔄 Uses SettingsScreen | Medium | User settings and stats |

---

## Detailed Component Specifications

### 1. CalendarStrip

```
Location: src/components/calendar/CalendarStrip.tsx
Props:
  - selectedDate: Date
  - onDateSelect: (date: Date) => void
  - startDate?: Date (defaults to -2 days from today)
  - endDate?: Date (defaults to +2 days from today)

Features:
  - Horizontal scroll showing 5 days
  - Abbreviated day name (Mon, Tue, etc.)
  - Date number
  - Selected state: Amber background, white text
  - Today indicator
```

### 2. AffirmationCard

```
Location: src/components/home/AffirmationCard.tsx
Props:
  - title: string (e.g., "Daily affirmations")
  - subtitle: string
  - author?: string
  - onPress?: () => void

Features:
  - Golden/amber (#F5A623) background
  - Dark text for contrast
  - Avatar/icon for author
  - Rounded corners (20px)
```

### 3. QuickJournalCard

```
Location: src/components/home/QuickJournalCard.tsx
Props:
  - emoji: string
  - title: string
  - prompt: string
  - tags: string[]
  - onPress: () => void

Features:
  - White card with border
  - Emoji prominently displayed
  - Title + prompt text
  - Tag pills at bottom
  - Pressable with animation
```

### 4. EmotionBars

```
Location: src/components/journal/EmotionBars.tsx
Props:
  - emotions: { type: MoodType; percentage: number }[]

Features:
  - Vertical bars for each emotion
  - Color coded by mood type
  - Percentage labels below
  - Emotion name labels
  - Animated fill on mount
```

### 5. AudioPlayer

```
Location: src/components/audio/AudioPlayer.tsx
Props:
  - audioUrl: string
  - duration: number (seconds)
  - onPlayStateChange?: (isPlaying: boolean) => void

Features:
  - Play/pause button
  - Progress bar/waveform
  - Current time / total duration
  - Seek functionality
```

### 6. MoodDropdown

```
Location: src/components/common/MoodDropdown.tsx
Props:
  - value: MoodType
  - onChange: (mood: MoodType) => void

Features:
  - Displays current selection with emoji + label
  - Opens dropdown/modal with all options
  - Each option: emoji + mood name
  - Checkmark on selected option
```

### 7. TabBar (Bottom Navigation)

```
Location: src/navigation/TabBar.tsx
Tabs:
  - Home (house icon)
  - Explore (sparkles icon)
  - Journey (journal icon)
  - Profile (person icon)

Features:
  - 80px height with safe area
  - Active state: amber color
  - Inactive state: grey
  - Icon + label for each tab
```

---

## Style Updates Required

### Global Updates

1. **Background Color**: Change from pink-tinted (#FFF7FA) to warm cream (#F5F2ED)
2. **Primary Color**: Change from pink (#B84A7C) to amber (#F5A623)
3. **Card Shadows**: Update to softer, warmer shadows
4. **Border Radius**: Standardize to 16-20px for cards

### Component-Specific Updates

```typescript
// Button primary solid
backgroundColor: '#F5A623' (was '#B84A7C')
pressedColor: '#D4890F'

// Card
backgroundColor: '#FFFFFF'
borderColor: '#E8E5E0'
borderRadius: 16
shadow: card preset from brandKit

// Tab bar
activeColor: '#F5A623'
inactiveColor: '#999999'
```

---

## Implementation Priority

### Phase 1: Foundation ✅ COMPLETE

1. ✅ Create brand kit (`src/theme/brandKit.ts`)
2. ✅ Update color system (`src/theme/colors.ts`)
3. ✅ Update typography system (`src/theme/typography.ts`)
4. ✅ Update spacing system (`src/theme/spacing.ts`)
5. ✅ Update Tailwind config (`tailwind.config.js`)
6. ✅ Update TabBar navigation (Home, Explore, Journey, Profile)
7. ✅ Update PrimaryButton with animations

### Phase 2: Core Components ✅ COMPLETE

1. ✅ Build CalendarStrip component
2. ✅ Build AffirmationCard component
3. ✅ Build QuickJournalCard component
4. ✅ Build StatCard component
5. ✅ Build AudioPlayer component
6. ✅ Build MoodDropdown component
7. ✅ Build EntryListItem component
8. ✅ Build EmotionBars component
9. ✅ Build HighlightsList component

### Phase 3: Core Screens ✅ COMPLETE

1. ✅ Update HomeScreen with all new components
2. ✅ Update JournalListScreen (Journey)
3. ✅ Update EntryDetailScreen

### Phase 4: Remaining Work

1. [ ] Build dedicated ExploreScreen (currently uses DashboardScreen)
2. [ ] Build dedicated ProfileScreen (currently uses SettingsScreen)
3. [ ] Test dark mode support
4. [ ] Accessibility audit
5. [ ] Performance optimization
6. [ ] Add more animations and micro-interactions

---

## File Structure for New Components

```
src/components/
├── audio/
│   └── AudioPlayer.tsx          # NEW
├── calendar/
│   └── CalendarStrip.tsx        # NEW
├── common/
│   ├── MoodDropdown.tsx         # NEW
│   └── ...existing
├── home/
│   ├── AffirmationCard.tsx      # NEW
│   ├── QuickJournalCard.tsx     # NEW
│   └── StatCard.tsx             # NEW
├── journal/
│   ├── EmotionBars.tsx          # NEW
│   ├── EntryListItem.tsx        # NEW
│   └── HighlightsList.tsx       # NEW
└── ...existing
```

---

## Testing Checklist

After implementing each component:

- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Accessibility labels present
- [ ] Touch targets >= 48px
- [ ] Animations smooth (60fps)
- [ ] Handles loading states
- [ ] Handles error states
- [ ] Handles empty states
- [ ] TypeScript types correct
- [ ] Follows brand kit tokens

---

## Notes

- The design uses a warm, welcoming aesthetic suitable for recovery users
- Emoji-first approach for moods provides immediate emotional connection
- Golden amber evokes warmth, hope, and positivity
- Cream backgrounds reduce eye strain for extended use
- Large touch targets (48px+) accommodate users with impaired motor control

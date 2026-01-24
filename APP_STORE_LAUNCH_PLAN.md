# Re:Claim App Store Launch Plan

## Overview

This document outlines the complete roadmap for launching Re:Claim on the Apple App Store, including pre-launch requirements, testing strategy, and App Store Optimization (ASO).

---

## Phase 1: Foundation Verification (Current)

### 1.1 Local Testing Checklist

- [ ] App builds without errors
- [ ] App runs on iOS Simulator
- [ ] App runs on physical iOS device
- [ ] All navigation flows work correctly
- [ ] Authentication flow complete (sign up, login, logout)
- [ ] Voice recording functions properly
- [ ] Firebase connection verified
- [ ] RevenueCat integration working
- [ ] No console errors or warnings in production mode

### 1.2 Core Feature Verification

| Feature            | Status | Notes                                      |
| ------------------ | ------ | ------------------------------------------ |
| Onboarding Flow    |        | Welcome → Value slides → Sign up → Profile |
| Voice Journal      |        | Record → Transcribe → AI Response          |
| Journal List       |        | View entries, search, filter               |
| Dashboard          |        | Stats, mood trends, insights               |
| Settings           |        | Account, notifications, subscription       |
| Paywall            |        | RevenueCat integration                     |
| Voice Conversation |        | Real-time AI conversation                  |

---

## Phase 2: Apple Developer Setup

### 2.1 Apple Developer Account

- [ ] Apple Developer Program membership ($99/year)
- [ ] Account: https://developer.apple.com
- [ ] Enable App Store Connect access

### 2.2 App Store Connect Setup

- [ ] Create new app in App Store Connect
- [ ] Bundle ID: `com.masterchiefspartan.recovervoice`
- [ ] Primary language: English (U.S.)
- [ ] Category: Health & Fitness (Primary), Lifestyle (Secondary)
- [ ] Content Rights: Confirm you own/licensed all content

### 2.3 Certificates & Provisioning

EAS Build handles this automatically, but ensure:

- [ ] Apple Developer account linked to Expo
- [ ] Push notification capability enabled
- [ ] App Groups enabled (if needed)

---

## Phase 3: App Configuration

### 3.1 App Icons (Required)

All icons must be:

- PNG format, no transparency, no rounded corners
- sRGB or P3 color space

| Size      | Usage        |
| --------- | ------------ |
| 1024x1024 | App Store    |
| 180x180   | iPhone (@3x) |
| 120x120   | iPhone (@2x) |
| 167x167   | iPad Pro     |
| 152x152   | iPad         |
| 76x76     | iPad (@1x)   |

**Action:** Create high-quality app icon in brand colors (recovery pink/teal gradient)

### 3.2 Screenshots (Required)

Minimum 3 screenshots per device size:

| Device      | Size        |
| ----------- | ----------- |
| iPhone 6.7" | 1290 x 2796 |
| iPhone 6.5" | 1242 x 2688 |
| iPhone 5.5" | 1242 x 2208 |
| iPad 12.9"  | 2048 x 2732 |

**Recommended Screenshots:**

1. Voice journal recording screen
2. AI conversation interface
3. Dashboard with mood insights
4. Journal entries list
5. Celebration/progress screen

### 3.3 App Preview Videos (Optional but Recommended)

- 15-30 seconds
- Show core value proposition
- No hands/bezels in frame

---

## Phase 4: EAS Build Setup

### 4.1 Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 4.2 Configure EAS (eas.json created below)

```bash
eas build:configure
```

### 4.3 Build Commands

```bash
# Development build (for testing)
eas build --platform ios --profile development

# Preview build (TestFlight internal)
eas build --platform ios --profile preview

# Production build (App Store)
eas build --platform ios --profile production
```

### 4.4 Submit to App Store

```bash
eas submit --platform ios
```

---

## Phase 5: App Store Listing

### 5.1 App Information

- **App Name:** Re:Claim - Voice Journal (30 char max)
- **Subtitle:** AI-Powered Recovery Companion (30 char max)
- **Promotional Text:** (170 char, can update anytime)
  > Transform your recovery journey with voice journaling. Speak your thoughts, gain AI-powered insights, and track your emotional progress daily.

### 5.2 Description (4000 char max)

```
Re:Claim is your personal voice-powered companion for recovery and self-reflection.

SPEAK YOUR TRUTH
Simply tap and talk. No typing required. Re:Claim captures your voice, transcribes it instantly, and creates meaningful journal entries from your spoken words.

AI-POWERED INSIGHTS
Our compassionate AI companion listens without judgment, offering thoughtful reflections and personalized insights to support your journey.

TRACK YOUR PROGRESS
• Visual mood tracking and trends
• Daily, weekly, and monthly insights
• Celebrate milestones and streaks
• See patterns in your emotional journey

FEATURES
• Voice-to-text journaling with instant transcription
• Real-time AI conversations for support
• Mood tracking and analytics
• Beautiful, calming interface
• Private and secure - your data stays yours
• Dark mode support

PRIVACY FIRST
Your journal entries are encrypted and private. We never share your personal data or use it for advertising.

SUBSCRIPTION
Re:Claim Pro unlocks unlimited entries, advanced AI features, and detailed analytics. Free trial available.

Start your recovery journey today. Your voice matters.
```

### 5.3 Keywords (100 char max)

```
journal,voice,recovery,mental health,mood,diary,AI,therapy,mindfulness,self-care,wellness,reflection
```

### 5.4 Support Information

- [ ] Support URL (required)
- [ ] Marketing URL (optional)
- [ ] Privacy Policy URL (required)

---

## Phase 6: Privacy & Compliance

### 6.1 Privacy Policy (Required)

Must include:

- What data is collected
- How data is used
- Data sharing practices
- Data retention policy
- User rights (deletion, export)
- Contact information

**Action:** Create privacy policy page and host at accessible URL

### 6.2 App Privacy Labels

Data types collected:

- [ ] Contact Info (email for account)
- [ ] Health & Fitness (mood data)
- [ ] User Content (journal entries, voice recordings)
- [ ] Identifiers (user ID)
- [ ] Usage Data (analytics)

Data linked to user:

- Contact Info, User Content, Health & Fitness

### 6.3 Age Rating

- Likely 4+ or 12+ depending on content
- No mature themes
- In-app purchases: Yes

### 6.4 Required Permissions

| Permission    | Usage Description                                                        |
| ------------- | ------------------------------------------------------------------------ |
| Microphone    | "Re:Claim needs microphone access to record your voice journal entries." |
| Notifications | "Re:Claim sends reminders to help you maintain your journaling habit."   |

---

## Phase 7: Testing Strategy

### 7.1 Internal Testing

- [ ] Test on multiple iOS versions (iOS 15, 16, 17, 18)
- [ ] Test on multiple device sizes
- [ ] Test in airplane mode (offline handling)
- [ ] Test with slow network
- [ ] Test subscription flows

### 7.2 TestFlight Beta

- [ ] Upload build to TestFlight
- [ ] Internal testers (up to 100)
- [ ] External testers (up to 10,000)
- [ ] Collect feedback for 1-2 weeks
- [ ] Fix critical bugs before submission

### 7.3 Pre-Submission Checklist

- [ ] No crashes on launch
- [ ] All features functional
- [ ] No placeholder content
- [ ] All links work
- [ ] Login/logout works
- [ ] Subscription purchase works
- [ ] Restore purchases works

---

## Phase 8: App Review Guidelines

### 8.1 Common Rejection Reasons to Avoid

1. **Incomplete Information** - Fill all metadata fields
2. **Bugs/Crashes** - Test thoroughly
3. **Placeholder Content** - Remove all "Lorem ipsum"
4. **Broken Links** - Verify support/privacy URLs
5. **Misleading** - Screenshots must reflect actual app
6. **Login Required** - Provide demo account if needed
7. **In-App Purchase Issues** - Test restore purchases

### 8.2 Health App Guidelines

Since Re:Claim involves mental health:

- Don't make medical claims
- Include appropriate disclaimers
- Don't replace professional help messaging
- Consider: "This app is not a substitute for professional medical advice"

### 8.3 Demo Account

Provide in App Review Information:

- Demo username
- Demo password
- Any special instructions

---

## Phase 9: Launch Timeline

### Week 1: Foundation

- [ ] Verify all features work
- [ ] Fix any critical bugs
- [ ] Update app icons and splash screen

### Week 2: Build & Configure

- [ ] Set up EAS Build
- [ ] Create first TestFlight build
- [ ] Set up App Store Connect listing

### Week 3: Content & Compliance

- [ ] Create app screenshots
- [ ] Write App Store description
- [ ] Create/host privacy policy
- [ ] Fill privacy labels

### Week 4: Beta Testing

- [ ] Internal TestFlight testing
- [ ] External beta if desired
- [ ] Collect and address feedback

### Week 5: Submission

- [ ] Final production build
- [ ] Submit for review
- [ ] Respond to any review feedback

### Week 6: Launch

- [ ] App approved and released
- [ ] Monitor crash reports
- [ ] Respond to initial reviews

---

## Phase 10: Post-Launch

### 10.1 Monitoring

- [ ] Firebase Crashlytics enabled
- [ ] RevenueCat revenue tracking
- [ ] App Store Connect analytics
- [ ] User reviews monitoring

### 10.2 Iteration

- Address user feedback
- Release bug fixes promptly
- Plan feature updates
- A/B test App Store listing

---

## Quick Commands Reference

```bash
# Run locally on iOS Simulator
npx expo start --ios

# Run on physical device
npx expo start --dev-client

# Build for TestFlight
eas build --platform ios --profile preview

# Build for App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios

# Check build status
eas build:list
```

---

## Resources

- [Apple App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

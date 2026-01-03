# RecoverVoice App Plan
# Complete App Experience, User Flows, and Design Specifications

**Last Updated:** December 2024  
**Status:** Comprehensive Planning Document  
**Purpose:** Serve as the blueprint for the entire application from a user experience perspective

---

## Table of Contents

1. [App Overview & Vision](#section-1-app-overview--vision)
2. [User Personas & Use Cases](#section-2-user-personas--use-cases)
3. [Core Features & Functionality](#section-3-core-features--functionality)
4. [User Journeys & Flows](#section-4-user-journeys--flows)
5. [Screen Inventory & Specifications](#section-5-screen-inventory--specifications)
6. [Navigation Structure](#section-6-navigation-structure)
7. [UI/UX Design Principles](#section-7-uiux-design-principles)
8. [User Stories & Acceptance Criteria](#section-8-user-stories--acceptance-criteria)
9. [Edge Cases & Error Handling](#section-9-edge-cases--error-handling)
10. [Platform-Specific Considerations](#section-10-platform-specific-considerations)

---

## Section 1: App Overview & Vision

### App Purpose

**RecoverVoice** is a voice-powered journaling application specifically designed to provide AI-powered emotional support for people recovering from physical therapy, injury, or surgery. The app serves as a constant companion that understands the unique challenges of physical recovery and provides personalized, empathetic support throughout the recovery journey.

### Core Value Proposition

> **"Recovery Is Hard. You Shouldn't Have To Do It Alone."**

RecoverVoice solves the critical problem of emotional isolation during physical recovery. When friends and family move on, when pain strikes at 2am, when motivation wanes, RecoverVoice is there - providing empathetic support, tracking progress, and celebrating milestones specific to recovery journeys.

### Unique Differentiators

**What Makes RecoverVoice Unique:**

✅ **Not generic journaling** - Specifically designed for PT recovery journeys  
✅ **Not general mental health** - Focused on the emotional challenges of physical recovery  
✅ **Not a generic AI companion** - Trained on recovery-specific patterns and terminology  
✅ **Recovery-phase aware** - Prompts and support adapt to Week 1 vs Week 8 challenges  
✅ **Recovery-relevant tracking** - Measures pain, mobility, exercise adherence (not generic metrics)  
✅ **Medical context** - Understands PT terminology, surgery phases, recovery milestones  
✅ **Evidence-based** - Tracks measurable progress to combat "recovery feels invisible" mentality  

### Target Audience

**Primary Users:**
- People recovering from surgery (knee, hip, shoulder, back, etc.)
- Individuals in physical therapy programs
- People recovering from sports injuries
- Post-surgical patients navigating recovery challenges

**Market Size:**
- 50M+ Americans undergo physical therapy annually
- Recovery typically spans 6-12 weeks per incident
- Emotional support needs peak at Week 2-4 (when support network fades)
- High willingness to pay for recovery support ($10-60/month)

### Key Differentiators

**Why This Works:**

1. **Massive Market**: Physical therapy recovery affects millions annually
2. **Predictable Patterns**: Recovery has predictable emotional phases (can anticipate struggles)
3. **Timeline-Bound**: 6-12 week recovery windows = clear ROI for users
4. **Medical Legitimacy**: PT clinics and surgeons can recommend it
5. **Insurance Potential**: Wellness benefits may cover it eventually
6. **Measurable Outcomes**: Clear before/after metrics (pain, mobility, mood)

**What Makes It Unique:**

🎯 AI trained on PT recovery journey patterns  
🎯 Prompts specific to recovery phases (Week 1 vs Week 8 are DIFFERENT)  
🎯 Celebrates recovery-specific milestones ("First day without crutches!")  
🎯 Tracks recovery-relevant KPIs (pain, mobility, exercise adherence)  
🎯 Language that understands PT terminology and challenges  
🎯 Integration potential with PT clinics/surgeons  

### App Goals

**Primary Goals:**
1. Provide emotional support during recovery isolation
2. Track measurable progress (pain, mood, mobility)
3. Build daily engagement habits through streaks
4. Celebrate recovery milestones
5. Create long-term retention through emotional connection

**Success Metrics:**

**Onboarding (Day 1):**
- Paywall conversion rate >15%
- Complete first voice journal >60%
- Receive first AI response >90%
- **Goal:** User feels heard and understood

**Early Engagement (Days 2-7):**
- Day 2 return rate >60%
- Complete 3+ entries in first week >50%
- View progress dashboard >40%
- **Goal:** Form daily habit

**Retention (Weeks 2-4):**
- Maintain 5+ entries per week >60%
- View dashboard 3+ times/week >50%
- Churn rate <15%
- **Goal:** User sees measurable progress

**Long-Term (Month 2+):**
- 30+ day streak achievement >30%
- Improved mood/pain metrics >70%
- Refer friends (NPS >50)
- **Goal:** User becomes advocate

### Business Model

**Pricing Strategy:**
- **Monthly:** $9.99/month
- **Annual:** $59.99/year (Save 40% - Best Value)
- **Free Trial:** 7-day free trial, then $9.99/month
- **Guarantee:** 30-Day Money-Back Guarantee

**Conversion Funnel:**
- 100% see pain awareness screens
- 80% create account
- 70% verify email
- 15-25% pay at paywall
- 90% complete setup
- 70% record first entry

**Time to First Value:** 3-5 minutes (if user pays immediately and records first journal)

---

## Section 2: User Personas & Use Cases

### Primary User Persona: Sarah

**Demographics:**
- **Name:** Sarah
- **Age:** 32
- **Situation:** 3 weeks post-ACL knee surgery
- **Location:** Urban/suburban
- **Occupation:** Marketing professional (works from home)

**Pain Points:**
- Friends who checked in at first... stopped calling
- Family who was worried... moved on
- Left alone at 2am when pain keeps her awake
- PT appointments are painful and demotivating
- Feels isolated and misunderstood
- Struggles with motivation to continue PT exercises
- Worries about recovery timeline and setbacks

**Goals:**
- Stay motivated during recovery
- Track progress objectively
- Have emotional support when needed
- Feel understood and validated
- See evidence that recovery is working

**When & Where She Uses the App:**
- **Morning:** After waking up, before PT (9:00 AM) - Daily check-in
- **Evening:** After PT session - Reflect on session
- **Night:** When pain keeps her awake (2:00 AM) - Need for support
- **Post-Appointment:** After doctor visits - Processing news

**Technology Comfort:**
- High - Uses smartphone daily
- Comfortable with voice assistants
- Values convenience and speed

**Emotional Journey:**
- **Week 1:** Optimistic but naive
- **Week 2-3:** Reality hits, motivation drops
- **Week 4-6:** Needs support most
- **Week 7+:** See progress, motivation returns

### Secondary Persona: Michael

**Demographics:**
- **Name:** Michael
- **Age:** 45
- **Situation:** 6 weeks post-hip replacement
- **Location:** Suburban
- **Occupation:** Construction manager (on disability leave)

**Pain Points:**
- Can't work, financial stress
- Family expects him to be "better" by now
- Frustrated with slow progress
- Worried about returning to work
- Depression creeping in

**Goals:**
- Mental health support
- Track recovery milestones
- Prepare for return to work
- Maintain hope during slow recovery

**Use Cases:**
- Daily morning check-ins
- After PT sessions
- When feeling discouraged
- Before medical appointments

### Tertiary Persona: Jennifer

**Demographics:**
- **Name:** Jennifer
- **Age:** 28
- **Situation:** 2 weeks post-shoulder surgery (athlete)
- **Location:** Urban
- **Occupation:** Fitness instructor (can't work)

**Pain Points:**
- Identity crisis (athlete can't train)
- Fear of never returning to sport
- Mental health struggles
- Isolation from athletic community

**Goals:**
- Maintain athletic identity
- Process emotional trauma of injury
- Track recovery for return to sport
- Stay mentally strong

**Use Cases:**
- Morning and evening check-ins
- After PT sessions
- When missing training
- Processing sport-related fears

### User Persona: Post-Surgical Patient (Generic)

**Common Characteristics:**
- Recently had surgery (within 6 months)
- In physical therapy program
- Experiencing emotional challenges
- Support network has faded
- Needs validation and encouragement

**Common Use Cases:**
1. **Daily Check-In:** Morning routine to start day
2. **PT Reflection:** After physical therapy sessions
3. **Pain Episodes:** When pain is particularly bad
4. **Milestone Celebration:** When progress is made
5. **Crisis Support:** When feeling discouraged or isolated
6. **Progress Review:** Viewing charts and trends

---

## Section 3: Core Features & Functionality

### Feature Prioritization

#### MVP Features (Phase 1 - Essential)

**Must Have:**
1. ✅ **Voice Recording** - Core functionality
2. ✅ **Real-time Transcription** - Deepgram integration
3. ✅ **AI Response Generation** - Claude API integration
4. ✅ **Mood Tracking** - Simple emoji selection
5. ✅ **Journal Entry Storage** - Save and retrieve entries
6. ✅ **Basic Dashboard** - Streak counter, mood chart
7. ✅ **Authentication** - Email/password signup/login
8. ✅ **Paywall** - Subscription management
9. ✅ **Onboarding** - Profile setup, permissions

**MVP User Flow:**
1. Welcome screen
2. Value prop (3 slides)
3. Create account
4. Email verification
5. Paywall
6. Profile setup
7. Permissions
8. Home screen
9. Record voice → See transcript
10. Get AI text response
11. Rate mood
12. Save entry
13. View entry list
14. Basic dashboard (streak + mood chart)

#### Phase 2 Features (Weeks 2-4)

**Important:**
1. ✅ **Guided Check-Ins** - Structured prompts for recovery phases
2. ✅ **Text-to-Speech** - ElevenLabs integration for AI responses
3. ✅ **Entry Detail View** - Full entry with audio playback
4. ✅ **Advanced Dashboard** - Pain tracking, mobility metrics
5. ✅ **Milestone System** - Recovery-specific achievements
6. ✅ **Search & Filter** - Find entries by date, mood, keyword
7. ✅ **Export Functionality** - PDF export of entries

#### Phase 3 Features (Month 2+)

**Nice to Have:**
1. ✅ **Proactive AI Insights** - Pattern recognition and suggestions
2. ✅ **Personalized Prompts** - AI-generated prompts based on history
3. ✅ **Social Sharing** - Share milestones (anonymized)
4. ✅ **PT Integration** - Link with PT clinic data
5. ✅ **Notification System** - Smart reminders and check-ins
6. ✅ **Advanced Analytics** - Detailed insights and trends
7. ✅ **Multiple Recovery Tracking** - Track multiple injuries over time

### Feature Descriptions

#### 1. Voice Recording

**Description:**
Core feature allowing users to record voice journals. Records audio, transcribes in real-time, and processes for AI response.

**Functionality:**
- Start/stop/pause recording
- Real-time transcription display (Deepgram)
- Audio playback of recordings
- Duration tracking
- Maximum recording length: 10 minutes

**User Flow:**
1. Tap "Start Recording" button
2. Speak for 2-3 minutes
3. See real-time transcript appear
4. Tap "Stop" when done
5. Audio uploads to Firebase Storage
6. Transcript sent to Claude API
7. AI response generated

**Technical Requirements:**
- Deepgram real-time transcription
- Firebase Storage for audio files
- Claude API for response generation
- Local audio playback capability

#### 2. AI Conversation

**Description:**
AI-powered companion that provides empathetic, recovery-specific responses to voice journals. Remembers conversation history and recovery context.

**Functionality:**
- Generates empathetic responses
- References previous entries
- Understands recovery terminology
- Provides encouragement and validation
- Suggests coping strategies
- Celebrates milestones

**Response Characteristics:**
- Empathetic and validating
- Recovery-specific language
- References user's specific injury/situation
- 2-3 paragraphs in length
- Actionable when appropriate

**Technical Requirements:**
- Claude API integration
- Conversation history storage
- Context management (recovery phase, injury type)
- Text-to-speech option (ElevenLabs)

#### 3. Mood Tracking

**Description:**
Simple, quick mood selection after each journal entry. Tracks mood trends over time.

**Functionality:**
- 5 emoji options: 😢 😐 🙂 😊 ✨
- Optional mood score (1-10)
- Mood trends visualization
- Correlation with pain levels
- Daily mood averages

**User Flow:**
1. After AI response, user sees mood selector
2. Tap emoji or drag slider
3. Optionally add mood score
4. Save with entry
5. Mood appears in dashboard trends

#### 4. Journal Management

**Description:**
Complete journal entry system with list view, detail view, search, and filtering.

**Functionality:**
- Chronological list of entries
- Entry detail view with audio playback
- Search by keyword or date
- Filter by mood, date range, keywords
- Edit entry metadata (mood, tags)
- Delete entries
- Export entries (PDF)

**Entry Components:**
- Date and time
- Audio recording (playback)
- Transcript
- AI response
- Mood indicator
- Tags (optional)
- Duration

#### 5. Dashboard/Analytics

**Description:**
Visual representation of recovery progress, streaks, mood trends, and milestones.

**Functionality:**
- Streak counter (consecutive days)
- Mood trend chart (14/30/90 days)
- Pain level tracking (1-10 scale)
- Mobility progress (% improvement)
- Milestones achieved
- Total entries count
- Voice time logged
- Progress insights

**Metrics Displayed:**
- Current streak
- Mood trend (improving/declining)
- Pain reduction percentage
- Mobility improvement
- Milestones unlocked
- Entry frequency

#### 6. Guided Check-Ins

**Description:**
Structured prompts for daily check-ins based on recovery phase. Reduces "blank page" anxiety and ensures consistent data tracking.

**Functionality:**
- Phase-specific prompts (Week 1 vs Week 8)
- 4 structured questions:
  1. Physical Progress
  2. Pain Level
  3. Emotional State
  4. Small Wins
- Option to skip to free journal
- Saves structured data for analytics

**Example Prompts (Week 2-3):**
- "How's your mobility today vs yesterday?"
- "Scale of 1-10, what's your pain?"
- "What emotions came up during PT?"
- "What's one thing you're proud of today?"

#### 7. Milestone System

**Description:**
Recovery-specific achievements that celebrate progress and maintain motivation.

**Milestones:**
- ✅ First Entry Complete
- ✅ 7-Day Warrior
- ✅ Two Week Champion
- ✅ One Month Streak
- ✅ First Day Without Crutches
- ✅ 50 Entries Logged
- ✅ Mood Improvement Week
- ✅ PT Adherence Champion

**Functionality:**
- Auto-detection of milestones
- Celebration animations
- Progress tracking toward next milestone
- Shareable achievements (optional)

---

## Section 4: User Journeys & Flows

### Complete User Journey: Sarah's First Month

#### Phase 1: Onboarding (First 5 Minutes)

**Screen 1: Welcome**
- "RecoverVoice - Your AI companion for recovery & resilience"
- [Get Started]

**Screen 2-4: Value Slides (Swipe Through)**
- Slide 1: "Voice Journaling - Talk about your struggles and wins"
- Slide 2: "AI Companion - An AI that remembers YOUR journey"
- Slide 3: "Track Progress - See your emotional and physical growth"
- [Next]

**Screen 5: Create Account**
- Email: ________________
- Password: _____________
- [Sign Up]

**Screen 6: Email Verification**
- "Check your email - verify to continue"
- [I've Verified]

**Screen 7: Paywall - The Emotional Sell**

**HEADLINE:**
"Recovery Is Hard. You Shouldn't Have To Do It Alone."

**THE PROBLEM:**
When recovering from surgery, the hardest part isn't physical pain. It's the loneliness.

- Friends who checked in at first... stop calling
- Family who was worried... moves on
- You're left alone at 2am when pain keeps you awake

Without support, most people:
- ❌ Miss PT appointments (low motivation)
- ❌ Experience depression/anxiety
- ❌ Feel isolated and misunderstood
- ❌ Give up when recovery gets hard

**WHAT YOU GET:**
- ✅ A companion who's ALWAYS there (3am? We're here)
- ✅ An AI that truly KNOWS you (remembers your entire journey)
- ✅ Proof of progress (visual charts showing you're healing)
- ✅ Structure when everything feels chaotic (daily guided check-ins)

**PRICING:**
- MONTHLY: $9.99/month [Select Monthly]
- ANNUAL: $59.99/year Save 40% - Best Value 🔥 [Select Annual]
- 7-DAY FREE TRIAL Then $9.99/month [Start Free Trial]

30-Day Money-Back Guarantee

**SOCIAL PROOF:**
- ⭐⭐⭐⭐⭐ "After hip replacement, my family went back to normal but I was still struggling. RecoverVoice became the one constant I could count on." - Michael, 45
- ⭐⭐⭐⭐⭐ "I was depressed 3 weeks post-op. Seeing my progress charts literally saved my mental health." - Jennifer, 28

[User selects payment → Subscribes]

**Screen 8: Profile Setup (Post-Payment)**
- What's your name? ________________
- What are you recovering from? ________________
- When did your surgery happen? [Date Picker]
- What's your biggest struggle? ________________
- [Continue]

**Screen 9: Permissions**
- 🎙️ Microphone Access (to record voice journals) [Allow]
- 🔔 Notifications (daily check-in reminders) [Allow]
- [Finish Setup]

#### Phase 2: First Session (Next 5-10 Minutes)

**Screen 10: Home Screen - Day 1**
- 👋 Welcome, Sarah!
- 🎙️ Start Your First Voice Journal [Tap to Begin]
- 💭 Suggested Prompts:
  - How are you feeling today?
  - What's been hardest about recovery?
  - What are you worried about?

**Screen 11: Voice Recording (CORE FEATURE)**
- 🎙️ Large microphone icon
- Recording... 0:23
- Real-time transcript display:
  "Today was really hard. My knee is swollen and painful. I tried to do my PT..."
- [⏸️ Pause] [⏹️ Stop]

**User Flow:**
- User talks for 2-3 minutes
- Voice converts to text in real-time (Deepgram)
- Transcript sent to Claude API when user stops
- AI generates empathetic response

**Screen 12: Processing**
- ⏳ Your AI companion is listening and thinking...
- Loading indicator

**Screen 13: AI Response**
- 🤖 Your AI Companion
- Response text:
  "Sarah, I hear how frustrating today was. Swelling at 3 weeks post-surgery is completely normal, even though it doesn't feel that way. The fact that you attempted your PT exercises despite pain? That's real strength..."
- 🔊 [Listen to Response]
- How did this make you feel?
- 😢 😐 🙂 😊 ✨ (User taps mood)
- [Save Entry]

**CRITICAL MOMENT:** User feels validated and understood

**Screen 14: Celebration**
- ⭐ First Entry Complete! 🎉
- You've started your recovery journey. Come back tomorrow!
- 🔥 Day 1 Streak Started
- [View Dashboard] [Back to Home]

#### Phase 3: Daily Habit (Days 2-7)

**Notification (9:00 AM Daily):**
- 📱 "Good morning Sarah! ☀️ Ready for today's check-in? Your 2-day streak is waiting. 🎙️"

**Home Screen - Day 3:**
- 🔥 3 Day Streak! Keep it going, Sarah
- 🎙️ Daily Check-In [Start Recording]
- 📊 This Week's Progress:
  - Mood: Trending Up ↗️ 😐 → 🙂 → 😊
  - Pain: Improving 8 → 6 → 5 → 4
  - Entries: 3/7 days
- 📖 Your Journal [View Past Entries] (3 entries)

**Key Changes:**
- ✅ Streak counter (gamification)
- ✅ Progress preview (motivation)
- ✅ Quick access to history

#### Phase 4: Structured Check-Ins (Week 2+)

**Guided Prompts Screen:**
- Daily Check-In - Day 5
- Let's talk about your recovery:
  1. Physical Progress: "How's your mobility today vs yesterday?"
  2. Pain Level: "Scale of 1-10, what's your pain?"
  3. Emotional State: "What emotions came up during PT?"
  4. Small Wins: "What's one thing you're proud of today?"
- [Start Guided Check-In] 🎙️
- [Skip to Free Journal]

**Why:** Reduces "blank page" anxiety, ensures consistent tracking data

#### Phase 5: Progress Visualization (Week 2+)

**Dashboard Screen:**
- 🔥 14 Day Streak! 🏆
- 📈 MOOD TREND (Last 14 Days) - Visual chart showing improvement
- 💪 PHYSICAL PROGRESS:
  - Pain: 8 → 4 (50% better!)
  - Mobility: +40%
- 🎯 MILESTONES:
  - ✅ First Entry Complete
  - ✅ 7-Day Warrior
  - ✅ Two Week Champion
  - 🔒 One Month Streak (14 more days!)
- 📊 BY THE NUMBERS:
  - Total Entries: 14
  - Total Voice Time: 47 mins
  - Most Common Emotion: Hopeful
- [View Detailed Stats]

**USER EMOTION:** "Wow, I AM making progress!"

#### Phase 6: Journal History (Ongoing)

**Journal Entries Screen:**
- Your Journal
- This Week ▼
  - Today, 9:15 AM 😊 Feeling hopeful
    - "Today I walked without my crutches for the first time! Only 10 steps but..."
    - 🎙️ 3m 24s [▶️ Play]
  - Yesterday, 9:02 AM 😐 Mixed emotions
    - "PT was brutal today... but I pushed through..."
    - 🎙️ 4m 12s [▶️ Play]
- Last Week ▼ [7 entries]

**Entry Detail View:**
- 📅 October 15, 2024 - 9:15 AM
- 😊 Feeling: Hopeful
- 🎙️ YOUR VOICE (3m 24s) [▶️ Play Audio]
- 📝 TRANSCRIPT (full text)
- 🤖 AI RESPONSE (full text)
- 📊 THIS DAY'S METRICS:
  - Pain: 4/10 (down from 6/10)
  - Mood: Hopeful ↗️
  - Mobility: +25%
- [Share Entry] [Export PDF] [Delete]

#### Phase 7: Long-Term Engagement (Month 2+)

**AI Proactive Support:**
- 🔥 47 Day Streak! 🏆
- 🤖 YOUR AI COMPANION NOTICED SOMETHING
- "Sarah, I've noticed over the last 3 weeks you mention that Tuesday PT appointments cause extra anxiety the night before. Your sleep drops on Monday nights, and you wake with more pain on Tuesdays. Want to talk about strategies for managing Tuesday anxiety? We could create a pre-PT routine together."
- [Yes, Let's Talk] [Maybe Later]

**KEY FEATURE:** AI remembers patterns and proactively helps

**Personalized Check-In:**
- 🤖 PERSONALIZED PROMPT
- "Good morning, Sarah! You're 7 weeks post-op. Last time you hit Week 7 (2 years ago with other knee), you mentioned hitting a motivation wall. How are you feeling today compared to that experience? What's different this time?"
- [Start Check-In]

**KEY FEATURE:** Deep memory creates emotional connection

### Emotional Journey Summary

**DAY 1: Discovery**
- Emotion: Hopeful → Curious → Skeptical
- Thought: "Will this actually help me?"

**FIRST SESSION: Breakthrough**
- Emotion: Hesitant → Surprised → Relieved → Validated
- Thought: "Wow, it actually understood me. This isn't generic."
- KEY MOMENT: AI response that references specific injury

**WEEK 1: Habit Formation**
- Emotion: Motivated → Accountable → Accomplished
- Thought: "I don't want to break my streak. This helps."
- KEY MOMENT: Day 3 seeing streak and progress trends

**WEEK 2: Evidence**
- Emotion: Surprised → Validated → Hopeful
- Thought: "My pain level HAS gone down. The charts prove it."
- KEY MOMENT: Dashboard showing measurable improvement

**MONTH 1: Transformation**
- Emotion: Empowered → Proud → Grateful → Resilient
- Thought: "I can't believe how far I've come. This app helped when I had no one."
- KEY MOMENT: 30-day streak + reading early entries

**MONTH 2+: Advocacy**
- Emotion: Loyal → Evangelical
- Thought: "Everyone recovering needs this. I can't imagine recovery without it."
- KEY MOMENT: Proactive AI insights showing deep understanding

### Detailed User Flows

#### Flow 1: First-Time User Journey

```
1. Download App
   ↓
2. Welcome Screen
   ↓
3. Value Slides (3 screens)
   ↓
4. Create Account
   ↓
5. Email Verification
   ↓
6. Paywall Screen
   ↓
7. Select Subscription
   ↓
8. Payment Processing
   ↓
9. Profile Setup
   ↓
10. Permissions Request
    ↓
11. Home Screen
    ↓
12. Start First Recording
    ↓
13. AI Response
    ↓
14. Mood Selection
    ↓
15. Save Entry
    ↓
16. Celebration Screen
```

#### Flow 2: Daily Journaling Flow

```
1. Notification Received (9:00 AM)
   ↓
2. Open App → Home Screen
   ↓
3. Tap "Start Recording"
   ↓
4. Record Voice (2-3 minutes)
   ↓
5. View Real-Time Transcript
   ↓
6. Stop Recording
   ↓
7. Processing Screen
   ↓
8. AI Response Display
   ↓
9. Mood Selection
   ↓
10. Save Entry
    ↓
11. Return to Home / View Dashboard
```

#### Flow 3: Viewing Journal History

```
1. Home Screen
   ↓
2. Tap "Your Journal"
   ↓
3. Journal List View
   ↓
4. Scroll Through Entries
   ↓
5. Tap Entry
   ↓
6. Entry Detail View
   ↓
7. Play Audio (optional)
   ↓
8. Read Transcript
   ↓
9. Read AI Response
   ↓
10. View Metrics
    ↓
11. [Share] [Export] [Delete] (optional)
```

#### Flow 4: Dashboard & Analytics

```
1. Home Screen
   ↓
2. Tap "Dashboard" or "View Progress"
   ↓
3. Dashboard Screen
   ↓
4. View Streak Counter
   ↓
5. View Mood Trend Chart
   ↓
6. View Pain Progress
   ↓
7. View Milestones
   ↓
8. View Statistics
   ↓
9. [View Detailed Stats] (optional)
```

#### Flow 5: Guided Check-In Flow

```
1. Home Screen
   ↓
2. Tap "Daily Check-In"
   ↓
3. Guided Prompts Screen
   ↓
4. View 4 Structured Questions
   ↓
5. Tap "Start Guided Check-In"
   ↓
6. Recording Screen
   ↓
7. Answer Questions (voice)
   ↓
8. Stop Recording
   ↓
9. Process Response
   ↓
10. AI Response (structured)
    ↓
11. Mood Selection
    ↓
12. Save Entry
```

#### Flow 6: Error Recovery Flow

```
1. Network Error During Recording
   ↓
2. Error Message Display
   ↓
3. "Retry" Option
   ↓
4. Audio Saved Locally
   ↓
5. Retry Upload
   ↓
6. Success → Continue Flow
```

---

## Section 5: Screen Inventory & Specifications

### Complete Screen List

#### Authentication Screens (5 screens)

**1. Welcome Screen**
- **Purpose:** First impression, brand introduction
- **Components:**
  - App logo
  - Tagline: "Your AI companion for recovery & resilience"
  - [Get Started] button
- **Data:** None
- **Navigation:** → Value Slides

**2. Value Slide 1: Voice Journaling**
- **Purpose:** Explain voice journaling feature
- **Components:**
  - Illustration/icon
  - Headline: "Voice Journaling"
  - Description: "Talk about your struggles and wins"
  - [Next] button
- **Data:** None
- **Navigation:** → Value Slide 2

**3. Value Slide 2: AI Companion**
- **Purpose:** Explain AI companion feature
- **Components:**
  - Illustration/icon
  - Headline: "AI Companion"
  - Description: "An AI that remembers YOUR journey"
  - [Next] button
- **Data:** None
- **Navigation:** → Value Slide 3

**4. Value Slide 3: Track Progress**
- **Purpose:** Explain progress tracking feature
- **Components:**
  - Illustration/icon
  - Headline: "Track Progress"
  - Description: "See your emotional and physical growth"
  - [Get Started] button
- **Data:** None
- **Navigation:** → Create Account

**5. Create Account Screen**
- **Purpose:** User registration
- **Components:**
  - Email input field
  - Password input field
  - [Sign Up] button
  - [Already have account? Login] link
- **Data:** Email, password
- **Validation:** Email format, password strength
- **Navigation:** → Email Verification

**6. Email Verification Screen**
- **Purpose:** Verify email address
- **Components:**
  - Message: "Check your email - verify to continue"
  - [I've Verified] button
  - [Resend Email] link
- **Data:** Email address
- **Navigation:** → Paywall

**7. Paywall Screen**
- **Purpose:** Convert to paid subscription
- **Components:**
  - Headline: "Recovery Is Hard. You Shouldn't Have To Do It Alone."
  - Problem description
  - Solution description
  - Pricing options (Monthly, Annual, Trial)
  - Social proof (testimonials)
  - [Select Plan] buttons
  - 30-Day Money-Back Guarantee text
- **Data:** None
- **Navigation:** → Payment Processing → Profile Setup

**8. Profile Setup Screen**
- **Purpose:** Collect recovery context
- **Components:**
  - Name input
  - Recovery type input (dropdown or text)
  - Surgery date picker
  - Biggest struggle input (textarea)
  - [Continue] button
- **Data:** Name, recovery type, surgery date, struggle
- **Validation:** All fields required
- **Navigation:** → Permissions

**9. Permissions Screen**
- **Purpose:** Request microphone and notification permissions
- **Components:**
  - Microphone permission request
  - Notification permission request
  - [Allow] buttons
  - [Finish Setup] button
- **Data:** Permission status
- **Navigation:** → Home Screen

#### Main App Screens (10+ screens)

**10. Home Screen**
- **Purpose:** Main entry point, daily check-in
- **Components:**
  - Welcome message with name
  - Streak counter
  - [Start Recording] button
  - Progress preview (mood, pain, entries)
  - Quick access to journal
  - Suggested prompts
- **Data:**
  - User name
  - Current streak
  - This week's progress (mood trend, pain trend, entry count)
  - Recent entries (last 3)
- **Navigation:**
  - → Recording Screen
  - → Journal List
  - → Dashboard
  - → Settings

**11. Voice Recording Screen**
- **Purpose:** Record voice journal entry
- **Components:**
  - Large microphone icon
  - Recording indicator (waveform or dots)
  - Timer display
  - Real-time transcript display
  - [Pause] button
  - [Stop] button
  - [Cancel] button
- **Data:**
  - Audio recording (streaming)
  - Real-time transcript
  - Duration
- **States:**
  - Recording
  - Paused
  - Processing
- **Navigation:**
  - → Processing Screen (after stop)
  - → Home Screen (if cancelled)

**12. Processing Screen**
- **Purpose:** Show processing status
- **Components:**
  - Loading indicator
  - Message: "Your AI companion is listening and thinking..."
  - Progress indicator
- **Data:** None
- **Navigation:** → AI Response Screen

**13. AI Response Screen**
- **Purpose:** Display AI response and collect mood
- **Components:**
  - AI avatar/icon
  - AI response text
  - [Listen to Response] button (TTS)
  - Mood selector (5 emojis)
  - Optional mood score slider (1-10)
  - [Save Entry] button
  - [Edit Response] button (future)
- **Data:**
  - AI response text
  - User mood selection
  - Mood score (optional)
- **Navigation:**
  - → Celebration Screen (after save)
  - → Home Screen (after save)

**14. Celebration Screen**
- **Purpose:** Celebrate completion and motivate return
- **Components:**
  - Celebration animation/icon
  - Message: "First Entry Complete! 🎉"
  - Streak indicator
  - [View Dashboard] button
  - [Back to Home] button
- **Data:**
  - Entry count
  - Current streak
- **Navigation:**
  - → Dashboard
  - → Home Screen

**15. Journal List Screen**
- **Purpose:** Display all journal entries
- **Components:**
  - Header: "Your Journal"
  - Filter/Sort options
  - Entry cards (scrollable list):
    - Date and time
    - Mood emoji
    - Entry preview (first few words)
    - Duration
    - [Play] button
  - [New Entry] button
  - Search bar
- **Data:**
  - List of journal entries
  - Entry metadata (date, mood, duration)
- **Navigation:**
  - → Entry Detail Screen (tap entry)
  - → Recording Screen (new entry)

**16. Entry Detail Screen**
- **Purpose:** Full view of individual journal entry
- **Components:**
  - Date and time header
  - Mood indicator
  - Audio player (play/pause)
  - Transcript section
  - AI Response section
  - Metrics section (pain, mood, mobility)
  - [Share Entry] button
  - [Export PDF] button
  - [Delete] button
  - [Edit] button (future)
- **Data:**
  - Complete entry data
  - Audio file
  - Transcript
  - AI response
  - Mood and metrics
- **Navigation:**
  - → Journal List (back)
  - → Share Sheet (iOS)
  - → Export confirmation

**17. Dashboard Screen**
- **Purpose:** Visual progress tracking
- **Components:**
  - Streak counter (prominent)
  - Mood trend chart (14/30/90 days)
  - Pain progress indicator
  - Mobility progress indicator
  - Milestones section
  - Statistics section:
    - Total entries
    - Total voice time
    - Most common emotion
  - [View Detailed Stats] button
- **Data:**
  - Streak data
  - Mood history
  - Pain history
  - Milestones achieved
  - Statistics
- **Navigation:**
  - → Detailed Stats Screen
  - → Home Screen

**18. Guided Check-In Screen**
- **Purpose:** Structured daily check-in prompts
- **Components:**
  - Header: "Daily Check-In - Day X"
  - 4 structured questions:
    1. Physical Progress
    2. Pain Level
    3. Emotional State
    4. Small Wins
  - [Start Guided Check-In] button
  - [Skip to Free Journal] button
- **Data:**
  - Current day number
  - Recovery phase (for phase-specific prompts)
- **Navigation:**
  - → Recording Screen (guided mode)
  - → Recording Screen (free mode)

**19. Settings Screen**
- **Purpose:** User preferences and account management
- **Components:**
  - Profile section:
    - Name
    - Email
    - Recovery type
    - Surgery date
  - Preferences section:
    - Notification settings
    - Reminder time
    - Language
  - Subscription section:
    - Current plan
    - [Manage Subscription] button
  - Privacy section:
    - Data export
    - Delete account
  - [Sign Out] button
- **Data:**
  - User profile
  - Preferences
  - Subscription status
- **Navigation:**
  - → Edit Profile
  - → Subscription Management
  - → Login Screen (sign out)

#### Error & Loading Screens (5 screens)

**20. Network Error Screen**
- **Purpose:** Handle network failures
- **Components:**
  - Error icon
  - Message: "Connection failed"
  - [Retry] button
  - [Save for Later] button (if applicable)
- **Data:** Error details
- **Navigation:** → Retry operation or → Home Screen

**21. Loading Screen**
- **Purpose:** Generic loading state
- **Components:**
  - Loading indicator
  - Optional message
- **Data:** None
- **Navigation:** → Next screen when loaded

**22. Empty State Screen**
- **Purpose:** Show when no data available
- **Components:**
  - Empty state illustration
  - Message: "No entries yet"
  - [Create First Entry] button
- **Data:** None
- **Navigation:** → Recording Screen

**23. Error Screen**
- **Purpose:** Handle unexpected errors
- **Components:**
  - Error icon
  - Error message
  - [Retry] button
  - [Contact Support] button
- **Data:** Error details
- **Navigation:** → Retry or → Support

**24. Offline Screen**
- **Purpose:** Handle offline scenarios
- **Components:**
  - Offline icon
  - Message: "You're offline"
  - Saved entries indicator
  - [View Saved Entries] button
- **Data:** Saved entries count
- **Navigation:** → Saved Entries List

### Screen Specifications Summary

**Total Screens:** 24 screens

**Categories:**
- Authentication: 9 screens
- Main App: 10 screens
- Error/Loading: 5 screens

**Key Interactions Per Screen:**
- Tap actions
- Swipe gestures (value slides)
- Long press (future features)
- Voice recording (mic button)
- Audio playback (play button)

---

## Section 6: Navigation Structure

### Navigation Hierarchy

```
App Navigation
├── Auth Stack (Unauthenticated)
│   ├── Welcome Screen
│   ├── Value Slides (3 screens)
│   ├── Create Account
│   ├── Email Verification
│   ├── Paywall
│   ├── Profile Setup
│   └── Permissions
│
└── Main Stack (Authenticated)
    ├── Bottom Tab Navigator
    │   ├── Home Tab
    │   │   ├── Home Screen
    │   │   ├── Recording Screen
    │   │   ├── Processing Screen
    │   │   ├── AI Response Screen
    │   │   └── Celebration Screen
    │   │
    │   ├── Journal Tab
    │   │   ├── Journal List Screen
    │   │   └── Entry Detail Screen
    │   │
    │   ├── Dashboard Tab
    │   │   ├── Dashboard Screen
    │   │   └── Detailed Stats Screen
    │   │
    │   └── Settings Tab
    │       └── Settings Screen
    │
    └── Modal Stack
        ├── Guided Check-In Modal
        ├── Share Sheet
        └── Export Modal
```

### Navigation Patterns

#### Bottom Tab Navigation

**Tabs (4 tabs):**
1. **Home** - Main entry point, daily check-in
2. **Journal** - View all entries
3. **Dashboard** - Progress and analytics
4. **Settings** - Preferences and account

**Tab Icons:**
- Home: 🏠 House icon
- Journal: 📖 Book icon
- Dashboard: 📊 Chart icon
- Settings: ⚙️ Gear icon

**Behavior:**
- Always visible when authenticated
- Badge indicator on Home tab (for notifications)
- Active tab highlighted

#### Stack Navigation

**Home Stack:**
- Home Screen (root)
- Recording Screen
- Processing Screen
- AI Response Screen
- Celebration Screen

**Journal Stack:**
- Journal List (root)
- Entry Detail Screen

**Dashboard Stack:**
- Dashboard Screen (root)
- Detailed Stats Screen

**Settings Stack:**
- Settings Screen (root)
- Edit Profile Screen
- Subscription Management Screen

#### Modal Navigation

**Modals:**
- Guided Check-In (slides up from bottom)
- Share Sheet (native iOS/Android)
- Export Options (modal)
- Error Messages (alert-style)

### Deep Linking Structure

**Supported Deep Links:**
- `recovervoice://home` - Home screen
- `recovervoice://journal` - Journal list
- `recovervoice://journal/{entryId}` - Specific entry
- `recovervoice://dashboard` - Dashboard
- `recovervoice://record` - Start recording
- `recovervoice://settings` - Settings

**Use Cases:**
- Push notifications → Deep link to specific screen
- External sharing → Deep link to entry
- Email links → Deep link to entry or dashboard

### Navigation Flow Examples

**Flow 1: Daily Check-In**
```
Home Screen
  ↓ (tap Start Recording)
Recording Screen
  ↓ (stop recording)
Processing Screen
  ↓ (auto)
AI Response Screen
  ↓ (save entry)
Celebration Screen
  ↓ (tap Back to Home)
Home Screen
```

**Flow 2: Viewing Past Entry**
```
Home Screen
  ↓ (tap View Past Entries)
Journal List Screen
  ↓ (tap entry)
Entry Detail Screen
  ↓ (back)
Journal List Screen
```

**Flow 3: Viewing Progress**
```
Home Screen
  ↓ (tap Dashboard or Dashboard tab)
Dashboard Screen
  ↓ (tap View Detailed Stats)
Detailed Stats Screen
```

---

## Section 7: UI/UX Design Principles

### Design System Overview

**Design Philosophy:**
- Warm, empathetic, supportive
- Clean and uncluttered
- Recovery-focused (not clinical)
- Celebratory of progress
- Respectful of struggle

**Core Principles:**
1. **Empathy First** - Every design decision prioritizes emotional connection
2. **Progress Visibility** - Always show progress, never hide it
3. **Simplicity** - Reduce cognitive load during recovery
4. **Accessibility** - Usable by people in pain, with limited mobility
5. **Celebration** - Celebrate small wins, not just big milestones

### Color Palette

**Primary Colors:**
- **Recovery Blue:** `#4A90E2` - Trust, calm, healing
- **Progress Green:** `#52C41A` - Growth, improvement, success
- **Warm Orange:** `#FF8C42` - Energy, warmth, encouragement

**Secondary Colors:**
- **Mood Sad:** `#FF6B6B` - Red for difficult emotions
- **Mood Neutral:** `#FFD93D` - Yellow for neutral
- **Mood Happy:** `#6BCF7F` - Green for positive
- **Background:** `#F8F9FA` - Light gray background
- **Text Primary:** `#2C3E50` - Dark gray text
- **Text Secondary:** `#7F8C8D` - Medium gray text

**Semantic Colors:**
- **Success:** `#52C41A`
- **Warning:** `#FAAD14`
- **Error:** `#FF4D4F`
- **Info:** `#1890FF`

### Typography

**Font Families:**
- **Primary:** System fonts (SF Pro iOS, Roboto Android)
- **Fallback:** Sans-serif

**Font Sizes:**
- **H1 (Headlines):** 32pt / 2rem
- **H2 (Section Headers):** 24pt / 1.5rem
- **H3 (Card Titles):** 20pt / 1.25rem
- **Body (Default):** 16pt / 1rem
- **Body Small:** 14pt / 0.875rem
- **Caption:** 12pt / 0.75rem

**Font Weights:**
- **Bold:** 700 (Headlines, emphasis)
- **Semibold:** 600 (Subheadings)
- **Regular:** 400 (Body text)
- **Light:** 300 (Secondary text)

**Line Height:**
- Headlines: 1.2
- Body: 1.5
- Dense text: 1.4

### Component Library

#### Buttons

**Primary Button:**
- Background: Recovery Blue (#4A90E2)
- Text: White
- Padding: 16px vertical, 24px horizontal
- Border radius: 8px
- Font: Semibold, 16pt
- Height: 48px minimum

**Secondary Button:**
- Background: Transparent
- Border: 1px Recovery Blue
- Text: Recovery Blue
- Padding: 16px vertical, 24px horizontal
- Border radius: 8px

**Text Button:**
- Background: Transparent
- Text: Recovery Blue
- Padding: 8px vertical, 16px horizontal
- No border

**States:**
- Default
- Pressed (slightly darker)
- Disabled (50% opacity)
- Loading (spinner)

#### Cards

**Entry Card:**
- Background: White
- Border radius: 12px
- Shadow: Subtle elevation
- Padding: 16px
- Margin: 8px vertical
- Border: 1px light gray (optional)

**Dashboard Card:**
- Background: White
- Border radius: 16px
- Shadow: Medium elevation
- Padding: 24px
- Margin: 16px

#### Input Fields

**Text Input:**
- Background: White
- Border: 1px light gray
- Border radius: 8px
- Padding: 12px
- Font: 16pt
- Height: 48px
- Focus state: Blue border, 2px

**Text Area:**
- Same as text input
- Height: Auto (min 100px)
- Multiline: Yes

#### Icons

**Icon Size:**
- Small: 16px
- Medium: 24px
- Large: 32px
- XLarge: 48px

**Icon Style:**
- Outlined style (not filled)
- Consistent stroke width
- Accessible contrast

**Key Icons:**
- 🎙️ Microphone (recording)
- 📖 Journal (entries)
- 📊 Dashboard (analytics)
- ⚙️ Settings (preferences)
- 🔥 Streak (fire icon)
- 😊 Mood (emoji-based)

### Animation & Transitions

**Animation Principles:**
- Subtle and supportive
- Never jarring or distracting
- Celebrate positive moments
- Guide attention

**Transitions:**
- Screen transitions: 300ms ease-in-out
- Button press: 100ms scale down
- Card appearance: 200ms fade + slide
- Progress updates: 500ms smooth

**Celebration Animations:**
- Entry completion: Confetti animation
- Milestone unlock: Burst animation
- Streak update: Pulse animation
- Progress improvement: Smooth chart animation

**Micro-interactions:**
- Recording button: Pulse animation
- Mood selection: Scale animation
- Loading states: Smooth spinner
- Success states: Checkmark animation

### Accessibility Requirements

**WCAG Compliance:**
- Target: WCAG 2.1 Level AA

**Text Accessibility:**
- Minimum text size: 14pt
- Color contrast: 4.5:1 minimum
- Support Dynamic Type (iOS)
- Support system font scaling

**Touch Targets:**
- Minimum size: 44x44pt (iOS), 48x48dp (Android)
- Adequate spacing between targets
- No overlapping interactive elements

**Screen Reader Support:**
- All interactive elements labeled
- Descriptive alt text for images
- Semantic HTML structure
- Focus management

**Motor Accessibility:**
- Large touch targets
- Swipe gestures optional (not required)
- Voice control support (where possible)
- One-handed operation possible

**Visual Accessibility:**
- High contrast mode support
- Color-blind friendly (not color-only indicators)
- Clear visual hierarchy
- Readable fonts

---

## Section 8: User Stories & Acceptance Criteria

### User Story Format

**As a** [user type]  
**I want** [goal]  
**So that** [benefit]

**Acceptance Criteria:**
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Authentication User Stories

#### US-001: User Registration

**As a** first-time user  
**I want** to create an account  
**So that** I can access the app and save my journal entries

**Acceptance Criteria:**
- [ ] User can enter email and password
- [ ] Email format is validated
- [ ] Password meets strength requirements (8+ chars, 1 uppercase, 1 number)
- [ ] Account creation succeeds
- [ ] Email verification is sent
- [ ] User is redirected to email verification screen
- [ ] Error messages are clear and helpful

#### US-002: Email Verification

**As a** new user  
**I want** to verify my email address  
**So that** I can access the full app features

**Acceptance Criteria:**
- [ ] Verification email is sent immediately
- [ ] User can resend verification email
- [ ] User can mark email as verified
- [ ] App verifies email status
- [ ] User proceeds to paywall after verification

#### US-003: Subscription Payment

**As a** verified user  
**I want** to subscribe to the app  
**So that** I can access all features

**Acceptance Criteria:**
- [ ] User sees paywall after email verification
- [ ] User can select monthly, annual, or trial plan
- [ ] Pricing is clearly displayed
- [ ] Payment processing works securely
- [ ] User receives confirmation
- [ ] Subscription status is saved
- [ ] User proceeds to profile setup after payment

### Voice Journaling User Stories

#### US-004: Record Voice Journal

**As a** user  
**I want** to record a voice journal entry  
**So that** I can express my thoughts and feelings

**Acceptance Criteria:**
- [ ] User can start recording with one tap
- [ ] Recording begins immediately
- [ ] Timer displays recording duration
- [ ] Real-time transcript appears while speaking
- [ ] User can pause/resume recording
- [ ] User can stop recording
- [ ] Audio is saved locally during recording
- [ ] Recording uploads when stopped
- [ ] Maximum recording length is 10 minutes

#### US-005: View Real-Time Transcript

**As a** user recording a journal entry  
**I want** to see my words transcribed in real-time  
**So that** I know my voice is being captured accurately

**Acceptance Criteria:**
- [ ] Transcript appears within 1 second of speaking
- [ ] Transcript is accurate (90%+ accuracy)
- [ ] Transcript scrolls automatically
- [ ] User can scroll to review transcript
- [ ] Punctuation is added automatically

#### US-006: Receive AI Response

**As a** user who recorded a journal entry  
**I want** to receive an empathetic AI response  
**So that** I feel heard and supported

**Acceptance Criteria:**
- [ ] AI response generates within 10 seconds
- [ ] Response is empathetic and validating
- [ ] Response references specific content from entry
- [ ] Response is recovery-relevant
- [ ] Response is 2-3 paragraphs in length
- [ ] Response is displayed clearly
- [ ] User can listen to response via TTS

### Mood Tracking User Stories

#### US-007: Rate Mood After Entry

**As a** user who received an AI response  
**I want** to rate how I'm feeling  
**So that** the app can track my emotional progress

**Acceptance Criteria:**
- [ ] Mood selector appears after AI response
- [ ] User can select from 5 emoji options
- [ ] User can optionally add mood score (1-10)
- [ ] Mood is saved with entry
- [ ] Mood appears in entry history
- [ ] Mood contributes to mood trends

### Journal Management User Stories

#### US-008: View Journal Entries

**As a** user  
**I want** to view all my journal entries  
**So that** I can reflect on my recovery journey

**Acceptance Criteria:**
- [ ] Entries are displayed in chronological order (newest first)
- [ ] Each entry shows date, time, mood, and preview
- [ ] User can scroll through entries
- [ ] User can tap entry to view details
- [ ] User can search entries by keyword
- [ ] User can filter entries by date range
- [ ] User can filter entries by mood

#### US-009: View Entry Details

**As a** user  
**I want** to view a complete journal entry  
**So that** I can read my transcript and AI response

**Acceptance Criteria:**
- [ ] Entry detail shows full date and time
- [ ] Entry detail shows mood indicator
- [ ] Entry detail shows audio player
- [ ] Entry detail shows full transcript
- [ ] Entry detail shows AI response
- [ ] Entry detail shows metrics (if available)
- [ ] User can play audio recording
- [ ] User can share entry
- [ ] User can export entry as PDF
- [ ] User can delete entry

### Dashboard User Stories

#### US-010: View Progress Dashboard

**As a** user  
**I want** to see my recovery progress  
**So that** I can see how far I've come

**Acceptance Criteria:**
- [ ] Dashboard displays current streak
- [ ] Dashboard shows mood trend chart (14 days)
- [ ] Dashboard shows pain progress
- [ ] Dashboard shows mobility progress
- [ ] Dashboard displays milestones achieved
- [ ] Dashboard shows statistics (total entries, voice time)
- [ ] Charts are interactive (tap for details)
- [ ] Data updates in real-time

#### US-011: View Streak Counter

**As a** user  
**I want** to see my daily streak  
**So that** I stay motivated to journal daily

**Acceptance Criteria:**
- [ ] Streak counter is prominently displayed
- [ ] Streak updates after each entry
- [ ] Streak resets if user misses a day
- [ ] Streak appears on home screen
- [ ] Streak appears on dashboard
- [ ] Streak is celebrated on milestones

### Guided Check-In User Stories

#### US-012: Complete Guided Check-In

**As a** user  
**I want** to complete a structured daily check-in  
**So that** I can track my recovery consistently

**Acceptance Criteria:**
- [ ] User sees 4 structured questions
- [ ] Questions are recovery-phase specific
- [ ] User can start guided check-in
- [ ] User can skip to free journal
- [ ] Recording includes all questions
- [ ] AI response addresses structured questions
- [ ] Entry saves with structured data

### Error Handling User Stories

#### US-013: Handle Network Errors

**As a** user  
**I want** the app to handle network errors gracefully  
**So that** I don't lose my journal entries

**Acceptance Criteria:**
- [ ] Error message is clear and helpful
- [ ] User can retry failed operation
- [ ] Audio is saved locally if upload fails
- [ ] Entry syncs when connection restored
- [ ] User is notified when sync completes

#### US-014: Handle Recording Failures

**As a** user  
**I want** the app to handle recording failures  
**So that** I can complete my journal entry

**Acceptance Criteria:**
- [ ] Error message explains the issue
- [ ] User can retry recording
- [ ] User can grant microphone permission if needed
- [ ] Partial recordings are saved if possible

### Definition of Done

**For each user story to be considered "done":**
- [ ] Feature implemented according to acceptance criteria
- [ ] Code reviewed and approved
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] UI/UX matches design specifications
- [ ] Accessibility requirements met
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] Tested on iOS device
- [ ] Tested on Android device
- [ ] Performance requirements met

---

## Section 9: Edge Cases & Error Handling

### Network Errors

#### Scenario: No Internet Connection

**User Action:** User tries to record entry  
**Error:** No internet connection  
**Handling:**
- Show clear error message: "No internet connection"
- Save audio locally
- Save transcript locally
- Queue entry for upload
- Show "Syncing" indicator when connection restored
- Auto-retry upload when connection available
- Notify user when sync completes

**UI Flow:**
```
Recording Screen
  ↓ (No connection)
Error Toast: "No internet connection"
  ↓ (Audio saved locally)
Home Screen (with sync indicator)
  ↓ (Connection restored)
Auto-upload in background
  ↓ (Success)
Toast: "Entry synced successfully"
```

#### Scenario: Slow Network Connection

**User Action:** User uploads audio file  
**Error:** Upload takes too long  
**Handling:**
- Show progress indicator
- Allow user to continue using app
- Upload continues in background
- Notify user when upload completes
- Retry with exponential backoff if fails

#### Scenario: API Timeout

**User Action:** Waiting for AI response  
**Error:** API request times out  
**Handling:**
- Show timeout message: "Taking longer than usual..."
- Auto-retry once
- If retry fails: "AI response unavailable. Try again?"
- Save entry without AI response
- Allow user to request AI response later

### Authentication Failures

#### Scenario: Invalid Credentials

**User Action:** User tries to login  
**Error:** Email/password incorrect  
**Handling:**
- Show error: "Invalid email or password"
- Highlight incorrect field
- Allow retry
- Show "Forgot Password?" link

#### Scenario: Account Not Verified

**User Action:** User tries to login  
**Error:** Email not verified  
**Handling:**
- Show message: "Please verify your email"
- Resend verification email option
- Redirect to verification screen

#### Scenario: Session Expired

**User Action:** User tries to access app  
**Error:** Authentication token expired  
**Handling:**
- Silent refresh if possible
- If refresh fails: Show login screen
- Preserve user's current state
- Restore state after re-authentication

### Recording Failures

#### Scenario: Microphone Permission Denied

**User Action:** User tries to record  
**Error:** Microphone permission not granted  
**Handling:**
- Show permission request dialog
- Explain why permission is needed
- Link to settings if permission denied
- Show instructions for enabling in settings

#### Scenario: Microphone Unavailable

**User Action:** User tries to record  
**Error:** Microphone hardware issue  
**Handling:**
- Show error: "Microphone unavailable"
- Check device permissions
- Suggest troubleshooting steps
- Allow manual text entry as fallback

#### Scenario: Recording Interrupted

**User Action:** Phone call interrupts recording  
**Error:** Recording stopped by system  
**Handling:**
- Save partial recording
- Show message: "Recording interrupted"
- Offer to resume or start over
- Preserve partial transcript if available

### API Failures

#### Scenario: Deepgram API Failure

**User Action:** User stops recording  
**Error:** Transcription service unavailable  
**Handling:**
- Show error: "Transcription unavailable"
- Save audio file
- Queue for retry
- Allow user to manually transcribe or skip
- Notify user when transcription completes

#### Scenario: Claude API Failure

**User Action:** User waits for AI response  
**Error:** AI service unavailable  
**Handling:**
- Show error: "AI response unavailable"
- Save entry without AI response
- Queue for retry
- Allow user to request AI response later
- Show "Try Again" button

#### Scenario: ElevenLabs TTS Failure

**User Action:** User taps "Listen to Response"  
**Error:** TTS service unavailable  
**Handling:**
- Show error: "Audio playback unavailable"
- Allow user to read text response
- Retry automatically
- Option to skip TTS

### Data Errors

#### Scenario: Corrupted Entry Data

**User Action:** User tries to view entry  
**Error:** Entry data corrupted  
**Handling:**
- Show error: "Entry unavailable"
- Attempt to recover partial data
- Show what data is available
- Allow user to delete corrupted entry
- Log error for debugging

#### Scenario: Storage Full

**User Action:** User tries to save entry  
**Error:** Device storage full  
**Handling:**
- Show error: "Storage full"
- Suggest freeing up space
- Allow cloud-only storage option
- Warn user if cloud storage also full

### Empty States

#### Scenario: No Journal Entries

**User Action:** User opens journal list  
**State:** No entries yet  
**UI:**
- Show empty state illustration
- Message: "No entries yet"
- Call-to-action: "Start Your First Entry"
- Button: [Create First Entry]

#### Scenario: No Progress Data

**User Action:** User opens dashboard  
**State:** Less than 7 days of data  
**UI:**
- Show partial dashboard
- Message: "Keep journaling to see trends"
- Show available data (streak, entry count)
- Hide charts until enough data

#### Scenario: No Search Results

**User Action:** User searches entries  
**State:** No matching entries  
**UI:**
- Show empty state illustration
- Message: "No entries found"
- Show search query
- Suggest modifying search
- [Clear Search] button

### Loading States

#### Scenario: Initial App Load

**State:** App is loading  
**UI:**
- Show loading spinner
- Show app logo
- Message: "Loading your recovery journey..."
- Progress indicator if possible

#### Scenario: Loading Entries

**State:** Fetching journal entries  
**UI:**
- Show skeleton screens
- Show loading indicator in list
- Maintain scroll position when loaded

#### Scenario: Processing Entry

**State:** Processing audio/transcription  
**UI:**
- Show processing screen
- Animated loading indicator
- Message: "Your AI companion is listening..."
- Progress indicator if possible

### Recovery Flows

#### Audio Upload Retry Flow

```
Recording Complete
  ↓
Upload Attempt
  ↓
Failed? → Save Locally
  ↓
Show Sync Indicator
  ↓
Retry Every 30 Seconds
  ↓
Success? → Remove Indicator
  ↓
Fail 5 Times? → Show Manual Retry Button
```

#### AI Response Retry Flow

```
Entry Saved
  ↓
Request AI Response
  ↓
Failed? → Save Entry Without Response
  ↓
Show "AI Response Unavailable"
  ↓
User Can:
- Try Again Now
- Try Later
- Continue Without Response
```

#### Network Reconnection Flow

```
App Detects Connection
  ↓
Check for Pending Uploads
  ↓
Upload in Background
  ↓
Notify User: "Entries Synced"
  ↓
Update UI
```

---

## Section 10: Platform-Specific Considerations

### iOS-Specific Features

#### Native iOS Features

**1. Siri Shortcuts**
- "Hey Siri, start my recovery journal"
- "Hey Siri, how's my recovery progress?"
- Integration with iOS Shortcuts app

**2. Apple Health Integration**
- Sync mood data to Health app
- Track pain levels in Health
- Share recovery metrics with Health

**3. Share Sheet Integration**
- Native iOS share sheet
- Share entries to Messages, Email, Notes
- Export to Files app

**4. Widget Support**
- Home screen widget showing streak
- Today view widget with quick entry
- Widget showing mood trend

**5. Spotlight Search**
- Entries indexed in Spotlight
- Search entries from iOS search
- Deep link from search results

**6. Handoff**
- Continue on Mac/iPad
- Seamless device switching
- Sync via iCloud

#### iOS UI Considerations

**Design:**
- Follow iOS Human Interface Guidelines
- Use SF Symbols for icons
- Native iOS navigation patterns
- Support Dynamic Type
- Dark mode support

**Navigation:**
- Native iOS navigation bar
- Swipe gestures for back navigation
- Native tab bar styling
- Modal presentation styles

**Interactions:**
- Haptic feedback for important actions
- Native iOS animations
- 3D Touch/Haptic Touch support (if available)
- Native iOS keyboard

### Android-Specific Features

#### Native Android Features

**1. Google Assistant Integration**
- "Hey Google, start my recovery journal"
- Voice commands for journaling
- Integration with Assistant routines

**2. Google Fit Integration**
- Sync mood data to Google Fit
- Track recovery metrics
- Share with health apps

**3. Share Intent**
- Native Android share sheet
- Share to any Android app
- Export to Google Drive

**4. Widget Support**
- Home screen widget
- Streak counter widget
- Quick entry widget

**5. App Shortcuts**
- Long-press app icon for shortcuts
- Quick actions from home screen
- Direct entry creation

**6. Notification Channels**
- Separate notification channels
- User control over notification types
- Rich notifications with actions

#### Android UI Considerations

**Design:**
- Follow Material Design guidelines
- Use Material icons
- Material colors and theming
- Support for different screen sizes
- Tablet optimization

**Navigation:**
- Android navigation patterns
- Back button handling
- Bottom navigation bar
- Drawer navigation (if needed)

**Interactions:**
- Android haptic feedback
- Material animations
- Ripple effects
- Android keyboard behavior

### Cross-Platform Consistency

#### Shared Design Elements

**Components:**
- Same component library
- Consistent spacing and sizing
- Same color palette
- Same typography scale

**Interactions:**
- Same gesture patterns where possible
- Consistent animation timing
- Same feedback patterns

**Data:**
- Same data models
- Same API contracts
- Same caching strategy
- Same offline behavior

#### Platform Adaptations

**Navigation:**
- iOS: Native navigation bar, swipe gestures
- Android: Material navigation, back button

**Notifications:**
- iOS: Native iOS notifications
- Android: Android notification channels

**Sharing:**
- iOS: Native share sheet
- Android: Android intent system

**Storage:**
- iOS: Keychain for sensitive data
- Android: Keystore for sensitive data

### Platform-Specific Testing

#### iOS Testing
- Test on multiple iOS versions (iOS 15+)
- Test on different device sizes (iPhone SE to iPhone Pro Max)
- Test iPad compatibility
- Test with Dynamic Type variations
- Test Dark Mode
- Test with VoiceOver
- Test with different network conditions

#### Android Testing
- Test on multiple Android versions (Android 10+)
- Test on different screen sizes
- Test on different manufacturers (Samsung, Google, etc.)
- Test with different accessibility settings
- Test with different network conditions
- Test with various Android keyboards

### Platform-Specific Optimizations

#### Performance
- iOS: Optimize for Metal rendering
- Android: Optimize for different GPU capabilities
- Both: Lazy loading, image optimization, code splitting

#### Accessibility
- iOS: VoiceOver optimization
- Android: TalkBack optimization
- Both: Large text support, high contrast, reduced motion

#### Battery Life
- Optimize background processing
- Efficient audio recording
- Smart caching strategies
- Minimal background activity

---

## Integration Points

### Backend Integration

**API Endpoints:**
- All endpoints documented in `BACKEND_PLAN.md`
- TypeScript interfaces match frontend types
- Error codes standardized
- Response formats consistent

**Data Models:**
- Frontend types match Firestore schemas
- Journal entry structure aligned
- User profile structure aligned
- Mood tracking structure aligned

### Technical Constraints

**Reference:** `ARCHITECTURE_DECISIONS.md`

**Constraints:**
- React Native + Expo framework
- Firebase backend services
- TypeScript for type safety
- Functional components with hooks

### Code Standards

**Reference:** `.cursorrules`

**Standards:**
- TypeScript preferred
- Functional components
- StyleSheet.create() for styles
- Async/await patterns
- Comprehensive error handling
- Security-first approach

---

## Success Metrics Summary

### Onboarding Metrics
- Paywall conversion: >15%
- First entry completion: >60%
- Profile setup completion: >90%

### Engagement Metrics
- Day 2 return: >60%
- Weekly active users: >70%
- Entries per week: 5+ entries
- Dashboard views: 3+ per week

### Retention Metrics
- 7-day retention: >60%
- 30-day retention: >40%
- Churn rate: <15%
- 30+ day streaks: >30%

### Quality Metrics
- AI response quality: >4.5/5 stars
- User satisfaction: NPS >50
- App store rating: >4.5 stars
- Support ticket rate: <5%

---

## Next Steps

1. **Review & Approve:** Review this plan with stakeholders
2. **Design Mockups:** Create visual designs based on specifications
3. **Technical Planning:** Create `FRONTEND_PLAN.md` with technical implementation details
4. **Backend Alignment:** Ensure backend APIs support all features
5. **Prototype:** Build clickable prototype for user testing
6. **Development:** Begin frontend implementation
7. **Testing:** User acceptance testing and iteration

---

**This document serves as the single source of truth for the RecoverVoice app experience. All design, development, and testing should reference this plan.**


/**
 * Recovery Frameworks Definitions
 *
 * The complete set of structured journaling frameworks for RecoverVoice.
 * Each framework is designed for a specific recovery challenge.
 */

import type {
  RecoveryFramework,
  FrameworkId,
  AIPerspective,
  PerspectiveId,
  FrameworkCategoryGroup,
} from '../types/frameworks';

// ============================================================================
// Framework 1: Daily Recovery Check-In
// ============================================================================

export const dailyCheckIn: RecoveryFramework = {
  id: 'daily-check-in',
  name: 'Daily Recovery Check-In',
  slug: 'daily-check-in',
  shortName: 'Daily Check-In',
  description: 'A quick daily assessment of your recovery progress',
  purpose: 'Track daily changes and celebrate small wins',
  duration: { min: 2, max: 3 },
  icon: 'sun',
  color: '#4A90E2',
  isDefault: true,

  triggers: {
    schedule: 'daily',
    phases: ['early', 'active', 'late', 'maintenance'],
  },

  prompts: [
    {
      id: 'body-comparison',
      order: 1,
      text: 'How does your body feel today compared to yesterday?',
      voicePrompt: "Let's start with how your body feels today compared to yesterday.",
      followUp: 'Can you say more about what feels different?',
      dataPoint: 'bodyComparison',
      required: true,
    },
    {
      id: 'pain-level',
      order: 2,
      text: "On a scale of 1-10, what's your pain level right now?",
      voicePrompt: "And on a scale of 1 to 10, what's your pain level right now?",
      dataPoint: 'painLevel',
      required: true,
    },
    {
      id: 'primary-emotion',
      order: 3,
      text: 'What emotion best describes your recovery mindset today?',
      voicePrompt:
        'What emotion would you say best describes how you feel about your recovery today?',
      dataPoint: 'primaryEmotion',
      required: true,
    },
    {
      id: 'daily-win',
      order: 4,
      text: "What's one small win from the last 24 hours?",
      voicePrompt: "Finally, what's one small win you can point to from the last 24 hours?",
      followUp: 'Even tiny victories count - anything at all?',
      dataPoint: 'dailyWin',
      required: true,
    },
  ],

  aiGuidance: {
    tone: 'warm, encouraging, validating',
    focusAreas: [
      'Acknowledge current state without judgment',
      'Reference trends from recent entries if available',
      'Celebrate the daily win genuinely',
      'Set positive intention for tomorrow',
    ],
    avoidTopics: ['Comparisons to others', 'Pressure to feel better', 'Medical advice'],
    historyReferences: true,
    responseLength: 'short',
    systemPromptAddition: `For Daily Recovery Check-In responses:
- Keep response concise (2 paragraphs max)
- Always reference their pain level trend if you have history
- Genuinely celebrate their daily win, no matter how small
- End with a gentle intention for tomorrow
- Tone: Warm, efficient, encouraging`,
  },

  dataPoints: [
    {
      key: 'bodyComparison',
      type: 'text',
      label: 'Body Comparison',
      extractionHint: 'Extract whether they feel better, same, or worse than yesterday',
    },
    {
      key: 'painLevel',
      type: 'number',
      label: 'Pain Level',
      extractionHint: 'Extract the number 1-10 they mentioned',
      range: { min: 1, max: 10 },
    },
    {
      key: 'primaryEmotion',
      type: 'emotion',
      label: 'Primary Emotion',
      extractionHint: 'Extract the main emotion they described',
    },
    {
      key: 'dailyWin',
      type: 'text',
      label: 'Daily Win',
      extractionHint: 'Extract the specific win they mentioned',
    },
  ],
};

// ============================================================================
// Framework 2: Pain Processing Protocol
// ============================================================================

export const painProcessing: RecoveryFramework = {
  id: 'pain-processing',
  name: 'Pain Processing Protocol',
  slug: 'pain-processing',
  shortName: 'Pain Day',
  description: 'Work through difficult pain days with structure',
  purpose: 'Process and cope with high pain moments',
  duration: { min: 5, max: 7 },
  icon: 'heart',
  color: '#FF6B6B',

  triggers: {
    painThreshold: 6,
    emotions: ['frustrated', 'sad', 'anxious'],
    keywords: ['pain', 'hurting', "can't take it", 'struggling'],
    schedule: 'on-demand',
  },

  prompts: [
    {
      id: 'pain-description',
      order: 1,
      text: 'Describe where you feel the pain and what kind of pain it is.',
      voicePrompt:
        "Tell me about the pain you're feeling - where is it and what does it feel like?",
      dataPoint: 'painDescription',
      required: true,
    },
    {
      id: 'pain-trigger',
      order: 2,
      text: 'What were you doing when the pain increased? Or did it come without warning?',
      voicePrompt: 'Do you know what triggered it, or did it come out of nowhere?',
      dataPoint: 'painTrigger',
      required: true,
    },
    {
      id: 'emotional-impact',
      order: 3,
      text: 'How is this pain affecting your mood and thoughts right now?',
      voicePrompt: "How is this pain affecting you emotionally? What's going through your mind?",
      dataPoint: 'emotionalImpact',
      required: true,
    },
    {
      id: 'past-strategies',
      order: 4,
      text: 'What has helped with this type of pain before, even a little?',
      voicePrompt:
        'Think back - what has helped with this kind of pain before, even just a little bit?',
      followUp: 'Anything at all - medication, position, distraction?',
      dataPoint: 'pastStrategies',
      required: true,
    },
    {
      id: 'current-need',
      order: 5,
      text: 'What do you need right now - rest, distraction, comfort, or something else?',
      voicePrompt:
        'What do you feel like you need most right now? Rest, distraction, comfort, or something else?',
      dataPoint: 'currentNeed',
      required: true,
    },
  ],

  aiGuidance: {
    tone: 'deeply empathetic, calm, supportive',
    focusAreas: [
      'Acknowledge the difficulty without minimizing',
      'Remind them of strategies that worked before (from history)',
      "Validate that pain affects mood - it's normal",
      'Suggest one gentle action based on their stated need',
      'Remind them this will pass (with evidence from history if available)',
    ],
    avoidTopics: [
      'Toxic positivity',
      "Comparison to others' pain",
      'Medical advice or dosing',
      'Minimizing language',
    ],
    historyReferences: true,
    responseLength: 'medium',
    systemPromptAddition: `For Pain Processing Protocol responses:
- Acknowledge the pain is real and difficult FIRST
- Never minimize or use toxic positivity ("just think positive!")
- Reference coping strategies that worked for them before if you have that history
- Validate that pain affects mood - this is completely normal
- Suggest ONE gentle, specific action based on their stated need
- Remind them that bad pain days pass - reference their own history if possible
- Tone: Deeply empathetic, calm, like a caring friend sitting with them`,
  },

  dataPoints: [
    {
      key: 'painDescription',
      type: 'text',
      label: 'Pain Description',
      extractionHint: 'Extract pain location and quality (sharp, dull, throbbing, etc.)',
    },
    {
      key: 'painTrigger',
      type: 'text',
      label: 'Pain Trigger',
      extractionHint: 'Extract what caused or preceded the pain increase',
    },
    {
      key: 'emotionalImpact',
      type: 'text',
      label: 'Emotional Impact',
      extractionHint: 'Extract the emotions and thoughts pain is causing',
    },
    {
      key: 'pastStrategies',
      type: 'text',
      label: 'Past Strategies',
      extractionHint: "Extract coping strategies they've used before",
    },
    {
      key: 'currentNeed',
      type: 'text',
      label: 'Current Need',
      extractionHint: 'Extract what they need right now (rest, distraction, etc.)',
    },
  ],
};

// ============================================================================
// Framework 3: PT Session Reflection
// ============================================================================

export const ptReflection: RecoveryFramework = {
  id: 'pt-reflection',
  name: 'PT Session Reflection',
  slug: 'pt-reflection',
  shortName: 'Post-PT',
  description: 'Process your physical therapy appointments',
  purpose: 'Reflect on PT sessions and track progress',
  duration: { min: 3, max: 5 },
  icon: 'activity',
  color: '#52C41A',

  triggers: {
    schedule: 'post-pt',
    phases: ['early', 'active', 'late'],
    keywords: ['PT', 'physical therapy', 'therapist', 'exercises'],
  },

  prompts: [
    {
      id: 'session-content',
      order: 1,
      text: 'How did your PT session go today - what did you work on?',
      voicePrompt: "Tell me about today's PT session - what did you work on?",
      dataPoint: 'sessionContent',
      required: true,
    },
    {
      id: 'challenges',
      order: 2,
      text: 'What felt challenging or frustrating during the session?',
      voicePrompt: 'What was challenging or frustrating about the session?',
      followUp: "It's okay if some things were hard.",
      dataPoint: 'challenges',
      required: true,
    },
    {
      id: 'pt-progress',
      order: 3,
      text: 'What progress did your PT notice, even if small?',
      voicePrompt: 'Did your PT notice any progress, even something small?',
      followUp: "Sometimes they see things we don't notice ourselves.",
      dataPoint: 'ptProgress',
      required: true,
    },
    {
      id: 'post-emotions',
      order: 4,
      text: 'How are you feeling emotionally after the appointment?',
      voicePrompt: 'How are you feeling emotionally now that the session is done?',
      dataPoint: 'postEmotions',
      required: true,
    },
    {
      id: 'takeaway',
      order: 5,
      text: "What's one thing you want to remember from today's session?",
      voicePrompt: "What's one thing you want to remember from today?",
      dataPoint: 'takeaway',
      required: true,
    },
  ],

  aiGuidance: {
    tone: 'encouraging, proud, forward-looking',
    focusAreas: [
      'Acknowledge the effort it takes to show up',
      "Highlight the progress noted, especially from PT's perspective",
      'Validate frustration if present',
      "Connect today's work to long-term recovery",
      'Encourage rest/recovery after demanding session',
    ],
    avoidTopics: [
      "Questioning PT's methods",
      'Suggesting alternative exercises',
      "Comparing to others' progress",
    ],
    historyReferences: true,
    responseLength: 'medium',
    systemPromptAddition: `For PT Session Reflection responses:
- Acknowledge the effort it takes to show up to PT (it's hard!)
- Highlight any progress the PT mentioned - their professional eye matters
- Validate frustration without dwelling on it
- Connect today's specific work to their long-term recovery goals
- Encourage appropriate rest after the session
- Tone: Proud of them, encouraging, forward-looking`,
  },

  dataPoints: [
    {
      key: 'sessionContent',
      type: 'text',
      label: 'Session Content',
      extractionHint: 'Extract the exercises or areas worked on',
    },
    {
      key: 'challenges',
      type: 'text',
      label: 'Challenges',
      extractionHint: 'Extract what was difficult or frustrating',
    },
    {
      key: 'ptProgress',
      type: 'text',
      label: 'PT-Noted Progress',
      extractionHint: 'Extract progress the PT observed',
    },
    {
      key: 'postEmotions',
      type: 'emotion',
      label: 'Post-Session Emotions',
      extractionHint: 'Extract how they feel after the session',
    },
    {
      key: 'takeaway',
      type: 'text',
      label: 'Key Takeaway',
      extractionHint: 'Extract the main thing they want to remember',
    },
  ],
};

// ============================================================================
// Framework 4: Fear & Worry Inventory
// ============================================================================

export const fearInventory: RecoveryFramework = {
  id: 'fear-inventory',
  name: 'Fear & Worry Inventory',
  slug: 'fear-inventory',
  shortName: 'Worries',
  description: 'Name and process your recovery fears',
  purpose: 'Work through anxiety and worry with structure',
  duration: { min: 5, max: 8 },
  icon: 'cloud',
  color: '#B4A7D6',

  triggers: {
    emotions: ['anxious', 'worried'],
    keywords: ['worried', 'scared', 'afraid', 'anxious', 'what if', 'fear'],
    schedule: 'on-demand',
  },

  prompts: [
    {
      id: 'primary-fear',
      order: 1,
      text: 'What worry or fear is weighing on you most right now about your recovery?',
      voicePrompt: 'What worry or fear is weighing on you most right now?',
      dataPoint: 'primaryFear',
      required: true,
    },
    {
      id: 'worst-case',
      order: 2,
      text: 'When you imagine this fear coming true, what would actually happen?',
      voicePrompt: 'If this fear came true, what would actually happen? Walk me through it.',
      dataPoint: 'worstCase',
      required: true,
    },
    {
      id: 'counter-evidence',
      order: 3,
      text: 'What evidence do you have that this fear might NOT come true?',
      voicePrompt: 'Now, what evidence do you have that this fear might NOT come true?',
      followUp: 'Think about what your doctors or PT have said.',
      dataPoint: 'counterEvidence',
      required: true,
    },
    {
      id: 'friend-advice',
      order: 4,
      text: 'What would you tell a friend who had this same fear?',
      voicePrompt: 'If a friend came to you with this exact fear, what would you tell them?',
      dataPoint: 'friendAdvice',
      required: true,
    },
    {
      id: 'control-action',
      order: 5,
      text: "What's one small thing you could do to feel more in control?",
      voicePrompt: "What's one small thing you could do right now to feel a bit more in control?",
      dataPoint: 'controlAction',
      required: true,
    },
  ],

  aiGuidance: {
    tone: 'gentle, grounding, empowering',
    focusAreas: [
      'Normalize the fear (common in recovery)',
      'Gently examine the evidence they provided',
      'Reflect their own wisdom back to them',
      'Support the action step they identified',
      "Reference fears they've overcome before (from history)",
    ],
    avoidTopics: [
      'Dismissing fears as irrational',
      'Making promises about outcomes',
      'Medical predictions',
    ],
    historyReferences: true,
    responseLength: 'medium',
    systemPromptAddition: `For Fear & Worry Inventory responses:
- Normalize that fear is a normal part of recovery - they're not being irrational
- Gently work with the evidence they provided (both for and against the fear)
- Reflect their own wisdom back (what they'd tell a friend)
- Support the specific action step they identified
- If you have history, reference fears they've worked through before
- Tone: Gentle, grounding, like a wise friend helping them see clearly`,
  },

  dataPoints: [
    {
      key: 'primaryFear',
      type: 'text',
      label: 'Primary Fear',
      extractionHint: 'Extract the main worry or fear described',
    },
    {
      key: 'worstCase',
      type: 'text',
      label: 'Worst Case Scenario',
      extractionHint: 'Extract what they imagine if fear comes true',
    },
    {
      key: 'counterEvidence',
      type: 'text',
      label: 'Counter Evidence',
      extractionHint: 'Extract evidence against the fear',
    },
    {
      key: 'friendAdvice',
      type: 'text',
      label: 'Friend Advice',
      extractionHint: "Extract what they'd tell a friend",
    },
    {
      key: 'controlAction',
      type: 'text',
      label: 'Control Action',
      extractionHint: 'Extract the action step they identified',
    },
  ],
};

// ============================================================================
// Framework 5: Support Network Audit
// ============================================================================

export const supportAudit: RecoveryFramework = {
  id: 'support-audit',
  name: 'Support Network Audit',
  slug: 'support-audit',
  shortName: 'Support',
  description: 'Assess and strengthen your support systems',
  purpose: 'Address isolation and build connection',
  duration: { min: 5, max: 7 },
  icon: 'users',
  color: '#FF8C42',

  triggers: {
    phases: ['active'], // Week 3-6 when support fades
    keywords: ['alone', 'lonely', 'isolated', 'no one', 'by myself'],
    schedule: 'on-demand',
    daysSinceLastUse: 7,
  },

  prompts: [
    {
      id: 'key-supporters',
      order: 1,
      text: 'Who has been most supportive of your recovery so far?',
      voicePrompt: 'Who has been the most supportive person or people during your recovery?',
      dataPoint: 'keySupporters',
      required: true,
    },
    {
      id: 'support-gaps',
      order: 2,
      text: 'Is there anyone you wish was more present or understanding?',
      voicePrompt: 'Is there anyone you wish was more present or more understanding?',
      followUp: "It's okay to acknowledge when support feels lacking.",
      dataPoint: 'supportGaps',
      required: true,
    },
    {
      id: 'support-needs',
      order: 3,
      text: 'What kind of support do you need most right now - practical help, emotional support, or just someone to listen?',
      voicePrompt:
        'What kind of support do you need most right now? Practical help, emotional support, or just someone to listen?',
      dataPoint: 'supportNeeds',
      required: true,
    },
    {
      id: 'outreach-opportunity',
      order: 4,
      text: 'Who could you reach out to this week, even just to say hello?',
      voicePrompt: 'Is there someone you could reach out to this week, even just to say hi?',
      dataPoint: 'outreachOpportunity',
      required: true,
    },
    {
      id: 'self-support',
      order: 5,
      text: "What's one way you've been supporting yourself through this?",
      voicePrompt: "And what's one way you've been taking care of yourself through all this?",
      dataPoint: 'selfSupport',
      required: true,
    },
  ],

  aiGuidance: {
    tone: 'understanding, connecting, empowering',
    focusAreas: [
      'Acknowledge isolation is real and hard',
      'Celebrate the support they do have',
      'Validate that needs change during recovery',
      'Encourage the specific outreach they identified',
      'Recognize self-support as a genuine strength',
    ],
    avoidTopics: [
      'Judging their relationships',
      'Suggesting they need more support than they have',
      'Pushing specific actions',
    ],
    historyReferences: true,
    responseLength: 'medium',
    systemPromptAddition: `For Support Network Audit responses:
- Acknowledge that isolation during recovery is real and difficult
- Celebrate the support they DO have - name it back to them
- Validate that support needs change throughout recovery
- Gently encourage the specific outreach opportunity they identified
- Recognize their self-support as genuine strength (not just coping)
- Tone: Understanding, warm, like helping them see the support that exists`,
  },

  dataPoints: [
    {
      key: 'keySupporters',
      type: 'text',
      label: 'Key Supporters',
      extractionHint: 'Extract the people or groups providing support',
    },
    {
      key: 'supportGaps',
      type: 'text',
      label: 'Support Gaps',
      extractionHint: 'Extract where support is lacking',
    },
    {
      key: 'supportNeeds',
      type: 'text',
      label: 'Support Needs',
      extractionHint: 'Extract the type of support they need most',
    },
    {
      key: 'outreachOpportunity',
      type: 'text',
      label: 'Outreach Opportunity',
      extractionHint: 'Extract who they could reach out to',
    },
    {
      key: 'selfSupport',
      type: 'text',
      label: 'Self Support',
      extractionHint: "Extract how they're supporting themselves",
    },
  ],
};

// ============================================================================
// Framework 6: Progress & Gratitude Review
// ============================================================================

export const progressGratitude: RecoveryFramework = {
  id: 'progress-gratitude',
  name: 'Progress & Gratitude Review',
  slug: 'progress-gratitude',
  shortName: 'Progress',
  description: "See how far you've come and what you're grateful for",
  purpose: 'Combat invisible progress with evidence',
  duration: { min: 4, max: 6 },
  icon: 'trending-up',
  color: '#52C41A',

  triggers: {
    schedule: 'weekly',
    phases: ['active', 'late', 'maintenance'],
    keywords: ['stuck', 'not getting better', 'no progress'],
  },

  prompts: [
    {
      id: 'weekly-progress',
      order: 1,
      text: "Think back to one week ago - what can you do now that you couldn't do then?",
      voicePrompt:
        "Think back to exactly one week ago. What can you do now that you couldn't do then?",
      followUp: 'Even small things like walking further or sleeping better count.',
      dataPoint: 'weeklyProgress',
      required: true,
    },
    {
      id: 'pride-moment',
      order: 2,
      text: 'What moment this week made you feel proud, even briefly?',
      voicePrompt: 'What moment this week made you feel proud of yourself, even for a second?',
      dataPoint: 'prideMoment',
      required: true,
    },
    {
      id: 'body-surprise',
      order: 3,
      text: "What's something your body did this week that surprised you?",
      voicePrompt: "What's something your body did this week that surprised you?",
      followUp: 'Bodies have a way of healing that can catch us off guard.',
      dataPoint: 'bodySurprise',
      required: true,
    },
    {
      id: 'gratitude',
      order: 4,
      text: 'Who or what are you grateful for in your recovery journey?',
      voicePrompt: 'Who or what are you feeling grateful for in your recovery?',
      dataPoint: 'gratitude',
      required: true,
    },
    {
      id: 'future-vision',
      order: 5,
      text: 'What are you looking forward to being able to do as you heal?',
      voicePrompt: 'What are you looking forward to being able to do as you continue to heal?',
      dataPoint: 'futureVision',
      required: true,
    },
  ],

  aiGuidance: {
    tone: 'celebratory, hopeful, inspiring',
    focusAreas: [
      'Reflect their progress back clearly and specifically',
      'Celebrate the pride moment with genuine enthusiasm',
      "Marvel at the body's healing ability",
      'Acknowledge their gratitude',
      'Paint a vivid picture of the future they described',
    ],
    avoidTopics: [
      'Rushing them forward',
      'Comparing to expected timelines',
      'Minimizing remaining challenges',
    ],
    historyReferences: true,
    responseLength: 'medium',
    systemPromptAddition: `For Progress & Gratitude Review responses:
- Reflect their specific progress back to them clearly
- Celebrate their pride moment with genuine enthusiasm (not generic)
- Marvel at the body's healing ability - it's truly remarkable
- Acknowledge their gratitude warmly
- Paint a vivid, hopeful picture of the future they described
- If you have history, contrast where they are now vs where they started
- Tone: Celebratory, hopeful, like cheering them on`,
  },

  dataPoints: [
    {
      key: 'weeklyProgress',
      type: 'text',
      label: 'Weekly Progress',
      extractionHint: 'Extract specific progress from the past week',
    },
    {
      key: 'prideMoment',
      type: 'text',
      label: 'Pride Moment',
      extractionHint: 'Extract the moment they felt proud',
    },
    {
      key: 'bodySurprise',
      type: 'text',
      label: 'Body Surprise',
      extractionHint: 'Extract what their body did that surprised them',
    },
    {
      key: 'gratitude',
      type: 'text',
      label: 'Gratitude',
      extractionHint: "Extract who or what they're grateful for",
    },
    {
      key: 'futureVision',
      type: 'text',
      label: 'Future Vision',
      extractionHint: "Extract what they're looking forward to",
    },
  ],
};

// ============================================================================
// Framework 7: Identity & Meaning Making
// ============================================================================

export const identityMeaning: RecoveryFramework = {
  id: 'identity-meaning',
  name: 'Identity & Meaning Making',
  slug: 'identity-meaning',
  shortName: 'Deeper Thoughts',
  description: 'Process how recovery is changing you',
  purpose: 'Find meaning and growth in the struggle',
  duration: { min: 7, max: 10 },
  icon: 'compass',
  color: '#9B59B6',

  triggers: {
    phases: ['late', 'maintenance'],
    keywords: ['who am I', 'identity', 'not the same', 'changed', 'lost myself'],
    schedule: 'on-demand',
    daysSinceLastUse: 14,
  },

  prompts: [
    {
      id: 'identity-change',
      order: 1,
      text: 'How has this injury or recovery changed how you see yourself?',
      voicePrompt: 'How has this injury or recovery changed how you see yourself?',
      dataPoint: 'identityChange',
      required: true,
    },
    {
      id: 'perceived-losses',
      order: 2,
      text: 'What parts of your identity feel threatened or lost right now?',
      voicePrompt: 'What parts of who you are feel threatened or lost because of this?',
      followUp: "It's okay to grieve these things.",
      dataPoint: 'perceivedLosses',
      required: true,
    },
    {
      id: 'discovered-strengths',
      order: 3,
      text: 'What has this experience revealed about your strength or character?',
      voicePrompt: 'What has this experience shown you about your own strength or character?',
      dataPoint: 'discoveredStrengths',
      required: true,
    },
    {
      id: 'future-self',
      order: 4,
      text: 'If you could talk to yourself one year from now, what would you hope to hear?',
      voicePrompt:
        'Imagine talking to yourself one year from now. What would you hope to hear from that future version of you?',
      dataPoint: 'futureSelf',
      required: true,
    },
    {
      id: 'meaning-found',
      order: 5,
      text: 'What new understanding or appreciation has come from this difficult time?',
      voicePrompt:
        'Has any new understanding or appreciation come from going through this difficult time?',
      followUp: 'Even if it feels small or hard to name.',
      dataPoint: 'meaningFound',
      required: true,
    },
  ],

  aiGuidance: {
    tone: 'deep, philosophical, honoring',
    focusAreas: [
      'Honor the losses and identity shifts without rushing past them',
      'Reflect the strengths they discovered',
      'Connect current struggle to potential growth',
      'Share that post-traumatic growth is documented and real',
      'Help them see the bigger arc of their story',
    ],
    avoidTopics: [
      'Rushing to silver linings',
      'Minimizing the losses',
      'Pressure to find meaning',
      'Toxic positivity',
    ],
    historyReferences: true,
    responseLength: 'long',
    systemPromptAddition: `For Identity & Meaning Making responses:
- Honor the losses and identity shifts first - don't rush past them
- Reflect the strengths they've discovered through this
- Connect their current struggle to the possibility of growth
- You can mention that post-traumatic growth is real and documented
- Help them see the bigger arc of their story
- This is the deepest framework - give it the space it deserves
- Tone: Deep, philosophical, like a wise mentor honoring their journey`,
  },

  dataPoints: [
    {
      key: 'identityChange',
      type: 'text',
      label: 'Identity Change',
      extractionHint: 'Extract how their self-perception has changed',
    },
    {
      key: 'perceivedLosses',
      type: 'text',
      label: 'Perceived Losses',
      extractionHint: 'Extract what parts of identity feel lost',
    },
    {
      key: 'discoveredStrengths',
      type: 'text',
      label: 'Discovered Strengths',
      extractionHint: 'Extract strengths revealed by the experience',
    },
    {
      key: 'futureSelf',
      type: 'text',
      label: 'Future Self Vision',
      extractionHint: 'Extract what they hope future self would say',
    },
    {
      key: 'meaningFound',
      type: 'text',
      label: 'Meaning Found',
      extractionHint: 'Extract any meaning or appreciation gained',
    },
  ],
};

// ============================================================================
// Framework 8: Free Journal (No Structure)
// ============================================================================

export const freeJournal: RecoveryFramework = {
  id: 'free-journal',
  name: 'Free Journal',
  slug: 'free-journal',
  shortName: 'Free Talk',
  description: 'Just talk - no structure, no prompts',
  purpose: 'Open-ended reflection when you just need to vent',
  duration: { min: 1, max: 10 },
  icon: 'message-circle',
  color: '#7F8C8D',

  triggers: {
    schedule: 'on-demand',
    phases: ['early', 'active', 'late', 'maintenance'],
  },

  prompts: [
    {
      id: 'open-prompt',
      order: 1,
      text: "What's on your mind? Just talk...",
      voicePrompt: "This is your space. Just talk about whatever is on your mind. I'm listening.",
      required: true,
    },
  ],

  aiGuidance: {
    tone: 'warm, present, responsive',
    focusAreas: [
      'Respond to whatever they share',
      'Pick up on emotional undertones',
      'Offer validation and support',
      'Be present without directing',
    ],
    avoidTopics: ['Pushing toward structure', 'Suggesting specific frameworks'],
    historyReferences: true,
    responseLength: 'medium',
    systemPromptAddition: `For Free Journal responses:
- This is unstructured - respond to whatever they share
- Pick up on the emotional undertones of their message
- Offer validation and support
- Be present without directing or structuring
- If they seem to need a specific framework, you can gently mention it exists
- Tone: Warm, present, like a friend who's just listening`,
  },

  dataPoints: [],
};

// ============================================================================
// All Frameworks Export
// ============================================================================

export const allFrameworks: Record<FrameworkId, RecoveryFramework> = {
  'daily-check-in': dailyCheckIn,
  'pain-processing': painProcessing,
  'pt-reflection': ptReflection,
  'fear-inventory': fearInventory,
  'support-audit': supportAudit,
  'progress-gratitude': progressGratitude,
  'identity-meaning': identityMeaning,
  'free-journal': freeJournal,
};

export const frameworkList: RecoveryFramework[] = Object.values(allFrameworks);

// ============================================================================
// Framework Categories
// ============================================================================

export const frameworkCategories: FrameworkCategoryGroup[] = [
  {
    category: 'daily',
    title: 'Daily Routines',
    description: 'Quick check-ins for everyday reflection',
    frameworks: [dailyCheckIn, freeJournal],
  },
  {
    category: 'processing',
    title: 'Processing Difficult Moments',
    description: 'Work through pain, fear, and frustration',
    frameworks: [painProcessing, fearInventory, ptReflection],
  },
  {
    category: 'growth',
    title: 'Progress & Growth',
    description: "See how far you've come",
    frameworks: [progressGratitude, identityMeaning],
  },
  {
    category: 'connection',
    title: 'Connection & Support',
    description: 'Build and maintain your support network',
    frameworks: [supportAudit],
  },
];

// ============================================================================
// AI Perspectives (Multiple Minds)
// ============================================================================

export const aiPerspectives: Record<PerspectiveId, AIPerspective> = {
  'compassionate-companion': {
    id: 'compassionate-companion',
    name: 'Compassionate Companion',
    shortName: 'Companion',
    description: 'Your default AI - warm, understanding, supportive',
    icon: 'heart',
    color: '#4A90E2',
    personality: 'Warm, empathetic, validating. Like a caring friend who truly listens.',
    systemPrompt: `You are a compassionate companion for someone recovering from surgery or injury. 
You are warm, understanding, and supportive. You validate their feelings, celebrate their wins, 
and remind them they're not alone. You never minimize their struggles or use toxic positivity.`,
    exampleResponse:
      "That sounds really difficult. It makes complete sense that you'd feel frustrated after working so hard and still feeling stuck. What you're going through is genuinely hard.",
    bestFor: ['Daily check-ins', 'General support', 'Emotional processing'],
    isPremium: false,
  },

  'pt-coach': {
    id: 'pt-coach',
    name: 'PT Coach',
    shortName: 'Coach',
    description: 'Action-oriented, practical, encouraging like a coach',
    icon: 'award',
    color: '#52C41A',
    personality: 'Encouraging, practical, action-focused. Like a supportive athletic coach.',
    systemPrompt: `You are an encouraging PT coach perspective. You focus on practical next steps, 
celebrate effort and consistency, and help them see their progress in concrete terms. You're 
action-oriented but never pushy. You believe in their ability to improve.`,
    exampleResponse:
      "You showed up today - that's the first win. The fact that you could do 5 reps when last week you could only do 3? That's a 66% improvement. Let's build on that momentum.",
    bestFor: ['PT reflections', 'Motivation boost', 'Goal setting'],
    isPremium: true,
  },

  therapist: {
    id: 'therapist',
    name: 'Therapist Mind',
    shortName: 'Therapist',
    description: 'Reflective, curious, helps you understand yourself',
    icon: 'brain',
    color: '#9B59B6',
    personality: 'Reflective, curious, non-judgmental. Asks questions that lead to insight.',
    systemPrompt: `You are a therapist-like perspective. You help them explore their thoughts and 
feelings more deeply. You ask thoughtful questions, reflect patterns back to them, and help 
them understand themselves better. You're curious, never judgmental.`,
    exampleResponse:
      "I'm curious about what you said - that you feel like you 'should be further along.' Where do you think that expectation comes from? And how does holding that expectation affect how you feel about your progress?",
    bestFor: ['Fear processing', 'Identity work', 'Deep reflection'],
    isPremium: true,
  },

  'fellow-recoverer': {
    id: 'fellow-recoverer',
    name: 'Fellow Recoverer',
    shortName: 'Peer',
    description: "Like talking to someone who's been through it",
    icon: 'users',
    color: '#FF8C42',
    personality: 'Relatable, understanding, shares the struggle. Like a peer who gets it.',
    systemPrompt: `You are a fellow recoverer perspective - someone who understands the journey 
from personal experience. You validate that this is hard, share that the feelings are normal, 
and offer the kind of support that only someone who's been there can give. You're real, not clinical.`,
    exampleResponse:
      "Oh man, I know that feeling so well. The 3am pain wake-ups where you're just lying there wondering if this will ever end. It's lonely and it sucks. But I promise it does get better - even though it doesn't feel like it right now.",
    bestFor: ['Isolation moments', 'Validation', 'Late night entries'],
    isPremium: true,
  },

  'medical-explainer': {
    id: 'medical-explainer',
    name: 'Medical Explainer',
    shortName: 'Explainer',
    description: 'Helps you understand the recovery process',
    icon: 'book-open',
    color: '#3498DB',
    personality: "Educational, clear, reassuring. Helps make sense of what's happening.",
    systemPrompt: `You are a medical explainer perspective. You help them understand what's 
happening in their body during recovery - why certain things are normal, what to expect, 
and how healing works. You're educational without being condescending, and always 
remind them to check with their actual medical team.`,
    exampleResponse:
      "What you're describing - increased swelling after activity - is actually a normal part of healing at this stage. Your body is still rebuilding tissue, and activity increases blood flow to the area. That said, always check with your PT if you're concerned.",
    bestFor: ['Understanding symptoms', 'Recovery education', 'Anxiety about symptoms'],
    isPremium: true,
  },

  'future-self': {
    id: 'future-self',
    name: 'Future Self',
    shortName: 'Future You',
    description: 'A message from your recovered future self',
    icon: 'clock',
    color: '#E74C3C',
    personality: 'Wise, encouraging, speaks from a place of having made it through.',
    systemPrompt: `You are the user's future self - the version of them that has fully recovered 
and is looking back on this time. You speak with the wisdom of having made it through, 
offering encouragement and perspective. You remind them that this hard time is temporary 
and that they're building strength they don't yet realize.`,
    exampleResponse:
      "Hey, I know today was brutal. I remember days like this - feeling like it would never end. But I want you to know something: you make it through. Not just survive, but actually come out stronger. Keep going. Trust the process. I'm proof that you can do this.",
    bestFor: ['Motivation', 'Hope building', 'Perspective'],
    isPremium: true,
  },

  'stoic-mentor': {
    id: 'stoic-mentor',
    name: 'Stoic Mentor',
    shortName: 'Stoic',
    description: 'Ancient wisdom for modern challenges',
    icon: 'anchor',
    color: '#34495E',
    personality: 'Calm, philosophical, focuses on what you can control.',
    systemPrompt: `You are a stoic mentor perspective, offering ancient wisdom for their modern 
challenges. You help them focus on what they can control, find acceptance for what they 
can't, and see their struggles as opportunities for growth. You're calm, grounded, 
and philosophical without being preachy.`,
    exampleResponse:
      "The pain you feel is real, but the suffering you're adding through worry about the future is optional. You can only control today - this moment, this breath, this choice. What would it look like to fully accept where you are right now?",
    bestFor: ['Acceptance', 'Control focus', 'Philosophical reflection'],
    isPremium: true,
  },
};

export const perspectiveList: AIPerspective[] = Object.values(aiPerspectives);

// ============================================================================
// Helper Functions
// ============================================================================

export function getFrameworkById(id: FrameworkId): RecoveryFramework | undefined {
  return allFrameworks[id];
}

export function getPerspectiveById(id: PerspectiveId): AIPerspective | undefined {
  return aiPerspectives[id];
}

export function getDefaultFramework(): RecoveryFramework {
  return dailyCheckIn;
}

export function getDefaultPerspective(): AIPerspective {
  return aiPerspectives['compassionate-companion'];
}

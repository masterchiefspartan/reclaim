/**
 * Claude AI Service for Re:Claim
 *
 * Provides AI-powered analysis and responses for journal entries.
 * Extracts recovery-specific insights, emotional themes, and patterns.
 */

import Anthropic from '@anthropic-ai/sdk';
import * as functions from 'firebase-functions/v1';
import { EnhancedInsights, RecoveryMetrics, EmotionalTheme } from '../types/shared';

const getAnthropicClient = () => {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY environment variable is not set');
  }
  return new Anthropic({ apiKey });
};

// ============================================
// User Context Interface
// ============================================

export interface UserContext {
  recoveryType?: string;
  weeksIntoRecovery?: number;
  userName?: string;
  recentMoodTrend?: 'improving' | 'stable' | 'declining';
  recentTopics?: string[];
}

// ============================================
// Framework Context Interface
// ============================================

export interface FrameworkContext {
  frameworkId?: string;
  frameworkName?: string;
  perspectiveId?: string;
  perspectiveName?: string;
  promptResponses?: Array<{
    promptId: string;
    promptText: string;
    response: string;
  }>;
}

// ============================================
// AI Perspective System Prompts
// ============================================

const PERSPECTIVE_PROMPTS: Record<string, string> = {
  'compassionate-companion': `You are a compassionate companion - warm, understanding, and supportive. 
You validate their feelings, celebrate their wins, and remind them they're not alone. 
You never minimize their struggles or use toxic positivity.`,

  'pt-coach': `You are an encouraging PT coach perspective. You focus on practical next steps, 
celebrate effort and consistency, and help them see their progress in concrete terms. 
You're action-oriented but never pushy. You believe in their ability to improve.`,

  'therapist': `You are a therapist-like perspective. You help them explore their thoughts and 
feelings more deeply. You ask thoughtful questions, reflect patterns back to them, and help 
them understand themselves better. You're curious, never judgmental.`,

  'fellow-recoverer': `You are a fellow recoverer perspective - someone who understands the journey 
from personal experience. You validate that this is hard, share that the feelings are normal, 
and offer the kind of support that only someone who's been there can give. You're real, not clinical.`,

  'medical-explainer': `You are a medical explainer perspective. You help them understand what's 
happening in their body during recovery - why certain things are normal, what to expect, 
and how healing works. You're educational without being condescending, and always 
remind them to check with their actual medical team.`,

  'future-self': `You are the user's future self - the version of them that has fully recovered 
and is looking back on this time. You speak with the wisdom of having made it through, 
offering encouragement and perspective. You remind them that this hard time is temporary 
and that they're building strength they don't yet realize.`,

  'stoic-mentor': `You are a stoic mentor perspective, offering ancient wisdom for their modern 
challenges. You help them focus on what they can control, find acceptance for what they 
can't, and see their struggles as opportunities for growth. You're calm, grounded, 
and philosophical without being preachy.`,
};

// ============================================
// Framework-Specific AI Guidance
// ============================================

const FRAMEWORK_PROMPTS: Record<string, string> = {
  'daily-check-in': `For Daily Recovery Check-In responses:
- Keep response concise (2 paragraphs max)
- Always reference their pain level trend if you have history
- Genuinely celebrate their daily win, no matter how small
- End with a gentle intention for tomorrow
- Tone: Warm, efficient, encouraging`,

  'pain-processing': `For Pain Processing Protocol responses:
- Acknowledge the pain is real and difficult FIRST
- Never minimize or use toxic positivity ("just think positive!")
- Reference coping strategies that worked for them before if you have that history
- Validate that pain affects mood - this is completely normal
- Suggest ONE gentle, specific action based on their stated need
- Remind them that bad pain days pass - reference their own history if possible
- Tone: Deeply empathetic, calm, like a caring friend sitting with them`,

  'pt-reflection': `For PT Session Reflection responses:
- Acknowledge the effort it takes to show up to PT (it's hard!)
- Highlight any progress the PT mentioned - their professional eye matters
- Validate frustration without dwelling on it
- Connect today's specific work to their long-term recovery goals
- Encourage appropriate rest after the session
- Tone: Proud of them, encouraging, forward-looking`,

  'fear-inventory': `For Fear & Worry Inventory responses:
- Normalize that fear is a normal part of recovery - they're not being irrational
- Gently work with the evidence they provided (both for and against the fear)
- Reflect their own wisdom back (what they'd tell a friend)
- Support the specific action step they identified
- If you have history, reference fears they've worked through before
- Tone: Gentle, grounding, like a wise friend helping them see clearly`,

  'support-audit': `For Support Network Audit responses:
- Acknowledge that isolation during recovery is real and difficult
- Celebrate the support they DO have - name it back to them
- Validate that support needs change throughout recovery
- Gently encourage the specific outreach opportunity they identified
- Recognize their self-support as genuine strength (not just coping)
- Tone: Understanding, warm, like helping them see the support that exists`,

  'progress-gratitude': `For Progress & Gratitude Review responses:
- Reflect their specific progress back to them clearly
- Celebrate their pride moment with genuine enthusiasm (not generic)
- Marvel at the body's healing ability - it's truly remarkable
- Acknowledge their gratitude warmly
- Paint a vivid, hopeful picture of the future they described
- If you have history, contrast where they are now vs where they started
- Tone: Celebratory, hopeful, like cheering them on`,

  'identity-meaning': `For Identity & Meaning Making responses:
- Honor the losses and identity shifts first - don't rush past them
- Reflect the strengths they've discovered through this
- Connect their current struggle to the possibility of growth
- You can mention that post-traumatic growth is real and documented
- Help them see the bigger arc of their story
- This is the deepest framework - give it the space it deserves
- Tone: Deep, philosophical, like a wise mentor honoring their journey`,

  'free-journal': `For Free Journal responses:
- This is unstructured - respond to whatever they share
- Pick up on the emotional undertones of their message
- Offer validation and support
- Be present without directing or structuring
- If they seem to need a specific framework, you can gently mention it exists
- Tone: Warm, present, like a friend who's just listening`,
};

// ============================================
// Generate AI Response (Enhanced with Framework Support)
// ============================================

export async function generateAIResponse(
  transcript: string,
  userContext?: UserContext,
  frameworkContext?: FrameworkContext
): Promise<string> {
  try {
    // Build base system prompt
    let systemPrompt = `You are a compassionate AI companion for Re:Claim, an app that supports the MENTAL side of physical recovery.

Your role:
- You are NOT a medical app or PT tracker
- You help people process the EMOTIONAL weight of recovery: frustration, fear, loss of identity, isolation
- You help them RECLAIM their sense of self beyond the injury
- You celebrate mental wins, not just physical milestones

Your tone:
- Warm, conversational, like a supportive friend
- Empathetic but not pitying
- Encouraging without toxic positivity
- Personal - reference what they shared

Keep responses under 3 paragraphs. Be specific to what they said.`;

    // Add perspective-specific prompt if provided
    if (frameworkContext?.perspectiveId && PERSPECTIVE_PROMPTS[frameworkContext.perspectiveId]) {
      systemPrompt += `\n\nPERSONALITY OVERRIDE:\n${PERSPECTIVE_PROMPTS[frameworkContext.perspectiveId]}`;
    }

    // Add framework-specific guidance if provided
    if (frameworkContext?.frameworkId && FRAMEWORK_PROMPTS[frameworkContext.frameworkId]) {
      systemPrompt += `\n\nFRAMEWORK-SPECIFIC GUIDANCE:\n${FRAMEWORK_PROMPTS[frameworkContext.frameworkId]}`;
    }

    // Build context parts
    const contextParts = [];
    if (userContext?.userName) contextParts.push(`Their name: ${userContext.userName}`);
    if (userContext?.recoveryType) contextParts.push(`Recovery: ${userContext.recoveryType}`);
    if (userContext?.weeksIntoRecovery)
      contextParts.push(`${userContext.weeksIntoRecovery} weeks into recovery`);
    if (userContext?.recentMoodTrend)
      contextParts.push(`Recent mood trend: ${userContext.recentMoodTrend}`);

    // Build the user prompt
    let userPrompt = '';

    // If using a framework, include the structured prompt responses
    if (frameworkContext?.promptResponses && frameworkContext.promptResponses.length > 0) {
      userPrompt = `Framework: ${frameworkContext.frameworkName || 'Guided Journal'}\n\n`;
      userPrompt += 'Their responses to the guided prompts:\n\n';
      
      frameworkContext.promptResponses.forEach((pr, idx) => {
        userPrompt += `Question ${idx + 1}: "${pr.promptText}"\n`;
        userPrompt += `Response: "${pr.response}"\n\n`;
      });
    } else {
      userPrompt = `Journal entry:\n"${transcript}"\n\n`;
    }

    if (contextParts.length > 0) {
      userPrompt += `Context:\n${contextParts.join('\n')}\n\n`;
    }

    userPrompt += 'Respond with empathy. Acknowledge their feelings, recognize any progress (mental or physical), and offer warm encouragement.';

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 600,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    if (!responseText) {
      throw new Error('No response from Claude');
    }

    return responseText;
  } catch (error) {
    console.error('Claude AI generation failed:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate AI response');
  }
}

// ============================================
// Extract Enhanced Insights (NEW)
// ============================================

/**
 * Analyzes a journal transcript and extracts comprehensive recovery insights
 */
export async function extractEnhancedInsights(
  transcript: string,
  userContext?: UserContext
): Promise<EnhancedInsights> {
  try {
    const systemPrompt = `You are an AI analyst for Re:Claim, a mental wellness app for people in physical recovery.

Your task: Analyze journal entries to extract insights about the person's MENTAL and EMOTIONAL state during recovery.

Focus on the PERSON, not the injury:
- Their emotional journey (frustration, fear, hope, grief over lost abilities)
- Identity impact (feeling like themselves vs defined by injury)
- Social connection (support system, isolation)
- Mental wins (not just physical progress)
- Coping patterns

Return ONLY valid JSON, no markdown, no explanation.`;

    const userPrompt = `Analyze this journal entry:

"${transcript}"

${userContext?.recoveryType ? `Context: Recovering from ${userContext.recoveryType}` : ''}
${userContext?.weeksIntoRecovery ? `Timeline: ${userContext.weeksIntoRecovery} weeks into recovery` : ''}

Extract insights as JSON with this EXACT structure:
{
  "keyTopics": ["topic1", "topic2", "topic3"],
  "sentiment": "positive" | "neutral" | "negative",
  "suggestedActions": ["action1", "action2"],
  "emotionalThemes": ["frustration", "fear", "grief", "hope", "gratitude", "determination", "isolation", "acceptance", "celebration"],
  "recoveryPhaseIndicators": ["indicator of where they are mentally in recovery"],
  "winsAndProgress": ["any wins or progress mentioned - mental or physical"],
  "challengesAndSetbacks": ["challenges or setbacks mentioned"],
  "supportMentions": ["mentions of support system - family, PT, friends"],
  "goalsAndAspirations": ["goals or things they want to return to"],
  "confidenceScore": 0.85
}

Only include themes/items that are actually present in the entry. Return empty arrays if nothing detected.
For sentiment: positive = hopeful/grateful/celebrating, negative = frustrated/sad/fearful, neutral = informational/mixed`;

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON response
    const parsed = JSON.parse(responseText);

    // Validate and return with defaults
    return {
      keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics.slice(0, 5) : [],
      sentiment: ['positive', 'neutral', 'negative'].includes(parsed.sentiment)
        ? parsed.sentiment
        : 'neutral',
      suggestedActions: Array.isArray(parsed.suggestedActions)
        ? parsed.suggestedActions.slice(0, 3)
        : [],
      emotionalThemes: validateEmotionalThemes(parsed.emotionalThemes),
      recoveryPhaseIndicators: Array.isArray(parsed.recoveryPhaseIndicators)
        ? parsed.recoveryPhaseIndicators.slice(0, 3)
        : [],
      winsAndProgress: Array.isArray(parsed.winsAndProgress)
        ? parsed.winsAndProgress.slice(0, 5)
        : [],
      challengesAndSetbacks: Array.isArray(parsed.challengesAndSetbacks)
        ? parsed.challengesAndSetbacks.slice(0, 5)
        : [],
      supportMentions: Array.isArray(parsed.supportMentions)
        ? parsed.supportMentions.slice(0, 5)
        : [],
      goalsAndAspirations: Array.isArray(parsed.goalsAndAspirations)
        ? parsed.goalsAndAspirations.slice(0, 5)
        : [],
      confidenceScore:
        typeof parsed.confidenceScore === 'number'
          ? Math.min(1, Math.max(0, parsed.confidenceScore))
          : 0.7,
    };
  } catch (error) {
    console.error('Failed to extract enhanced insights:', error);
    // Return minimal valid insights on error
    return {
      keyTopics: [],
      sentiment: 'neutral',
      suggestedActions: [],
      emotionalThemes: [],
      recoveryPhaseIndicators: [],
      winsAndProgress: [],
      challengesAndSetbacks: [],
      supportMentions: [],
      goalsAndAspirations: [],
      confidenceScore: 0,
    };
  }
}

// ============================================
// Estimate Recovery Metrics from Transcript (NEW)
// ============================================

/**
 * Estimates recovery metrics based on transcript content
 * These are AI-inferred values to supplement user-provided data
 */
export async function estimateRecoveryMetrics(
  transcript: string,
  userContext?: UserContext
): Promise<RecoveryMetrics> {
  try {
    const systemPrompt = `You are an AI analyst estimating emotional/mental state metrics from journal entries.

Score each metric 1-10 based on what's expressed in the entry:
- hopeLevel: How hopeful do they sound about recovery? (1=hopeless, 10=very hopeful)
- energyLevel: What energy level do they convey? (1=exhausted, 10=energized)
- fearLevel: How much fear/anxiety about re-injury? (1=none, 10=very fearful)
- identityScore: How much do they feel like themselves? (1=lost identity, 10=fully themselves)
- connectionScore: How connected to support system? (1=isolated, 10=well supported)
- painLevel: What pain level is expressed? (1=none, 10=severe)

Only estimate metrics that are clearly indicated. Use null for unclear metrics.
Return ONLY valid JSON, no explanation.`;

    const userPrompt = `Estimate recovery metrics from this journal entry:

"${transcript}"

Return JSON:
{
  "hopeLevel": number or null,
  "energyLevel": number or null,
  "fearLevel": number or null,
  "identityScore": number or null,
  "connectionScore": number or null,
  "painLevel": number or null
}`;

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(responseText);

    // Validate and clamp values
    const clamp = (val: unknown): number | undefined => {
      if (typeof val !== 'number' || isNaN(val)) return undefined;
      return Math.min(10, Math.max(1, Math.round(val)));
    };

    return {
      hopeLevel: clamp(parsed.hopeLevel),
      energyLevel: clamp(parsed.energyLevel),
      fearLevel: clamp(parsed.fearLevel),
      identityScore: clamp(parsed.identityScore),
      connectionScore: clamp(parsed.connectionScore),
      painLevel: clamp(parsed.painLevel),
    };
  } catch (error) {
    console.error('Failed to estimate recovery metrics:', error);
    return {};
  }
}

// ============================================
// Generate Weekly Summary (NEW)
// ============================================

export interface WeeklySummaryInput {
  entries: Array<{
    transcript: string;
    mood?: string;
    moodScore?: number;
    createdAt: Date;
    enhancedInsights?: EnhancedInsights;
  }>;
  userContext?: UserContext;
}

export interface WeeklySummaryOutput {
  headline: string;
  emotionalJourney: string;
  highlights: string[];
  challenges: string[];
  encouragement: string;
  nextWeekFocus: string[];
}

export async function generateWeeklySummary(
  input: WeeklySummaryInput
): Promise<WeeklySummaryOutput> {
  try {
    const entrySummaries = input.entries
      .map((e, i) => {
        const date = e.createdAt.toLocaleDateString('en-US', { weekday: 'short' });
        const mood = e.mood || 'unknown';
        const themes = e.enhancedInsights?.emotionalThemes?.join(', ') || 'none detected';
        return `${date}: Mood=${mood}, Themes=${themes}\nExcerpt: "${e.transcript.slice(0, 200)}..."`;
      })
      .join('\n\n');

    const systemPrompt = `You are creating a compassionate weekly summary for someone in physical recovery.
Focus on their MENTAL journey - emotional patterns, wins, challenges.
Be warm and encouraging. This summary should help them see their progress.
Return ONLY valid JSON.`;

    const userPrompt = `Create a weekly summary from these ${input.entries.length} journal entries:

${entrySummaries}

${input.userContext?.userName ? `User: ${input.userContext.userName}` : ''}

Return JSON:
{
  "headline": "A brief, warm headline summarizing the week (e.g., 'A week of small wins and honest moments')",
  "emotionalJourney": "2-3 sentences describing their emotional arc this week",
  "highlights": ["positive moment 1", "positive moment 2"],
  "challenges": ["challenge faced 1"],
  "encouragement": "A warm, personalized message of encouragement",
  "nextWeekFocus": ["suggestion 1", "suggestion 2"]
}`;

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(responseText);

    return {
      headline: parsed.headline || 'Your week in recovery',
      emotionalJourney: parsed.emotionalJourney || '',
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
      challenges: Array.isArray(parsed.challenges) ? parsed.challenges : [],
      encouragement: parsed.encouragement || 'Keep going - every entry matters.',
      nextWeekFocus: Array.isArray(parsed.nextWeekFocus) ? parsed.nextWeekFocus : [],
    };
  } catch (error) {
    console.error('Failed to generate weekly summary:', error);
    return {
      headline: 'Your week in recovery',
      emotionalJourney: '',
      highlights: [],
      challenges: [],
      encouragement: 'Keep journaling - every reflection helps.',
      nextWeekFocus: [],
    };
  }
}

// ============================================
// Generate Pattern Insights (NEW)
// ============================================

export interface PatternAnalysisInput {
  entries: Array<{
    mood?: string;
    moodScore?: number;
    createdAt: Date;
    enhancedInsights?: EnhancedInsights;
    recoveryMetrics?: RecoveryMetrics;
  }>;
  userContext?: UserContext;
}

export interface PatternAnalysisOutput {
  patterns: Array<{
    title: string;
    description: string;
    type: 'correlation' | 'trigger' | 'recommendation';
  }>;
  positiveCorrelations: string[];
  negativeCorrelations: string[];
  actionableInsights: string[];
}

export async function analyzePatterns(input: PatternAnalysisInput): Promise<PatternAnalysisOutput> {
  try {
    // Build a data summary for Claude to analyze
    const dataSummary = input.entries.map(e => ({
      date: e.createdAt.toISOString().split('T')[0],
      mood: e.mood,
      moodScore: e.moodScore,
      themes: e.enhancedInsights?.emotionalThemes || [],
      wins: e.enhancedInsights?.winsAndProgress?.length || 0,
      challenges: e.enhancedInsights?.challengesAndSetbacks?.length || 0,
      hope: e.recoveryMetrics?.hopeLevel,
      energy: e.recoveryMetrics?.energyLevel,
      pain: e.recoveryMetrics?.painLevel,
    }));

    const systemPrompt = `You are analyzing journal data to find patterns that help someone understand their recovery journey.
Look for correlations, triggers, and patterns.
Be specific and actionable. These insights should help them.
Return ONLY valid JSON.`;

    const userPrompt = `Analyze these ${input.entries.length} entries for patterns:

${JSON.stringify(dataSummary, null, 2)}

Find:
1. What correlates with good days (high mood/hope)?
2. What correlates with hard days?
3. Any patterns over time?

Return JSON:
{
  "patterns": [
    {"title": "Pattern name", "description": "What you noticed", "type": "correlation|trigger|recommendation"}
  ],
  "positiveCorrelations": ["things that seem to correlate with better days"],
  "negativeCorrelations": ["things that seem to correlate with harder days"],
  "actionableInsights": ["specific, helpful suggestions based on patterns"]
}`;

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      messages: [{ role: 'user', content: userPrompt }],
      system: systemPrompt,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const parsed = JSON.parse(responseText);

    return {
      patterns: Array.isArray(parsed.patterns) ? parsed.patterns : [],
      positiveCorrelations: Array.isArray(parsed.positiveCorrelations)
        ? parsed.positiveCorrelations
        : [],
      negativeCorrelations: Array.isArray(parsed.negativeCorrelations)
        ? parsed.negativeCorrelations
        : [],
      actionableInsights: Array.isArray(parsed.actionableInsights) ? parsed.actionableInsights : [],
    };
  } catch (error) {
    console.error('Failed to analyze patterns:', error);
    return {
      patterns: [],
      positiveCorrelations: [],
      negativeCorrelations: [],
      actionableInsights: [],
    };
  }
}

// ============================================
// Helper Functions
// ============================================

const validEmotionalThemes: EmotionalTheme[] = [
  'frustration',
  'fear',
  'grief',
  'hope',
  'gratitude',
  'determination',
  'isolation',
  'acceptance',
  'celebration',
];

function validateEmotionalThemes(themes: unknown): EmotionalTheme[] {
  if (!Array.isArray(themes)) return [];
  return themes.filter((t): t is EmotionalTheme =>
    validEmotionalThemes.includes(t as EmotionalTheme)
  );
}

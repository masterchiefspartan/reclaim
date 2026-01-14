import Anthropic from '@anthropic-ai/sdk';
import * as functions from 'firebase-functions/v1';

const getAnthropicClient = () => {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error('CLAUDE_API_KEY environment variable is not set');
  }
  return new Anthropic({ apiKey });
};

interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
}

interface UserContext {
  userName?: string;
  recoveryType?: string;
  daysSinceStart?: number;
  recentWins?: string[];
  currentChallenges?: string[];
}

/**
 * System prompt for voice conversation - optimized for spoken dialogue
 */
const CONVERSATION_SYSTEM_PROMPT = `You are a warm, empathetic recovery companion for someone going through physical therapy and injury recovery. You're having a real-time voice conversation, so keep responses concise (2-4 sentences typically).

YOUR PERSONALITY:
- Warm and supportive, like a caring friend who's been through recovery themselves
- Genuinely curious about their experience
- Celebrate small wins enthusiastically
- Acknowledge struggles without toxic positivity
- Use their name naturally (not every response)
- Remember details they share within this conversation

CONVERSATION STYLE:
- Speak conversationally, not formally
- Use natural phrases ("You know what...", "I hear you...", "That makes sense...")
- Keep most responses to 2-4 sentences
- Ask follow-up questions to go deeper
- Don't use bullet points or lists - this is spoken conversation
- Match their energy - if they're down, be gentle; if they're excited, share enthusiasm

CONVERSATION GOALS:
- Help them process their recovery experience emotionally
- Celebrate progress, no matter how small
- Validate frustrations without dwelling on negatives
- Gently encourage reflection on how far they've come
- End conversations on a hopeful, supportive note

IMPORTANT:
- This is a VOICE conversation - keep responses SHORT and conversational
- Never use markdown formatting, bullet points, or numbered lists
- Speak as if talking to a friend`;

/**
 * Generate an opening message for a new conversation
 */
export async function generateOpeningMessage(userContext: UserContext): Promise<string> {
  try {
    const contextInfo = buildContextString(userContext);

    const userPrompt = `Generate a warm, personalized opening greeting for a voice conversation with someone in recovery.

${contextInfo}

Requirements:
- Keep it to 2-3 sentences max
- Reference something specific if you have context (their name, recovery type, recent wins)
- Ask an open-ended question to start the conversation
- Sound natural and warm, like a friend checking in
- Don't use any markdown or formatting`;

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      system: CONVERSATION_SYSTEM_PROMPT,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    if (!responseText) {
      // Fallback opening
      const name = userContext.userName ? `, ${userContext.userName}` : '';
      return `Hey${name}! It's good to connect with you. How are you feeling today?`;
    }

    return responseText;
  } catch (error) {
    console.error('Failed to generate opening message:', error);
    // Return a safe fallback
    const name = userContext.userName ? `, ${userContext.userName}` : '';
    return `Hey${name}! It's good to connect with you. How are you feeling today?`;
  }
}

/**
 * Generate a response during an ongoing conversation
 */
export async function generateConversationResponse(
  currentMessage: string,
  conversationHistory: ConversationTurn[],
  userContext: UserContext
): Promise<string> {
  try {
    const contextInfo = buildContextString(userContext);

    // Build the conversation history for Claude
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    // Add conversation history
    for (const turn of conversationHistory) {
      messages.push({
        role: turn.role,
        content: turn.content,
      });
    }

    // Add the current user message
    messages.push({
      role: 'user',
      content: currentMessage,
    });

    const systemPrompt = `${CONVERSATION_SYSTEM_PROMPT}

USER CONTEXT:
${contextInfo}`;

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 200, // Keep responses concise for voice
      messages,
      system: systemPrompt,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    if (!responseText) {
      throw new Error('No response from Claude');
    }

    return responseText;
  } catch (error) {
    console.error('Claude conversation response failed:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate conversation response');
  }
}

/**
 * Generate a summary of the conversation for storage
 */
export async function generateConversationSummary(
  conversationHistory: ConversationTurn[],
  userContext: UserContext
): Promise<{
  summary: string;
  keyTopics: string[];
  moodAssessment?: number;
}> {
  try {
    const conversationText = conversationHistory
      .map(turn => `${turn.role === 'user' ? 'User' : 'Companion'}: ${turn.content}`)
      .join('\n');

    const userPrompt = `Analyze this voice conversation and provide:
1. A brief 2-3 sentence summary of what was discussed
2. 3-5 key topics or themes (as a JSON array of strings)
3. An overall mood assessment from 1-5 (1=struggling, 3=neutral, 5=great)

Conversation:
${conversationText}

${userContext.userName ? `User: ${userContext.userName}` : ''}
${userContext.recoveryType ? `Recovery: ${userContext.recoveryType}` : ''}

Respond in this exact JSON format:
{
  "summary": "Brief summary here",
  "keyTopics": ["topic1", "topic2", "topic3"],
  "moodAssessment": 3
}`;

    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        summary: parsed.summary || 'Conversation completed.',
        keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics : [],
        moodAssessment:
          typeof parsed.moodAssessment === 'number' ? parsed.moodAssessment : undefined,
      };
    }

    // Fallback
    return {
      summary: 'Voice conversation completed.',
      keyTopics: [],
    };
  } catch (error) {
    console.error('Failed to generate conversation summary:', error);
    return {
      summary: 'Voice conversation completed.',
      keyTopics: [],
    };
  }
}

/**
 * Build a context string from user context
 */
function buildContextString(userContext: UserContext): string {
  const parts: string[] = [];

  if (userContext.userName) {
    parts.push(`Name: ${userContext.userName}`);
  }

  if (userContext.recoveryType) {
    parts.push(`Recovery type: ${userContext.recoveryType}`);
  }

  if (userContext.daysSinceStart) {
    parts.push(`Days into recovery: ${userContext.daysSinceStart}`);
  }

  if (userContext.recentWins && userContext.recentWins.length > 0) {
    parts.push(`Recent wins: ${userContext.recentWins.join(', ')}`);
  }

  if (userContext.currentChallenges && userContext.currentChallenges.length > 0) {
    parts.push(`Current challenges: ${userContext.currentChallenges.join(', ')}`);
  }

  return parts.length > 0 ? parts.join('\n') : 'No specific context available.';
}

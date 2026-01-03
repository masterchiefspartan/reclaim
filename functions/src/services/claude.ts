import Anthropic from '@anthropic-ai/sdk';
import * as functions from 'firebase-functions/v1';

const anthropic = new Anthropic({
  apiKey: functions.config().claude.api_key,
});

export async function generateAIResponse(
  transcript: string,
  userContext?: {
    recoveryType?: string;
    weeksIntoRecovery?: number;
  }
): Promise<string> {
  try {
    const systemPrompt = `You are a compassionate AI companion for someone recovering from physical therapy or injury. 
Your role is to provide emotional support, celebrate progress, and help them process their recovery journey.
Be empathetic, encouraging, and specific to their recovery context.
Keep your response concise (under 3 paragraphs) and conversational.`;

    const userPrompt = `The user just recorded this journal entry:

"${transcript}"

${userContext?.recoveryType ? `Recovery type: ${userContext.recoveryType}` : ''}
${userContext?.weeksIntoRecovery ? `Weeks into recovery: ${userContext.weeksIntoRecovery}` : ''}

Provide a supportive, empathetic response that:
1. Acknowledges their feelings
2. Celebrates any progress mentioned
3. Offers encouragement
4. Is conversational and warm`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: userPrompt,
      }],
      system: systemPrompt,
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    if (!responseText) {
      throw new Error('No response from Claude');
    }

    return responseText;
  } catch (error) {
    console.error('Claude AI generation failed:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate AI response'
    );
  }
}


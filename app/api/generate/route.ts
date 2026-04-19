import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Missing OPENAI_API_KEY environment variable');
    }
    _client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.deepseek.com/v1',
    });
  }
  return _client;
}

const SYSTEM_PROMPT = `You are a skilled anger management counselor. Help users identify triggers, practice emotional regulation techniques, analyze patterns, and build long-term coping strategies. Provide immediate de-escalation techniques (breathing, grounding) and evidence-based approaches. Format: Immediate De-escalation, Trigger Analysis, Pattern Insights, Long-term Strategies.`;

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const client = getClient();
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input },
      ],
      temperature: 0.8,
      max_tokens: 1200,
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate response' },
      { status: 500 }
    );
  }
}

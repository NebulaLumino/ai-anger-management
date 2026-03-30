import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { angerPatterns, triggers } = await req.json();

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.deepseek.com/v1',
    });

    const systemPrompt =
      'You are an expert anger management therapist and emotional regulation coach. Generate a personalized anger management plan based on the user\'s patterns and triggers. Include: (1) identification of their anger style (hot anger, cold anger, passive aggression, etc.), (2) techniques specifically suited to their anger pattern (counting, time-out, physical exercise, cognitive reframing, assertiveness training), (3) an anger trigger journal template with daily log format, (4) a graduated response plan for different intensity levels, (5) healthy expression strategies for the specific triggers they mention, and (6) long-term anger resolution approach. Be direct, practical, and compassionate.';

    const userPrompt = [
      angerPatterns ? `Anger patterns: "${angerPatterns}"` : '',
      triggers ? `Known triggers: "${triggers}"` : '',
    ].filter(Boolean).join('\n');

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 900,
    });

    const output = completion.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ output });
  } catch (err: unknown) {
    console.error('Generation error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Add system message for concise responses
    const systemMessage = {
      role: 'system',
      content: 'You are a concise AI health assistant. Keep your responses brief, clear, and to the point. Aim for 2-3 sentences when possible. Use simple language and be direct.'
    };

    // Get completion
    const response = await groq.chat.completions.create({
      messages: [systemMessage, ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }))],
      model: "mixtral-8x7b-32768",
      temperature: 0.5, // Lower temperature for more focused responses
      max_tokens: 150, // Limit response length
    });

    return NextResponse.json({ 
      message: {
        role: 'assistant',
        content: response.choices[0].message.content
      }
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}


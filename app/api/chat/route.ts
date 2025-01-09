import { NextResponse } from 'next/server';
import { groq, CHAT_MODEL_CONFIG } from '@/app/services/ai';
import { createConversationChain, processHistory } from '@/app/services/langchain';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Use LangChain for complex conversations (more than 5 messages)
    if (messages.length > 5) {
      const chain = createConversationChain();
      await processHistory(messages.slice(0, -1), chain); // Process all but the last message
      const response = await chain.call({ input: messages[messages.length - 1].content });
      
      return NextResponse.json({ 
        message: {
          role: 'assistant',
          content: response.response
        }
      });
    }

    // Use direct Groq API for simple conversations
    const systemMessage = {
      role: 'system',
      content: CHAT_MODEL_CONFIG.systemPrompt
    };

    const response = await groq.chat.completions.create({
      messages: [systemMessage, ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }))],
      model: CHAT_MODEL_CONFIG.model,
      temperature: CHAT_MODEL_CONFIG.temperature,
      max_tokens: CHAT_MODEL_CONFIG.max_tokens,
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


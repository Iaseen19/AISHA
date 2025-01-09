import { NextResponse } from 'next/server';
import { ollamaService } from '../../services/api';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // Process message with Ollama
    const response = await ollamaService.getChatResponse(message);
    
    return NextResponse.json({ 
      response: response,
      success: true
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Chat processing failed' },
      { status: 500 }
    );
  }
}


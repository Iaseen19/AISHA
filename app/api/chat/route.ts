import { NextResponse } from 'next/server';
import { langchainService } from '../../services/langchain';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    // Get mood analysis
    const moodAnalysis = await langchainService.analyzeMood(message);
    
    // Process message with conversation memory
    const response = await langchainService.processMessage(message);
    
    return NextResponse.json({ 
      response: { content: response },
      mood: moodAnalysis
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Chat processing failed' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { langchainService } from '../../services/langchain';

export async function POST(req: Request) {
  try {
    const { conversation } = await req.json();
    const summary = await langchainService.generateSummary(conversation);
    
    return NextResponse.json({ 
      summary: { content: summary }
    });
  } catch (error) {
    console.error('Summary error:', error);
    return NextResponse.json(
      { error: 'Summary generation failed' },
      { status: 500 }
    );
  }
} 
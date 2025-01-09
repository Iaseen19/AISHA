import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // For now, return a simple response
    // In a real implementation, you would process the audio file
    return NextResponse.json({ 
      text: "Speech-to-text conversion not implemented. Please type your message instead." 
    });
  } catch (error) {
    console.error('Audio processing error:', error);
    return NextResponse.json(
      { error: 'Audio processing failed' },
      { status: 500 }
    );
  }
} 
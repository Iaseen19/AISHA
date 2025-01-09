import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { audio } = await req.json();

    // Convert base64 to buffer
    const buffer = Buffer.from(audio, 'base64');

    // Create a temporary file from the buffer
    const response = await openai.audio.transcriptions.create({
      file: new File([buffer], 'audio.webm', { type: 'audio/webm' }),
      model: 'whisper-1',
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
} 
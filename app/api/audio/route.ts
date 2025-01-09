import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { createReadStream } from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Create a temporary file path
    const tempFilePath = join(tmpdir(), `audio-${Date.now()}.webm`);
    
    // Convert blob to array buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Write the buffer to a temporary file
    await writeFile(tempFilePath, buffer);

    try {
      // Use OpenAI's Whisper API for transcription
      const transcription = await openai.audio.transcriptions.create({
        file: createReadStream(tempFilePath),
        model: "whisper-1",
        language: "en",
      });

      return NextResponse.json({ 
        text: transcription.text,
        success: true
      });
    } catch (transcriptionError: any) {
      console.error('Transcription error:', transcriptionError);
      return NextResponse.json(
        { 
          error: 'Transcription failed',
          details: transcriptionError.message 
        },
        { status: 500 }
      );
    } finally {
      // Clean up: Delete the temporary file
      try {
        await unlink(tempFilePath);
      } catch (unlinkError) {
        console.error('Error deleting temporary file:', unlinkError);
      }
    }
  } catch (error: any) {
    console.error('Audio processing error:', error);
    return NextResponse.json(
      { 
        error: 'Audio processing failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 
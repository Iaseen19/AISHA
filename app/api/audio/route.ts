import { NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';

// Initialize Whisper model
let whisperPipeline: any = null;

async function initWhisper() {
  if (!whisperPipeline) {
    whisperPipeline = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en');
  }
  return whisperPipeline;
}

async function transcribeAudio(audioData: Float32Array): Promise<string> {
  try {
    // Initialize Whisper if not already initialized
    const transcriber = await initWhisper();
    
    // Transcribe audio
    const result = await transcriber(audioData, {
      chunk_length_s: 30,
      stride_length_s: 5,
      language: 'english',
      task: 'transcribe',
      sampling_rate: 16000, // Whisper expects 16kHz audio
    });

    return result.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert the audio file to Float32Array
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioContext = new (globalThis.AudioContext || (globalThis as any).webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const audioData = audioBuffer.getChannelData(0);

    // Resample to 16kHz if needed
    let processedAudio = audioData;
    if (audioBuffer.sampleRate !== 16000) {
      const ratio = 16000 / audioBuffer.sampleRate;
      const newLength = Math.round(audioData.length * ratio);
      processedAudio = new Float32Array(newLength);
      
      for (let i = 0; i < newLength; i++) {
        const position = i / ratio;
        const index = Math.floor(position);
        const decimal = position - index;
        
        if (index >= audioData.length - 1) {
          processedAudio[i] = audioData[audioData.length - 1];
        } else {
          processedAudio[i] = audioData[index] * (1 - decimal) + audioData[index + 1] * decimal;
        }
      }
    }

    // Use Whisper for transcription
    const transcription = await transcribeAudio(processedAudio);

    // Clean up
    await audioContext.close();

    return NextResponse.json({ 
      text: transcription,
      success: true
    });
  } catch (error) {
    console.error('Audio processing error:', error);
    return NextResponse.json(
      { error: 'Audio processing failed' },
      { status: 500 }
    );
  }
} 
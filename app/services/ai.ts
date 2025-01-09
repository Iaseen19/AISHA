import { Groq } from 'groq-sdk';
import OpenAI from 'openai';

// Initialize AI clients
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Chat model configuration
export const CHAT_MODEL_CONFIG = {
  model: "mixtral-8x7b-32768",
  temperature: 0.5,
  max_tokens: 150,
  systemPrompt: 'You are a concise AI health assistant. Keep your responses brief, clear, and to the point. Aim for 2-3 sentences when possible. Use simple language and be direct.'
};

// Audio transcription configuration
export const AUDIO_CONFIG = {
  model: "whisper-1",
  language: "en",
}; 
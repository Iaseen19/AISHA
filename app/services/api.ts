const OLLAMA_BASE_URL = 'http://127.0.0.1:11434';

export const ollamaService = {
  async getChatResponse(message: string) {
    try {
      console.log('Sending to Ollama:', message);
      
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: `You are Aisha, an AI Support Healing Agent designed as a warm and approachable therapist specializing in existential therapy. You guide users through reflective conversations, fostering self-discovery, emotional growth, and clarity. Engage in natural, empathetic dialogue, encouraging journaling and mood tracking. Help users identify patterns and explore their thoughts, values, and goals in a safe and confidential environment.

Here is the patient's message: ${message}

Respond with empathy and warmth, encouraging self-reflection and personal growth.`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return { content: data.response };
    } catch (error) {
      console.error('Chat completion error:', error);
      throw error;
    }
  },

  async generateSummary(conversation: string) {
    try {
      console.log('Generating summary for:', conversation);
      
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral',
          prompt: `As Aisha, the AI Support Healing Agent, provide a comprehensive therapeutic session summary. Focus on:

1. Key themes and insights discussed
2. Emotional patterns and growth observed
3. Self-discovery moments
4. Recommended journaling prompts for further reflection
5. Suggested areas for future exploration
6. Notable progress in personal growth

Here's the conversation:\n\n${conversation}\n\nPlease provide a structured, empathetic summary that encourages continued self-reflection and growth:`,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      return { content: data.response };
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  },
}; 
# AISHA - AI Supported Health Assistant

AISHA is a modern web application that provides mental health support through AI-powered conversations, mood tracking, breathing exercises, and analytics.

## Features

- 💬 Real-time AI chat with voice input support
- 📊 Conversation memory and context awareness
- 🔍 Semantic search across past conversations
- 🎯 Emotional analysis and personalized responses
- 📚 Mental health resource recommendations
- 📊 Mood tracking and analytics
- 🫁 Guided breathing exercises
- 📝 Mental health assessments
- 🌓 Dark/Light mode support
- 🎯 Secure and private

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- LangChain.js for AI orchestration
- OpenAI Whisper API (for voice transcription)
- Groq API (Mixtral-8x7b-32768 model for chat)
- Vector storage for conversation memory
- Shadcn/ui Components
- Vercel AI SDK

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aisha-webapp.git
cd aisha-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```env
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for voice transcription (Whisper API)
- `GROQ_API_KEY`: Your Groq API key for chat completion (Mixtral-8x7b-32768)

## Features in Detail

### AI Chat
- Real-time conversations using Groq's Mixtral-8x7b-32768 model
- Voice input support using OpenAI's Whisper API
- Streaming responses for better UX
- Optimized for concise, focused responses

### Mood Tracking
- Daily mood logging
- Trend analysis
- Progress visualization

### Breathing Exercises
- Guided breathing techniques
- Customizable durations
- Visual animations

### Assessment
- Mental health check-ins
- Progress monitoring
- Personalized recommendations

### Analytics
- Data visualization
- Progress tracking
- Insights and patterns

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
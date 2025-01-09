# AISHA - AI Support Healing Agent

AISHA is an AI-powered therapy web application designed to provide empathetic and supportive mental health assistance. The application combines voice interaction, mood tracking, journaling, and therapeutic resources to create a comprehensive mental health support platform.

## Features

- **Voice Chat**: Natural conversation with AI using voice or text input
- **Mood Tracking**: Track and visualize emotional states over time
- **Progress Monitoring**: View therapy progress and achievements
- **Goal Setting**: Set and track personal development goals
- **Breathing Exercises**: Guided breathing exercises for stress relief
- **Journal**: Enhanced journaling with AI-powered prompts
- **Resource Library**: Access to mental health resources and coping strategies
- **Crisis Support**: Quick access to emergency mental health resources

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Voice Processing**: Whisper (local transcription)
- **AI Chat**: Ollama with Mistral model
- **State Management**: React Context
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM

## Getting Started

### Prerequisites

- Node.js (v20.0.0 or higher)
- PostgreSQL
- Ollama (for chat functionality)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Iaseen19/AISHA.git
cd aisha-webapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/aisha_db?schema=public"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Feature Flags
ENABLE_VOICE_CHAT=true
ENABLE_MOOD_TRACKING=true
```

4. Initialize the database:
```bash
npx prisma migrate dev
```

5. Start Ollama server:
```bash
ollama serve
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Design System

AISHA uses a custom design system focused on accessibility and emotional safety. Key design elements include:

- **Color Palette**: Carefully selected colors for emotional resonance
- **Typography**: Inter for readability, Merriweather for warmth
- **Components**: Consistent, accessible UI components
- **Voice Interface**: Clear visual feedback for voice interactions
- **Responsive Design**: Mobile-first approach with desktop optimization

## Project Structure

```
aisha-webapp/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   └── pages/            # Page components
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── styles/                # Global styles and theme
└── utils/                 # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI's Whisper for voice transcription
- Ollama for local AI model hosting
- shadcn/ui for component library
- All contributors and supporters of the project
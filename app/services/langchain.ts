import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { BufferMemory } from "langchain/memory";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";

// Initialize Ollama chat model
const model = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "mistral",
  temperature: 0.7,
});

// Create memory instance
const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history",
  chatHistory: new ChatMessageHistory(),
});

// Update prompt templates to use the new format
const therapyPrompt = ChatPromptTemplate.fromMessages([
  ["system", `You are Aisha, an AI Support Healing Agent designed as a warm and approachable therapist specializing in existential therapy.
  You guide users through reflective conversations, fostering self-discovery, emotional growth, and clarity.`],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
]);

const summaryPrompt = ChatPromptTemplate.fromMessages([
  ["system", `As Aisha, provide a therapeutic session summary with the following structure:
  1. Key Themes: Identify main topics and patterns discussed
  2. Emotional Journey: Track emotional states and changes
  3. Insights: Note important realizations or breakthroughs
  4. Growth Areas: Highlight areas of progress and potential focus
  5. Recommendations: Suggest specific actions or reflections`],
  ["human", "{conversation}"],
]);

const moodAnalysisPrompt = ChatPromptTemplate.fromMessages([
  ["system", `Analyze the emotional content of this message and provide a structured response as a JSON object with:
  - dominantEmotion (string)
  - emotionalIntensity (1-10)
  - suggestedCopingStrategy (string)`],
  ["human", "{input}"],
]);

// Create chains
const conversationChain = RunnableSequence.from([
  {
    input: (initialInput: string) => ({
      input: initialInput,
      chat_history: async () => {
        const memoryResult = await memory.loadMemoryVariables({});
        return memoryResult.chat_history || "";
      },
    }),
  },
  therapyPrompt,
  model,
  new StringOutputParser(),
]);

const moodAnalysisChain = RunnableSequence.from([
  moodAnalysisPrompt,
  model,
  new StringOutputParser(),
]);

const summaryChain = RunnableSequence.from([
  summaryPrompt,
  model,
  new StringOutputParser(),
]);

export const langchainService = {
  async processMessage(message: string) {
    const response = await conversationChain.invoke(message);
    
    await memory.saveContext(
      { input: message },
      { output: response }
    );
    
    return response;
  },

  async analyzeMood(message: string) {
    try {
      const analysis = await moodAnalysisChain.invoke({
        input: message,
      });
      return JSON.parse(analysis);
    } catch (error) {
      console.error('Mood analysis error:', error);
      return {
        dominantEmotion: "unknown",
        emotionalIntensity: 5,
        suggestedCopingStrategy: "Take a moment to breathe and reflect"
      };
    }
  },

  async generateSummary(conversation: string) {
    return await summaryChain.invoke({
      conversation,
    });
  },
}; 
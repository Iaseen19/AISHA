import { ChatGroq } from "@langchain/groq";
import { OpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { 
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
} from "@langchain/core/prompts";

// Initialize LangChain models
export const chatModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "mixtral-8x7b-32768",
  temperature: 0.5,
  maxTokens: 150,
});

export const whisperModel = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "whisper-1",
  temperature: 0,
});

// Create a conversation chain with memory
export const createConversationChain = () => {
  const memory = new BufferMemory();
  
  const chain = new ConversationChain({
    llm: chatModel,
    memory: memory,
    prompt: ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "You are a concise AI health assistant. Keep your responses brief, clear, and to the point. Aim for 2-3 sentences when possible. Use simple language and be direct."
      ),
      HumanMessagePromptTemplate.fromTemplate("{input}")
    ]),
  });

  return chain;
};

// Helper function to process chat history
export const processHistory = async (messages: any[], chain: ConversationChain) => {
  for (const message of messages) {
    if (message.role === 'user') {
      await chain.call({ input: message.content });
    }
  }
  return chain;
}; 
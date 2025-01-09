import { Tool } from "@langchain/core/tools";
import { searchSimilarConversations } from "./vectorstore";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGroq } from "@langchain/groq";

// Initialize models for different purposes
const openaiModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4-turbo-preview",
  temperature: 0,
});

const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  modelName: "mixtral-8x7b-32768",
  temperature: 0.5,
});

// Memory Search Tool
export class MemorySearchTool extends Tool {
  name = "memory_search";
  description = "Search through past conversations for relevant information";

  async _call(query: string) {
    const results = await searchSimilarConversations(query);
    return JSON.stringify(results);
  }
}

// Emotional Analysis Tool
export class EmotionalAnalysisTool extends Tool {
  name = "emotional_analysis";
  description = "Analyze the emotional content of a message";

  async _call(input: string) {
    const response = await openaiModel.invoke([{
      role: "system",
      content: "Analyze the emotional content of the following message. Return a JSON object with emotion categories and intensities."
    }, {
      role: "user",
      content: input
    }]);
    return response.content;
  }
}

// Mental Health Resource Tool
export class ResourceTool extends Tool {
  name = "mental_health_resources";
  description = "Find relevant mental health resources and coping strategies";

  async _call(query: string) {
    const response = await groqModel.invoke([{
      role: "system",
      content: "You are a mental health resource expert. Provide specific, actionable resources or coping strategies for the given query."
    }, {
      role: "user",
      content: query
    }]);
    return response.content;
  }
}

// Create tool instances
export const tools = [
  new MemorySearchTool(),
  new EmotionalAnalysisTool(),
  new ResourceTool(),
]; 
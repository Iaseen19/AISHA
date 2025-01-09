import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

// Initialize embeddings model
const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Create vector store instance
export const vectorStore = new MemoryVectorStore(embeddings);

// Add conversation to vector store
export async function storeConversation(messages: any[]) {
  const docs = messages.map((msg) => {
    return new Document({
      pageContent: msg.content,
      metadata: {
        role: msg.role,
        timestamp: new Date().toISOString(),
      },
    });
  });

  await vectorStore.addDocuments(docs);
}

// Search for similar conversations
export async function searchSimilarConversations(query: string, k: number = 3) {
  const results = await vectorStore.similaritySearch(query, k);
  return results;
} 
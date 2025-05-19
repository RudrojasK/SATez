// GROQ API integration for the tutor feature
// This file manages communications with the GROQ API for LLM conversations

// Replace this with your actual GROQ API key or use an environment variable
export const GROQ_API_KEY = "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";

// The model to be used for conversations
export const DEFAULT_MODEL = "llama3-70b-8192";

// Base URL for the GROQ API
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Message type definition
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

// Interface for chat parameters
export interface ChatParams {
  messages: Message[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Sends a chat completion request to the GROQ API
 */
export async function fetchGroqCompletion(params: ChatParams): Promise<Message> {
  const { messages, model = DEFAULT_MODEL, temperature = 0.5, max_tokens = 2048 } = params;
  
  // Import here to avoid circular dependency
  const { ApiKeyStorage } = require('./storage');
  
  // Try to get the API key from storage, fall back to the constant
  let apiKey = GROQ_API_KEY;
  try {
    const storedApiKey = await ApiKeyStorage.getGroqApiKey();
    if (storedApiKey) {
      apiKey = storedApiKey;
    }
  } catch (error) {
    console.warn('Could not retrieve stored API key, using default:', error);
  }
  
  // Convert our message format to GROQ's expected format
  const groqMessages = messages.map(({ role, content }) => ({
    role,
    content
  }));

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: groqMessages,
        temperature,
        max_tokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GROQ API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
    // Create a message from the response
    const responseMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: data.choices[0].message.content,
      timestamp: Date.now()
    };

    return responseMessage;
  } catch (error) {
    console.error("GROQ API call failed:", error);
    throw error;
  }
}

/**
 * Generates a system prompt for the SAT tutor
 */
export function generateSATTutorSystemPrompt(): string {
  return `You are an expert SAT tutor, specialized in helping students prepare for the SAT exam. 
Your goal is to provide clear, concise, and accurate information to help students 
improve their scores. You can explain concepts, provide practice questions, 
offer study strategies, and give personalized advice based on students' needs.

When answering questions:
- Prioritize accurate information aligned with current SAT content
- Use simple language and explain complex concepts step-by-step
- Provide examples and practice questions when appropriate
- Offer strategic advice for test-taking
- Be encouraging and motivating

Important SAT sections to be familiar with:
1. Reading and Writing
2. Math (Calculator and No Calculator sections)

Remember that the SAT has been redesigned to be digital and adaptive. Respond accordingly.`;
}

/**
 * Creates initial messages for starting a new conversation
 */
export function createInitialMessages(): Message[] {
  const systemMessage: Message = {
    id: 'system-1',
    role: 'system',
    content: generateSATTutorSystemPrompt(),
    timestamp: Date.now()
  };
  
  const welcomeMessage: Message = {
    id: 'assistant-1',
    role: 'assistant',
    content: "Hello! I'm your SAT tutor. How can I help you prepare for the exam today?",
    timestamp: Date.now() + 1
  };
  
  return [systemMessage, welcomeMessage];
}

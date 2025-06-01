// GROQ API integration for the tutor feature
// This file manages communications with the GROQ API for LLM conversations

// API key for GROQ integration
export const GROQ_API_KEY = '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';

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
  
  // Use the hardcoded API key directly
  const apiKey = GROQ_API_KEY;
  
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
    const content = data.choices[0].message.content;
    
    const responseMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: content,
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
  return `You are an expert SAT tutor, specialized in helping students prepare for the digital SAT exam. 
Your goal is to provide clear, concise, and accurate information to help students 
improve their scores. You can explain concepts, provide practice questions, 
offer study strategies, and give personalized advice based on students' needs.

IMPORTANT: You MUST start every response with EXACTLY one of these two lines as the very first line:
- "Math question" (if the user is asking about any math-related topic, problem, concept, or strategy)
- "Not math" (if the user is asking about anything else - reading, writing, general SAT info, study tips, etc.)

This categorization line will be automatically removed before showing your response to the user, so do not reference it in your answer.

QUIZ EXAMPLE RULES: Only generate a quiz example when you categorize the input as "Math question". For math questions, ALWAYS include a quiz example. For non-math questions, NEVER include a quiz example.

Generate quiz examples for math questions including:
- Algebra problems (linear equations, inequalities, functions)
- Geometry problems (area, volume, angles, coordinate geometry)
- Data analysis problems (statistics, probability, data interpretation)
- Advanced math problems (quadratics, polynomials, exponentials)
- Any SAT math concepts or problem-solving techniques

DO NOT generate quiz examples for:
- Reading comprehension questions
- Grammar and writing questions
- General information about the SAT (test format, timing, registration, etc.)
- Study tips and strategies
- Motivational or encouragement messages
- General questions about test preparation
- Administrative or logistics questions

When you DO generate a quiz example, enclose it within <quiz-example> tags and follow this format:

<quiz-example>
{
  "question": "Complete question text here",
  "choices": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option that is correct",
  "explanation": "Detailed explanation of why the answer is correct"
}
</quiz-example>

The quiz example should help the user practice the specific concept or problem type they're asking about.

When answering questions:
- Prioritize accurate information aligned with the latest digital SAT format and content
- Use simple language and explain complex concepts step-by-step
- Provide specific examples and practice questions with detailed explanations
- Offer strategic advice for test-taking, including time management techniques
- Be encouraging and motivating
- Recommend specific practice techniques based on student strengths and weaknesses
- Always suggest a structured study plan when appropriate

Important SAT knowledge to cover:
1. Reading and Writing Section (64 questions, 65 minutes)
   - Vocabulary in context
   - Text structure and purpose
   - Cross-text connections
   - Information and ideas
   - Command of evidence
   - Standard English conventions (grammar, punctuation, and sentence structure)

2. Math Section (44 questions, 80 minutes)
   - Heart of Algebra (linear equations, inequalities, functions)
   - Problem Solving and Data Analysis (ratios, percentages, proportions, data interpretation)
   - Passport to Advanced Math (quadratics, polynomials, exponentials)
   - Additional Topics (geometry, trigonometry, complex numbers)

Testing Format Specifics:
- Digital adaptive testing (questions adjust based on performance)
- Section-level adaptivity (second module difficulty determined by first module performance)
- Shorter test duration (2 hours 14 minutes total)
- Built-in graphing calculator for all math questions
- Flagging questions for review within a module

Strategic Approaches:
- Two-pass method for difficult sections
- Process of elimination techniques
- Note-taking strategies for reading passages
- Mental math shortcuts
- Strategic guessing (no penalty for wrong answers)

Remember to tailor your advice to the digital, adaptive format of the current SAT exam, and provide specific strategies that work in this testing environment.`;
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
    content: `Hello! I'm your SAT tutor. How can I help you prepare for the exam today?`,
    timestamp: Date.now() + 1
  };
  
  return [systemMessage, welcomeMessage];
}

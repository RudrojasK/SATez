// GROQ API integration for the tutor feature
// This file manages communications with the GROQ API for LLM conversations

// import { ApiKeyStorage } from './storage';

// API key for GROQ integration - Using a fixed API key for all users
// This is a shared API key for simplicity - in production, you would want to handle this more securely
export const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';  // Replace with your valid GROQ API key

// The model to be used for conversations
export const DEFAULT_MODEL = "llama3-70b-8192";

// The model to be used for image analysis
export const IMAGE_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

// Base URL for the GROQ API
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Message type definition
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  imageUri?: string; // Optional image URI for image analysis
}

// Interface for chat parameters
export interface ChatParams {
  messages: Message[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  includeImage?: boolean; // Flag to indicate if we're including an image
}

/**
 * Check if API key is configured
 * Always returns true since we're using a hardcoded key
 */
export function isApiKeyConfigured(): boolean {
  return true;
}

/**
 * Convert image to base64 for API submission
 * Groq supports a maximum of 4MB for base64 encoded images
 */
export async function imageToBase64(uri: string): Promise<string> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Check size limits (Groq has a 4MB limit for base64 encoded images)
    const fileSizeInBytes = blob.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
    
    if (fileSizeInMB > 4) {
      console.warn(`Image size (${fileSizeInMB.toFixed(2)}MB) exceeds Groq's 4MB limit. The request may fail.`);
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Extract base64 data part from the result
        const base64data = reader.result as string;
        const base64Content = base64data.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}

/**
 * Sends a chat completion request to the GROQ API
 * Always uses the hardcoded API key for simplicity
 * Now supports image analysis using Llama 4 Scout
 */
export async function fetchGroqCompletion(params: ChatParams): Promise<Message> {
  const { 
    messages, 
    model = DEFAULT_MODEL, 
    temperature = 0.5, 
    max_tokens = 2048,
    includeImage = false
  } = params;
  
  // Important: Always use the hardcoded API key directly, do not check storage
  // This ensures all users share the same API key for simplicity
  const apiKey = GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ API key is not configured');
  }
  
  // Use image model if we're including an image
  const selectedModel = includeImage ? IMAGE_MODEL : model;
  
  // Convert our message format to GROQ's expected format
  const groqMessages = await Promise.all(messages.map(async ({ role, content, imageUri }) => {
    // For text-only messages
    if (!imageUri) {
      return { role, content };
    }
    
    // For messages with images, create a content array with text and image
    // Following Groq's vision API format for Llama 4 Scout
    try {
      const base64Image = await imageToBase64(imageUri);
      
      return {
        role,
        content: [
          { type: "text", text: content },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
              // No need for "detail" parameter with Llama 4 Scout
            }
          }
        ]
      };
    } catch (error) {
      console.error('Error processing image:', error);
      // Fallback to text-only if image processing fails
      return { role, content };
    }
  }));

  try {
    console.log('Using hardcoded GROQ API key');
    console.log(`Using model: ${selectedModel}${includeImage ? ' (with image support)' : ''}`);
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: groqMessages,
        temperature,
        max_tokens,
        // Add proper Groq parameters for the vision model
        top_p: 1,
        stream: false,
        stop: null
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GROQ API Error: Status ${response.status}, Response:`, errorText);
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

You are especially skilled at analyzing images of math problems, handwritten work, textbook pages,
or practice questions that students upload. You can identify mathematical concepts,
solve equations, spot errors in work, and provide detailed step-by-step solutions.

CRITICAL FORMATTING RULES:
1. ALWAYS start your response with EXACTLY one line containing either "Math question" or "Not math"
2. Put this status line on its own line, then start your actual response on the next line
3. Do NOT include any other text on the status line

IMPORTANT: You MUST start every response with EXACTLY one of these two lines as the very first line:
- "Math question" (if the user is asking about any math-related topic, problem, concept, or strategy)
- "Not math" (if the user is asking about anything else - reading, writing, general SAT info, study tips, etc.)

This categorization line will be automatically removed before showing your response to the user, so do not reference it in your answer.

FOR IMAGE ANALYSIS:
When a student uploads an image containing a math problem or handwritten work:
1. Carefully analyze all elements in the image - equations, diagrams, graphs, handwritten work
2. For typed or printed math problems, transcribe the problem accurately first
3. For handwritten work, interpret the student's work and identify where they might be making mistakes
4. For math problems:
   - Identify the key mathematical concepts involved
   - Break down the problem into clear steps
   - Provide a complete step-by-step solution
   - Explain the reasoning behind each step
   - Point out common pitfalls or misconceptions
5. If the image contains a practice SAT question:
   - Identify the correct answer and explain why
   - Discuss why the other options are incorrect
   - Suggest strategies for similar problems
6. Always categorize image-based math problems as "Math question" and include a quiz example

QUIZ EXAMPLE RULES: You MUST generate a quiz example when you categorize the input as "Math question". For math questions, ALWAYS include a quiz example. For non-math questions, NEVER include a quiz example.

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

When you DO generate a quiz example, it's EXTREMELY IMPORTANT that you enclose it within <quiz-example> tags and follow this exact format:

<quiz-example>
{
  "question": "Write the complete question text here",
  "choices": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
  "correctAnswer": "A) First option",
  "explanation": "Write a detailed explanation of why this answer is correct and how to solve the problem step by step."
}
</quiz-example>

CRITICAL JSON FORMATTING RULES:
- The content inside <quiz-example> tags MUST be valid JSON
- Use double quotes for ALL strings
- Ensure the "correctAnswer" exactly matches one of the choices
- Do NOT use markdown formatting inside the JSON
- Do NOT include line breaks within string values
- Make sure all brackets and braces are properly closed
- Test your JSON mentally before including it

Example of proper formatting:
Math question
Here is my explanation of the concept...

<quiz-example>
{
  "question": "If 2x + 5 = 13, what is the value of x?",
  "choices": ["A) 2", "B) 4", "C) 6", "D) 8"],
  "correctAnswer": "B) 4",
  "explanation": "To solve 2x + 5 = 13, first subtract 5 from both sides to get 2x = 8. Then divide both sides by 2 to get x = 4."
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
    content: `Not math
Hello! I'm your SAT tutor. I can help with math problems, reading/writing questions, and test strategies. You can:

• Ask me questions about any SAT topic
• Upload images of math problems for step-by-step solutions
• Share pictures of your handwritten work for feedback
• Get help with practice questions from textbooks
• Request study tips and strategies

What would you like help with today?`,
    timestamp: Date.now() + 1
  };
  
  return [systemMessage, welcomeMessage];
}

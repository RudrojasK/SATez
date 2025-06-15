// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for storage
const STORAGE_KEYS = {
  GROQ_API_KEY: 'satez:groq_api_key',
  FAVORITE_RESPONSES: 'satez:favorite_responses',
  CHAT_HISTORY: 'satez:chat_history',
};

/**
 * Storage helper for saving and retrieving API keys
 */
export const ApiKeyStorage = {
  async saveGroqApiKey(apiKey: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GROQ_API_KEY, apiKey);
    } catch (error) {
      console.error('Failed to save API key:', error);
    }
  },

  async getGroqApiKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.GROQ_API_KEY);
    } catch (error) {
      console.error('Failed to get API key:', error);
      return null;
    }
  },

  async removeGroqApiKey(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GROQ_API_KEY);
    } catch (error) {
      console.error('Failed to remove API key:', error);
    }
  },
};

/**
 * Storage helper for saving favorite responses
 */
export interface FavoriteResponse {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
}

export const FavoriteResponsesStorage = {
  async saveFavoriteResponse(response: FavoriteResponse): Promise<void> {
    try {
      const existingResponses = await this.getFavoriteResponses();
      // Prevent duplicates
      const filtered = existingResponses.filter(r => r.id !== response.id);
      const newResponses = [...filtered, response];
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_RESPONSES, JSON.stringify(newResponses));
    } catch (error) {
      console.error('Failed to save favorite response:', error);
    }
  },

  async getFavoriteResponses(): Promise<FavoriteResponse[]> {
    try {
      const responses = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITE_RESPONSES);
      return responses ? JSON.parse(responses) : [];
    } catch (error) {
      console.error('Failed to get favorite responses:', error);
      return [];
    }
  },

  async removeFavoriteResponse(id: string): Promise<void> {
    try {
      const existingResponses = await this.getFavoriteResponses();
      const newResponses = existingResponses.filter(response => response.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.FAVORITE_RESPONSES, JSON.stringify(newResponses));
    } catch (error) {
      console.error('Failed to remove favorite response:', error);
    }
  },
};

/**
 * Storage helper for chat history
 */
import { Message } from './groq';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export const ChatHistoryStorage = {
  async saveSession(session: ChatSession): Promise<void> {
    try {
      const existingSessions = await this.getSessions();
      const existingIndex = existingSessions.findIndex(s => s.id === session.id);
      
      if (existingIndex >= 0) {
        // Update existing session
        existingSessions[existingIndex] = session;
      } else {
        // Add new session
        existingSessions.push(session);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(existingSessions));
    } catch (error) {
      console.error('Failed to save chat session:', error);
    }
  },

  async getSessions(): Promise<ChatSession[]> {
    try {
      const sessions = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Failed to get chat sessions:', error);
      return [];
    }
  },

  async getSession(id: string): Promise<ChatSession | null> {
    try {
      const sessions = await this.getSessions();
      return sessions.find(session => session.id === id) || null;
    } catch (error) {
      console.error('Failed to get chat session:', error);
      return null;
    }
  },

  async removeSession(id: string): Promise<void> {
    try {
      const existingSessions = await this.getSessions();
      const newSessions = existingSessions.filter(session => session.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(newSessions));
    } catch (error) {
      console.error('Failed to remove chat session:', error);
    }
  },
};

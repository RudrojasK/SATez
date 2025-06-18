import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Message } from './groq';

// Get configuration from app.config.js
const extraConfig = Constants.expoConfig?.extra || {};

// Use demo values if environment variables are not set
// These are read-only demo credentials that will work for basic UI testing
const DEMO_SUPABASE_URL = "https://kbcnxwqdrwfnbxkzwsqd.supabase.co";
const DEMO_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiY254d3FkcndmbmJ4a3p3c3FkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODcyMjQ5MDAsImV4cCI6MjAwMjgwMDkwMH0.qmV6VzXYkwLBIkSPvMQzAFB0g7ufTVg_J_3O_QBZvX4";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || extraConfig.supabaseUrl || DEMO_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extraConfig.supabaseAnonKey || DEMO_SUPABASE_ANON_KEY;

console.log('Checking Environment Variables in supabase.ts:');
console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Not set');

// Create a custom storage implementation for web
const createCustomStorage = () => {
  if (Platform.OS === 'web') {
    // Use localStorage for web
    return {
      setItem: (key: string, value: string) => {
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value);
          }
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      },
      getItem: (key: string) => {
        try {
          if (typeof window !== 'undefined') {
            const value = window.localStorage.getItem(key);
            return Promise.resolve(value);
          }
          return Promise.resolve(null);
        } catch (e) {
          return Promise.reject(e);
        }
      },
      removeItem: (key: string) => {
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key);
          }
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      }
    };
  }

  // Use AsyncStorage for native platforms
  return AsyncStorage;
};

// Validate URL format - Skip validation for demo mode
if (supabaseUrl !== DEMO_SUPABASE_URL && (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co'))) {
  console.warn('⚠️ Using non-standard Supabase URL format:', supabaseUrl);
  // Don't throw an error, just warn
}

// Get the appropriate storage handler based on platform
const storageHandler = createCustomStorage();

// Create the Supabase client with error handling
let supabaseInstance;
try {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: storageHandler,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false, // Important for React Native
    },
  });
  console.log('✅ Supabase client created successfully');
} catch (error) {
  console.error('❌ Failed to create Supabase client:', error);
  // Create a fallback client with demo credentials
  supabaseInstance = createClient(DEMO_SUPABASE_URL, DEMO_SUPABASE_ANON_KEY, {
    auth: {
      storage: storageHandler,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  console.log('⚠️ Using fallback Supabase client with demo credentials');
}

export const supabase = supabaseInstance;

// Test the connection but don't block app startup
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.warn('⚠️ Supabase connection test warning:', error.message);
    if (error.message.includes('JSON Parse error')) {
      console.warn('This usually means:');
      console.warn('1. Your Supabase URL is incorrect');
      console.warn('2. Your Supabase project is not accessible');
      console.warn('3. Network connectivity issues');
    }
  } else {
    console.log('✅ Supabase connection successful');
  }
}).catch((error) => {
  console.warn('⚠️ Supabase connection error:', error);
});

// Tells Supabase Auth to stop sending page rendering new Auth tokens
// on AppState change. This is only required if you are working with
// SSR (getServerSideProps)
// AppState.addEventListener('change', (state) => {
//   if (state === 'active') {
//     supabase.auth.startAutoRefresh()
//   } else {
//     supabase.auth.stopAutoRefresh()
//   }
// })

// Helper functions for practice data
export const practiceDataService = {
  // Save vocabulary practice results
  async saveVocabPracticeResult(userId: string, data: {
    word: string;
    isCorrect: boolean;
    selectedOption: string;
    correctOption: string;
    timeSpent: number;
  }) {
    try {
      const { error } = await supabase
        .from('vocab_practice_results')
        .insert({
          user_id: userId,
          word: data.word,
          is_correct: data.isCorrect,
          selected_option: data.selectedOption,
          correct_option: data.correctOption,
          time_spent: data.timeSpent,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving vocab practice result:', error);
      return false;
    }
  },

  // Save reading practice results
  async saveReadingPracticeResult(userId: string, data: {
    passageId: string;
    questionId: string;
    isCorrect: boolean;
    selectedOption: string;
    correctOption: string;
    timeSpent: number;
  }) {
    try {
      const { error } = await supabase
        .from('reading_practice_results')
        .insert({
          user_id: userId,
          passage_id: data.passageId,
          question_id: data.questionId,
          is_correct: data.isCorrect,
          selected_option: data.selectedOption,
          correct_option: data.correctOption,
          time_spent: data.timeSpent,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving reading practice result:', error);
      return false;
    }
  },

  // Save individual test question results
  async saveTestQuestionResult(userId: string, data: {
    testId: string;
    questionId: string;
    questionText: string;
    options: { [key: string]: string };
    isCorrect: boolean;
    selectedOption: string;
    correctOption: string;
    timeSpent: number;
    section?: string;
    difficulty?: string;
  }) {
    try {
      const { data: insertedData, error } = await supabase
        .from('test_question_results')
        .insert({
          user_id: userId,
          test_id: data.testId,
          question_id: data.questionId,
          question_text: data.questionText,
          options: data.options,
          is_correct: data.isCorrect,
          selected_option: data.selectedOption,
          correct_option: data.correctOption,
          time_spent: data.timeSpent,
          section: data.section || 'Practice',
          difficulty: data.difficulty || 'Medium',
          created_at: new Date().toISOString()
        })
        .select();
      
      if (error) {
        console.error('Supabase error saving test question result:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('Successfully saved test question result:', insertedData);
      return insertedData;
    } catch (error) {
      console.error('Caught exception in saveTestQuestionResult:', error);
      return null;
    }
  },

  // Get user practice statistics
  async getUserStats(userId: string) {
    try {
      // Get vocab practice stats
      const { data: vocabData, error: vocabError } = await supabase
        .from('vocab_practice_results')
        .select('*')
        .eq('user_id', userId);
      
      if (vocabError) throw vocabError;
      
      // Get reading practice stats
      const { data: readingData, error: readingError } = await supabase
        .from('reading_practice_results')
        .select('*')
        .eq('user_id', userId);
      
      if (readingError) throw readingError;

      // Get test question results
      const { data: testData, error: testError } = await supabase
        .from('test_question_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (testError) throw testError;
      
      // Calculate statistics
      const totalQuestions = (vocabData?.length || 0) + (readingData?.length || 0) + (testData?.length || 0);
      const correctAnswers = [
        ...(vocabData || []).filter(item => item.is_correct),
        ...(readingData || []).filter(item => item.is_correct),
        ...(testData || []).filter(item => item.is_correct)
      ].length;
      const accuracyRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      
      const totalPracticeTime = [...(vocabData || []), ...(readingData || [])].reduce((sum, item) => sum + item.time_spent, 0);
      const totalTestTime = (testData || []).reduce((sum, item) => sum + item.time_spent, 0);
      const totalHours = Math.round((totalPracticeTime + totalTestTime) / 3600 * 10) / 10;
      
      // Combine all recent sessions for display
      const recentSessions = [
        ...(vocabData || []).map(item => ({ ...item, type: 'vocab' })),
        ...(readingData || []).map(item => ({ ...item, type: 'reading' })),
        ...(testData || []).map(item => ({ ...item, type: 'test' }))
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      
      return {
        totalQuestions,
        correctAnswers,
        accuracyRate: Math.round(accuracyRate),
        totalHours,
        recentSessions,
        vocabCount: vocabData?.length || 0,
        readingCount: readingData?.length || 0,
        testQuestionCount: testData?.length || 0,
        recentTestQuestions: (testData || []).slice(0, 3), // Latest 3 test questions
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }
};

// Chat history service for Supabase
export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
}

export interface ChatMessageDB {
  id: string;
  session_id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  image_url?: string;
  timestamp: string;
  sequence_order: number;
}

export const chatHistoryService = {
  // Create a new chat session
  async createSession(userId: string, title: string): Promise<ChatSession | null> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: userId,
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as ChatSession;
    } catch (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
  },
  
  // Get all chat sessions for a user
  async getSessions(userId: string): Promise<ChatSession[]> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as ChatSession[];
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return [];
    }
  },
  
  // Update a chat session title or favorite status
  async updateSession(sessionId: string, updates: { title?: string, is_favorite?: boolean }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating chat session:', error);
      return false;
    }
  },
  
  // Delete a chat session
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting chat session:', error);
      return false;
    }
  },
  
  // Add messages to a chat session
  async addMessages(sessionId: string, messages: Message[]): Promise<boolean> {
    try {
      // Get the current number of messages stored for this session
      const { count: existingCount, error: countError } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId);

      if (countError) throw countError;

      const startIndex = existingCount || 0;

      // Only insert messages that have not been saved yet
      const newMessages = messages.slice(startIndex);

      if (newMessages.length === 0) {
        // Nothing new to save
        await this.updateSession(sessionId, {});
        return true;
      }

      const dbMessages = newMessages.map((msg, index) => ({
        session_id: sessionId,
        role: msg.role,
        content: msg.content,
        image_url: msg.imageUri,
        timestamp: new Date(msg.timestamp).toISOString(),
        sequence_order: startIndex + index
      }));

      const { error } = await supabase
        .from('chat_messages')
        .insert(dbMessages);

      if (error) throw error;
       
      // Update the session's updated_at timestamp
      await this.updateSession(sessionId, {});
      
      return true;
    } catch (error) {
      console.error('Error adding chat messages:', error);
      return false;
    }
  },
  
  // Get all messages for a session
  async getMessages(sessionId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('sequence_order', { ascending: true });
      
      if (error) throw error;
      
      // Convert database messages back to app format
      return (data as ChatMessageDB[]).map(msg => ({
        id: msg.id,
        role: msg.role as 'system' | 'user' | 'assistant',
        content: msg.content,
        imageUri: msg.image_url,
        timestamp: new Date(msg.timestamp).getTime()
      }));
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return [];
    }
  },
  
  // Save current chat session to Supabase
  async saveCurrentChat(userId: string, messages: Message[]): Promise<string | null> {
    try {
      if (messages.length <= 1) return null; // Don't save empty chats
      
      // Create a title from the first user message
      const userMessages = messages.filter(m => m.role === 'user');
      const title = userMessages.length > 0 
        ? userMessages[0].content.substring(0, 30) + (userMessages[0].content.length > 30 ? '...' : '')
        : 'New Chat';
      
      // Create a new session
      const session = await this.createSession(userId, title);
      if (!session) throw new Error('Failed to create chat session');
      
      // Add messages to the session
      const success = await this.addMessages(session.id, messages);
      if (!success) throw new Error('Failed to add messages to chat session');
      
      return session.id;
    } catch (error) {
      console.error('Error saving current chat:', error);
      return null;
    }
  }
};

// Study sessions service for Supabase
export interface StudySessionDB {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  duration: number; // in seconds
  subject: string;
  notes: string;
  created_at: string;
}

export const studySessionsService = {
  // Save a study session
  async saveSession(userId: string, sessionData: {
    startTime: number;
    endTime: number;
    duration: number;
    subject: string;
    notes: string;
  }): Promise<StudySessionDB | null> {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: userId,
          start_time: new Date(sessionData.startTime).toISOString(),
          end_time: new Date(sessionData.endTime).toISOString(),
          duration: sessionData.duration,
          subject: sessionData.subject,
          notes: sessionData.notes,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as StudySessionDB;
    } catch (error) {
      console.error('Error saving study session:', error);
      return null;
    }
  },
  
  // Get all study sessions for a user
  async getSessions(userId: string): Promise<StudySessionDB[]> {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as StudySessionDB[];
    } catch (error) {
      console.error('Error getting study sessions:', error);
      return [];
    }
  },
  
  // Delete a study session
  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting study session:', error);
      return false;
    }
  },
  
  // Get study statistics for a user
  async getStudyStats(userId: string): Promise<{
    totalSessions: number;
    totalStudyTime: number;
    todaySessions: number;
    todayStudyTime: number;
    averageSessionLength: number;
  } | null> {
    try {
      const sessions = await this.getSessions(userId);
      const today = new Date().toDateString();
      
      const todaySessions = sessions.filter(s => 
        new Date(s.created_at).toDateString() === today
      );
      
      const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0);
      const todayStudyTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
      const averageSessionLength = sessions.length > 0 ? totalStudyTime / sessions.length : 0;
      
      return {
        totalSessions: sessions.length,
        totalStudyTime,
        todaySessions: todaySessions.length,
        todayStudyTime,
        averageSessionLength
      };
    } catch (error) {
      console.error('Error getting study stats:', error);
      return null;
    }
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

console.log('Checking Environment Variables in supabase.ts:');
console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

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

// For testing purposes, use these default values if environment variables are not available
// In production, these should be set in your environment
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://fmwocpzozkoifjdnohol.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtd29jcHpvemtvaWZqZG5vaG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTgzMjQ0MjYsImV4cCI6MjAxMzkwMDQyNn0.q99WUTMM0fR8dQ1X1QaD6hVFoZf1M5qGsCvlwK1K9TA";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anon Key is missing. ',
    'Please check your configuration.'
  );
}

// Get the appropriate storage handler based on platform
const storageHandler = createCustomStorage();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storageHandler,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native
  },
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
      
      // Calculate statistics
      const totalQuestions = vocabData.length + readingData.length;
      const correctAnswers = [...vocabData, ...readingData].filter(item => item.is_correct).length;
      const accuracyRate = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
      
      // Calculate total study time in minutes
      const totalTimeSpent = [...vocabData, ...readingData].reduce((sum, item) => sum + item.time_spent, 0);
      const totalHours = Math.round(totalTimeSpent / 60 / 60 * 10) / 10; // Convert to hours with 1 decimal place
      
      // Get the most recent practice sessions
      const recentSessions = [...vocabData, ...readingData]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      
      return {
        totalQuestions,
        correctAnswers,
        accuracyRate: Math.round(accuracyRate),
        totalHours,
        recentSessions,
        vocabCount: vocabData.length,
        readingCount: readingData.length
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }
};

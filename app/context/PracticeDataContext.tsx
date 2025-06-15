import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { practiceDataService } from '../../utils/supabase';
import { useAuth } from './AuthContext';

// Define the shape of user statistics
interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  totalHours: number;
  recentSessions: any[];
  vocabCount: number;
  readingCount: number;
  testQuestionCount: number;
  recentTestQuestions: any[];
}

// Define the shape of the context value
interface PracticeDataContextType {
  stats: UserStats | null;
  statsLoading: boolean;
  fetchUserStats: () => Promise<void>;
  addVocabResult: (result: { word: string; isCorrect: boolean; selectedOption: string; correctOption: string; timeSpent: number; }) => Promise<void>;
  addTestQuestionResult: (result: { testId: string; questionId: string; questionText: string; options: { [key: string]: string }; isCorrect: boolean; selectedOption: string; correctOption: string; timeSpent: number; section?: string; difficulty?: string; }) => Promise<void>;
}

// Create the context
const PracticeDataContext = createContext<PracticeDataContextType | undefined>(undefined);

// Custom hook to use the context
export function usePracticeData() {
  const context = useContext(PracticeDataContext);
  if (context === undefined) {
    throw new Error('usePracticeData must be used within a PracticeDataProvider');
  }
  return context;
}

// The provider component
export function PracticeDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch initial stats when the user is available
  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  // Function to fetch stats from the backend
  const fetchUserStats = async () => {
    if (!user) return;
    
    setStatsLoading(true);
    try {
      const userStats = await practiceDataService.getUserStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Function to add a new vocab result
  const addVocabResult = async (result: { word: string; isCorrect: boolean; selectedOption: string; correctOption: string; timeSpent: number; }) => {
    if (!user) return;

    // --- Optimistic UI Update ---
    // Update local state immediately for a fast UI response
    setStats(prevStats => {
      if (!prevStats) return null;
      
      const newTotalQuestions = prevStats.totalQuestions + 1;
      const newCorrectAnswers = prevStats.correctAnswers + (result.isCorrect ? 1 : 0);
      const newAccuracy = Math.round((newCorrectAnswers / newTotalQuestions) * 100);
      const newTimeSpent = prevStats.totalHours + (result.timeSpent / 3600);

      // Create a mock session object for the recent activity list
      const newSession = {
          ...result,
          user_id: user.id,
          type: 'vocab',
          created_at: new Date().toISOString()
      };
      
      return {
        ...prevStats,
        totalQuestions: newTotalQuestions,
        correctAnswers: newCorrectAnswers,
        accuracyRate: newAccuracy,
        totalHours: Math.round(newTimeSpent * 10) / 10,
        vocabCount: prevStats.vocabCount + 1,
        recentSessions: [newSession, ...prevStats.recentSessions].slice(0, 5)
      };
    });

    // --- Save to Backend ---
    // Save the result to the database in the background
    try {
      await practiceDataService.saveVocabPracticeResult(user.id, result);
    } catch (error) {
      console.error('Failed to save vocab result to backend:', error);
      // Optional: Implement a rollback mechanism or error notification here
    }
  };
  
  // Function to add a new test question result
  const addTestQuestionResult = async (result: { testId: string; questionId: string; questionText: string; options: { [key: string]: string }; isCorrect: boolean; selectedOption: string; correctOption: string; timeSpent: number; section?: string; difficulty?: string; }) => {
    console.log('=== addTestQuestionResult called ===');
    console.log('User:', user);
    console.log('Result data:', result);
    
    if (!user) {
      console.error('No user found, cannot save test question result');
      return;
    }

    console.log('Starting optimistic UI update...');
    // --- Optimistic UI Update ---
    setStats(prevStats => {
      console.log('Previous stats:', prevStats);
      if (!prevStats) {
        console.log('No previous stats, returning null');
        return null;
      }
      
      const newTotalQuestions = prevStats.totalQuestions + 1;
      const newCorrectAnswers = prevStats.correctAnswers + (result.isCorrect ? 1 : 0);
      const newAccuracy = Math.round((newCorrectAnswers / newTotalQuestions) * 100);
      const newTimeSpent = prevStats.totalHours + (result.timeSpent / 3600);
      
      const newTestResult = {
        ...result,
        user_id: user.id,
        type: 'test',
        created_at: new Date().toISOString()
      };
      
      const updatedStats = {
        ...prevStats,
        totalQuestions: newTotalQuestions,
        correctAnswers: newCorrectAnswers,
        accuracyRate: newAccuracy,
        totalHours: Math.round(newTimeSpent * 10) / 10,
        testQuestionCount: prevStats.testQuestionCount + 1,
        recentTestQuestions: [newTestResult, ...prevStats.recentTestQuestions].slice(0, 50),
        recentSessions: [newTestResult, ...prevStats.recentSessions].slice(0, 5)
      };
      
      console.log('Updated stats:', updatedStats);
      return updatedStats;
    });

    console.log('Optimistic update complete, now saving to backend...');
    
    // --- Save to Backend ---
    try {
      console.log('Calling practiceDataService.saveTestQuestionResult with:', {
        userId: user.id,
        result: result
      });
      
      const backendResult = await practiceDataService.saveTestQuestionResult(user.id, result);
      console.log('Backend save result:', backendResult);
      
      if (backendResult) {
        console.log('✅ Successfully saved test question result to backend');
      } else {
        console.error('❌ Backend returned null/false, save may have failed');
      }
    } catch (error) {
      console.error('❌ Failed to save test question result to backend:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    }
  };

  const value = {
    stats,
    statsLoading,
    fetchUserStats,
    addVocabResult,
    addTestQuestionResult,
  };

  return (
    <PracticeDataContext.Provider value={value}>
      {children}
    </PracticeDataContext.Provider>
  );
} 
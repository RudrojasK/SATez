import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  school?: string;
  grade?: number;
  target_score?: number;
}

interface ProfileUpdateData {
  name?: string;
  avatar_url?: string;
  school?: string;
  grade?: number;
  target_score?: number;
}

interface UserMetadata {
  school?: string;
  grade?: number; 
  target_score?: number;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, metadata?: UserMetadata) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
    try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
      
        if (currentSession?.user) {
          setSession(currentSession);
          setSupabaseUser(currentSession.user);
          const userData = await getUserProfile(currentSession.user.id);
          setUser(userData);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

    fetchSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
      
        if (currentSession?.user) {
          setSupabaseUser(currentSession.user);
          const userData = await getUserProfile(currentSession.user.id);
          setUser(userData);
        } else {
          setSupabaseUser(null);
          setUser(null);
        }
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  
  const getUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }
      
      if (data) {
        return {
          id: data.id,
          email: data.email,
          name: data.name || data.email.split('@')[0],
          avatar: data.avatar_url,
          school: data.school,
          grade: data.grade,
          target_score: data.target_score
        };
      }
      
      // Fallback for when profile is not yet created by trigger
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return {
          id: user.id,
          email: user.email || '',
          name: user.email ? user.email.split('@')[0] : 'User',
        };
      }
      return null;
      
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
      throw error;
    }
    // onAuthStateChange will handle setting user and session state
  };

  const signUp = async (email: string, password: string, name: string, metadata?: UserMetadata) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          ...metadata
        },
      },
    });
    
    if (error) {
      console.error('Sign up error:', error);
      setIsLoading(false);
      throw error;
    }
    
    // Set new user flag to true, but don't redirect (handled by onAuthStateChange)
    if (data?.user) {
      setIsNewUser(true);
    }
    
    // onAuthStateChange will handle setting user and session state
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
        throw error;
    }
    // onAuthStateChange will handle cleanup
    setIsLoading(false);
  };

  const refreshUser = async () => {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (supabaseUser) {
        const userData = await getUserProfile(supabaseUser.id);
        setUser(userData);
    }
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    if (!user) throw new Error('User not authenticated');
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...data,
          updated_at: new Date()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refresh user data
      await refreshUser();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updateEmail = async (email: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      // Note: Email change requires confirmation
      // The system will send verification emails to both the old and new email addresses
      // User needs to click the verification link in the new email to complete the change
      
      // No need to refresh user data yet, will happen when email is confirmed
    } catch (error) {
      console.error('Error updating email:', error);
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      // Password update is immediate
      await refreshUser();
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      // Password reset email has been sent
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    supabaseUser,
    session,
    isLoading,
    isNewUser,
    setIsNewUser,
    signIn,
    signUp,
    signOut,
    refreshUser,
    updateProfile,
    updateEmail,
    updatePassword,
    resetPasswordForEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 
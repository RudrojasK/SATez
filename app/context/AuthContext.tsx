import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
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

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name, // This data is used by the DB trigger
        },
      },
    });
    
    if (error) {
      console.error('Sign up error:', error);
      setIsLoading(false);
      throw error;
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

  const value: AuthContextType = {
    user,
    supabaseUser,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 
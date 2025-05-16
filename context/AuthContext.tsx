import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { Alert } from 'react-native';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signInWithEmail: (email_param: string, password_param: string) => Promise<any>;
  signUpWithEmail: (email_param: string, password_param: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug function to log auth state changes
  const logAuthState = (event: string, sessionData?: Session | null, userData?: User | null) => {
    console.log(`[AUTH STATE] Event: ${event}`);
    console.log('[AUTH STATE] Session:', sessionData || session);
    console.log('[AUTH STATE] User:', userData || user);
  };

  // Function to refresh user data
  const refreshUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user data:', error.message);
        return;
      }
      if (data?.user) {
        setUser(data.user);
        logAuthState('REFRESH_USER', session, data.user);
      }
    } catch (err) {
      console.error('Error in refreshUser:', err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Get the initial session
    const initializeAuth = async () => {
      try {
        console.log('[AUTH] Initializing auth...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('[AUTH] Session error:', sessionError.message);
          setIsLoading(false);
          return;
        }
        
        const currentSession = sessionData?.session;
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          logAuthState('INIT', currentSession, currentSession.user);
        } else {
          console.log('[AUTH] No user in session');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('[AUTH] Initialization error:', error);
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Setup auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('[AUTH] Auth state change event:', event);
        setSession(newSession);
        
        if (event === 'SIGNED_IN') {
          if (newSession?.user) {
            setUser(newSession.user);
            logAuthState('SIGNED_IN', newSession, newSession.user);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          logAuthState('SIGNED_OUT', null, null);
        } else if (event === 'USER_UPDATED') {
          if (newSession?.user) {
            setUser(newSession.user);
            logAuthState('USER_UPDATED', newSession, newSession.user);
          }
        } else if (event === 'INITIAL_SESSION') {
          // Initial session is handled by getSession() above
        }
        
        if (event !== 'INITIAL_SESSION') {
          setIsLoading(false);
        }
      }
    );

    return () => {
      console.log('[AUTH] Cleaning up auth listener');
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email_param: string, password_param: string) => {
    setIsLoading(true);
    try {
      console.log(`[AUTH] Attempting sign in for email: ${email_param}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email_param,
        password: password_param,
      });
      
      if (error) {
        console.error('[AUTH] Sign in error:', error.message);
        throw error;
      }
      
      console.log('[AUTH] Sign in successful:', data);
      return data;
    } catch (error: any) {
      console.error('[AUTH] Sign in exception:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email_param: string, password_param: string) => {
    setIsLoading(true);
    try {
      console.log(`[AUTH] Attempting sign up for email: ${email_param}`);
      const { data, error } = await supabase.auth.signUp({
        email: email_param,
        password: password_param,
      });
      
      if (error) {
        console.error('[AUTH] Sign up error:', error.message);
        throw error;
      }
      
      // Store additional user info in profiles table if needed
      if (data.user) {
        console.log('[AUTH] Sign up successful. User created:', data.user);
      }
      
      return data;
    } catch (error: any) {
      console.error('[AUTH] Sign up exception:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      console.log('[AUTH] Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AUTH] Sign out error:', error.message);
        throw error;
      }
      console.log('[AUTH] Sign out successful');
    } catch (error: any) {
      console.error('[AUTH] Sign out exception:', error.message);
      Alert.alert('Error signing out', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        session, 
        user, 
        isLoading, 
        signInWithEmail, 
        signUpWithEmail, 
        signOut,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
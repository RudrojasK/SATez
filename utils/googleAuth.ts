import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

// Complete the auth session on web
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Configuration
const GOOGLE_OAUTH_CONFIG = {
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  scopes: ['openid', 'profile', 'email'],
};

// Helper function to get Supabase URL
const getSupabaseUrl = () => {
  let supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  
  // If the environment variable is not set, use a hardcoded URL for testing
  if (!supabaseUrl) {
    supabaseUrl = 'https://kbcnxwqdrwfnbxkzwsqd.supabase.co';
  }
  
  return supabaseUrl;
};

// Main Google Sign-In method
export const signInWithGoogle = async () => {
  try {
    const supabaseUrl = getSupabaseUrl();
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: AuthSession.makeRedirectUri({
          scheme: 'satez',
        }),
        skipBrowserRedirect: false,
      },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

// Check if Google OAuth is properly configured
export const isGoogleAuthConfigured = () => {
  return !!(
    GOOGLE_OAUTH_CONFIG.webClientId ||
    GOOGLE_OAUTH_CONFIG.iosClientId ||
    GOOGLE_OAUTH_CONFIG.androidClientId
  );
};

// Get a user-friendly error message for Google OAuth setup
export const getGoogleAuthSetupMessage = () => {
  if (!isGoogleAuthConfigured()) {
    return 'Google Sign-In is not configured.';
  }
  return null;
};
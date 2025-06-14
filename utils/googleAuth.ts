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

// Create Google OAuth request
const createGoogleAuthRequest = () => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'satez', // You'll need to add this to app.json
  });

  const request = new AuthSession.AuthRequest({
    clientId: GOOGLE_OAUTH_CONFIG.webClientId || '',
    scopes: GOOGLE_OAUTH_CONFIG.scopes,
    redirectUri,
    responseType: AuthSession.ResponseType.Code,
    codeChallenge: '', // Will be set automatically
    usePKCE: true,
  });

  return request;
};

export const signInWithGoogle = async () => {
  try {
    // For development, we'll use Supabase's built-in OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: AuthSession.makeRedirectUri({
          scheme: 'satez',
        }),
      },
    });

    if (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to sign in with Google:', error);
    throw error;
  }
};

// Alternative implementation using AuthSession for more control
export const signInWithGoogleAdvanced = async () => {
  try {
    const request = createGoogleAuthRequest();
    
    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
    });

    if (result.type === 'success') {
      // Exchange code for tokens via Supabase
      const { data, error } = await supabase.auth.exchangeCodeForSession(result.params.code);
      
      if (error) {
        throw error;
      }

      return data;
    } else if (result.type === 'cancel') {
      throw new Error('Google sign-in was cancelled');
    } else {
      throw new Error('Google sign-in failed');
    }
  } catch (error) {
    console.error('Advanced Google Sign-In Error:', error);
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
    return 'Google Sign-In is not configured. Please check the GOOGLE_OAUTH_SETUP.md file for setup instructions.';
  }
  return null;
}; 
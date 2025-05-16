import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

console.log('Checking Environment Variables in supabase.ts:');
console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('EXPO_PUBLIC_SUPABASE_ANON_KEY:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

// Create a custom storage implementation for web
const createCustomStorage = () => {
  if (Platform.OS === 'web') {
    // Use localStorage for web
    return {
      setItem: (key, value) => {
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, value);
          }
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      },
      getItem: (key) => {
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
      removeItem: (key) => {
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

// --- TEMPORARY DEBUGGING: Hardcoding Supabase credentials ---
// --- !!! IMPORTANT: This is a temporary solution !!! ---
// --- !!! DO NOT COMMIT THIS TO VERSION CONTROL !!! ---
const supabaseUrl = "https://xfpkdnqgbdelpfdomxej.supabase.co"; // process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmcGtkbnFnYmRlbHBmZG9teGVqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQyMzU2MiwiZXhwIjoyMDYyOTk5NTYyfQ.1D0xVeMq2N14s73WK9JrVLaYH-7UZPKW2T4HtwiCxHY"; // process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// --- End of temporary debugging section ---

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Supabase URL or Anon Key is missing. ',
    'Please check your configuration.'
  );
  // This will cause issues if the client is used without valid keys.
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
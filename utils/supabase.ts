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


const supabaseUrl = "x"; // process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = "x"; // process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
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

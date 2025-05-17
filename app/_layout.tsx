import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// This component handles the redirection logic based on auth state
const AuthCheck = () => {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Wait until session is loaded

    console.log('Current route segments:', segments);
    const inAuthGroup = segments[0] === '(auth)';

    if (session) {
      // User is signed in
      if (inAuthGroup) {
        console.log('User is signed in and in auth group, redirecting to tabs');
        router.replace('/(tabs)'); // Redirect to the tabs navigation (main SAT app)
      }
    } else {
      // User is not signed in
      if (!inAuthGroup) {
        console.log('User is not signed in and not in auth group, redirecting to login');
        router.replace('/(auth)/login'); // Redirect to login screen
      }
    }
  }, [session, isLoading, segments, router]);

  // Note: We're not returning any JSX here, just using this component
  // for the auth check logic with useEffect
  return null;
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    // Add your fonts here if needed
    // 'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* AuthCheck handles redirects based on auth state */}
        <AuthCheck />
        
        {/* Stack defines the routes/screens */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
          <Stack.Screen name="(tabs)" />
          {/* Additional screens can be added here if needed */}
        </Stack>
        
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

// You will need to create layout files for your groups:
// - SATez/app/(auth)/_layout.tsx (could be simple <Slot /> or a Stack for auth flow)
// - SATez/app/(app)/_layout.tsx (likely your main TabNavigator or Stack for the app)
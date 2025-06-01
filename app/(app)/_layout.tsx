import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const inAuthGroup = segments[0] === '(auth)';

  useEffect(() => {
    if (isLoading) return;
    console.log('Current route segments:', segments);

    if (session) {
      if (!inAuthGroup) return;
      console.log('User is signed in and in auth group, redirecting to tabs');
      router.replace('/(tabs)');
    } else {
      if (inAuthGroup) return;
      console.log('User is not signed in and not in auth group, redirecting to login');
      router.replace('/(auth)/login');
    }
  }, [session, isLoading, segments, router]);

  return <Slot />;
}

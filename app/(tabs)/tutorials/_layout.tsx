import { COLORS, FONTS } from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function TutorialsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontSize: FONTS.h3.fontSize,
          fontWeight: '600'
        }
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Tutorials',
          headerShown: true
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Tutorial',
          headerShown: true
        }}
      />
    </Stack>
  );
} 
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Animated, StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',
        tabBarStyle: {
          backgroundColor: '#667eea',
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Animated.View 
              style={[
                styles.iconContainer, 
                focused && styles.iconContainerFocused,
                { transform: [{ scale: focused ? 1.1 : 1 }] }
              ]}
            >
              <Ionicons name="home" size={24} color={color} />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color, focused }) => (
            <Animated.View 
              style={[
                styles.iconContainer, 
                focused && styles.iconContainerFocused,
                { transform: [{ scale: focused ? 1.1 : 1 }] }
              ]}
            >
              <Ionicons name="document-text" size={24} color={color} />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen 
        name="vocabpractice"
        options={{
          title: "Vocabulary Practice",
          headerShown: false,
          tabBarItemStyle: {display: "none"}
        }}
      />
      <Tabs.Screen 
        name="readingpractice"
        options={{
          title: "Reading Practice",
          headerShown: false,
          tabBarItemStyle: {display: "none"}
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: 'Resources',
          tabBarIcon: ({ color, focused }) => (
            <Animated.View 
              style={[
                styles.iconContainer, 
                focused && styles.iconContainerFocused,
                { transform: [{ scale: focused ? 1.1 : 1 }] }
              ]}
            >
              <Ionicons name="library" size={24} color={color} />
            </Animated.View>
          ),
        }}
      />
      <Tabs.Screen
        name="tutor"
        options={{
          title: 'Tutor',
          tabBarIcon: ({ color, focused }) => (
            <Animated.View 
              style={[
                styles.iconContainer, 
                focused && styles.iconContainerFocused,
                { transform: [{ scale: focused ? 1.1 : 1 }] }
              ]}
            >
              <Ionicons name="school" size={24} color={color} />
            </Animated.View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Animated.View 
              style={[
                styles.iconContainer, 
                focused && styles.iconContainerFocused,
                { transform: [{ scale: focused ? 1.1 : 1 }] }
              ]}
            >
              <Ionicons name="person" size={24} color={color} />
            </Animated.View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerFocused: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
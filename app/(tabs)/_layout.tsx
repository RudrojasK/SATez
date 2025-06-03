import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { HapticTab } from '../../components/HapticTab';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.6)',
        tabBarStyle: {
          position: 'absolute',
          bottom: 25,
          left: 20,
          right: 20,
          height: 70,
          borderRadius: 25,
          borderTopWidth: 0,
          elevation: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          paddingBottom: 10,
          paddingTop: 10,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFillObject}>
            <BlurView
              intensity={80}
              style={StyleSheet.absoluteFillObject}
            />
            <LinearGradient
              colors={['rgba(102, 126, 234, 0.9)', 'rgba(118, 75, 162, 0.9)']}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        ),
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              {focused && (
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.iconBackground}
                />
              )}
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={focused ? 26 : 24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: 'Practice',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              {focused && (
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.iconBackground}
                />
              )}
              <Ionicons 
                name={focused ? 'document-text' : 'document-text-outline'} 
                size={focused ? 26 : 24} 
                color={color} 
              />
            </View>
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
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              {focused && (
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.iconBackground}
                />
              )}
              <Ionicons 
                name={focused ? 'library' : 'library-outline'} 
                size={focused ? 26 : 24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tutor"
        options={{
          title: 'Tutor',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              {focused && (
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.iconBackground}
                />
              )}
              <Ionicons 
                name={focused ? 'school' : 'school-outline'} 
                size={focused ? 26 : 24} 
                color={color} 
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              {focused && (
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.iconBackground}
                />
              )}
              <Ionicons 
                name={focused ? 'person' : 'person-outline'} 
                size={focused ? 26 : 24} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  iconContainerFocused: {
    transform: [{ scale: 1.1 }],
  },
  iconBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
});
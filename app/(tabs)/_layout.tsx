import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { HapticTab } from '../../components/HapticTab';
import { PracticeDataProvider } from '../context/PracticeDataContext';

export default function TabLayout() {
  return (
    <PracticeDataProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#2962ff',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: '#eee',
            height: 60,
            paddingBottom: 10,
          },
          tabBarButton: (props) => <HapticTab {...props} />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'home' : 'home-outline'} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="practice"
          options={{
            title: 'Practice',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'document-text' : 'document-text-outline'} 
                size={24} 
                color={color} 
              />
            ),
            headerShown: false,
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
              <Ionicons 
                name={focused ? 'library' : 'library-outline'} 
                size={24} 
                color={color} 
              />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="tutor"
          options={{
            title: 'Tutor',
            tabBarIcon: ({ color, focused }) => (
              <Text>
                <Ionicons 
                  name={focused ? 'school' : 'school-outline'} 
                  size={24} 
                  color={color} 
                />
              </Text>
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Text>
                <Ionicons 
                  name={focused ? 'person' : 'person-outline'} 
                  size={24} 
                  color={color} 
                />
              </Text>
            ),
            headerShown: false,
          }}
        />
      </Tabs>
    </PracticeDataProvider>
  );
}
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Using the useAuth hook to get user info

  // Data for the cards, with colors instead of images
  const cardData = [
    {
      title: 'Practice Tests',
      description: 'Full-length practice tests to simulate the real SAT exam.',
      buttonText: 'Start',
      color: '#fdece1', // General color for the placeholder
      onPress: () => router.push('/(tabs)/practice'),
    },
    {
      title: 'Quizzes',
      description: 'Short quizzes focusing on specific SAT sections and topics.',
      buttonText: 'Start',
      color: '#eaf4ff', // A different color for variety
      onPress: () => router.push('/(tabs)/practice'), // Assuming quizzes are on the practice screen
    },
    {
      title: 'Study Plan',
      description: 'Personalized study plan based on your strengths and weaknesses.',
      buttonText: 'View',
      color: '#f8eaff', // And another one
      onPress: () => { /* Add navigation to study plan screen if it exists */ },
    },
  ];

  const userName = user?.name || 'User';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>SAT Prep</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome, {userName}!</Text>
          <Text style={styles.quote}>
            "The only way to do great work is to love what you do." - Steve Jobs
          </Text>
        </View>

        {/* Cards */}
        {cardData.map((card, index) => (
          <View key={index} style={styles.card}>
            <View style={[styles.cardImage, { backgroundColor: card.color }]} />
            <View style={styles.cardContent}>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDescription}>{card.description}</Text>
              </View>
              <TouchableOpacity style={styles.cardButton} onPress={card.onPress}>
                <Text style={styles.cardButtonText}>{card.buttonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light grey background from screenshot
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  welcomeSection: {
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  quote: {
    fontSize: 16,
    color: '#555',
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  cardButton: {
    backgroundColor: '#eef2ff', // Light blue button background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  cardButtonText: {
    color: '#4361ee', // Darker blue button text
    fontWeight: 'bold',
  },
});
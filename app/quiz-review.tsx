import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

// Define the shape of a question for type safety
interface Question {
  questionText: string;
  selectedOption: string;
  correctOption: string;
  isCorrect: boolean;
  options: { [key: string]: string }; 
}

export default function QuizReviewScreen() {
  const { title, questions: questionsString } = useLocalSearchParams<{ title: string; questions: string }>();
  
  // Safely parse the questions string
  const questions: Question[] = questionsString ? JSON.parse(questionsString) : [];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: title || 'Quiz Review', headerBackTitle: 'Profile' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {questions.map((q, index) => (
          <View key={index} style={[styles.card, !q.isCorrect && styles.incorrectCard]}>
            <Text style={styles.questionText}>{index + 1}. {q.questionText}</Text>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Your Answer:</Text>
              <Text style={[styles.optionValue, !q.isCorrect && styles.incorrectText]}>
                {q.selectedOption}
              </Text>
              {!q.isCorrect && (
                <Ionicons name="close-circle" size={20} color="#D32F2F" style={styles.icon} />
              )}
            </View>
            
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Correct Answer:</Text>
              <Text style={[styles.optionValue, styles.correctText]}>
                {q.correctOption}
              </Text>
              <Ionicons name="checkmark-circle" size={20} color="#388E3C" style={styles.icon} />
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
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderColor: '#4CAF50', // Green for correct
  },
  incorrectCard: {
    borderColor: '#F44336', // Red for incorrect
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  optionLabel: {
    fontSize: 14,
    color: '#6c757d',
    width: 120,
  },
  optionValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  correctText: {
    color: '#388E3C',
  },
  incorrectText: {
    color: '#D32F2F',
    textDecorationLine: 'line-through',
  },
  icon: {
    marginLeft: 8,
  },
}); 
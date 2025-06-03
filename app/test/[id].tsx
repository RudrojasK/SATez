import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { practiceTests, quizQuestions } from '../../constants/mockData';

export default function TestScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});

  const test = practiceTests.find(t => t.id === id);
  const questions = quizQuestions.slice(0, 3); // Just show 3 questions for demo

  if (!test) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Test not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.testTitle}>{test.title}</Text>
          <Text style={styles.questionCounter}>
            Question {currentQuestion + 1} of {questions.length}
          </Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBar,
            { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
          ]}
        />
      </View>

      {/* Question Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>Question {currentQuestion + 1}</Text>
          <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
          
          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswers[currentQuestion] === index && styles.optionButtonSelected,
                ]}
                onPress={() => handleAnswerSelect(currentQuestion, index)}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionIndicator,
                    selectedAnswers[currentQuestion] === index && styles.optionIndicatorSelected,
                  ]}>
                    <Text style={[
                      styles.optionLetter,
                      selectedAnswers[currentQuestion] === index && styles.optionLetterSelected,
                    ]}>
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>
                  <Text style={styles.optionText}>{option}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[styles.navButton, currentQuestion === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}
        >
          <Ionicons name="chevron-back" size={20} color={currentQuestion === 0 ? "#ccc" : "#667eea"} />
          <Text style={[styles.navButtonText, currentQuestion === 0 && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>
        
        {currentQuestion === questions.length - 1 ? (
          <TouchableOpacity style={styles.submitButton} onPress={() => router.back()}>
            <Text style={styles.submitButtonText}>Finish (Demo)</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  questionCounter: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#e1e8ed',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#667eea',
  },
  content: {
    flex: 1,
  },
  questionContainer: {
    padding: 20,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginBottom: 16,
  },
  questionText: {
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    overflow: 'hidden',
  },
  optionButtonSelected: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIndicatorSelected: {
    backgroundColor: '#667eea',
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  optionLetterSelected: {
    color: '#fff',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#ccc',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 4,
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
}); 
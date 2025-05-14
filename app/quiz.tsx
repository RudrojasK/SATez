import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ViewStyle, TextStyle, ScrollView, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SHADOWS } from '@/constants/Colors';
import { Button } from '@/components/Button';
import { quizQuestions, practiceTests } from '@/constants/mockData';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question (just UI, not functional)
  
  // Find the test details
  const test = practiceTests.find(t => t.id === id);
  
  // Calculate progress percentage
  const progress = Math.round(((currentQuestion + 1) / quizQuestions.length) * 100);
  
  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      // Reset timer for next question
      setTimeLeft(60);
    } else {
      // Quiz completed
      Alert.alert(
        "Quiz Completed",
        "You've completed the quiz! In a real app, this would show your score and analytics.",
        [
          { 
            text: "OK", 
            onPress: () => router.back() 
          }
        ]
      );
    }
  };
  
  // Mock timer effect (non-functional, just for UI)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestion]);
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Current question data
  const question = quizQuestions[currentQuestion];
  
  return (
    <>
      <Stack.Screen
        options={{
          title: test ? test.title : 'Quiz',
          headerBackTitle: 'Exit',
        }}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.progressInfo}>
            <Text style={styles.questionCounter}>
              Question {currentQuestion + 1} of {quizQuestions.length}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
          </View>
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={20} color={timeLeft < 10 ? COLORS.error : COLORS.textLight} />
            <Text style={[
              styles.timerText, 
              timeLeft < 10 && {color: COLORS.error}
            ]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>
        
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedOption === index && styles.selectedOption,
                ]}
                onPress={() => handleOptionSelect(index)}
                activeOpacity={0.7}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedOption === index }}
                accessibilityLabel={`Option ${String.fromCharCode(65 + index)}: ${option}`}
              >
                <View style={[
                  styles.optionLabelContainer,
                  selectedOption === index && styles.selectedOptionLabel
                ]}>
                  <Text style={[
                    styles.optionLabel,
                    selectedOption === index && styles.selectedOptionLabelText
                  ]}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[
                  styles.optionText,
                  selectedOption === index && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title={currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
            onPress={handleNextQuestion}
            disabled={selectedOption === null}
            fullWidth
          />
        </View>
      </SafeAreaView>
    </>
  );
}

type Styles = {
  container: ViewStyle;
  header: ViewStyle;
  progressInfo: ViewStyle;
  questionCounter: TextStyle;
  progressBarContainer: ViewStyle;
  progressBar: ViewStyle;
  timerContainer: ViewStyle;
  timerText: TextStyle;
  scrollContainer: ViewStyle;
  scrollContent: ViewStyle;
  questionContainer: ViewStyle;
  questionText: TextStyle;
  optionsContainer: ViewStyle;
  optionButton: ViewStyle;
  selectedOption: ViewStyle;
  optionLabelContainer: ViewStyle;
  selectedOptionLabel: ViewStyle;
  optionLabel: TextStyle;
  selectedOptionLabelText: TextStyle;
  optionText: TextStyle;
  selectedOptionText: TextStyle;
  footer: ViewStyle;
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressInfo: {
    flex: 1,
    marginRight: 16,
  },
  questionCounter: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.smallRadius,
    ...SHADOWS.small,
  },
  timerText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textLight,
    marginLeft: 4,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  questionContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 20,
    ...(Platform.OS === 'android' && {
      gap: 0,
      marginBottom: 10,
    })
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...(Platform.OS === 'android' && {
      marginBottom: 12,
    })
  },
  selectedOption: {
    backgroundColor: 'rgba(46, 91, 255, 0.08)',
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  optionLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(46, 91, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedOptionLabel: {
    backgroundColor: COLORS.primary,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  selectedOptionLabelText: {
    color: '#FFFFFF',
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 16,
  },
});
